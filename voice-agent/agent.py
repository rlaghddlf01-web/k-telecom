"""케이텔레콤 전화 AI 상담 (시험 단계).

한국AI통신(koreaaitel)에서 받은 070 번호로 걸려 온 전화를 받아 Gemini Live 로 바로 대화한다.
요금제·휴대폰·FAQ 는 홈페이지(/api/voice/tool)에서 찾아 오므로, 관리자에서 바꾼 내용이 전화에도 반영된다.
Next.js 웹앱과 분리된 별도 프로그램이다. 실행: python agent.py   (이지텍스 전화 상담과는 완전히 별개)

통화 내용은 저장하지 않는다. 통화 시작·종료 시각만 calls.log 에 남긴다.
"""

import asyncio
import json
import logging
import os
import sys
import time
import urllib.request

from dotenv import load_dotenv

from clawops.agent import ClawOpsAgent
from clawops.agent.pipeline import GeminiRealtime

load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("calls.log", encoding="utf-8")],
)
log = logging.getLogger("ktelecom")

from persona import SYSTEM_PROMPT  # noqa: E402  (load_dotenv 뒤에 불러와야 함)

REQUIRED = ["CLAWOPS_API_KEY", "CLAWOPS_ACCOUNT_ID", "CLAWOPS_FROM_NUMBER", "GOOGLE_API_KEY", "VOICE_TOOL_SECRET"]
TOOL_URL = os.environ.get("VOICE_TOOL_URL", "https://k-telecom.vercel.app/api/voice/tool")


_CACHE: dict[str, tuple[float, str]] = {}
_CACHE_TTL = 300  # 같은 질문의 결과는 5분 동안 바로 돌려준다


def _call_site(audience: str, name: str, args: dict) -> str:
    # audience: korean = 한국어로 말하는 고객, foreign = 그 밖의 언어로 말하는 고객
    audience = "foreign" if audience == "foreign" else "korean"
    key = f"{audience}|{name}|{json.dumps(args, sort_keys=True, ensure_ascii=False)}"
    hit = _CACHE.get(key)
    if hit and time.time() - hit[0] < _CACHE_TTL:
        return hit[1]
    result = _fetch_site(audience, name, args)
    if result and not result.startswith("정보를 불러오지 못했습니다"):
        if len(_CACHE) > 300:
            _CACHE.clear()
        _CACHE[key] = (time.time(), result)
    return result


def _fetch_site(audience: str, name: str, args: dict) -> str:
    req = urllib.request.Request(
        TOOL_URL,
        data=json.dumps({"name": name, "args": args, "audience": audience}).encode("utf-8"),
        headers={"content-type": "application/json", "x-voice-secret": os.environ["VOICE_TOOL_SECRET"]},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return json.loads(res.read().decode("utf-8")).get("result", "")
    except Exception as err:  # 홈페이지가 안 열려도 통화는 계속되게 한다
        log.warning("tool %s failed: %s", name, type(err).__name__)
        return "정보를 불러오지 못했습니다. 정확한 내용은 상담원이 확인해서 안내해 드리겠다고 말하세요."


def make_session() -> GeminiRealtime:
    return GeminiRealtime(
        system_prompt=SYSTEM_PROMPT,
        model=os.environ.get("GEMINI_LIVE_MODEL", "gemini-3.8-live"),
        voice=os.environ.get("GEMINI_VOICE", "Kore"),
        language="ko",
        greeting=True,
        api_version="v1alpha",
        # 압축을 켜지 않은 오디오 세션은 15분에서 끝난다. 긴 통화가 끊기지 않게 켠다.
        context_window_compression={"sliding_window": {}},
    )


async def main() -> None:
    missing = [k for k in REQUIRED if not os.environ.get(k)]
    if missing:
        sys.exit(f".env 에 빈 값이 있어요: {', '.join(missing)}  (.env.example 참고)")

    agent = ClawOpsAgent(
        from_=os.environ["CLAWOPS_FROM_NUMBER"],
        session_factory=make_session,
        recording=False,  # 음성 녹음은 하지 않는다
    )
    # 이벤트 처리 함수는 반드시 async 여야 한다 (일반 함수면 통화가 바로 끊긴다)
    @agent.on("call_start")
    async def _on_start(*_args, **_kwargs) -> None:
        log.info("통화 시작")

    @agent.on("call_end")
    async def _on_end(*_args, **_kwargs) -> None:
        log.info("통화 종료")

    @agent.on("call_failed")
    async def _on_failed(*_args, **_kwargs) -> None:
        log.warning("통화 실패")

    @agent.tool
    async def search_plans(network: str = "",
        billing: str = "",
        min_price: int = 0,
        max_price: int = 0,
        min_data_gb: float = 0,
        keyword: str = "",
        sort: str = "price_asc",
        audience: str = "korean",
    ) -> str:
        """Search the mobile plans. network: SKT, KT or LGU+; billing: post or prepaid; min_price/max_price: current monthly price in KRW (0 = no limit; 만원대 = 10000..19999); min_data_gb: minimum data in GB (999 = unlimited); keyword: Korean word such as 결합, eSIM, 평생; sort: price_asc, data_desc or lifetime_discount_first. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        args = {k: v for k, v in dict(network=network, billing=billing, keyword=keyword, sort=sort).items() if v}
        if min_price:
            args["min_price"] = min_price
        if max_price:
            args["max_price"] = max_price
        if min_data_gb:
            args["min_data_gb"] = min_data_gb
        return await asyncio.to_thread(_call_site, audience, "search_plans", args)

    @agent.tool
    async def get_plan(name: str, audience: str = "korean") -> str:
        """Get the full detail of one plan by its name or id. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "get_plan", {"name": name})

    @agent.tool
    async def search_phones(brand: str = "", keyword: str = "", max_monthly: int = 0, audience: str = "korean") -> str:
        """List the phones with their monthly price. brand: samsung or apple; keyword: part of the name; max_monthly: max monthly price in KRW (0 = no limit). audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        args = {k: v for k, v in dict(brand=brand, keyword=keyword).items() if v}
        if max_monthly:
            args["max_monthly"] = max_monthly
        return await asyncio.to_thread(_call_site, audience, "search_phones", args)

    @agent.tool
    async def get_phone(name: str, audience: str = "korean") -> str:
        """Get one phone's price, specifications, box contents and the exchange/return policy. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "get_phone", {"name": name})

    @agent.tool
    async def search_faq(keyword: str, audience: str = "korean") -> str:
        """Search the frequently asked questions (documents, activation, number porting, cancellation, payment...). audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "search_faq", {"keyword": keyword})

    @agent.tool
    async def list_pages(audience: str = "korean") -> str:
        """List every information page of the website (path, title, short summary). audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "list_pages", {})

    @agent.tool
    async def search_pages(keyword: str, audience: str = "korean") -> str:
        """Search all website information pages by a Korean keyword (셀프개통, 부가서비스, 할부, 인터넷, IPTV, 약관, 개인정보, 주문조회, 서류 ...) and return only the matching lines. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "search_pages", {"keyword": keyword})

    @agent.tool
    async def get_page(page: str, audience: str = "korean") -> str:
        """Get the content of one website page by its path (e.g. /plans/self, /internet, /company) or title. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "get_page", {"page": page})

    @agent.tool
    async def get_events(audience: str = "korean") -> str:
        """Current events and promotions. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "get_events", {})

    @agent.tool
    async def get_notices(audience: str = "korean") -> str:
        """Recent notices. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "get_notices", {})

    @agent.tool
    async def get_company_info(audience: str = "korean") -> str:
        """Company name, CEO, address, phone, email and how to reach staff. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return await asyncio.to_thread(_call_site, audience, "get_company_info", {})

    async def keep_warm() -> None:
        """홈페이지 서버가 식어 있으면 첫 조회가 느리다. 시작할 때와 4분마다 미리 불러 둔다 (통화 중 바로 대답하기 위해)."""
        while True:
            for audience in ("korean", "foreign"):
                for name, args in (("search_pages", {"keyword": "셀프개통"}), ("get_company_info", {}), ("search_plans", {"max_price": 20000})):
                    await asyncio.to_thread(_call_site, audience, name, args)
            await asyncio.sleep(240)

    warm_task = asyncio.create_task(keep_warm())  # noqa: F841  (프로그램이 도는 동안 계속)

    if sys.platform == "win32":
        # serve() 는 유닉스 종료 신호를 쓰므로 윈도우에서는 연결만 하고 계속 대기한다.
        await agent.connect()
        await asyncio.Event().wait()
    else:
        await agent.serve()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass

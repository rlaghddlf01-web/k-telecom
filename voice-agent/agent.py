"""케이텔레콤 전화 AI 상담 (시험 단계).

한국AI통신(koreaaitel)에서 받은 070 번호로 걸려 온 전화를 받아 Gemini Live 로 바로 대화한다.
요금제·휴대폰·FAQ·안내 페이지 전체는 켜질 때 홈페이지(/api/voice/snapshot)에서 받아 메모리에 올려 두고
(10분마다 갱신), 통화 중에는 인터넷 없이 바로 찾는다. (knowledge.py)
Next.js 웹앱과 분리된 별도 프로그램이다. 실행: python agent.py   (이지텍스 전화 상담과는 완전히 별개)

통화 내용은 저장하지 않는다. 통화 시작·종료 시각만 calls.log 에 남긴다.
"""

import asyncio
import logging
import os
import sys

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

import knowledge  # noqa: E402  (load_dotenv 뒤에 불러와야 함)
from persona import SYSTEM_PROMPT  # noqa: E402

REQUIRED = ["CLAWOPS_API_KEY", "CLAWOPS_ACCOUNT_ID", "CLAWOPS_FROM_NUMBER", "GOOGLE_API_KEY", "VOICE_TOOL_SECRET"]


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

    # 지식을 메모리에 올린다 (저장해 둔 파일은 바로, 최신본은 홈페이지에서). 이후 10분마다 갱신
    await asyncio.to_thread(knowledge.start)

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
    async def search_plans(
        network: str = "",
        billing: str = "",
        min_price: int = 0,
        max_price: int = 0,
        min_data_gb: float = 0,
        keyword: str = "",
        sort: str = "price_asc",
        audience: str = "korean",
    ) -> str:
        """Search the mobile plans. network: SKT, KT or LGU+; billing: post or prepaid; min_price/max_price: current monthly price in KRW (0 = no limit; 만원대 = 10000..19999); min_data_gb: minimum data in GB (999 = unlimited); keyword: Korean word such as 결합, eSIM, 평생; sort: price_asc, data_desc or lifetime_discount_first. Returns Korean text."""
        return knowledge.search_plans(network, billing, min_price, max_price, min_data_gb, keyword, sort)

    @agent.tool
    async def get_plan(name: str, audience: str = "korean") -> str:
        """Get the full detail of one plan by its name or id. Returns Korean text."""
        return knowledge.get_plan(name)

    @agent.tool
    async def search_phones(brand: str = "", keyword: str = "", max_monthly: int = 0, audience: str = "korean") -> str:
        """List the phones with their monthly price. brand: samsung or apple; keyword: part of the name; max_monthly: max monthly price in KRW (0 = no limit). Returns Korean text."""
        return knowledge.search_phones(brand, keyword, max_monthly)

    @agent.tool
    async def get_phone(name: str, audience: str = "korean") -> str:
        """Get one phone's price, specifications, box contents and the exchange/return policy. Returns Korean text."""
        return knowledge.get_phone(name)

    @agent.tool
    async def search_faq(keyword: str, audience: str = "korean") -> str:
        """Search the frequently asked questions (documents, activation, number porting, cancellation, payment...). audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return knowledge.search_faq(keyword, audience)

    @agent.tool
    async def list_pages(audience: str = "korean") -> str:
        """List every information page of the website (path, title, short summary). audience: korean or foreign. Returns Korean text."""
        return knowledge.list_pages(audience)

    @agent.tool
    async def search_pages(keyword: str, audience: str = "korean") -> str:
        """Search all website information pages by a Korean keyword (셀프개통, 부가서비스, 할부, 인터넷, IPTV, 약관, 개인정보, 주문조회, 서류 ...) and return only the matching lines. audience: korean if the caller speaks Korean, otherwise foreign. Returns Korean text."""
        return knowledge.search_pages(keyword, audience)

    @agent.tool
    async def get_page(page: str, audience: str = "korean") -> str:
        """Get the content of one website page by its path (e.g. /plans/self, /internet, /company) or title. audience: korean or foreign. Returns Korean text."""
        return knowledge.get_page(page, audience)

    @agent.tool
    async def get_events(audience: str = "korean") -> str:
        """Current events and promotions. audience: korean or foreign. Returns Korean text."""
        return knowledge.get_events(audience)

    @agent.tool
    async def get_notices(audience: str = "korean") -> str:
        """Recent notices. audience: korean or foreign. Returns Korean text."""
        return knowledge.get_notices(audience)

    @agent.tool
    async def get_company_info() -> str:
        """Company name, CEO, address, phone, email and how to reach staff. Returns Korean text."""
        return knowledge.get_company_info()

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

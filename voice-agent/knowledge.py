"""케이텔레콤 지식: 홈페이지의 전체 내용을 메모리에 올려 두고 통화 중에는 인터넷 없이 바로 찾는다.

- 프로그램이 켜질 때 지난번에 받아 둔 파일(snapshot.cache.json)을 바로 읽고, 홈페이지(/api/voice/snapshot)에서 최신본을 받아 온다.
- 이후 10분마다 최신본으로 바꾼다. (관리자에서 요금제·내용을 바꾸면 최대 10분 안에 전화에도 반영된다)
- 검색 규칙은 홈페이지의 채팅 상담사 도구(src/lib/server/chatTools.ts)와 같다.
"""

import json
import logging
import os
import re
import threading
import time
import urllib.request
from pathlib import Path

log = logging.getLogger("ktelecom.knowledge")

_CACHE_FILE = Path(__file__).with_name("snapshot.cache.json")
_DATA: dict = {}
_LOCK = threading.Lock()
REFRESH_SECONDS = 600


def _snapshot_url() -> str:
    explicit = os.environ.get("VOICE_SNAPSHOT_URL")
    if explicit:
        return explicit
    base = os.environ.get("VOICE_TOOL_URL", "https://k-telecom.vercel.app/api/voice/tool")
    return base.rsplit("/", 1)[0] + "/snapshot"


def _fetch() -> dict:
    req = urllib.request.Request(_snapshot_url(), headers={"x-voice-secret": os.environ["VOICE_TOOL_SECRET"]})
    with urllib.request.urlopen(req, timeout=40) as res:
        return json.loads(res.read().decode("utf-8"))


def refresh() -> bool:
    """홈페이지에서 최신 내용을 받아 메모리와 파일에 저장한다. 실패하면 기존 내용을 그대로 쓴다."""
    global _DATA
    try:
        data = _fetch()
    except Exception as err:
        log.warning("snapshot refresh failed: %s", type(err).__name__)
        return False
    with _LOCK:
        _DATA = data
    try:
        _CACHE_FILE.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    except OSError:
        pass
    log.info("snapshot loaded: plans=%d phones=%d", len(data.get("plans", [])), len(data.get("phones", [])))
    return True


def load_cache() -> bool:
    global _DATA
    try:
        data = json.loads(_CACHE_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return False
    with _LOCK:
        _DATA = data
    log.info("snapshot cache loaded: plans=%d", len(data.get("plans", [])))
    return True


def start() -> None:
    """켜질 때 한 번 호출: 저장해 둔 파일을 바로 읽고, 최신본을 받아 오고, 10분마다 갱신한다."""
    load_cache()
    refresh()

    def loop() -> None:
        while True:
            time.sleep(REFRESH_SECONDS)
            refresh()

    threading.Thread(target=loop, name="snapshot-refresh", daemon=True).start()


# ---------------------------------------------------------------------------
# 검색 (chatTools.ts 와 같은 규칙)
# ---------------------------------------------------------------------------
_NOT_READY = "정보를 아직 불러오지 못했습니다. 정확한 내용은 상담원이 확인해서 안내해 드리겠다고 말하세요."


def _norm(s: str) -> str:
    return re.sub(r"\s+", "", str(s or "")).lower()


def _audience(a: str) -> str:
    return "foreign" if a == "foreign" else "korean"


def _short(s: str, n: int) -> str:
    return s if len(s) <= n else s[:n] + "…"


_SYNONYMS = [
    ["국제전화", "국제통화", "해외통화", "해외전화", "글로벌통화", "00700"],
    ["무료충전", "2개월무료", "3개월무료"],
    ["결합", "인터넷결합", "kt인터넷", "인터넷결합할인"],
    ["5g", "5지"],
]


def _alternatives(kw: str) -> list[str]:
    """같은 뜻의 말: 어느 쪽으로 물어도 같은 요금제가 나오게 한다 (chatTools.ts 와 같은 규칙)"""
    for group in _SYNONYMS:
        if any(w in kw for w in group):
            return list(dict.fromkeys([kw, *group]))
    return [kw]


def search_plans(network="", billing="", min_price=0, max_price=0, min_data_gb=0, keyword="", sort="price_asc") -> str:
    plans = _DATA.get("plans")
    if not plans:
        return _NOT_READY
    net = str(network or "").strip().upper().replace("LG U+", "LGU+")
    if net == "LGU":
        net = "LGU+"
    bill = str(billing or "").strip().lower()
    kw = _norm(keyword)
    out = []
    for p in plans:
        if net and p["network"] != net:
            continue
        if bill and p["billing"] != ("prepaid" if bill.startswith("pre") else "post"):
            continue
        if min_price and p["promoPrice"] < min_price:
            continue
        if max_price and p["promoPrice"] > max_price:
            continue
        if min_data_gb and p["dataGB"] < min_data_gb:
            continue
        if kw:
            hay = _norm(f"{p['name']} {' '.join(p['features'])} {p['badge']} {p.get('promoNote', '')}")
            if not any(k in hay for k in _alternatives(kw)):
                continue
        out.append(p)
    if sort == "data_desc":
        out.sort(key=lambda p: (-p["dataGB"], p["promoPrice"]))
    elif sort == "lifetime_discount_first":
        out.sort(key=lambda p: (p["promoNote"] != "평생 할인", p["promoPrice"]))
    else:
        out.sort(key=lambda p: (p["promoPrice"], -p["dataGB"]))
    if not out:
        return "조건에 맞는 요금제가 없습니다. 조건을 넓혀 다시 찾아 보세요."
    return f"조건에 맞는 요금제 {len(out)}개 중 {min(8, len(out))}개:\n" + "\n".join(p["line"] for p in out[:8])


def get_plan(name: str) -> str:
    plans = _DATA.get("plans")
    if not plans:
        return _NOT_READY
    q = _norm(name)
    if not q:
        return "요금제 이름을 알려 주세요."
    hit = next((p for p in plans if _norm(p["id"]) == q), None) or next((p for p in plans if _norm(p["name"]) == q), None) or next((p for p in plans if q in _norm(p["name"])), None)
    return hit["line"] if hit else "해당 이름의 요금제를 찾지 못했습니다. search_plans 로 먼저 찾아 보세요."


def search_phones(brand="", keyword="", max_monthly=0) -> str:
    phones = _DATA.get("phones")
    if not phones:
        return _NOT_READY
    b = str(brand or "").strip().lower()
    b = {"galaxy": "samsung", "iphone": "apple"}.get(b, b)
    kw = _norm(keyword)
    out = [
        p
        for p in phones
        if (not b or p["brand"] == b) and (not kw or kw in _norm(p["title"])) and (not max_monthly or (p["monthly"] or 10**12) <= max_monthly)
    ]
    out.sort(key=lambda p: p["monthly"] or 10**12)
    if not out:
        return "조건에 맞는 휴대폰이 없습니다."
    head = (_DATA.get("phoneNotice") or "") + ("\n" if _DATA.get("phoneNotice") else "")
    return head + f"휴대폰 {len(out)}개 (월 금액이 낮은 순, 24개월 할부 기준 월 최저가):\n" + "\n".join(p["line"] for p in out)


def get_phone(name: str) -> str:
    phones = _DATA.get("phones")
    if not phones:
        return _NOT_READY
    q = _norm(name)
    if not q:
        return "휴대폰 이름을 알려 주세요."
    hit = next((p for p in phones if _norm(p["title"]) == q), None) or next((p for p in phones if q in _norm(p["title"])), None)
    return hit["detail"] if hit else "해당 이름의 휴대폰을 찾지 못했습니다. search_phones 로 먼저 찾아 보세요."


def search_faq(keyword: str, audience="korean") -> str:
    faqs = (_DATA.get("faqs") or {}).get(_audience(audience))
    if not faqs:
        return _NOT_READY
    kw = _norm(keyword)
    words = [_norm(w) for w in str(keyword or "").split() if len(w) > 1]
    scored = []
    for f in faqs:
        text = _norm(f"{f['category']} {f['q']} {f['a']}")
        score = (3 if kw and kw in text else 0) + sum(1 for w in words if w in text)
        if score > 0:
            scored.append((score, f))
    scored.sort(key=lambda x: -x[0])
    if not scored:
        return "관련 FAQ가 없습니다. 모르는 내용은 직원이 확인해 드린다고 안내하세요."
    return "\n\n".join(f"Q. {f['q']}\nA. {f['a']}" for _, f in scored[:4])


def _pages(audience: str) -> list[dict]:
    return (_DATA.get("pages") or {}).get(_audience(audience)) or []


def list_pages(audience="korean") -> str:
    pages = _pages(audience)
    if not pages:
        return _NOT_READY
    lines = [f"- {p['path']} | {p['title']} | {_short(p['text'].replace(chr(10), ' '), 80)}" for p in pages]
    return f"홈페이지 안내 페이지 {len(lines)}개:\n" + "\n".join(lines)


def search_pages(keyword: str, audience="korean") -> str:
    pages = _pages(audience)
    if not pages:
        return _NOT_READY
    kw = _norm(keyword)
    if not kw:
        return "검색어를 알려 주세요."
    words = [_norm(w) for w in str(keyword).split() if len(w) > 1]
    hits = []
    for p in pages:
        hay = _norm(f"{p['title']} {p['text']}")
        score = (3 if kw in hay else 0) + sum(1 for w in words if w in hay) + (3 if kw in _norm(p["title"]) else 0)
        if score > 0:
            hits.append((score, p))
    hits.sort(key=lambda x: -x[0])
    if not hits:
        return "관련 페이지가 없습니다. 직원이 확인해 드린다고 안내하세요."
    terms = [kw] + words

    def relevant(text: str) -> str:
        lines = [l for l in text.split("\n") if l]
        picked = [l for l in lines if any(t in _norm(l) for t in terms)]
        return _short("\n".join(picked if picked else lines[:2]), 500)

    return "\n\n".join(f"## {p['title']} ({p['path']})\n{relevant(p['text'])}" for _, p in hits[:3])


def get_page(page: str, audience="korean") -> str:
    pages = _pages(audience)
    if not pages:
        return _NOT_READY
    q = str(page or "").strip()
    hit = (
        next((p for p in pages if p["path"] == q), None)
        or next((p for p in pages if _norm(p["title"]) == _norm(q)), None)
        or next((p for p in pages if _norm(q) in _norm(p["title"])), None)
    )
    if not hit:
        return "해당 페이지를 찾지 못했습니다. list_pages 로 먼저 찾아 보세요."
    return f"## {hit['title']} ({hit['path']})\n{_short(hit['text'], 1800)}"


def get_events(audience="korean") -> str:
    return (_DATA.get("events") or {}).get(_audience(audience)) or _NOT_READY


def get_notices(audience="korean") -> str:
    return (_DATA.get("notices") or {}).get(_audience(audience)) or _NOT_READY


def get_company_info() -> str:
    return _DATA.get("company") or _NOT_READY

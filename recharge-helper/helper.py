"""케이텔레콤 충전 도우미 (1단계: 확인까지만 하고 멈춤).

고객이 사이트에 남긴 선불 충전 요청을 가져와서, 프리티 판매점 화면에서
  1) 번호 뒤 8자리를 넣고  2) "폰번호 정보 확인"을 눌러 가입자인지 보여 주고  3) 거기서 멈춘다.
"freeT 고객 가상계좌 전송" 버튼은 사장님이 화면을 보고 직접 누른다. 이 프로그램은 절대 누르지 않는다.
"충 전" 버튼(예치금이 빠지는 버튼)도 절대 누르지 않는다.

사장님 PC 에서만 실행한다. 이지텍스 프로그램과는 완전히 별개다 (다른 키, 다른 브라우저 폴더).
"""

import json
import os
import sys
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

SITE_URL = os.environ.get("SITE_URL", "https://k-telecom.vercel.app").rstrip("/")
SECRET = os.environ.get("RECHARGE_WORKER_SECRET", "")
PARTNER_CHARGE_URL = "https://partner.freet.co.kr/view/charge/agencyCreditCharge.jsp?account=1"
PROFILE_DIR = Path(__file__).with_name("profile")  # 로그인 상태가 저장되는 전용 브라우저 폴더 (비밀번호는 저장하지 않는다)

# 이 이름의 링크만 누를 수 있다. 그 밖의 버튼(전송, 충전, 로그아웃 등)은 코드로 누를 수 없게 막아 둔다.
ALLOWED_CLICKS = {"폰번호 정보 확인"}


def api(method: str, payload: dict | None = None) -> dict:
    req = urllib.request.Request(
        f"{SITE_URL}/api/recharge/worker",
        data=json.dumps(payload).encode("utf-8") if payload is not None else None,
        method=method,
        headers={"content-type": "application/json", "x-worker-secret": SECRET},
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode("utf-8"))


def safe_click(page, name: str) -> None:
    if name not in ALLOWED_CLICKS:
        raise RuntimeError(f"허용되지 않은 버튼입니다: {name}")
    page.get_by_role("link", name=name).first.click()


def check_member(page, phone: str) -> str:
    """번호를 넣고 가입자 확인까지만 한다. 화면의 '고객정보' 칸 글자를 돌려준다."""
    page.goto(PARTNER_CHARGE_URL)
    page.wait_for_load_state("domcontentloaded")
    if "login" in page.url.lower():
        return "(로그인이 필요합니다. 열린 브라우저에서 판매점에 로그인한 뒤 다시 실행하세요)"
    page.get_by_placeholder("뒤 8자리 입력").fill(phone[3:])
    safe_click(page, "폰번호 정보 확인")
    page.wait_for_timeout(1500)
    try:
        return page.locator("tr:has-text('고객정보') td").first.inner_text(timeout=4000).strip() or "(고객정보가 비어 있습니다. 가입자가 아닐 수 있습니다)"
    except Exception:
        return "(고객정보를 읽지 못했습니다. 화면을 직접 확인하세요)"


def ask(prompt: str) -> str:
    try:
        return input(prompt).strip().lower()
    except EOFError:
        return "q"


def main() -> None:
    if not SECRET:
        sys.exit(".env 에 RECHARGE_WORKER_SECRET 이 비어 있어요 (.env.example 참고)")
    rows = api("GET").get("rows", [])
    if not rows:
        print("처리할 충전 요청이 없습니다.")
        return
    print(f"처리할 충전 요청 {len(rows)}건")

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(str(PROFILE_DIR), headless=False)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        for r in rows:
            print("\n" + "=" * 60)
            print(f"번호: {r['phone']}   종류: {r['kind']}   상품/금액: {r['item']}")
            info = check_member(page, r["phone"])
            print(f"프리티 화면 고객정보: {info}")
            print("→ 가입자가 맞으면 화면에서 'freeT 고객 가상계좌 전송' 버튼을 직접 누르세요. (프로그램은 누르지 않습니다)")
            while True:
                a = ask("[d] 전송했음(완료)  [x] 처리 불가(가입자 아님 등)  [s] 건너뜀  [q] 그만 : ")
                if a == "d":
                    api("POST", {"id": r["id"], "status": "done"})
                    print("완료로 기록했습니다.")
                    break
                if a == "x":
                    api("POST", {"id": r["id"], "status": "cancelled"})
                    print("처리 불가로 기록했습니다.")
                    break
                if a == "s":
                    break
                if a == "q":
                    ctx.close()
                    return
        ctx.close()
    print("\n끝났습니다.")


if __name__ == "__main__":
    main()

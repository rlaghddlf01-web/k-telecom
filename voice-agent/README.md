# 케이텔레콤 전화 AI 상담 (시험 단계)

한국AI통신 070 번호로 걸려 온 전화를 AI 상담사 "케이" 가 받습니다.
**이지텍스 전화 상담과는 별개입니다.** 계정·번호·키·프로그램을 공유하지 않습니다.

## 구조
- `agent.py` : 전화를 받는 프로그램 (Gemini Live 음성 대화)
- `persona.py` : 말투와 규칙
- 요금제·휴대폰·FAQ 는 홈페이지의 `/api/voice/tool` 에서 찾아 옵니다 (채팅 상담사와 같은 도구). 관리자에서 바꾼 내용이 전화에도 반영됩니다.
- 통화 내용은 저장하지 않고, 시작·종료 시각만 `calls.log` 에 남깁니다.

## 준비 (한 번만)
1. 한국AI통신 케이텔레콤 계정에서 **API 키**를 새로 발급하고 **계정 ID** 를 확인합니다.
2. `.env.example` 을 `.env` 로 복사해 값을 채웁니다. (`.env` 는 깃·채팅에 올리지 않습니다)
   - `VOICE_TOOL_SECRET` : 긴 임의 문자열을 직접 정합니다.
3. 같은 `VOICE_TOOL_SECRET` 값을 Vercel 프로젝트(k-telecom) 환경변수에도 넣고 다시 배포합니다.
4. 한국AI통신 → 전화번호 → 이 번호의 **인바운드 라우팅**을 플랫폼 기본 에이전트가 아니라 이 프로그램(외부 에이전트)으로 바꿉니다.
5. 설치:

```bash
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 실행
```bash
.venv\Scripts\python.exe agent.py
```
"ClawOpsAgent connected on 070..." 로그가 나오면 전화를 받을 수 있습니다. 번호로 전화해서 시험하세요.

## 주의
- 무료 체험이 끝나면 번호가 반납됩니다 (체험 종료일을 확인하세요).
- 전화로는 주민번호·신분증 번호·카드번호를 받지 않도록 상담사에게 지시되어 있습니다.

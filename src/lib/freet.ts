/**
 * 프리티 셀프개통(고객이 직접 가입하는 프리티 화면) 주소.
 * storeAgentIdKey 는 우리 판매점 코드라서, 이 주소로 들어와 개통한 고객이 우리 실적으로 잡힌다.
 * (프리티 정산 화면에서 실적 연결을 확인했다고 대표님이 알려 주셨음)
 */
const STORE_KEY = 'PS1200942';

/** 유심(USIM)으로 가입하는 셀프개통 시작 화면 */
export const FREET_SELF_URL = `https://agent.freet.co.kr/self/custSel?usimType=U&storeAgentIdKey=${STORE_KEY}`;

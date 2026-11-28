/**
 * 휴대폰 판매 상태. 프리티가 휴대폰을 취급하지 않아 지금은 "준비 중"으로 보여 준다.
 * 가격(월 할부금) 자리에는 금액 대신 "준비 중"이 나온다.
 * 판매를 시작하게 되면 PHONES_COMING_SOON 을 false 로 바꾸면 배지·안내가 사라지고 원래 가격이 나온다.
 */
export const PHONES_COMING_SOON = true;

export const PHONES_SOON_BADGE = '준비 중';

/** 가격 자리에 대신 나오는 말 */
export const PHONES_SOON_PRICE = '준비 중';

export const PHONES_SOON_NOTICE = '휴대폰 판매는 현재 준비 중입니다. 판매가 시작되면 가격과 함께 안내해 드립니다.';

/** AI 상담사가 휴대폰을 안내할 때 붙이는 말 */
export const PHONES_SOON_AI_NOTE = '※ 휴대폰 판매는 현재 준비 중입니다. 가격은 아직 정해지지 않았고 지금은 구매·신청을 받지 않습니다. 휴대폰 가격이나 월 할부금을 절대 말하지 말고, "준비 중"이라고만 안내하세요.';

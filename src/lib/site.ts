import type { LucideIcon } from 'lucide-react';
import { Smartphone, CardSim, Wifi, Tv, Globe2, ScanLine, Truck, Headset } from 'lucide-react';

export const COMPANY = {
  name: 'K-Telecom(케이텔레콤)',
  brand: 'KTRS',
  ceo: '김홍일',
  phone: '010-4885-8575',
  email: 'zkfnrh01@naver.com',
  address: '경기도 남양주시 부평로 48번길 140, 107-1102',
};

export interface Category {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const CATEGORIES: Category[] = [
  { label: '스마트폰', icon: Smartphone, href: '/phones' },
  { label: '알뜰폰 요금제', icon: CardSim, href: '/plans' },
  { label: 'eSIM', icon: CardSim, href: '/plans/esim' },
  { label: '원룸 인터넷', icon: Wifi, href: '/internet' },
  { label: 'IPTV', icon: Tv, href: '/internet/iptv' },
  { label: '국제통화', icon: Globe2, href: '/plans/addons' },
  { label: '신분증 OCR 접수', icon: ScanLine, href: '/plans/apply' },
];

export const PROCESS_STEPS = [
  { icon: Globe2, title: '모국어 선택', desc: '내 나라 말로 폰·요금제·인터넷을 고르고 월 납부액을 투명하게 확인합니다.' },
  { icon: ScanLine, title: '신분증 OCR 스캔', desc: '외국인등록증을 촬영하면 영문명과 등록번호가 자동으로 입력됩니다.' },
  { icon: Headset, title: '접수 자동 전달', desc: '신청 정보가 제휴 통신사 전산으로 암호화되어 전달됩니다.' },
  { icon: Truck, title: '배송 및 방문 설치', desc: '단말·유심은 택배로, 인터넷은 전문 기사님이 방문해 설치합니다.' },
];

export const PAIN_POINTS = [
  { problem: '한국어로만 설명해서 요금제를 이해할 수 없어요', solution: '요금제와 월 납부액을 모국어로 100% 투명하게 확인' },
  { problem: '신용카드 할부가 안 돼서 현금 일시불을 요구해요', solution: '외국인등록증 기반 24개월 통신요금 합산 분할 청구' },
  { problem: '이사할 때 인터넷 신청을 포기했어요', solution: '원룸 GiGA 인터넷+TV 1분 신청, 기사님 방문 설치' },
  { problem: '매장에 가서 1시간 넘게 기다려야 해요', solution: '신분증 OCR과 전자서명으로 30초 비대면 접수' },
];

export const NEWS = [
  { date: '8.25', title: 'K-Telecom × 아이즈모바일 사업제휴 제안', desc: '외국인 통신 원스톱 공급을 위한 B2B 파트너십을 제안합니다.' },
  { date: '8.20', title: '외국인등록증 OCR 30초 무인 접수 안내', desc: '매장 방문 없이 사진 한 장으로 접수를 마칩니다.' },
  { date: '8.10', title: '원룸·기숙사 전용 GiGA 인터넷 결합 상품', desc: '이사 전에 미리 신청하고 설치 일정까지 한 번에 잡으세요.' },
  { date: '8.01', title: '알뜰폰 무료 국제통화 패키지 안내', desc: '고향에 매월 무료로 전화할 수 있는 요금제를 소개합니다.' },
];

export const PARTNER_TYPES = ['단말기 할부 결합', '알뜰폰 요금제', '초고속 인터넷·IPTV', '기타 제휴'];


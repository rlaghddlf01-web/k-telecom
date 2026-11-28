/**
 * 카카오톡·PASS 인증서 발급 안내 데이터 (이지텍스 안내에서 인증서 발급 부분만 가져옴. 홈택스·인증 승인 슬라이드는 뺌).
 * 마커: x, y = 점선 박스 중심(%), text = 말풍선(한국어 문장 키, certGuideTexts.ts에서 언어별 번역), 나머지는 박스/말풍선 모양 옵션.
 * 사진의 개인정보(이름·생년월일·이메일·친구 목록)는 임의 값으로 바꾸거나 흐리게 처리했습니다.
 */

export interface CertMarker {
  x: number;
  y: number;
  text: string;
  textX?: number;
  textY?: number;
  hideBox?: boolean;
  hideArrow?: boolean;
  isRed?: boolean;
  isSmall?: boolean;
  isLarge?: boolean;
  fontSize?: number;
  position?: 'top' | 'bottom';
}

export interface CertSlide {
  image: string;
  markers: CertMarker[];
}

export interface CertChapter {
  title: string;
  start: number;
  icon: string;
}

export interface CertGuideDef {
  slides: CertSlide[];
  chapters: CertChapter[];
}

export const KAKAO_GUIDE: CertGuideDef = {
  slides: [
    { image: "/images/guide/kakao/kakao_1.jpg", markers: [{"x":84,"y":23,"text":"Play 스토어에서 '카카오톡'을 검색하여 설치해 주세요.","textX":50,"textY":15}] },
    { image: "/images/guide/kakao/kakao_2.jpg", markers: [{"x":88,"y":24,"text":"설치가 완료되었습니다. '열기'를 눌러 카카오톡을 실행해 주세요.","textX":50,"textY":14}] },
    { image: "/images/guide/kakao/kakao_3.jpg", markers: [{"x":50,"y":42,"text":"카카오톡이 처음이라면 '새로운 카카오계정 만들기'를 눌러 가입을 시작해 주세요.","textX":50,"textY":35}] },
    { image: "/images/guide/kakao/kakao_4.jpg", markers: [{"x":7,"y":16.5,"text":"이용 약관에 모두 동의해 주세요.","textX":35,"textY":8,"position":"bottom"},{"x":50,"y":72,"text":"'동의하고 계속 진행합니다' 버튼을 눌러 다음으로 넘어가세요.","textX":50,"textY":65}] },
    { image: "/images/guide/kakao/kakao_5.jpg", markers: [{"x":78,"y":55.5,"text":"원활한 가입을 위해 '확인'을 눌러 전화 권한을 허용해 주세요.","textX":50,"textY":42}] },
    { image: "/images/guide/kakao/kakao_6.jpg", markers: [{"x":50,"y":81,"text":"시스템 팝업창에서 '허용'을 눌러주세요.","textX":50,"textY":74},{"x":50,"y":10,"text":"안내 문구가 가려져 보이지 않는다면 화면을 아래로 내려보세요.","hideBox":true,"textX":50,"textY":10}] },
    { image: "/images/guide/kakao/kakao_7.jpg", markers: [{"x":50,"y":34.5,"text":"전화번호가 자동으로 입력되었습니다. '확인'을 눌러 다음 단계로 넘어가 주세요.","textX":50,"textY":45}] },
    { image: "/images/guide/kakao/kakao_8.jpg", markers: [{"x":50,"y":19,"text":"문자로 받은 인증번호 6자리를 입력해 주세요.","textX":50,"textY":9},{"x":50,"y":32,"text":"인증번호 입력 후 '다음' 버튼을 눌러주세요.","textX":50,"textY":42,"position":"bottom"}] },
    { image: "/images/guide/kakao/kakao_9.jpg", markers: [{"x":50,"y":31,"text":"사용하실 비밀번호를 위,아래 동일하게 한번씩 입력해 주세요.","textX":50,"textY":20},{"x":50,"y":47,"text":"비밀번호 설정 후 '확인'을 눌러주세요.","textX":50,"textY":55,"position":"bottom"}] },
    { image: "/images/guide/kakao/kakao_10.jpg", markers: [{"x":50,"y":47.5,"text":"비밀번호를 모두 입력하셨다면 '확인'을 눌러주세요.","textX":50,"textY":60,"position":"bottom"}] },
    { image: "/images/guide/kakao/kakao_11.jpg", markers: [{"x":50,"y":23,"text":"사용하실 닉네임을 입력해 주세요."},{"x":50,"y":29,"text":"생일을 선택해 주세요."},{"x":50,"y":35,"text":"성별을 선택해 주세요. (남성은 '남성', 여성은 '여성'을 선택)","textX":50,"textY":42,"position":"bottom"},{"x":50,"y":54,"text":"모든 정보 입력 후 '확인'을 눌러주세요.","textX":50,"textY":65,"position":"bottom"}] },
    { image: "/images/guide/kakao/kakao_12.jpg", markers: [{"x":50,"y":54,"text":"입력하신 정보를 다시 한번 확인하신 후 '확인'을 눌러주세요.","textX":50,"textY":65,"position":"bottom"}] },
    { image: "/images/guide/kakao/kakao_13.jpg", markers: [{"x":50,"y":41,"text":"빠른 진행을 위해 '나중에 하기'를 눌러 다음 단계로 넘어가 주세요.","textX":50,"textY":52,"position":"bottom"}] },
    { image: "/images/guide/kakao/kakao_14.jpg", markers: [{"x":50,"y":89,"text":"원활한 서비스 이용을 위해 내용을 확인하신 후 '확인'을 눌러주세요.","textX":50,"textY":82},{"x":50,"y":10,"text":"안내 내용이 더 있으니 화면을 아래로 내려보세요.","hideBox":true,"textX":50,"textY":10}] },
    { image: "/images/guide/kakao/kakao_15.jpg", markers: [{"x":50,"y":81,"text":"시스템 팝업창에서 '허용'을 눌러주세요.","textX":50,"textY":74,"position":"top"},{"x":50,"y":10,"text":"안내 내용이 더 있으니 화면을 아래로 내려보세요.","hideBox":true,"textX":50,"textY":10}] },
    { image: "/images/guide/kakao/kakao_16.jpg", markers: [{"x":50,"y":81,"text":"시스템 팝업창에서 '허용'을 눌러주세요.","textX":50,"textY":74,"position":"top"},{"x":50,"y":10,"text":"안내 내용이 더 있으니 화면을 아래로 내려보세요.","hideBox":true,"textX":50,"textY":10}] },
    { image: "/images/guide/kakao/kakao_17.jpg", markers: [{"x":78,"y":59.5,"text":"원활한 서비스 사용을 위해 '확인'을 눌러주세요.","textX":50,"textY":50,"position":"top"}] },
    { image: "/images/guide/kakao/kakao_18.jpg", markers: [{"x":78,"y":59.5,"text":"원활한 서비스 사용을 위해 '확인'을 눌러주세요.","textX":50,"textY":50,"position":"top"}] },
    { image: "/images/guide/kakao/kakao_19.jpg", markers: [{"x":88,"y":91,"text":"더보기 메뉴로 가기 위해 하단의 '...' 아이콘을 눌러주세요.","textX":50,"textY":82},{"x":50,"y":10,"text":"안내 내용이 더 있으니 화면을 아래로 내려보세요.","hideBox":true,"textX":50,"textY":10}] },
    { image: "/images/guide/kakao/kakao_20.jpg", markers: [{"x":27,"y":12.5,"text":"인증서 확인을 위해 상단의 '지갑' 탭을 눌러주세요.","textX":50,"textY":4}] },
    { image: "/images/guide/kakao/kakao_21.jpg", markers: [{"x":50,"y":66,"text":"다른 서비스들이 많으니 주의하세요! '인증서 발급'을 정확히 눌러주세요.","textX":50,"textY":58,"position":"top","isRed":true}] },
    { image: "/images/guide/kakao/kakao_22.jpg", markers: [{"x":7,"y":24.5,"text":"원활한 진행을 위해 '전체 동의'를 체크해 주세요.","textX":50,"textY":17},{"x":50,"y":89,"text":"동의 후 하단의 '계속 진행하기' 버튼을 눌러주세요.","textX":50,"textY":82,"position":"top"}] },
    { image: "/images/guide/kakao/kakao_23.jpg", markers: [{"x":50,"y":27,"text":"본인 성함을 입력해 주세요.","textX":50,"textY":27,"isSmall":true,"fontSize":10,"hideArrow":true},{"x":50,"y":33,"text":"외국인등록번호 앞 6자리와 뒤 1자리를 입력해 주세요.","textX":50,"textY":33,"isSmall":true,"fontSize":10,"hideArrow":true},{"x":50,"y":39,"text":"이용 중인 통신사를 선택해 주세요. (알뜰폰은 하단 탭 확인)","textX":50,"textY":39,"isSmall":true,"fontSize":10,"hideArrow":true},{"x":35.5,"y":45,"text":"본인 휴대폰 번호를 입력해 주세요.","textX":35.5,"textY":45,"isSmall":true,"fontSize":10,"hideArrow":true},{"x":85,"y":45,"text":"인증요청","textX":85,"textY":45,"isSmall":true,"fontSize":10,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_24.jpg", markers: [{"x":22,"y":56,"text":"알뜰폰 사용자를 위한 추가 동의입니다. '동의합니다'를 체크해 주세요.","textX":50,"textY":48,"isSmall":true,"hideArrow":true},{"x":50,"y":64.5,"text":"'확인'을 눌러 계속 진행해 주세요.","textX":50,"textY":73,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_25.jpg", markers: [{"x":50,"y":51,"text":"문자로 받은 인증번호 6자리를 입력해 주세요.","textX":50,"textY":43,"isSmall":true,"hideArrow":true},{"x":50,"y":61,"text":"인증번호 입력 후 '다음' 버튼을 눌러주세요.","textX":50,"textY":70,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_26.jpg", markers: [{"x":50,"y":64,"text":"본인이 이용 중인 은행을 선택해 주세요.","textX":50,"textY":35,"isLarge":true,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_27.jpg", markers: [{"x":50,"y":48,"text":"본인 명의의 계좌번호를 숫자만 입력해 주세요.","textX":50,"textY":38,"isSmall":true,"hideArrow":true},{"x":50,"y":89,"text":"정보 입력 후 '1원 송금하기'를 눌러주세요.","textX":50,"textY":80,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_28.jpg", markers: [{"x":50,"y":44,"text":"입금자명 '카카오' 뒤의 숫자 3자리를 입력해 주세요.","textX":50,"textY":34,"isSmall":true,"hideArrow":true},{"x":50,"y":89,"text":"숫자 3자리 입력 후 '확인'을 눌러주세요.","textX":50,"textY":80,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_29.jpg", markers: [{"x":23,"y":18,"text":"은행 앱의 입금 내역에서 '카카오' 뒤의 숫자 3자리를 확인해 주세요.","textX":50,"textY":30,"isSmall":true,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_30.jpg", markers: [{"x":12,"y":44,"text":"은행 앱에서 확인하신 숫자 3자리를 입력해 주세요.","textX":50,"textY":34,"isSmall":true,"hideArrow":true},{"x":50,"y":89,"text":"입력 후 하단의 '확인' 버튼을 눌러 다음으로 진행해 주세요.","textX":50,"textY":80,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_31.jpg", markers: [{"x":50,"y":89,"text":"카카오 인증서 사용 시 필요한 My 비밀번호 6자리를 만들어주세요.","textX":50,"textY":80,"hideArrow":true}] },
    { image: "/images/guide/kakao/kakao_32.jpg", markers: [{"x":50,"y":35,"text":"GUIDE_CONGRATS","hideBox":true,"textX":50,"textY":45}] },
  ],
  chapters: [
    { title: '카카오톡 시작', start: 0, icon: '📱' },
    { title: '회원가입', start: 2, icon: '📝' },
    { title: '인증서 발급', start: 20, icon: '🔐' },
  ],
};

export const PASS_GUIDE: CertGuideDef = {
  slides: [
    { image: "/images/guide/pass/pass_01.jpg", markers: [{"x":50,"y":18,"text":"SKT 알뜰폰→SKT / KT 알뜰폰→KT / LG 알뜰폰→LG 선택"},{"x":45,"y":39,"text":"본인 통신사에 맞는 PASS 앱을 설치해 주세요"}] },
    { image: "/images/guide/pass/pass_02.jpg", markers: [{"x":50,"y":16,"text":"이용 중인 통신사의 PASS 앱을 설치해 주세요"}] },
    { image: "/images/guide/pass/pass_03.jpg", markers: [{"x":50,"y":20,"text":"설치가 완료되었습니다 '열기'를 눌러 앱을 실행해 주세요","hideBox":true}] },
    { image: "/images/guide/pass/pass_04.jpg", markers: [{"x":50,"y":55,"text":"아래로 스크롤하여 모든 내용을 확인해 주세요","hideBox":true},{"x":50,"y":89,"text":"앱 이용 권한 안내입니다. '확인'을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_05.jpg", markers: [{"x":50,"y":80,"text":"'허용'을 눌러 앱 알림 권한을 승인해 주세요"}] },
    { image: "/images/guide/pass/pass_06.jpg", markers: [{"x":50,"y":80,"text":"'허용'을 눌러 전화 관리 권한을 승인해 주세요"}] },
    { image: "/images/guide/pass/pass_07.jpg", markers: [{"x":50,"y":20.5,"text":"성명을 입력해 주세요"},{"x":50,"y":34.3,"text":"외국인 등록번호를 입력해 주세요"},{"x":50,"y":46.5,"text":"휴대폰 번호를 입력해 주세요"},{"x":50,"y":88,"text":"정보 입력 후 '다음'을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_08.jpg", markers: [{"x":50,"y":47.5,"text":"PASS 필수 항목을 선택하여 모두 동의해 주세요"},{"x":50,"y":88.5,"text":"동의를 마친 후 '다음' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_09.jpg", markers: [{"x":50,"y":17.5,"text":"휴대폰 문자로 받은 인증번호 6자리를 입력해 주세요"},{"x":50,"y":88.5,"text":"번호를 모두 입력한 후 '다음' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_10.jpg", markers: [{"x":50,"y":30,"text":"앞으로 앱 실행 시 사용할 숫자 6자리 비밀번호를 설정해 주세요"},{"x":50,"y":68,"text":"연속된 숫자나 생년월일 등 쉬운 번호를 피해서 입력해 주세요"}] },
    { image: "/images/guide/pass/pass_11.jpg", markers: [{"x":50,"y":25,"text":"설정한 비밀번호를 확인하기 위해 한 번 더 입력해 주세요"}] },
    { image: "/images/guide/pass/pass_12.jpg", markers: [{"x":50,"y":89,"text":"PASS 가입이 완료되었습니다 인증서 발급을 위해 하단의 '다음'을 눌러 이동해 주세요"},{"x":50,"y":55,"text":"생체 인증은 건너뛰고 '다음'을 눌러주세요","hideBox":true}] },
    { image: "/images/guide/pass/pass_13.jpg", markers: [{"x":50,"y":36.5,"text":"인증서를 발급받기 위해 화면 중앙의 '인증서 관리' 메뉴를 눌러주세요"}] },
    { image: "/images/guide/pass/pass_14.jpg", markers: [{"x":50,"y":55,"text":"초록색 팝업창 중앙의 '인증서 발급 받기' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_15.jpg", markers: [{"x":50,"y":51,"text":"인증서 서비스를 이용하기 위해 필수 항목을 선택하여 모두 동의해 주세요","hideBox":true},{"x":50,"y":80.5,"text":"모든 항목에 동의한 후 하단의 '발급' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_16.jpg", markers: [{"x":50,"y":20.5,"text":"이름을 실명으로 입력해 주세요"},{"x":50,"y":32.5,"text":"가입된 휴대폰 번호를 숫자만 입력해 주세요"},{"x":50,"y":41.5,"text":"'인증번호요청' 버튼을 누른 후 문자로 받은 번호를 입력해 주세요","position":"bottom"},{"x":50,"y":88.5,"text":"정보 입력 후 '다음' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_17.jpg", markers: [{"x":50,"y":42.5,"text":"문자로 받은 인증번호 6자리를 입력해 주세요"},{"x":50,"y":88.5,"text":"번호를 입력한 후 하단의 '다음' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_18.jpg", markers: [{"x":50,"y":18,"text":"본인이 사용 중인 은행을 목록에서 선택해 주세요"},{"x":50,"y":33,"text":"본인 명의의 계좌번호를 하이픈(-) 없이 숫자만 입력해 주세요","position":"bottom"},{"x":50,"y":48,"text":"'인증요청' 버튼을 누르면 해당 계좌로 1원이 입금됩니다","position":"bottom"}] },
    { image: "/images/guide/pass/pass_19.jpg", markers: [{"x":50,"y":8.5,"text":"해당 은행 앱의 거래내역에서 'SKT또는 LGU또는 KT' 뒤에 적힌 숫자 3자리를 확인해 주세요"},{"x":50,"y":45.5,"text":"확인한 숫자 3자리를 아래 입력창에 넣어주세요"},{"x":50,"y":88.5,"text":"입력을 마친 후 하단의 '다음' 버튼을 눌러주세요"}] },
    { image: "/images/guide/pass/pass_20.jpg", markers: [{"x":50,"y":8,"text":"은행 앱에서 1원 입금 내역을 보면 'SKT또는 LGU또는 KT' 뒤에 숫자 3자리가 적혀 있습니다.","hideBox":true},{"x":50,"y":15,"text":"사진 속 '510'처럼 적힌 숫자 3자리를 기억해 주세요","hideBox":true}] },
    { image: "/images/guide/pass/pass_21.jpg", markers: [{"x":50,"y":46,"text":"확인된 입금자명 중 3자리 숫자를 입력해 주세요"},{"x":50,"y":88,"text":"입력 후 하단의 '다음' 버튼을 눌러주세요","position":"bottom"}] },
    { image: "/images/guide/pass/pass_22.jpg", markers: [{"x":50,"y":26,"text":"앱에서 사용할 비밀번호 6자리를 설정해 주세요","position":"bottom"}] },
    { image: "/images/guide/pass/pass_23.jpg", markers: [{"x":50,"y":46,"text":"PASS 인증서 발급이 완료되었습니다!"},{"x":50,"y":55,"text":"가운데 '확인' 버튼을 눌러주세요","position":"bottom"}] },
  ],
  chapters: [
    { title: 'PASS 시작', start: 0, icon: '📱' },
    { title: '회원가입', start: 6, icon: '📝' },
    { title: '인증서 발급', start: 12, icon: '🎫' },
    { title: '계좌 인증 완료', start: 17, icon: '🏦' },
  ],
};

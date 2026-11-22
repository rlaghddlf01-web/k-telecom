// 통신 가이드 글 (src/content/guides/*.json). 글마다 10개 언어 본문을 갖는다.
// 가이드가 없는 언어(ja·ru·zh 등)로 열리면 영어 본문을 보여 주고, 검색 대표 주소(canonical)는 영어 주소로 둔다.
import whatIsMvno from '@/content/guides/what-is-mvno.json';
import openingALine from '@/content/guides/opening-a-line-as-a-foreigner.json';
import prepaidVsPostpaid from '@/content/guides/prepaid-vs-postpaid.json';
import useYourOwnPhone from '@/content/guides/use-your-own-phone.json';
import howToReadAPlan from '@/content/guides/how-to-read-a-plan.json';
import keepYourNumber from '@/content/guides/keep-your-number.json';
import checkYourMonthlyBill from '@/content/guides/check-your-monthly-bill.json';
import internationalCalls from '@/content/guides/international-calls.json';
import leavingKorea from '@/content/guides/leaving-korea.json';
import avoidPhoneScams from '@/content/guides/avoid-phone-scams.json';
import { SOURCE_LANG, localizePath, type Lang } from '@/lib/langs';
import { SITE_URL } from '@/lib/seo';

/** 가이드 본문이 있는 언어 (한국어 먼저) */
export const GUIDE_LANGS = ['ko', 'en', 'vi', 'ne', 'km', 'id', 'th', 'mn', 'my', 'uz'] as const;
export type GuideLang = (typeof GUIDE_LANGS)[number];
const FALLBACK_LANG: GuideLang = 'en';

export interface GuideContent {
  title: string;
  description: string;
  sections: { heading: string; body: string }[];
  faq: { q: string; a: string }[];
}

export interface Guide {
  slug: string;
  order: number;
  published: string;
  updated: string;
  related: string[];
  content: Record<GuideLang, GuideContent>;
}

export const GUIDES: Guide[] = (
  [
    whatIsMvno,
    openingALine,
    prepaidVsPostpaid,
    useYourOwnPhone,
    howToReadAPlan,
    keepYourNumber,
    checkYourMonthlyBill,
    internationalCalls,
    leavingKorea,
    avoidPhoneScams,
  ] as Guide[]
).sort((a, b) => a.order - b.order);

export const getGuide = (slug: string): Guide | undefined => GUIDES.find((g) => g.slug === slug);

const isGuideLang = (l: string): l is GuideLang => (GUIDE_LANGS as readonly string[]).includes(l);

/** 이 화면 언어에서 보여 줄 본문 언어: 관리자 원문 화면(/kr)은 한국어, 가이드가 없는 언어는 영어 */
export function guideLangFor(lang: Lang): GuideLang {
  if (lang === SOURCE_LANG) return 'ko';
  return isGuideLang(lang) ? lang : FALLBACK_LANG;
}

/** 절대 주소 (사이트 주소가 정해지지 않았으면 상대 주소) */
export const absoluteUrl = (path: string, lang: Lang) => `${SITE_URL}${localizePath(path, lang)}`;

/** 검색엔진용 대표 주소와 언어별 대체 주소 (가이드 본문이 있는 언어만 연결) */
export function guideAlternates(path: string, lang: Lang) {
  const languages: Record<string, string> = Object.fromEntries(GUIDE_LANGS.map((code) => [code, absoluteUrl(path, code)]));
  languages['x-default'] = absoluteUrl(path, FALLBACK_LANG);
  return { canonical: absoluteUrl(path, guideLangFor(lang)), languages };
}

/** 화면 고정 문구 (사이트 사전에는 없는 말이라 여기서 언어별로 둔다) */
const UI: Record<GuideLang, Record<'guides' | 'guidesLead' | 'faq' | 'related' | 'allGuides' | 'ctaTitle' | 'ctaText' | 'plans' | 'phones' | 'inquiry' | 'updated' | 'readMore' | 'note', string>> = {
  ko: {
    guides: '통신 가이드',
    guidesLead: '한국에서 휴대폰을 처음 쓰는 외국인을 위해 알뜰폰, 개통, 요금 청구서, 해지까지 꼭 알아야 할 내용을 정리했습니다.',
    faq: '자주 묻는 질문',
    related: '함께 보면 좋은 가이드',
    allGuides: '전체 가이드 보기',
    ctaTitle: '나에게 맞는 요금제를 찾고 있나요?',
    ctaText: '데이터와 통화량을 기준으로 요금제와 휴대폰을 모국어로 비교해 보세요.',
    plans: '요금제 보기',
    phones: '휴대폰 보기',
    inquiry: '1:1 상담문의',
    updated: '업데이트',
    readMore: '자세히 보기',
    note: '이 글은 일반적인 안내입니다. 실제 조건은 통신사와 요금제마다 다를 수 있으니 가입 전에 꼭 확인해 주세요.',
  },
  en: {
    guides: 'Phone guides',
    guidesLead: 'Everything foreigners new to Korea should know about budget plans (알뜰폰), opening a line, reading your bill and cancelling.',
    faq: 'Frequently asked questions',
    related: 'Related guides',
    allGuides: 'All guides',
    ctaTitle: 'Looking for a plan that fits you?',
    ctaText: 'Compare plans and phones in your own language based on the data and calls you use.',
    plans: 'View plans',
    phones: 'View phones',
    inquiry: 'Ask us',
    updated: 'Updated',
    readMore: 'Read more',
    note: 'This is general information. Actual conditions can differ by carrier and plan, so please check before you sign up.',
  },
  vi: {
    guides: 'Hướng dẫn điện thoại',
    guidesLead: 'Những điều người nước ngoài mới đến Hàn Quốc cần biết về sim giá rẻ (알뜰폰), mở thuê bao, đọc hóa đơn và hủy thuê bao.',
    faq: 'Câu hỏi thường gặp',
    related: 'Hướng dẫn liên quan',
    allGuides: 'Xem tất cả hướng dẫn',
    ctaTitle: 'Bạn đang tìm gói cước phù hợp?',
    ctaText: 'So sánh gói cước và điện thoại bằng tiếng mẹ đẻ dựa trên lượng data và cuộc gọi bạn dùng.',
    plans: 'Xem gói cước',
    phones: 'Xem điện thoại',
    inquiry: 'Tư vấn 1:1',
    updated: 'Cập nhật',
    readMore: 'Xem chi tiết',
    note: 'Đây là thông tin chung. Điều kiện thực tế có thể khác nhau tùy nhà mạng và gói cước, vui lòng kiểm tra trước khi đăng ký.',
  },
  ne: {
    guides: 'फोन गाइड',
    guidesLead: 'कोरियामा नयाँ आएका विदेशीहरूले सस्तो योजना (알뜰폰), लाइन खोल्ने, बिल बुझ्ने र रद्द गर्ने बारे जान्नुपर्ने कुराहरू।',
    faq: 'बारम्बार सोधिने प्रश्नहरू',
    related: 'सम्बन्धित गाइडहरू',
    allGuides: 'सबै गाइड हेर्नुहोस्',
    ctaTitle: 'आफूलाई मिल्ने प्लान खोज्दै हुनुहुन्छ?',
    ctaText: 'तपाईंले प्रयोग गर्ने डाटा र कलका आधारमा आफ्नै भाषामा प्लान र फोन तुलना गर्नुहोस्।',
    plans: 'प्लानहरू हेर्नुहोस्',
    phones: 'फोनहरू हेर्नुहोस्',
    inquiry: '१:१ सोधपुछ',
    updated: 'अपडेट',
    readMore: 'थप पढ्नुहोस्',
    note: 'यो सामान्य जानकारी हो। वास्तविक सर्तहरू टेलिकम कम्पनी र प्लान अनुसार फरक हुन सक्छन्, त्यसैले साइन अप गर्नु अघि जाँच गर्नुहोस्।',
  },
  km: {
    guides: 'មគ្គុទ្ទេសក៍ទូរសព្ទ',
    guidesLead: 'អ្វីដែលជនបរទេសទើបមកកូរ៉េគួរដឹង អំពីគម្រោងតម្លៃសន្សំ (알뜰폰) ការបើកលេខ ការអានវិក្កយបត្រ និងការលុបចោល។',
    faq: 'សំណួរដែលសួរញឹកញាប់',
    related: 'មគ្គុទ្ទេសក៍ពាក់ព័ន្ធ',
    allGuides: 'មើលមគ្គុទ្ទេសក៍ទាំងអស់',
    ctaTitle: 'កំពុងរកគម្រោងដែលសមនឹងអ្នកមែនទេ?',
    ctaText: 'ប្រៀបធៀបគម្រោង និងទូរសព្ទជាភាសាកំណើតរបស់អ្នក ដោយផ្អែកលើទិន្នន័យ និងការហៅដែលអ្នកប្រើ។',
    plans: 'មើលគម្រោង',
    phones: 'មើលទូរសព្ទ',
    inquiry: 'ពិគ្រោះ 1:1',
    updated: 'ធ្វើបច្ចុប្បន្នភាព',
    readMore: 'អានបន្ថែម',
    note: 'នេះជាព័ត៌មានទូទៅ។ លក្ខខណ្ឌជាក់ស្តែងអាចខុសគ្នាតាមក្រុមហ៊ុនទូរគមនាគមន៍ និងគម្រោង សូមពិនិត្យមុនពេលចុះឈ្មោះ។',
  },
  id: {
    guides: 'Panduan ponsel',
    guidesLead: 'Hal yang perlu diketahui orang asing yang baru di Korea tentang paket hemat (알뜰폰), membuka nomor, membaca tagihan, dan berhenti berlangganan.',
    faq: 'Pertanyaan umum',
    related: 'Panduan terkait',
    allGuides: 'Lihat semua panduan',
    ctaTitle: 'Mencari paket yang cocok untuk Anda?',
    ctaText: 'Bandingkan paket dan ponsel dalam bahasa Anda sendiri berdasarkan data dan panggilan yang Anda gunakan.',
    plans: 'Lihat paket',
    phones: 'Lihat ponsel',
    inquiry: 'Konsultasi 1:1',
    updated: 'Diperbarui',
    readMore: 'Baca selengkapnya',
    note: 'Ini adalah informasi umum. Ketentuan sebenarnya dapat berbeda tergantung operator dan paket, jadi periksa sebelum mendaftar.',
  },
  th: {
    guides: 'คู่มือโทรศัพท์มือถือ',
    guidesLead: 'สิ่งที่ชาวต่างชาติที่เพิ่งมาเกาหลีควรรู้ เกี่ยวกับซิมราคาประหยัด (알뜰폰) การเปิดเบอร์ การอ่านใบแจ้งค่าบริการ และการยกเลิก',
    faq: 'คำถามที่พบบ่อย',
    related: 'คู่มือที่เกี่ยวข้อง',
    allGuides: 'ดูคู่มือทั้งหมด',
    ctaTitle: 'กำลังมองหาแพ็กเกจที่เหมาะกับคุณอยู่ไหม?',
    ctaText: 'เปรียบเทียบแพ็กเกจและโทรศัพท์เป็นภาษาของคุณเอง ตามปริมาณดาต้าและการโทรที่คุณใช้',
    plans: 'ดูแพ็กเกจ',
    phones: 'ดูโทรศัพท์',
    inquiry: 'ปรึกษา 1:1',
    updated: 'อัปเดต',
    readMore: 'อ่านต่อ',
    note: 'นี่เป็นข้อมูลทั่วไป เงื่อนไขจริงอาจแตกต่างกันไปตามผู้ให้บริการและแพ็กเกจ โปรดตรวจสอบก่อนสมัคร',
  },
  mn: {
    guides: 'Утасны гарын авлага',
    guidesLead: 'Солонгост шинээр ирсэн гадаад иргэдэд хямд багц (알뜰폰), дугаар нээх, төлбөрийн нэхэмжлэл унших, цуцлах талаар мэдэх хэрэгтэй зүйлс.',
    faq: 'Түгээмэл асуултууд',
    related: 'Холбоотой гарын авлага',
    allGuides: 'Бүх гарын авлага',
    ctaTitle: 'Өөрт тохирох багц хайж байна уу?',
    ctaText: 'Хэрэглэдэг дата, ярианыхаа хэмжээгээр багц болон утсаа эх хэлээрээ харьцуулаарай.',
    plans: 'Багцууд үзэх',
    phones: 'Утаснууд үзэх',
    inquiry: '1:1 зөвлөгөө',
    updated: 'Шинэчилсэн',
    readMore: 'Дэлгэрэнгүй',
    note: 'Энэ бол ерөнхий мэдээлэл юм. Бодит нөхцөл нь оператор болон багцаас хамаарч өөр байж болох тул бүртгүүлэхээсээ өмнө шалгаарай.',
  },
  my: {
    guides: 'ဖုန်းလမ်းညွှန်',
    guidesLead: 'ကိုရီးယားသို့ အသစ်ရောက်လာသော နိုင်ငံခြားသားများ သိထားသင့်သည့် ချွေတာဖုန်းအစီအစဉ် (알뜰폰)၊ လိုင်းဖွင့်ခြင်း၊ ဘေလ်ဖတ်ခြင်းနှင့် ပယ်ဖျက်ခြင်းဆိုင်ရာ အချက်များ။',
    faq: 'မကြာခဏမေးလေ့ရှိသောမေးခွန်းများ',
    related: 'ဆက်စပ်လမ်းညွှန်များ',
    allGuides: 'လမ်းညွှန်အားလုံးကြည့်ရန်',
    ctaTitle: 'သင်နှင့်ကိုက်ညီသော အစီအစဉ်ကို ရှာနေပါသလား။',
    ctaText: 'သင်သုံးသော ဒေတာနှင့် ဖုန်းခေါ်ဆိုမှုအပေါ် မူတည်၍ အစီအစဉ်နှင့် ဖုန်းများကို မိခင်ဘာသာဖြင့် နှိုင်းယှဉ်ကြည့်ပါ။',
    plans: 'အစီအစဉ်များကြည့်ရန်',
    phones: 'ဖုန်းများကြည့်ရန်',
    inquiry: '1:1 မေးမြန်းရန်',
    updated: 'နောက်ဆုံးပြင်ဆင်',
    readMore: 'ဆက်ဖတ်ရန်',
    note: 'ဤအချက်အလက်သည် ယေဘုယျလမ်းညွှန်သာဖြစ်သည်။ အမှန်တကယ်အခြေအနေများသည် ဖုန်းကုမ္ပဏီနှင့် အစီအစဉ်အလိုက် ကွာခြားနိုင်သဖြင့် စာရင်းမသွင်းမီ စစ်ဆေးပါ။',
  },
  uz: {
    guides: "Telefon bo'yicha qo'llanmalar",
    guidesLead: "Koreyaga yangi kelgan chet elliklar arzon tariflar (알뜰폰), raqam ochish, hisobni o'qish va bekor qilish haqida bilishi kerak bo'lgan narsalar.",
    faq: "Ko'p beriladigan savollar",
    related: "O'xshash qo'llanmalar",
    allGuides: "Barcha qo'llanmalar",
    ctaTitle: "O'zingizga mos tarif qidiryapsizmi?",
    ctaText: "Foydalanadigan internet va qo'ng'iroqlaringizga qarab tarif va telefonlarni o'z tilingizda solishtiring.",
    plans: "Tariflarni ko'rish",
    phones: "Telefonlarni ko'rish",
    inquiry: '1:1 maslahat',
    updated: 'Yangilangan',
    readMore: 'Batafsil',
    note: "Bu umumiy ma'lumot. Haqiqiy shartlar operator va tarifga qarab farq qilishi mumkin, shuning uchun ro'yxatdan o'tishdan oldin tekshiring.",
  },
};

export const guideUi = (lang: GuideLang) => UI[lang];

/** <script type="application/ld+json"> 안에 안전하게 넣을 수 있도록 '<' 를 바꾼다 */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

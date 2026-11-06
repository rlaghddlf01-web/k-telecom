// K-Telecom 17개국어 웰컴 게이트웨이 실시간 반응형 번역 매트릭스

import type { Lang } from '@/lib/langs';

export interface WelcomeLanguageText {
  badge: string;
  title: string;
  subtitle: string;
  footerButton: string;
  bannerBenefit: string;
}

export const WELCOME_TEXTS: Record<Lang, WelcomeLanguageText> = {
  ko: {
    badge: 'K-Telecom 17개국어 모국어 게이트웨이',
    title: 'Choose Your Language / 국가 언어를 선택하세요',
    subtitle: '모국어를 선택하시면 1:1 실시간 자동번역과 전용 혜택이 제공됩니다.',
    footerButton: '🇰🇷 한국어로 바로 시작하기 (Enter in Korean)',
    bannerBenefit: '17개국어 실시간 자동 번역 채팅',
  },
  ja: {
    badge: 'K-Telecom 17言語 母国語ゲートウェイ',
    title: '言語を選択してください / Choose Your Language',
    subtitle: '母国語を選択すると1:1リアルタイム自動翻訳と専用特典が提供されます。',
    footerButton: '🇯🇵 日本語で始める (Enter in Japanese)',
    bannerBenefit: '17言語 リアルタイム自動翻訳チャット',
  },
  ru: {
    badge: 'K-Telecom Шлюз на 17 языках',
    title: 'Выберите ваш язык / Choose Your Language',
    subtitle: 'Выберите родной язык для 1:1 онлайн-перевода и специальных бонусов.',
    footerButton: '🇷🇺 Начать на русском (Enter in Russian)',
    bannerBenefit: 'Чат с автопереводом на 17 языков',
  },
  en: {
    badge: 'K-Telecom 17-Language Gateway',
    title: 'Select Your Language / Choose Your Language',
    subtitle: 'Select your native language for real-time 1:1 translation and exclusive benefits.',
    footerButton: '🇺🇸 Continue in English',
    bannerBenefit: '17 Languages Real-time Translation Chat',
  },
  vi: {
    badge: 'K-Telecom Cổng 17 Ngôn Ngữ Mẹ Đẻ',
    title: 'Chọn ngôn ngữ của bạn / Choose Your Language',
    subtitle: 'Chọn tiếng mẹ đẻ để nhận dịch tự động 1:1 theo thời gian thực và ưu đãi độc quyền.',
    footerButton: '🇻🇳 Bắt đầu bằng Tiếng Việt',
    bannerBenefit: 'Chat dịch tự động 17 ngôn ngữ',
  },
  zh: {
    badge: 'K-Telecom 17国语言母语通道',
    title: '选择您的语言 / Choose Your Language',
    subtitle: '选择您的母语即可享受1:1实时自动翻译及专属福利。',
    footerButton: '🇨🇳 进入中文版 (Enter in Chinese)',
    bannerBenefit: '17国语言实时自动翻译聊天',
  },
  th: {
    badge: 'K-Telecom ประตูสู่ 17 ภาษาแม่',
    title: 'เลือกภาษาของคุณ / Choose Your Language',
    subtitle: 'เลือกภาษาบ้านเกิดเพื่อใช้งานระบบแปลภาษา 1:1 อัตโนมัติและรับสิทธิพิเศษ',
    footerButton: '🇹🇭 เริ่มต้นด้วยภาษาไทย',
    bannerBenefit: 'แชทแปลภาษาอัตโนมัติ 17 ภาษา',
  },
  uz: {
    badge: 'K-Telecom 17 ta tilda ona tili shlyuzi',
    title: 'Tilingizni tanlang / Choose Your Language',
    subtitle: '1:1 jonli avtomat tarjima va maxsus imtiyozlardan foydalanish uchun ona tilingizni tanlang.',
    footerButton: "🇺🇿 O'zbek tilida davom etish",
    bannerBenefit: '17 tilda jonli avto-tarjima chati',
  },
  km: {
    badge: 'K-Telecom ច្រកទ្វារ ១៧ ភាសាកំណើត',
    title: 'ជ្រើសរើសភាសារបស់អ្នក / Choose Your Language',
    subtitle: 'ជ្រើសរើសភាសាកំណើតរបស់អ្នក ដើម្បីទទួលបានការបកប្រែ 1:1 ផ្ទាល់ និងអត្ថប្រយោជន៍ពិសេស។',
    footerButton: '🇰🇭 ចាប់ផ្តើមជាភាសាខ្មែរ',
    bannerBenefit: 'ជជែកបកប្រែដោយស្វ័យប្រវត្តិ ១៧ ភាសា',
  },
  mn: {
    badge: 'K-Telecom 17 хэлний эх хэлний гарц',
    title: 'Хэлээ сонгоно уу / Choose Your Language',
    subtitle: '1:1 шууд автомат орчуулга болон онцгой хөнгөлөлт авахын тулд төрөлх хэлээ сонгоно уу.',
    footerButton: '🇲🇳 Монгол хэлээр эхлэх',
    bannerBenefit: '17 хэлний шууд автомат орчуулгын чат',
  },
  ne: {
    badge: 'K-Telecom १७ भाषा मातृभाषा गेटवे',
    title: 'आफ्नो भाषा छान्नुहोस् / Choose Your Language',
    subtitle: '१:१ वास्तविक-समय अनुवाद र विशेष सुविधाहरू पाउन आफ्नो मातृभाषा छान्नुहोस्।',
    footerButton: '🇳🇵 नेपालीमा सुरु गर्नुहोस्',
    bannerBenefit: '१७ भाषा वास्तविक-समय अनुवाद च्याट',
  },
  id: {
    badge: 'K-Telecom Gerbang 17 Bahasa Asli',
    title: 'Pilih Bahasa Anda / Choose Your Language',
    subtitle: 'Pilih bahasa ibu Anda untuk terjemahan otomatis 1:1 waktu nyata dan keuntungan eksklusif.',
    footerButton: '🇮🇩 Mulai dalam Bahasa Indonesia',
    bannerBenefit: 'Chat terjemahan otomatis 17 bahasa',
  },
  my: {
    badge: 'K-Telecom ၁၇ မျိုးသော မိခင်ဘာသာစကား ဂိတ်ဝေး',
    title: 'သင့်ဘာသာစကားကို ရွေးချယ်ပါ / Choose Your Language',
    subtitle: '၁:၁ အချိန်နှင့်တပြေးညီ အလိုအလျောက် ဘာသာပြန်နှင့် အထူးခံစားခွင့်များ ရရှိရန် မိခင်ဘာသာစကားကို ရွေးပါ။',
    footerButton: '🇲🇲 မြန်မာဘာသာဖြင့် စတင်မည်',
    bannerBenefit: '၁၇ ဘာသာစကား အလိုအလျောက် ဘာသာပြန် ချတ်',
  },
  si: {
    badge: 'K-Telecom භාෂා 17 ක මව්භාෂා දොරටුව',
    title: 'ඔබේ භාෂාව තෝරන්න / Choose Your Language',
    subtitle: '1:1 තත්‍ය කාලීන ස්වයංක්‍රීය පරිවර්තනය සහ විශේෂ ප්‍රතිලාභ ලබා ගැනීමට ඔබේ මව්භාෂාව තෝරන්න.',
    footerButton: '🇱🇰 සිංහලෙන් ඉදිරියට යන්න',
    bannerBenefit: 'භාෂා 17 ක ක්ෂණික ස්වයංක්‍රීය පරිවර්තන චැට්',
  },
  kk: {
    badge: 'K-Telecom 17 тілдегі ана тілі шлюзі',
    title: 'Тіліңізді таңдаңыз / Choose Your Language',
    subtitle: '1:1 тікелей автоматты аударма мен арнайы артықшылықтарды алу үшін ана тіліңізді таңдаңыз.',
    footerButton: '🇰🇿 Қазақ тілінде жалғастыру',
    bannerBenefit: '17 тілде тікелей автоматты аударма чаты',
  },
  bn: {
    badge: 'K-Telecom ১৭ ভাষার মাতৃভাষা গেটওয়ে',
    title: 'আপনার ভাষা নির্বাচন করুন / Choose Your Language',
    subtitle: '১:১ রিয়েল-টাইম স্বয়ংক্রিয় অনুবাদ এবং বিশেষ সুবিধা পেতে আপনার মাতৃভাষা বেছে নিন।',
    footerButton: '🇧🇩 বাংলায় শুরু করুন',
    bannerBenefit: '১৭ ভাষায় রিয়েল-টাইম স্বয়ংক্রিয় অনুবাদ চ্যাট',
  },
  ur: {
    badge: 'K-Telecom 17 زبانوں کا مادری گیٹ وے',
    title: 'اپنی زبان منتخب کریں / Choose Your Language',
    subtitle: '1:1 فوری خودکار ترجمہ اور خصوصی فوائد حاصل کرنے کے لیے اپنی مادری زبان منتخب کریں۔',
    footerButton: '🇵🇰 اردو میں شروع کریں',
    bannerBenefit: '17 زبانوں میں فوری خودکار ترجمہ چیٹ',
  },
};

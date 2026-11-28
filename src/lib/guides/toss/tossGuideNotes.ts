/**
 * 케이텔레콤에서 새로 넣은 토스 안내 주의 문구 (18개 언어). 이지텍스 원본(tossGuideTexts.ts)에는 없는 문구라 따로 둔다.
 * 원어민 검수 전 초안입니다.
 */
export type TossNoteKey = 'idFieldsNote';

export const TOSS_NOTES: Record<string, Record<TossNoteKey, string>> = {
  ko: { idFieldsNote: '화면에 보이는 항목은 신분증 종류에 따라 다를 수 있어요. 이 사진은 운전면허증 예시예요. 외국인등록증이면 이름과 등록번호가 맞는지만 확인하세요.' },
  en: { idFieldsNote: 'The items on your screen can differ depending on your ID type. This picture is a driver’s license example. If you use an Alien Registration Card, just check that your name and registration number are correct.' },
  vi: { idFieldsNote: 'Các mục hiển thị trên màn hình có thể khác nhau tùy loại giấy tờ. Ảnh này là ví dụ với bằng lái xe. Nếu bạn dùng thẻ đăng ký người nước ngoài, chỉ cần kiểm tra tên và số đăng ký có đúng không.' },
  zh: { idFieldsNote: '屏幕上显示的项目可能因证件类型而不同。这张图是驾驶证示例。如果您使用外国人登录证，只需确认姓名和登录号码是否正确。' },
  id: { idFieldsNote: 'Item yang tampil di layar bisa berbeda tergantung jenis identitas. Gambar ini adalah contoh SIM. Jika Anda memakai Kartu Registrasi Orang Asing, cukup periksa apakah nama dan nomor registrasi sudah benar.' },
  th: { idFieldsNote: 'รายการที่แสดงบนหน้าจออาจแตกต่างกันตามประเภทบัตร ภาพนี้เป็นตัวอย่างของใบขับขี่ หากคุณใช้บัตรลงทะเบียนต่างด้าว ให้ตรวจสอบเพียงว่าชื่อและเลขทะเบียนถูกต้อง' },
  km: { idFieldsNote: 'ធាតុដែលបង្ហាញលើអេក្រង់អាចខុសគ្នាតាមប្រភេទអត្តសញ្ញាណប័ណ្ណ។ រូបភាពនេះជាឧទាហរណ៍នៃប័ណ្ណបើកបរ។ ប្រសិនបើអ្នកប្រើប័ណ្ណចុះបញ្ជីជនបរទេស គ្រាន់តែពិនិត្យថា ឈ្មោះ និងលេខចុះបញ្ជីត្រឹមត្រូវ។' },
  ne: { idFieldsNote: 'तपाईंको स्क्रिनमा देखिने विवरणहरू परिचयपत्रको प्रकारअनुसार फरक हुन सक्छन्। यो तस्बिर चालक अनुमतिपत्रको उदाहरण हो। यदि तपाईं विदेशी दर्ता कार्ड प्रयोग गर्दै हुनुहुन्छ भने, नाम र दर्ता नम्बर सही छन् कि छैनन् भनेर मात्र जाँच गर्नुहोस्।' },
  uz: { idFieldsNote: 'Ekrandagi maydonlar hujjat turiga qarab farq qilishi mumkin. Bu rasm haydovchilik guvohnomasi namunasi. Agar siz chet el fuqarosi ro‘yxatga olish kartasidan foydalansangiz, faqat ism va ro‘yxat raqami to‘g‘riligini tekshiring.' },
  my: { idFieldsNote: 'ဖန်သားပြင်ပေါ်တွင် ပြသည့် အချက်အလက်များသည် ID အမျိုးအစားအလိုက် ကွာခြားနိုင်ပါသည်။ ဤပုံသည် ယာဉ်မောင်းလိုင်စင် ဥပမာဖြစ်ပါသည်။ နိုင်ငံခြားသားမှတ်ပုံတင်ကတ်ကို သုံးပါက အမည်နှင့် မှတ်ပုံတင်နံပါတ် မှန်ကန်မှုရှိမရှိကိုသာ စစ်ဆေးပါ။' },
  si: { idFieldsNote: 'ඔබේ තිරයේ පෙනෙන අයිතම හැඳුනුම්පත් වර්ගය අනුව වෙනස් විය හැක. මෙම පින්තූරය රියදුරු බලපත්‍රයක උදාහරණයකි. ඔබ විදේශිකයන්ගේ ලියාපදිංචි කාඩ්පත භාවිතා කරන්නේ නම්, නම සහ ලියාපදිංචි අංකය නිවැරදිදැයි පමණක් පරීක්ෂා කරන්න.' },
  mn: { idFieldsNote: 'Дэлгэцэн дээр харагдах зүйлс иргэний үнэмлэхийн төрлөөс хамаарч өөр байж болно. Энэ зураг нь жолооны үнэмлэхийн жишээ юм. Хэрэв та гадаадын иргэний бүртгэлийн карт ашиглаж байвал нэр болон бүртгэлийн дугаар зөв эсэхийг л шалгаарай.' },
  bn: { idFieldsNote: 'আপনার স্ক্রিনে দেখানো তথ্যগুলো পরিচয়পত্রের ধরন অনুযায়ী ভিন্ন হতে পারে। এই ছবিটি ড্রাইভিং লাইসেন্সের উদাহরণ। আপনি যদি বিদেশি নিবন্ধন কার্ড ব্যবহার করেন, শুধু নাম ও নিবন্ধন নম্বর ঠিক আছে কিনা দেখে নিন।' },
  kk: { idFieldsNote: 'Экрандағы тармақтар құжат түріне қарай әртүрлі болуы мүмкін. Бұл сурет жүргізуші куәлігінің мысалы. Егер шетелдіктің тіркеу картасын пайдалансаңыз, тек аты-жөніңіз бен тіркеу нөмірінің дұрыстығын тексеріңіз.' },
  ur: { idFieldsNote: 'آپ کی اسکرین پر نظر آنے والی تفصیلات شناختی دستاویز کی قسم کے مطابق مختلف ہو سکتی ہیں۔ یہ تصویر ڈرائیونگ لائسنس کی مثال ہے۔ اگر آپ غیر ملکی رجسٹریشن کارڈ استعمال کر رہے ہیں تو صرف نام اور رجسٹریشن نمبر درست ہونے کی جانچ کریں۔' },
  ja: { idFieldsNote: '画面に表示される項目は、身分証の種類によって異なる場合があります。この画像は運転免許証の例です。外国人登録証を使う場合は、名前と登録番号が合っているかだけ確認してください。' },
  ru: { idFieldsNote: 'Пункты на экране могут отличаться в зависимости от типа документа. На этой картинке — пример водительского удостоверения. Если вы используете карту иностранца (ARC), просто проверьте, что имя и регистрационный номер верны.' },
  tl: { idFieldsNote: 'Maaaring magkaiba ang mga item sa screen mo depende sa uri ng ID. Halimbawa ng driver’s license ang larawang ito. Kung Alien Registration Card ang gamit mo, tingnan lang kung tama ang pangalan at registration number.' },
};

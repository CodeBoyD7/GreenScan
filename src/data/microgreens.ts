// Mock data — full 7-language support

export type HealthConcernId =
  | "iron_deficiency"
  | "diabetes"
  | "high_bp"
  | "high_cholesterol"
  | "digestive"
  | "low_immunity"
  | "fatigue"
  | "poor_eyesight"
  | "stress";

export interface Microgreen {
  id: string;
  name: string;
  nameTe: string;
  nameHi: string;
  nameTa: string;
  nameKn: string;
  nameBn: string;
  nameMr: string;
  emoji: string;
  benefits: string[];
  benefitsTe: string[];
  benefitsHi: string[];
  benefitsTa: string[];
  benefitsKn: string[];
  benefitsBn: string[];
  benefitsMr: string[];
  dailyIntake: string;
  dailyIntakeTe: string;
  dailyIntakeHi: string;
  dailyIntakeTa: string;
  dailyIntakeKn: string;
  dailyIntakeBn: string;
  dailyIntakeMr: string;
  growthTime: string;
  growthTimeTe: string;
  growthTimeHi: string;
  growthTimeTa: string;
  growthTimeKn: string;
  growthTimeBn: string;
  growthTimeMr: string;
  consume: string[];
  consumeTe: string[];
  consumeHi: string[];
  consumeTa: string[];
  consumeKn: string[];
  consumeBn: string[];
  consumeMr: string[];
  grow: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
  growTe: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
  growHi: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
  growTa: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
  growKn: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
  growBn: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
  growMr: {
    seed: string;
    medium: string;
    watering: string;
    sunlight: string;
    harvest: string;
  };
}

function g(
  seed: string, medium: string, watering: string, sunlight: string, harvest: string
): { seed: string; medium: string; watering: string; sunlight: string; harvest: string } {
  return { seed, medium, watering, sunlight, harvest };
}

export const microgreens: Record<string, Microgreen> = {
  fenugreek: {
    id: "fenugreek",
    name: "Fenugreek Microgreens",
    nameTe: "మెంతి మైక్రోగ్రీన్స్",
    nameHi: "मेथी माइक्रोग्रीन्स",
    nameTa: "வெந்தய மைக்ரோகிரீன்ஸ்",
    nameKn: "ಮೆಂತ್ಯ ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "মেথি মাইক্রোগ্রিন্স",
    nameMr: "मेथी मायक्रोग्रीन्स",
    emoji: "🌿",
    benefits: ["Rich in iron", "Supports healthy hemoglobin levels", "Helps reduce fatigue", "High fiber content", "Supports healthy blood sugar"],
    benefitsTe: ["ఇనుములో సమృద్ధి", "హిమోగ్లోబిన్‌ను పెంచుతుంది", "అలసటను తగ్గిస్తుంది", "అధిక ఫైబర్", "రక్తంలో చక్కెరను నియంత్రిస్తుంది"],
    benefitsHi: ["आयरन से भरपूर", "हीमोग्लोबिन बढ़ाता है", "थकान कम करता है", "उच्च फाइबर", "ब्लड शुगर नियंत्रित करता है"],
    benefitsTa: ["இரும்புச்சத்து நிறைந்தது", "ஹீமோகுளோபினை அதிகரிக்கிறது", "சோர்வைக் குறைக்கிறது", "உயர் நார்ச்சத்து", "இரத்த சர்க்கரையை கட்டுப்படுத்துகிறது"],
    benefitsKn: ["ಕಬ್ಬಿಣದಿಂದ ಸಮೃದ್ಧ", "ಹಿಮೋಗ್ಲೋಬಿನ್ ಅನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ", "ಆಯಾಸವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ", "ಅಧಿಕ ನಾರಿನಂಶ", "ರಕ್ತ ಸಕ್ಕರೆಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ"],
    benefitsBn: ["আয়রন সমৃদ্ধ", "হিমোগ্লোবিন বাড়ায়", "ক্লান্তি কমায়", "উচ্চ ফাইবার", "রক্তে শর্করা নিয়ন্ত্রণ করে"],
    benefitsMr: ["लोहाने समृद्ध", "हिमोग्लोबिन वाढवते", "थकवा कमी करते", "उच्च फायबर", "रक्त शर्करा नियंत्रित करते"],
    dailyIntake: "15–25 grams",
    dailyIntakeTe: "15–25 గ్రాములు",
    dailyIntakeHi: "15–25 ग्राम",
    dailyIntakeTa: "15–25 கிராம்",
    dailyIntakeKn: "15–25 ಗ್ರಾಂ",
    dailyIntakeBn: "১৫–২৫ গ্রাম",
    dailyIntakeMr: "१५–२५ ग्रॅम",
    growthTime: "7–10 days",
    growthTimeTe: "7–10 రోజులు",
    growthTimeHi: "7–10 दिन",
    growthTimeTa: "7–10 நாட்கள்",
    growthTimeKn: "7–10 ದಿನಗಳು",
    growthTimeBn: "৭–১০ দিন",
    growthTimeMr: "७–१० दिवस",
    consume: ["Salads", "Soups", "Sandwiches", "Wraps"],
    consumeTe: ["సలాడ్లు", "సూప్‌లు", "శాండ్‌విచ్‌లు", "ర్యాప్‌లు"],
    consumeHi: ["सलाद", "सूप", "सैंडविच", "रैप्स"],
    consumeTa: ["சாலடுகள்", "சூப்கள்", "சாண்ட்விச்கள்", "ரேப்கள்"],
    consumeKn: ["ಸಲಾಡ್ಗಳು", "ಸೂಪ್ಗಳು", "ಸ್ಯಾಂಡ್ವಿಚ್ಗಳು", "ರ್ಯಾಪ್ಗಳು"],
    consumeBn: ["সালাদ", "স্যুপ", "স্যান্ডউইচ", "র্যাপ"],
    consumeMr: ["सॅलड", "सूप", "सँडविच", "रॅप्स"],
    grow: g("2 tbsp fenugreek seeds", "Coco peat or organic soil", "Mist 2x daily", "Indirect bright light", "7–10 days"),
    growTe: g("2 టేబుల్ స్పూన్ల మెంతి విత్తనాలు", "కోకో పీట్ లేదా సేంద్రియ నేల", "రోజుకు 2 సార్లు పిచికారీ", "పరోక్ష ప్రకాశవంతమైన కాంతి", "7–10 రోజులు"),
    growHi: g("2 बड़े चम्मच मेथी दाना", "कोको पीट या जैविक मिट्टी", "दिन में 2 बार छिड़काव", "अप्रत्यक्ष तेज रोशनी", "7–10 दिन"),
    growTa: g("2 டேபிள்ஸ்பூன் வெந்தய விதைகள்", "கோகோ பீட் அல்லது இயற்கை மண்", "ஒரு நாளைக்கு 2 முறை தெளிக்கவும்", "மறைமுக பிரகாசமான ஒளி", "7–10 நாட்கள்"),
    growKn: g("2 ಟೇಬಲ್ಸ್ಪೂನ್ ಮೆಂತ್ಯ ಬೀಜಗಳು", "ಕೋಕೋ ಪೀಟ್ ಅಥವಾ ಸಾವಯವ ಮಣ್ಣು", "ದಿನಕ್ಕೆ 2 ಬಾರಿ ತೇವಗೊಳಿಸಿ", "ಪರೋಕ್ಷ ಪ್ರಕಾಶಮಾನ ಬೆಳಕು", "7–10 ದಿನಗಳು"),
    growBn: g("২ টেবিল চামচ মেথি বীজ", "কোকো পিট বা জৈব মাটি", "দিনে ২ বার স্প্রে করুন", "পরোক্ষ উজ্জ্বল আলো", "৭–১০ দিন"),
    growMr: g("२ टेबलस्पून मेथी बियाणे", "कोको पीट किंवा सेंद्रिय माती", "दिवसातून २ वेळा फवारा", "अप्रत्यक्ष तेजस्वी प्रकाश", "७–१० दिवस"),
  },

  mustard: {
    id: "mustard",
    name: "Mustard Microgreens",
    nameTe: "ఆవ మైక్రోగ్రీన్స్",
    nameHi: "सरसों माइक्रोग्रीन्स",
    nameTa: "கடுகு மைக்ரோகிரீன்ஸ்",
    nameKn: "ಸಾಸಿವೆ ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "সরিষা মাইক্রোগ্রিন্স",
    nameMr: "मोहरी मायक्रोग्रीन्स",
    emoji: "🌱",
    benefits: ["Rich in antioxidants", "Supports cardiovascular wellness", "Nutrient rich", "Helps manage blood pressure"],
    benefitsTe: ["యాంటీఆక్సిడెంట్లు సమృద్ధి", "హృదయ ఆరోగ్యానికి మద్దతు", "పోషకాలు సమృద్ధి", "రక్తపోటును నియంత్రిస్తుంది"],
    benefitsHi: ["एंटीऑक्सीडेंट से भरपूर", "हृदय स्वास्थ्य में सहायक", "पोषक तत्वों से भरपूर", "रक्तचाप नियंत्रित करने में सहायक"],
    benefitsTa: ["ஆன்டிஆக்ஸிடன்ட்கள் நிறைந்தது", "இருதய ஆரோக்கியத்தை ஆதரிக்கிறது", "ஊட்டச்சத்து நிறைந்தது", "இரத்த அழுத்தத்தை நிர்வகிக்க உதவுகிறது"],
    benefitsKn: ["ಉತ್ಕರ್ಷಣ ನಿರೋಧಕಗಳಿಂದ ಸಮೃದ್ಧ", "ಹೃದಯರಕ್ತನಾಳದ ಆರೋಗ್ಯವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", "ಪೋಷಕಾಂಶಗಳಿಂದ ಸಮೃದ್ಧ", "ರಕ್ತದೊತ್ತಡ ನಿರ್ವಹಣೆಗೆ ಸಹಾಯ"],
    benefitsBn: ["অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ", "হৃদযন্ত্রের স্বাস্থ্য সমর্থন করে", "পুষ্টিকর", "রক্তচাপ নিয়ন্ত্রণে সাহায্য করে"],
    benefitsMr: ["अँटीऑक्सिडंट्सने समृद्ध", "हृदय व रक्तवाहिन्यासंबंधी आरोग्यास समर्थन", "पोषक तत्वांनी समृद्ध", "रक्तदाब व्यवस्थापित करण्यास मदत"],
    dailyIntake: "15–20 grams",
    dailyIntakeTe: "15–20 గ్రాములు",
    dailyIntakeHi: "15–20 ग्राम",
    dailyIntakeTa: "15–20 கிராம்",
    dailyIntakeKn: "15–20 ಗ್ರಾಂ",
    dailyIntakeBn: "১৫–২০ গ্রাম",
    dailyIntakeMr: "१५–२० ग्रॅम",
    growthTime: "6–10 days",
    growthTimeTe: "6–10 రోజులు",
    growthTimeHi: "6–10 दिन",
    growthTimeTa: "6–10 நாட்கள்",
    growthTimeKn: "6–10 ದಿನಗಳು",
    growthTimeBn: "৬–১০ দিন",
    growthTimeMr: "६–१० दिवस",
    consume: ["Burgers", "Sandwiches", "Salads"],
    consumeTe: ["బర్గర్లు", "శాండ్‌విచ్‌లు", "సలాడ్లు"],
    consumeHi: ["बर्गर", "सैंडविच", "सलाद"],
    consumeTa: ["பர்கர்கள்", "சாண்ட்விச்கள்", "சாலடுகள்"],
    consumeKn: ["ಬರ್ಗರ್ಗಳು", "ಸ್ಯಾಂಡ್ವಿಚ್ಗಳು", "ಸಲಾಡ್ಗಳು"],
    consumeBn: ["বার্গার", "স্যান্ডউইচ", "সালাদ"],
    consumeMr: ["बर्गर", "सँडविच", "सॅलड"],
    grow: g("1.5 tbsp mustard seeds", "Coco peat tray", "Mist 2x daily", "4–6 hrs indirect", "6–10 days"),
    growTe: g("1.5 టేబుల్ స్పూన్ల ఆవ విత్తనాలు", "కోకో పీట్ ట్రే", "రోజుకు 2 సార్లు పిచికారీ", "4–6 గంటలు పరోక్ష కాంతి", "6–10 రోజులు"),
    growHi: g("1.5 बड़े चम्मच सरसों के बीज", "कोको पीट ट्रे", "दिन में 2 बार छिड़काव", "4–6 घंटे अप्रत्यक्ष", "6–10 दिन"),
    growTa: g("1.5 டேபிள்ஸ்பூன் கடுகு விதைகள்", "கோகோ பீட் தட்டு", "ஒரு நாளைக்கு 2 முறை தெளிக்கவும்", "4–6 மணி நேரம் மறைமுக ஒளி", "6–10 நாட்கள்"),
    growKn: g("1.5 ಟೇಬಲ್ಸ್ಪೂನ್ ಸಾಸಿವೆ ಬೀಜಗಳು", "ಕೋಕೋ ಪೀಟ್ ಟ್ರೇ", "ದಿನಕ್ಕೆ 2 ಬಾರಿ ತೇವಗೊಳಿಸಿ", "4–6 ಗಂಟೆಗಳ ಪರೋಕ್ಷ", "6–10 ದಿನಗಳು"),
    growBn: g("১.৫ টেবিল চামচ সরিষা বীজ", "কোকো পিট ট্রে", "দিনে ২ বার স্প্রে করুন", "৪–৬ ঘন্টা পরোক্ষ", "৬–১০ দিন"),
    growMr: g("१.५ टेबलस्पून मोहरीचे बियाणे", "कोको पीट ट्रे", "दिवसातून २ वेळा फवारा", "४–६ तास अप्रत्यक्ष", "६–१० दिवस"),
  },

  red_cabbage: {
    id: "red_cabbage",
    name: "Red Cabbage Microgreens",
    nameTe: "ఎరుపు క్యాబేజీ మైక్రోగ్రీన్స్",
    nameHi: "लाल पत्ता गोभी माइक्रोग्रीन्स",
    nameTa: "சிவப்பு முட்டைக்கோஸ் மைக்ரோகிரீன்ஸ்",
    nameKn: "ಕೆಂಪು ಎಲೆಕೋಸು ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "লাল বাঁধাকপি মাইক্রোগ্রিন্স",
    nameMr: "लाल कोबी मायक्रोग्रीन्स",
    emoji: "🥬",
    benefits: ["Rich in polyphenols", "Supports heart health", "High antioxidant content", "Helps manage cholesterol"],
    benefitsTe: ["పాలిఫినాల్స్ సమృద్ధి", "గుండె ఆరోగ్యానికి మద్దతు", "అధిక యాంటీఆక్సిడెంట్లు", "కొలెస్ట్రాల్ నియంత్రణ"],
    benefitsHi: ["पॉलीफेनॉल से भरपूर", "हृदय स्वास्थ्य में सहायक", "उच्च एंटीऑक्सीडेंट", "कोलेस्ट्रॉल नियंत्रण में सहायक"],
    benefitsTa: ["பாலிஃபீனால்கள் நிறைந்தது", "இதய ஆரோக்கியத்தை ஆதரிக்கிறது", "உயர் ஆன்டிஆக்ஸிடன்ட் உள்ளடக்கம்", "கொலஸ்ட்ரால் நிர்வகிக்க உதவுகிறது"],
    benefitsKn: ["ಪಾಲಿಫಿನಾಲ್ಗಳಿಂದ ಸಮೃದ್ಧ", "ಹೃದಯದ ಆರೋಗ್ಯವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", "ಅಧಿಕ ಉತ್ಕರ್ಷಣ ನಿರೋಧಕ ಅಂಶ", "ಕೊಲೆಸ್ಟ್ರಾಲ್ ನಿರ್ವಹಣೆಗೆ ಸಹಾಯ"],
    benefitsBn: ["পলিফেনলে সমৃদ্ধ", "হৃদযন্ত্রের স্বাস্থ্য সমর্থন করে", "উচ্চ অ্যান্টিঅক্সিডেন্ট", "কোলেস্টেরল নিয়ন্ত্রণে সহায়ক"],
    benefitsMr: ["पॉलिफिनॉलने समृद्ध", "हृदयाच्या आरोग्यास समर्थन", "उच्च अँटीऑक्सिडंट सामग्री", "कोलेस्ट्रॉल व्यवस्थापित करण्यास मदत"],
    dailyIntake: "15–25 grams",
    dailyIntakeTe: "15–25 గ్రాములు",
    dailyIntakeHi: "15–25 ग्राम",
    dailyIntakeTa: "15–25 கிராம்",
    dailyIntakeKn: "15–25 ಗ್ರಾಂ",
    dailyIntakeBn: "১৫–২৫ গ্রাম",
    dailyIntakeMr: "१५–२५ ग्रॅम",
    growthTime: "8–12 days",
    growthTimeTe: "8–12 రోజులు",
    growthTimeHi: "8–12 दिन",
    growthTimeTa: "8–12 நாட்கள்",
    growthTimeKn: "8–12 ದಿನಗಳು",
    growthTimeBn: "৮–১২ দিন",
    growthTimeMr: "८–१२ दिवस",
    consume: ["Salads", "Smoothies", "Wraps"],
    consumeTe: ["సలాడ్లు", "స్మూతీలు", "ర్యాప్‌లు"],
    consumeHi: ["सलाद", "स्मूदी", "रैप्स"],
    consumeTa: ["சாலடுகள்", "ஸ்மூத்திகள்", "ரேப்கள்"],
    consumeKn: ["ಸಲಾಡ್ಗಳು", "ಸ್ಮೂಥಿಗಳು", "ರ್ಯಾಪ್ಗಳು"],
    consumeBn: ["সালাদ", "স্মুদি", "র্যাপ"],
    consumeMr: ["सॅलड", "स्मूदी", "रॅप्स"],
    grow: g("2 tbsp red cabbage seeds", "Coco peat", "Mist daily", "Indirect light", "8–12 days"),
    growTe: g("2 టేబుల్ స్పూన్ల విత్తనాలు", "కోకో పీట్", "రోజూ పిచికారీ", "పరోక్ష కాంతి", "8–12 రోజులు"),
    growHi: g("2 बड़े चम्मच लाल पत्ता गोभी के बीज", "कोको पीट", "रोज छिड़काव", "अप्रत्यक्ष रोशनी", "8–12 दिन"),
    growTa: g("2 டேபிள்ஸ்பூன் சிவப்பு முட்டைக்கோஸ் விதைகள்", "கோகோ பீட்", "தினமும் தெளிக்கவும்", "மறைமுக ஒளி", "8–12 நாட்கள்"),
    growKn: g("2 ಟೇಬಲ್ಸ್ಪೂನ್ ಕೆಂಪು ಎಲೆಕೋಸು ಬೀಜಗಳು", "ಕೋಕೋ ಪೀಟ್", "ಪ್ರತಿದಿನ ತೇವಗೊಳಿಸಿ", "ಪರೋಕ್ಷ ಬೆಳಕು", "8–12 ದಿನಗಳು"),
    growBn: g("২ টেবিল চামচ লাল বাঁধাকপি বীজ", "কোকো পিট", "প্রতিদিন স্প্রে করুন", "পরোক্ষ আলো", "৮–১২ দিন"),
    growMr: g("२ टेबलस्पून लाल कोबी बियाणे", "कोको पीट", "रोज फवारा", "अप्रत्यक्ष प्रकाश", "८–१२ दिवस"),
  },

  radish: {
    id: "radish",
    name: "Radish Microgreens",
    nameTe: "ముల్లంగి మైక్రోగ్రీన్స్",
    nameHi: "मूली माइक्रोग्रीन्स",
    nameTa: "முள்ளங்கி மைக்ரோகிரீன்ஸ்",
    nameKn: "ಮೂಲಂಗಿ ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "মুলা মাইক্রোগ্রিন্স",
    nameMr: "मुळा मायक्रोग्रीन्स",
    emoji: "🌾",
    benefits: ["Supports digestion", "Rich in enzymes", "Helps gut health", "Boosts metabolism"],
    benefitsTe: ["జీర్ణక్రియకు మద్దతు", "ఎంజైమ్‌లు సమృద్ధి", "పేగు ఆరోగ్యానికి సహాయం", "జీవక్రియను పెంచుతుంది"],
    benefitsHi: ["पाचन में सहायक", "एंजाइम से भरपूर", "आंतों के स्वास्थ्य में सहायक", "चयापचय बढ़ाता है"],
    benefitsTa: ["செரிமானத்தை ஆதரிக்கிறது", "என்சைம்கள் நிறைந்தது", "குடல் ஆரோக்கியத்திற்கு உதவுகிறது", "வளர்சிதை மாற்றத்தை அதிகரிக்கிறது"],
    benefitsKn: ["ಜೀರ್ಣಕ್ರಿಯೆಯನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", "ಕಿಣ್ವಗಳಿಂದ ಸಮೃದ್ಧ", "ಕರುಳಿನ ಆರೋಗ್ಯಕ್ಕೆ ಸಹಾಯ", "ಚಯಾಪಚಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ"],
    benefitsBn: ["হজমে সহায়তা করে", "এনজাইম সমৃদ্ধ", "অন্ত্রের স্বাস্থ্যে সাহায্য করে", "বিপাক বাড়ায়"],
    benefitsMr: ["पचनास मदत", "एंझाइमने समृद्ध", "आतड्यांच्या आरोग्यास मदत", "चयापचय वाढवते"],
    dailyIntake: "20–30 grams",
    dailyIntakeTe: "20–30 గ్రాములు",
    dailyIntakeHi: "20–30 ग्राम",
    dailyIntakeTa: "20–30 கிராம்",
    dailyIntakeKn: "20–30 ಗ್ರಾಂ",
    dailyIntakeBn: "২০–৩০ গ্রাম",
    dailyIntakeMr: "२०–३० ग्रॅम",
    growthTime: "7–10 days",
    growthTimeTe: "7–10 రోజులు",
    growthTimeHi: "7–10 दिन",
    growthTimeTa: "7–10 நாட்கள்",
    growthTimeKn: "7–10 ದಿನಗಳು",
    growthTimeBn: "৭–১০ দিন",
    growthTimeMr: "७–१० दिवस",
    consume: ["Salads", "Soups", "Sandwiches"],
    consumeTe: ["సలాడ్లు", "సూప్‌లు", "శాండ్‌విచ్‌లు"],
    consumeHi: ["सलाद", "सूप", "सैंडविच"],
    consumeTa: ["சாலடுகள்", "சூப்கள்", "சாண்ட்விச்கள்"],
    consumeKn: ["ಸಲಾಡ್ಗಳು", "ಸೂಪ್ಗಳು", "ಸ್ಯಾಂಡ್ವಿಚ್ಗಳು"],
    consumeBn: ["সালাদ", "স্যুপ", "স্যান্ডউইচ"],
    consumeMr: ["सॅलड", "सूप", "सँडविच"],
    grow: g("2 tbsp radish seeds", "Coco peat", "Mist 2x daily", "Bright indirect", "7–10 days"),
    growTe: g("2 టేబుల్ స్పూన్ల విత్తనాలు", "కోకో పీట్", "రోజుకు 2 సార్లు", "ప్రకాశవంతమైన పరోక్ష", "7–10 రోజులు"),
    growHi: g("2 बड़े चम्मच मूली के बीज", "कोको पीट", "दिन में 2 बार छिड़काव", "तेज अप्रत्यक्ष", "7–10 दिन"),
    growTa: g("2 டேபிள்ஸ்பூன் முள்ளங்கி விதைகள்", "கோகோ பீட்", "ஒரு நாளைக்கு 2 முறை", "பிரகாசமான மறைமுக", "7–10 நாட்கள்"),
    growKn: g("2 ಟೇಬಲ್ಸ್ಪೂನ್ ಮೂಲಂಗಿ ಬೀಜಗಳು", "ಕೋಕೋ ಪೀಟ್", "ದಿನಕ್ಕೆ 2 ಬಾರಿ", "ಪ್ರಕಾಶಮಾನ ಪರೋಕ್ಷ", "7–10 ದಿನಗಳು"),
    growBn: g("২ টেবিল চামচ মুলা বীজ", "কোকো পিট", "দিনে ২ বার", "উজ্জ্বল পরোক্ষ", "৭–১০ দিন"),
    growMr: g("२ टेबलस्पून मुळा बियाणे", "कोको पीट", "दिवसातून २ वेळा", "तेजस्वी अप्रत्यक्ष", "७–१० दिवस"),
  },

  broccoli: {
    id: "broccoli",
    name: "Broccoli Microgreens",
    nameTe: "బ్రోకలీ మైక్రోగ్రీన్స్",
    nameHi: "ब्रोकली माइक्रोग्रीन्स",
    nameTa: "ப்ரோக்கோலி மைக்ரோகிரீன்ஸ்",
    nameKn: "ಬ್ರೊಕೋಲಿ ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "ব্রোকলি মাইক্রোগ্রিন্স",
    nameMr: "ब्रोकोली मायक्रोग्रीन्स",
    emoji: "🥦",
    benefits: ["Rich in sulforaphane", "High antioxidants", "Supports immune function", "Detoxifying properties"],
    benefitsTe: ["సల్ఫోరాఫేన్ సమృద్ధి", "అధిక యాంటీఆక్సిడెంట్లు", "రోగనిరోధక శక్తికి మద్దతు", "నిర్విషీకరణ లక్షణాలు"],
    benefitsHi: ["सल्फोराफेन से भरपूर", "उच्च एंटीऑक्सीडेंट", "प्रतिरक्षा कार्य में सहायक", "डिटॉक्सिफाइंग गुण"],
    benefitsTa: ["சல்போராபேன் நிறைந்தது", "உயர் ஆன்டிஆக்ஸிடன்ட்கள்", "நோய் எதிர்ப்பு சக்தியை ஆதரிக்கிறது", "நச்சு நீக்க பண்புகள்"],
    benefitsKn: ["ಸಲ್ಫೋರಾಫೇನ್ನಿಂದ ಸಮೃದ್ಧ", "ಅಧಿಕ ಉತ್ಕರ್ಷಣ ನಿರೋಧಕಗಳು", "ಪ್ರತಿರಕ್ಷಾ ಕಾರ್ಯವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", "ನಿರ್ವಿಷೀಕರಣ ಗುಣಲಕ್ಷಣಗಳು"],
    benefitsBn: ["সালফোরাফেন সমৃদ্ধ", "উচ্চ অ্যান্টিঅক্সিডেন্ট", "ইমিউন ফাংশন সমর্থন করে", "ডিটক্সিফাইং বৈশিষ্ট্য"],
    benefitsMr: ["सल्फोराफेनने समृद्ध", "उच्च अँटीऑक्सिडंट्स", "रोगप्रतिकारक कार्यास समर्थन", "डिटॉक्सिफायिंग गुणधर्म"],
    dailyIntake: "15–20 grams",
    dailyIntakeTe: "15–20 గ్రాములు",
    dailyIntakeHi: "15–20 ग्राम",
    dailyIntakeTa: "15–20 கிராம்",
    dailyIntakeKn: "15–20 ಗ್ರಾಂ",
    dailyIntakeBn: "১৫–২০ গ্রাম",
    dailyIntakeMr: "१५–२० ग्रॅम",
    growthTime: "8–12 days",
    growthTimeTe: "8–12 రోజులు",
    growthTimeHi: "8–12 दिन",
    growthTimeTa: "8–12 நாட்கள்",
    growthTimeKn: "8–12 ದಿನಗಳು",
    growthTimeBn: "৮–১২ দিন",
    growthTimeMr: "८–१२ दिवस",
    consume: ["Salads", "Smoothies"],
    consumeTe: ["సలాడ్లు", "స్మూతీలు"],
    consumeHi: ["सलाद", "स्मूदी"],
    consumeTa: ["சாலடுகள்", "ஸ்மூத்திகள்"],
    consumeKn: ["ಸಲಾಡ್ಗಳು", "ಸ್ಮೂಥಿಗಳು"],
    consumeBn: ["সালাদ", "স্মুদি"],
    consumeMr: ["सॅलड", "स्मूदी"],
    grow: g("1.5 tbsp broccoli seeds", "Coco peat tray", "Mist daily", "Indirect light", "8–12 days"),
    growTe: g("1.5 టేబుల్ స్పూన్ల విత్తనాలు", "కోకో పీట్ ట్రే", "రోజూ పిచికారీ", "పరోక్ష కాంతి", "8–12 రోజులు"),
    growHi: g("1.5 बड़े चम्मच ब्रोकली के बीज", "कोको पीट ट्रे", "रोज छिड़काव", "अप्रत्यक्ष रोशनी", "8–12 दिन"),
    growTa: g("1.5 டேபிள்ஸ்பூன் ப்ரோக்கோலி விதைகள்", "கோகோ பீட் தட்டு", "தினமும் தெளிக்கவும்", "மறைமுக ஒளி", "8–12 நாட்கள்"),
    growKn: g("1.5 ಟೇಬಲ್ಸ್ಪೂನ್ ಬ್ರೊಕೋಲಿ ಬೀಜಗಳು", "ಕೋಕೋ ಪೀಟ್ ಟ್ರೇ", "ಪ್ರತಿದಿನ ತೇವಗೊಳಿಸಿ", "ಪರೋಕ್ಷ ಬೆಳಕು", "8–12 ದಿನಗಳು"),
    growBn: g("১.৫ টেবিল চামচ ব্রোকলি বীজ", "কোকো পিট ট্রে", "প্রতিদিন স্প্রে করুন", "পরোক্ষ আলো", "৮–১২ দিন"),
    growMr: g("१.५ टेबलस्पून ब्रोकोली बियाणे", "कोको पीट ट्रे", "रोज फवारा", "अप्रत्यक्ष प्रकाश", "८–१२ दिवस"),
  },

  spinach: {
    id: "spinach",
    name: "Spinach Microgreens",
    nameTe: "పాలకూర మైక్రోగ్రీన్స్",
    nameHi: "पालक माइक्रोग्रीन्स",
    nameTa: "கீரை மைக்ரோகிரீன்ஸ்",
    nameKn: "ಪಾಲಕ್ ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "পালং শাক মাইক্রোগ্রিন্স",
    nameMr: "पालक मायक्रोग्रीन्स",
    emoji: "🥗",
    benefits: ["Rich in lutein", "Contains Vitamin A", "Supports eye health", "Iron source"],
    benefitsTe: ["లుటీన్ సమృద్ధి", "విటమిన్ A కలిగి ఉంది", "కంటి ఆరోగ్యానికి మద్దతు", "ఇనుము మూలం"],
    benefitsHi: ["ल्यूटिन से भरपूर", "विटामिन A युक्त", "आंखों के स्वास्थ्य में सहायक", "आयरन का स्रोत"],
    benefitsTa: ["லுடீன் நிறைந்தது", "வைட்டமின் A கொண்டுள்ளது", "கண் ஆரோக்கியத்தை ஆதரிக்கிறது", "இரும்பு மூலம்"],
    benefitsKn: ["ಲುಟೀನ್ನಿಂದ ಸಮೃದ್ಧ", "ವಿಟಮಿನ್ A ಹೊಂದಿದೆ", "ಕಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", "ಕಬ್ಬಿಣದ ಮೂಲ"],
    benefitsBn: ["লুটেইন সমৃদ্ধ", "ভিটামিন A রয়েছে", "চোখের স্বাস্থ্য সমর্থন করে", "আয়রনের উৎস"],
    benefitsMr: ["ल्युटिनने समृद्ध", "व्हिटॅमिन A असते", "डोळ्यांच्या आरोग्यास समर्थन", "लोह स्रोत"],
    dailyIntake: "15–20 grams",
    dailyIntakeTe: "15–20 గ్రాములు",
    dailyIntakeHi: "15–20 ग्राम",
    dailyIntakeTa: "15–20 கிராம்",
    dailyIntakeKn: "15–20 ಗ್ರಾಂ",
    dailyIntakeBn: "১৫–২০ গ্রাম",
    dailyIntakeMr: "१५–२० ग्रॅम",
    growthTime: "8–12 days",
    growthTimeTe: "8–12 రోజులు",
    growthTimeHi: "8–12 दिन",
    growthTimeTa: "8–12 நாட்கள்",
    growthTimeKn: "8–12 ದಿನಗಳು",
    growthTimeBn: "৮–১২ দিন",
    growthTimeMr: "८–१२ दिवस",
    consume: ["Salads", "Sandwiches"],
    consumeTe: ["సలాడ్లు", "శాండ్‌విచ్‌లు"],
    consumeHi: ["सलाद", "सैंडविच"],
    consumeTa: ["சாலடுகள்", "சாண்ட்விச்கள்"],
    consumeKn: ["ಸಲಾಡ್ಗಳು", "ಸ್ಯಾಂಡ್ವಿಚ್ಗಳು"],
    consumeBn: ["সালাদ", "স্যান্ডউইচ"],
    consumeMr: ["सॅलड", "सँडविच"],
    grow: g("2 tbsp spinach seeds (soaked)", "Organic soil", "Keep moist", "4–6 hrs sun", "8–12 days"),
    growTe: g("2 టేబుల్ స్పూన్ల పాలకూర విత్తనాలు", "సేంద్రియ నేల", "తేమగా ఉంచండి", "4–6 గంటలు సూర్యకాంతి", "8–12 రోజులు"),
    growHi: g("2 बड़े चम्मच पालक के बीज (भिगोए हुए)", "जैविक मिट्टी", "नम रखें", "4–6 घंटे धूप", "8–12 दिन"),
    growTa: g("2 டேபிள்ஸ்பூன் கீரை விதைகள் (ஊறவைத்தது)", "இயற்கை மண்", "ஈரமாக வைக்கவும்", "4–6 மணி நேரம் சூரிய ஒளி", "8–12 நாட்கள்"),
    growKn: g("2 ಟೇಬಲ್ಸ್ಪೂನ್ ಪಾಲಕ್ ಬೀಜಗಳು (ನೆನೆಸಿದ)", "ಸಾವಯವ ಮಣ್ಣು", "ತೇವವಾಗಿರಿಸಿ", "4–6 ಗಂಟೆಗಳ ಬಿಸಿಲು", "8–12 ದಿನಗಳು"),
    growBn: g("২ টেবিল চামচ পালং শাক বীজ (ভিজানো)", "জৈব মাটি", "আর্দ্র রাখুন", "৪–৬ ঘন্টা রোদ", "৮–১২ দিন"),
    growMr: g("२ टेबलस्पून पालक बियाणे (भिजवलेले)", "सेंद्रिय माती", "ओलसर ठेवा", "४–६ तास उन्हात", "८–१२ दिवस"),
  },

  pea: {
    id: "pea",
    name: "Pea Shoot Microgreens",
    nameTe: "బఠాణీ మైక్రోగ్రీన్స్",
    nameHi: "मटर माइक्रोग्रीन्स",
    nameTa: "பட்டாணி மைக்ரோகிரீன்ஸ்",
    nameKn: "ಬಟಾಣಿ ಮೈಕ್ರೋಗ್ರೀನ್ಸ್",
    nameBn: "মটর মাইক্রোগ্রিন্স",
    nameMr: "मटार मायक्रोग्रीन्स",
    emoji: "🌿",
    benefits: ["Magnesium rich", "Plant protein source", "Supports energy levels", "Reduces stress"],
    benefitsTe: ["మెగ్నీషియం సమృద్ధి", "మొక్కల ప్రోటీన్ మూలం", "శక్తి స్థాయిలకు మద్దతు", "ఒత్తిడిని తగ్గిస్తుంది"],
    benefitsHi: ["मैग्नीशियम से भरपूर", "पौध प्रोटीन स्रोत", "ऊर्जा स्तर में सहायक", "तनाव कम करता है"],
    benefitsTa: ["மெக்னீசியம் நிறைந்தது", "தாவர புரத மூலம்", "ஆற்றல் அளவுகளை ஆதரிக்கிறது", "மன அழுத்தத்தை குறைக்கிறது"],
    benefitsKn: ["ಮೆಗ್ನೀಸಿಯಮ್ನಿಂದ ಸಮೃದ್ಧ", "ಸಸ್ಯ ಪ್ರೋಟೀನ್ ಮೂಲ", "ಶಕ್ತಿಯ ಮಟ್ಟವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ", "ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ"],
    benefitsBn: ["ম্যাগনেসিয়াম সমৃদ্ধ", "উদ্ভিদ প্রোটিন উৎস", "শক্তির মাত্রা সমর্থন করে", "মানসিক চাপ কমায়"],
    benefitsMr: ["मॅग्नेशिअमने समृद्ध", "वनस्पती प्रथिन स्रोत", "ऊर्जा पातळीस समर्थन", "तणाव कमी करते"],
    dailyIntake: "20–30 grams",
    dailyIntakeTe: "20–30 గ్రాములు",
    dailyIntakeHi: "20–30 ग्राम",
    dailyIntakeTa: "20–30 கிராம்",
    dailyIntakeKn: "20–30 ಗ್ರಾಂ",
    dailyIntakeBn: "২০–৩০ গ্রাম",
    dailyIntakeMr: "२०–३० ग्रॅम",
    growthTime: "10–14 days",
    growthTimeTe: "10–14 రోజులు",
    growthTimeHi: "10–14 दिन",
    growthTimeTa: "10–14 நாட்கள்",
    growthTimeKn: "10–14 ದಿನಗಳು",
    growthTimeBn: "১০–১৪ দিন",
    growthTimeMr: "१०–१४ दिवस",
    consume: ["Salads", "Stir fry", "Wraps"],
    consumeTe: ["సలాడ్లు", "స్టిర్ ఫ్రై", "ర్యాప్‌లు"],
    consumeHi: ["सलाद", "स्टिर फ्राई", "रैप्स"],
    consumeTa: ["சாலடுகள்", "ஸ்டிர் ஃப்ரை", "ரேப்கள்"],
    consumeKn: ["ಸಲಾಡ್ಗಳು", "ಸ್ಟಿರ್ ಫ್ರೈ", "ರ್ಯಾಪ್ಗಳು"],
    consumeBn: ["সালাদ", "স্টির ফ্রাই", "র্যাপ"],
    consumeMr: ["सॅलड", "स्टिर फ्राय", "रॅप्स"],
    grow: g("3 tbsp pea seeds (soaked 8 hrs)", "Coco peat or soil", "Mist 2x daily", "Bright indirect", "10–14 days"),
    growTe: g("3 టేబుల్ స్పూన్ల బఠాణీ విత్తనాలు (8 గంటలు నానబెట్టి)", "కోకో పీట్ లేదా నేల", "రోజుకు 2 సార్లు", "ప్రకాశవంతమైన పరోక్ష", "10–14 రోజులు"),
    growHi: g("3 बड़े चम्मच मटर के बीज (8 घंटे भिगोए)", "कोको पीट या मिट्टी", "दिन में 2 बार छिड़काव", "तेज अप्रत्यक्ष", "10–14 दिन"),
    growTa: g("3 டேபிள்ஸ்பூன் பட்டாணி விதைகள் (8 மணி நேரம் ஊறவைத்தது)", "கோகோ பீட் அல்லது மண்", "ஒரு நாளைக்கு 2 முறை தெளிக்கவும்", "பிரகாசமான மறைமுக", "10–14 நாட்கள்"),
    growKn: g("3 ಟೇಬಲ್ಸ್ಪೂನ್ ಬಟಾಣಿ ಬೀಜಗಳು (8 ಗಂಟೆ ನೆನೆಸಿದ)", "ಕೋಕೋ ಪೀಟ್ ಅಥವಾ ಮಣ್ಣು", "ದಿನಕ್ಕೆ 2 ಬಾರಿ ತೇವಗೊಳಿಸಿ", "ಪ್ರಕಾಶಮಾನ ಪರೋಕ್ಷ", "10–14 ದಿನಗಳು"),
    growBn: g("৩ টেবিল চামচ মটর বীজ (৮ ঘন্টা ভিজানো)", "কোকো পিট বা মাটি", "দিনে ২ বার স্প্রে করুন", "উজ্জ্বল পরোক্ষ", "১০–১৪ দিন"),
    growMr: g("३ टेबलस्पून मटार बियाणे (८ तास भिजवलेले)", "कोको पीट किंवा माती", "दिवसातून २ वेळा फवारा", "तेजस्वी अप्रत्यक्ष", "१०–१४ दिवस"),
  },
};

export const concernToMicrogreen: Record<HealthConcernId, string> = {
  iron_deficiency: "fenugreek",
  diabetes: "fenugreek",
  high_bp: "mustard",
  high_cholesterol: "red_cabbage",
  digestive: "radish",
  low_immunity: "broccoli",
  fatigue: "pea",
  poor_eyesight: "spinach",
  stress: "pea",
};

export const concernLabels: Record<HealthConcernId, { en: string; te: string; emoji: string }> = {
  iron_deficiency: { en: "Iron Deficiency", te: "ఇనుము లోపం", emoji: "🩸" },
  diabetes: { en: "Diabetes Support", te: "మధుమేహ మద్దతు", emoji: "🍬" },
  high_bp: { en: "High Blood Pressure", te: "అధిక రక్తపోటు", emoji: "❤️" },
  high_cholesterol: { en: "High Cholesterol", te: "అధిక కొలెస్ట్రాల్", emoji: "🫀" },
  digestive: { en: "Digestive Issues", te: "జీర్ణ సమస్యలు", emoji: "🌀" },
  low_immunity: { en: "Low Immunity", te: "తక్కువ రోగనిరోధక శక్తి", emoji: "🛡️" },
  fatigue: { en: "Fatigue & Low Energy", te: "అలసట & తక్కువ శక్తి", emoji: "⚡" },
  poor_eyesight: { en: "Poor Eyesight", te: "తక్కువ దృష్టి", emoji: "👁️" },
  stress: { en: "Stress", te: "ఒత్తిడి", emoji: "🧘" },
};

export const ageGroups = [
  { id: "under18", en: "Under 18", te: "18 కంటే తక్కువ" },
  { id: "18_30", en: "18–30", te: "18–30" },
  { id: "31_45", en: "31–45", te: "31–45" },
  { id: "46_60", en: "46–60", te: "46–60" },
  { id: "60plus", en: "60+", te: "60+" },
];

const exactTranslations = {
  ta: {
    Paddy: 'நெல்', Banana: 'வாழை', Tomato: 'தக்காளி', Loam: 'வண்டல் மண்', 'Clay loam': 'களிமண் வண்டல்', 'Sandy loam': 'மணல் வண்டல்', 'Silt loam': 'வண்டல் மண்',
    '2-3 weeks before planting, test soil pH, organic carbon, nitrogen, phosphorus, potassium, and salinity; use the results to set amendment rates.': 'நடவு செய்வதற்கு 2-3 வாரங்களுக்கு முன் மண் pH, கரிம கார்பன், நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம் மற்றும் உப்புத்தன்மையை பரிசோதித்து, முடிவுகளின் அடிப்படையில் திருத்த அளவை நிர்ணயிக்கவும்.',
    'Remove weeds and crop residues, loosen compacted soil, and incorporate 2-4 tonnes per acre of mature compost or farmyard manure without using fresh manure.': 'களைகள் மற்றும் பயிர் எச்சங்களை அகற்றி, இறுக்கமான மண்ணை தளர்த்தி, புதிய உரத்திற்கு பதிலாக ஒரு ஏக்கருக்கு 2-4 டன் நன்கு மக்கிய கம்போஸ்ட் அல்லது தொழு உரத்தை கலக்கவும்.',
    'Correct pH only from the soil-test recommendation: use agricultural lime for strongly acidic soil or gypsum where sodicity is confirmed; do not apply either blindly.': 'மண் பரிசோதனை பரிந்துரைத்தால் மட்டுமே pH-ஐ திருத்தவும்: அதிக அமில மண்ணுக்கு வேளாண் சுண்ணாம்பும், சோடியம் அதிகம் உள்ள மண்ணுக்கு ஜிப்சமும் பயன்படுத்தவும்.',
    'Improve biological activity with mature compost, retain suitable crop residues as mulch, and provide drainage so roots receive air as well as water.': 'மக்கிய கம்போஸ்ட் மூலம் உயிரியல் செயல்பாட்டை மேம்படுத்தி, பொருத்தமான பயிர் எச்சங்களை மூடாக்காக வைத்து, வேர்களுக்கு காற்றும் நீரும் கிடைக்க வடிகால் அமைக்கவும்.',
  },
  ml: {
    Paddy: 'നെല്ല്', Banana: 'വാഴ', Tomato: 'തക്കാളി', Loam: 'പശിമണ്ണ്', 'Clay loam': 'കളിമൺ പശിമണ്ണ്', 'Sandy loam': 'മണൽ പശിമണ്ണ്', 'Silt loam': 'സിൽറ്റ് പശിമണ്ണ്',
  },
  kn: {
    Paddy: 'ಭತ್ತ', Banana: 'ಬಾಳೆಹಣ್ಣು', Tomato: 'ಟೊಮೇಟೊ', Loam: 'ಲೋಮ್ ಮಣ್ಣು', 'Clay loam': 'ಜೇಡಿ ಲೋಮ್', 'Sandy loam': 'ಮರಳು ಲೋಮ್', 'Silt loam': 'ಸಿಲ್ಟ್ ಲೋಮ್',
  },
  te: {
    Paddy: 'వరి', Banana: 'అరటి', Tomato: 'టమాటా', Loam: 'లోమ్ నేల', 'Clay loam': 'బంకమట్టి లోమ్', 'Sandy loam': 'ఇసుక లోమ్', 'Silt loam': 'సిల్ట్ లోమ్',
  },
};

const termTranslations = {
  ta: { Nitrogen: 'நைட்ரஜன்', Phosphorus: 'பாஸ்பரஸ்', Potassium: 'பொட்டாசியம்', Calcium: 'கால்சியம்', Nursery: 'நாற்றங்கால்', Planting: 'நடவு', Transplanting: 'மறு நடவு', 'Early growth': 'ஆரம்ப வளர்ச்சி', 'Active growth': 'செயலில் வளர்ச்சி', Flowering: 'பூக்கும் நிலை', 'Fruit setting': 'காய் பிடித்தல்', 'Fruit filling': 'காய் நிரப்புதல்', Tillering: 'தூர் விடுதல்', Maturity: 'முதிர்ச்சி', 'Before planting': 'நடவு செய்வதற்கு முன்', 'Pre-harvest': 'அறுவடைக்கு முன்', Establishment: 'நிறுவல் நிலை', 'Organic matter': 'கரிமப் பொருள்', 'soil test': 'மண் பரிசோதனை', compost: 'கம்போஸ்ட்', manure: 'தொழு உரம்', 'irrigation method': 'பாசன முறை', 'Every': 'ஒவ்வொரு', days: 'நாட்கள்', 'Apply': 'பயன்படுத்தவும்', 'Water': 'நீர்' },
  ml: { Nitrogen: 'നൈട്രജൻ', Phosphorus: 'ഫോസ്ഫറസ്', Potassium: 'പൊട്ടാസ്യം', Calcium: 'കാൽസ്യം', Nursery: 'നഴ്സറി', Planting: 'നടീൽ', Transplanting: 'നടീൽ മാറ്റം', Flowering: 'പൂക്കൽ', 'Fruit setting': 'കായ പിടിത്തം', Tillering: 'തളിർ വളർച്ച', Maturity: 'പക്വത', 'Before planting': 'നടുന്നതിന് മുമ്പ്', Establishment: 'സ്ഥാപനം', 'Organic matter': 'ജൈവ വസ്തു', compost: 'കമ്പോസ്റ്റ്', manure: 'വളം' },
  kn: { Nitrogen: 'ಸಾರಜನಕ', Phosphorus: 'ರಂಜಕ', Potassium: 'ಪೊಟ್ಯಾಸಿಯಂ', Calcium: 'ಕ್ಯಾಲ್ಸಿಯಂ', Nursery: 'ನರ್ಸರಿ', Planting: 'ನಾಟಿ', Transplanting: 'ಮರುನಾಟಿ', Flowering: 'ಹೂಬಿಡುವಿಕೆ', 'Fruit setting': 'ಹಣ್ಣು ಕಟ್ಟುವಿಕೆ', Tillering: 'ಸಸಿಗಳ ಬೆಳವಣಿಗೆ', Maturity: 'ಪಕ್ವತೆ', 'Before planting': 'ನಾಟಿಗೆ ಮುನ್ನ', Establishment: 'ಸ್ಥಾಪನೆ', 'Organic matter': 'ಸಾವಯವ ಪದಾರ್ಥ', compost: 'ಕಾಂಪೋಸ್ಟ್', manure: 'ಗೊಬ್ಬರ' },
  te: { Nitrogen: 'నైట్రోజన్', Phosphorus: 'భాస్వరం', Potassium: 'పొటాషియం', Calcium: 'కాల్షియం', Nursery: 'నర్సరీ', Planting: 'నాటడం', Transplanting: 'మార్పిడి', Flowering: 'పుష్పించే దశ', 'Fruit setting': 'కాయ ఏర్పడటం', Tillering: 'పిలకల దశ', Maturity: 'పక్వత', 'Before planting': 'నాటడానికి ముందు', Establishment: 'స్థాపన', 'Organic matter': 'సేంద్రియ పదార్థం', compost: 'కంపోస్ట్', manure: 'పశువుల ఎరువు' },
};

export const translateContent = (value, language) => {
  if (value === null || value === undefined || language === 'en') return value;
  const text = String(value);
  if (exactTranslations[language]?.[text]) return exactTranslations[language][text];
  return Object.entries(termTranslations[language] || {})
    .sort(([first], [second]) => second.length - first.length)
    .reduce((translated, [source, target]) => translated.replaceAll(source, target), text);
};

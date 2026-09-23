import React, { createContext, useState } from 'react';

// Mock Dictionary
const translations = {
  en: {
    find_work: 'Find Work',
    login: 'Login',
    post_shift: 'Post a Shift',
    hero_title: 'Find reliable local shifts instantly.',
    hero_subtitle: 'Connect with verified businesses in your area for immediate, short-term work. Get paid instantly.',
    browse_title: 'Find Your Next Gig',
    all_locations: 'All Locations',
    all_categories: 'All Categories',
    search_placeholder: 'Search packing, cashier...',
    no_shifts: 'No Shifts Found',
    urgent: 'URGENT SHIFT',
    apply: 'Apply Now'
  },
  gu: {
    find_work: 'કામ શોધો',
    login: 'લૉગિન',
    post_shift: 'શિફ્ટ પોસ્ટ કરો',
    hero_title: 'તાત્કાલિક ભરોસાપાત્ર સ્થાનિક શિફ્ટ શોધો.',
    hero_subtitle: 'તાત્કાલિક, ટૂંકા ગાળાના કામ માટે તમારા વિસ્તારમાં ચકાસાયેલ વ્યવસાયો સાથે જોડાઓ. તરત જ ચૂકવણી મેળવો.',
    browse_title: 'તમારું આગલું કામ શોધો',
    all_locations: 'બધા સ્થાનો',
    all_categories: 'બધી શ્રેણીઓ',
    search_placeholder: 'પેકિંગ, કેશિયર શોધો...',
    no_shifts: 'કોઈ શિફ્ટ મળી નથી',
    urgent: 'તાત્કાલિક શિફ્ટ',
    apply: 'અરજી કરો'
  },
  hi: {
    find_work: 'काम खोजें',
    login: 'लॉग इन करें',
    post_shift: 'शिफ्ट पोस्ट करें',
    hero_title: 'तुरंत भरोसेमंद स्थानीय शिफ्ट खोजें।',
    hero_subtitle: 'तत्काल, अल्पकालिक काम के लिए अपने क्षेत्र में सत्यापित व्यवसायों से जुड़ें। तुरंत भुगतान पाएं।',
    browse_title: 'अपना अगला काम खोजें',
    all_locations: 'सभी स्थान',
    all_categories: 'सभी श्रेणियां',
    search_placeholder: 'पैकिंग, कैशियर खोजें...',
    no_shifts: 'कोई शिफ्ट नहीं मिली',
    urgent: 'अत्यावश्यक शिफ्ट',
    apply: 'अभी आवेदन करें'
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

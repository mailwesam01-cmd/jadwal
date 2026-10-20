import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'ar' | 'en';

export const translations = {
  ar: {
    appTitle: 'جدولك الجامعي الذكي',
    appSubtitle: 'ارفع ملف Excel الخاص بجامعتك وابدأ بتوليد جدولك',
    searchCourses: 'البحث عن المواد',
    generateButton: 'توليد الجداول',
    generatingButton: 'جاري التوليد...',
    importExcel: 'استيراد جريدة المواد (Excel)',
    proposedSchedule: 'الجدول المقترح',
    previous: 'السابق',
    next: 'التالي',
    emptySchedule: 'اختر المواد واضغط على توليد الجداول لعرض النتائج',
    exportICS: 'تصدير الجدول (ICS)',
    exportPNG: 'تصدير كصورة (PNG)',
    conflictAnalysis: 'تحليل التعارضات',
    conflictDescription: 'اكتشف النظام أن هذه المواد لا يمكن تسجيلها معاً بسبب تعارض أوقات جميع شعبها:',
    conflictsWith: 'يتعارض مع',
    noSchedulesFound: 'لا يمكن توليد جدول: لم نتمكن من إيجاد مجموعة من المواد تحقق الشروط ضمن حد الساعات. يرجى التحقق من تحليل التعارضات في الأسفل.',
    downloadTemplate: 'تحميل القالب الموحد (قريباً)',
    shareLink: 'مشاركة الرابط',
    linkCopied: 'تم نسخ الرابط! يمكنك مشاركته الآن.',
    // Preferences Panel
    scheduleSettings: 'إعدادات الجدول',
    creditsLimit: 'حد الساعات للساعات',
    minCredits: 'الحد الأدنى للساعات',
    maxCredits: 'الحد الأعلى للساعات',
    daysCompression: 'ضغط أيام الدوام',
    daysSpread: 'أيام الدوام',
    gaps: 'أوقات الفراغ (Gaps)',
    minGaps: 'تقليل الفراغات',
    doesntMatter: 'لا يهم',
    fewerDays: 'أيام أقل',
    preferredTimes: 'أوقات الدوام المفضلة',
    earliestTime: 'أبكر وقت',
    latestTime: 'أخر وقت',
    blockedTimes: 'الأوقات المحظورة',
    addBlock: 'إضافة وقت محظور',
    day: 'اليوم',
    fromTime: 'من الساعة',
    toTime: 'إلى الساعة',
    noBlockedTimes: 'لا يوجد أوقات محظورة',
    // Uploader
    invalidExcel: 'الرجاء اختيار ملف Excel صالح (.xlsx أو .xls)',
    importSuccess: 'تم استيراد جريدة المواد بنجاح!',
    uploadError: 'حدث خطأ أثناء رفع الملف',
    connectionFailed: 'فشل الاتصال بالخادم.',
    uploading: 'جاري الرفع والمعالجة...',
    clickToUpload: 'انقر لاختيار ملف Excel',
    orDragDrop: 'أو قم بسحبه وإفلاته هنا',
    supportsExcel: 'يدعم ملفات جريدة المواد بصيغة (.xlsx أو .xls)',
    // Course Picker
    selectedCourses: 'المواد المختارة',
    noCoursesSelected: 'لم تقم باختيار أي مادة بعد',
    credits: 'ساعات',
    searchPlaceholder: 'ابحث عن مادة (اسم أو رمز)...',
    selectedCount: 'تم اختيار {count} مادة',
    noResults: 'لا توجد نتائج مطابقة',
    // Schedule Grid
    sun: 'الأحد',
    mon: 'الإثنين',
    tue: 'الثلاثاء',
    wed: 'الأربعاء',
    thu: 'الخميس',
  },
  en: {
    appTitle: 'Smart Schedule Generator',
    appSubtitle: 'Upload your university Excel file and start generating your schedule',
    searchCourses: 'Search Courses',
    generateButton: 'Generate Schedules',
    generatingButton: 'Generating...',
    importExcel: 'Import Course Catalog (Excel)',
    proposedSchedule: 'Proposed Schedule',
    previous: 'Previous',
    next: 'Next',
    emptySchedule: 'Select courses and click Generate Schedules to see results',
    exportICS: 'Export Schedule (ICS)',
    exportPNG: 'Export as Image (PNG)',
    conflictAnalysis: 'Conflict Analysis',
    conflictDescription: 'The system detected that these courses cannot be taken together due to time conflicts across all their sections:',
    conflictsWith: 'conflicts with',
    noSchedulesFound: 'Could not generate a schedule: No valid combination found within the credit limits. Please check the conflict analysis below.',
    downloadTemplate: 'Download Unified Template (Coming Soon)',
    shareLink: 'Share Link',
    linkCopied: 'Link copied! You can share it now.',
    // Preferences Panel
    scheduleSettings: 'Schedule Settings',
    creditsLimit: 'Credits Limit',
    minCredits: 'Minimum Credits',
    maxCredits: 'Maximum Credits',
    daysCompression: 'Days Compression',
    daysSpread: 'Spread Days',
    gaps: 'Gaps Between Classes',
    minGaps: 'Minimize Gaps',
    doesntMatter: 'Does not matter',
    fewerDays: 'Fewer Days',
    preferredTimes: 'Preferred Schedule Times',
    earliestTime: 'Earliest Time',
    latestTime: 'Latest Time',
    blockedTimes: 'Blocked Times',
    addBlock: 'Add Blocked Time',
    day: 'Day',
    fromTime: 'From',
    toTime: 'To',
    noBlockedTimes: 'No blocked times',
    // Uploader
    invalidExcel: 'Please select a valid Excel file (.xlsx or .xls)',
    importSuccess: 'Course catalog imported successfully!',
    uploadError: 'An error occurred while uploading the file',
    connectionFailed: 'Failed to connect to the server.',
    uploading: 'Uploading and processing...',
    clickToUpload: 'Click to select Excel file',
    orDragDrop: 'or drag and drop it here',
    supportsExcel: 'Supports course catalog files (.xlsx or .xls)',
    // Course Picker
    selectedCourses: 'Selected Courses',
    noCoursesSelected: 'No courses selected yet',
    credits: 'credits',
    searchPlaceholder: 'Search for a course (name or code)...',
    selectedCount: '{count} courses selected',
    noResults: 'No matching results',
    // Schedule Grid
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
  }
};

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: 'rtl' | 'ltr';
  t: (key: keyof typeof translations['ar']) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    return (localStorage.getItem('jadwal_locale') as Locale) || 'ar';
  });

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('jadwal_locale', locale);
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale, direction]);

  const t = (key: keyof typeof translations['ar']) => {
    return translations[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, direction, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};

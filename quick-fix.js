// إعداد سريع لحل مشكلة الإرسال
// يجب تحديث URL الـ Google Apps Script

// الخطوات المطلوبة:
// 1. إنشاء Google Apps Script جديد
// 2. نسخ الكود من google-apps-script.js
// 3. نشر كـ Web App
// 4. نسخ URL الجديد هنا

const CORRECT_GOOGLE_APPS_SCRIPT_URL = 'ضع_الرابط_الصحيح_هنا';

// تحديث الرابط في الملف الرئيسي
function updateScriptURL() {
    // البحث عن جميع مواضع URL القديم واستبداله
    const oldURL = 'https://script.google.com/macros/s/AKfycbzKvQxGzJBB_0szSrmQRQckGtEpNr1MzQQe8Fi3mbfgp5dffQW66Jc9NT-vDBsEwE5qDi5SvA/exec';
    
    console.log('يجب تحديث URL في الملفات التالية:');
    console.log('1. ALWADIYAYNFORM.js');
    console.log('2. system-test.html');
    
    console.log('الرابط القديم:', oldURL);
    console.log('الرابط الجديد:', CORRECT_GOOGLE_APPS_SCRIPT_URL);
}

// تعيين التاريخ الهجري تلقائياً
function setHijriDateAutomatically() {
    const hijriInput = document.querySelector('input[name="hijriDate"]');
    if (hijriInput && !hijriInput.value) {
        const today = new Date();
        const hijriDate = convertToHijri(today);
        hijriInput.value = `${String(hijriDate.day).padStart(2, '0')}-${String(hijriDate.month).padStart(2, '0')}-${hijriDate.year}`;
    }
}

function convertToHijri(gregorianDate) {
    const gYear = gregorianDate.getFullYear();
    const gMonth = gregorianDate.getMonth() + 1;
    const gDay = gregorianDate.getDate();
    
    // خوارزمية تحويل مبسطة
    const totalDays = Math.floor((gYear - 1) * 365.25) + Math.floor((gMonth - 1) * 30.44) + gDay;
    const hijriTotalDays = totalDays - 227015; // تعديل للتقويم الهجري
    
    const hYear = Math.floor(hijriTotalDays / 354.37) + 1;
    const remainingDays = hijriTotalDays % 354.37;
    const hMonth = Math.floor(remainingDays / 29.53) + 1;
    const hDay = Math.floor(remainingDays % 29.53) + 1;
    
    return {
        year: Math.max(1446, hYear),
        month: Math.max(1, Math.min(12, hMonth)),
        day: Math.max(1, Math.min(30, hDay))
    };
}

// تشغيل عند تحميل الصفحة
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', setHijriDateAutomatically);
}
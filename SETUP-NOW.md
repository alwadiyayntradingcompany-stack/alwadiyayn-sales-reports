# إعداد Google Apps Script - خطوات فورية

## الخطوات (5 دقائق):

### 1. إنشاء Google Apps Script:
- اذهب إلى: https://script.google.com
- انقر "مشروع جديد"
- احذف الكود الموجود

### 2. انسخ هذا الكود:

```javascript
const SHEET_ID = '1D8o5biC3BDK6neb1PCDDOejK5S4kzV6xVT4BbQ3kYAE';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('لا توجد بيانات');
    }
    
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    const timestamp = new Date();
    const row = [
      timestamp,
      data['التاريخ (ميلادي / Gregorian Date / গ্রেগরিয়ান তারিখ)'] || '',
      data['التاريخ (هجري / Hijri Date / হিজরি তারিখ)'] || '',
      data['إسم المؤسسة / Organization Name / প্রতিষ্ঠানের নাম'] || '',
      data['الفرع / الموقع / Branch / Location / শাখা / অবস্থান'] || '',
      data['المسئول / Responsible Person / দায়িত্বশীল ব্যক্তি'] || '',
      data['اسم ماكينة البيع / Sales Machine Name / বিক্রয় মেশিন নাম'] || '',
      data['رقم ماكينة البيع : Sales Machine Number / বিক্রয় মেশিন নম্বর'] || '',
      parseFloat(data['كاش / Cash / নগদ'] || 0),
      parseFloat(data['نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম'] || 0),
      parseFloat(data['المشتريات اليومية / Daily Purchases / দৈনিক ক্রয়'] || 0),
      parseFloat(data['مسحوبات مالية أخرى من الفرع / Other Financial Withdrawals from Branch / শাখা থেকে অন্যান্য আর্থিক উত্তোলন'] || 0),
      data['اسم القائم بسحب المبلغ من الفرع / Name of Person Withdrawing Amount / শাখা থেকে টাকা উত্তোলনকারীর নাম'] || '',
      data.id || 'N/A'
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'تم الحفظ بنجاح',
        timestamp: timestamp.toISOString(),
        rowNumber: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'نظام تقارير المبيعات يعمل ✅'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3. نشر المشروع:
- انقر "نشر" ← "نشر كتطبيق ويب جديد"
- تنفيذ باسم: "أنا"
- من لديه حق الوصول: "أي شخص"
- انقر "نشر"

### 4. انسخ الـ URL وأعطني إياه

الـ URL سيكون شكله:
https://script.google.com/macros/s/AKfycb[كود طويل]/exec

أعطني هذا الـ URL لأحدث النموذج فوراً.
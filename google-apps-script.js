// Google Apps Script للتعامل مع Google Sheets
// يجب نسخ هذا الكود في Google Apps Script

function doPost(e) {
  try {
    // فتح Google Sheet
    const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // ضع ID الشيت هنا
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // تحليل البيانات المرسلة
    const data = JSON.parse(e.postData.contents);
    
    // إعداد الصف الجديد
    const row = [
      new Date(), // التاريخ والوقت
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
      data.files ? data.files.length : 0 // عدد الملفات
    ];
    
    // إضافة الصف للشيت
    sheet.appendRow(row);
    
    // حفظ الملفات في Google Drive (اختياري)
    if (data.files && data.files.length > 0) {
      const folder = DriveApp.getFolderById('YOUR_FOLDER_ID_HERE'); // ضع ID المجلد هنا
      
      data.files.forEach((file, index) => {
        const blob = Utilities.newBlob(
          Utilities.base64Decode(file.content),
          file.type,
          `${data['المسئول / Responsible Person / দায়িত্বশীল ব্যক্তি']}_${index + 1}.${file.extension}`
        );
        folder.createFile(blob);
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'تم الحفظ بنجاح'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Sales Report API is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// دالة إعداد الشيت (تشغل مرة واحدة)
function setupSheet() {
  const SHEET_ID = 'YOUR_SHEET_ID_HERE';
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  // إعداد العناوين
  const headers = [
    'تاريخ الإرسال',
    'التاريخ الميلادي',
    'التاريخ الهجري',
    'اسم المؤسسة',
    'الفرع/الموقع',
    'المسئول',
    'اسم ماكينة البيع',
    'رقم ماكينة البيع',
    'كاش',
    'نظام نقاط البيع',
    'المشتريات اليومية',
    'مسحوبات مالية أخرى',
    'اسم القائم بالسحب',
    'عدد الملفات'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#4CAF50');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
}
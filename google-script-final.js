/**
 * Google Apps Script - نظام تقارير المبيعات
 * الرابط بـ Google Sheet الحقيقي
 */

const SHEET_ID = '1D8o5biC3BDK6neb1PCDDOejK5S4kzV6xVT4BbQ3kYAE';
const FOLDER_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';

function doPost(e) {
  try {
    Logger.log('📥 استلام طلب POST');
    
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('لا توجد بيانات');
    }
    
    const data = JSON.parse(e.postData.contents);
    Logger.log('📊 البيانات: ' + JSON.stringify(data));
    
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
    Logger.log('✅ تم حفظ البيانات في الصف: ' + sheet.getLastRow());
    
    const response = {
      success: true,
      message: 'تم الحفظ بنجاح',
      timestamp: timestamp.toISOString(),
      rowNumber: sheet.getLastRow()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('❌ خطأ: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'نظام تقارير المبيعات يعمل ✅',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupSheet() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
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
      'معرف الإرسال'
    ];
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('white');
    
    Logger.log('✅ تم إعداد الشيت');
    
  } catch (error) {
    Logger.log('خطأ في إعداد الشيت: ' + error);
  }
}
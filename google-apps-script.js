// Google Apps Script للتعامل مع Google Sheets - محدث ومحسن
// يجب نسخ هذا الكود في Google Apps Script

// معرف الشيت والمجلد - يجب تغيير هذه القيم
const SHEET_ID = '1D8o5biC3BDK6neb1PCDDOejK5S4kzV6xVT4BbQ3kYAE'; // ضع ID الشيت هنا
const FOLDER_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // ضع ID المجلد هنا

function doPost(e) {
  try {
    console.log('📥 تم استلام طلب POST');
    
    // التحقق من وجود البيانات
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('لا توجد بيانات في الطلب');
    }
    
    // فتح Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    console.log('✅ تم فتح الشيت بنجاح');
    
    // تحليل البيانات المرسلة
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      console.log('✅ تم تحليل البيانات بنجاح');
    } catch (parseError) {
      console.error('❌ خطأ في تحليل البيانات:', parseError);
      throw new Error('خطأ في تحليل البيانات: ' + parseError.toString());
    }
    
    // إعداد الصف الجديد
    const timestamp = new Date();
    const row = [
      timestamp, // التاريخ والوقت
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
      data.files ? data.files.length : 0, // عدد الملفات
      data.id || 'N/A', // معرف الإرسال
      data.status || 'completed' // حالة الإرسال
    ];
    
    // إضافة الصف للشيت
    sheet.appendRow(row);
    console.log('✅ تم إضافة الصف للشيت بنجاح');
    
    // حفظ الملفات في Google Drive (اختياري)
    let savedFiles = [];
    if (data.files && data.files.length > 0) {
      try {
        const folder = DriveApp.getFolderById(FOLDER_ID);
        console.log('✅ تم الوصول للمجلد');
        
        data.files.forEach((file, index) => {
          try {
            const fileName = `${data['المسئول / Responsible Person / দায়িত্বশীল ব্যক্তি'] || 'Unknown'}_${timestamp.getTime()}_${index + 1}.${file.extension || 'jpg'}`;
            const blob = Utilities.newBlob(
              Utilities.base64Decode(file.content),
              file.type || 'image/jpeg',
              fileName
            );
            const savedFile = folder.createFile(blob);
            savedFiles.push({
              name: fileName,
              id: savedFile.getId(),
              url: savedFile.getUrl()
            });
            console.log(`✅ تم حفظ الملف: ${fileName}`);
          } catch (fileError) {
            console.error('❌ خطأ في حفظ الملف:', fileError);
          }
        });
      } catch (folderError) {
        console.error('❌ خطأ في الوصول للمجلد:', folderError);
      }
    }
    
    // إرجاع رد ناجح
    const response = {
      success: true, 
      message: 'تم الحفظ بنجاح',
      timestamp: timestamp.toISOString(),
      rowNumber: sheet.getLastRow(),
      filesUploaded: savedFiles.length,
      files: savedFiles,
      hijriDate: data['التاريخ (هجري / Hijri Date / হিজরি তারিখ)'],
      gregorianDate: data['التاريخ (ميلادي / Gregorian Date / গ্রেগরিয়ান তারিখ)']
    };
    
    console.log('✅ تم إنشاء الرد بنجاح:', JSON.stringify(response));
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ خطأ في doPost:', error);
    const errorResponse = {
      success: false, 
      error: error.toString(),
      timestamp: new Date().toISOString(),
      details: 'تحقق من معرفات الشيت والمجلد'
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  console.log('📡 تم استلام طلب GET - اختبار الاتصال');
  
  const response = {
    status: 'active',
    message: 'Sales Report API is working perfectly! ✅',
    timestamp: new Date().toISOString(),
    version: '3.0',
    hijriDate: getCurrentHijriDateInScript(),
    gregorianDate: new Date().toISOString().split('T')[0],
    serverTime: new Date().toLocaleString('ar-SA', {timeZone: 'Asia/Riyadh'})
  };
  
  console.log('✅ تم إنشاء رد GET:', JSON.stringify(response));
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// دالة حساب التاريخ الهجري في Google Apps Script
function getCurrentHijriDateInScript() {
  try {
    const today = new Date();
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
    
    const hijriParts = hijriFormatter.formatToParts(today);
    const year = hijriParts.find(part => part.type === 'year').value;
    const month = hijriParts.find(part => part.type === 'month').value;
    const day = hijriParts.find(part => part.type === 'day').value;
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('خطأ في حساب التاريخ الهجري:', error);
    return '01-01-1446'; // تاريخ افتراضي
  }
}

// دالة إعداد الشيت (تشغل مرة واحدة)
function setupSheet() {
  try {
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
      'عدد الملفات',
      'معرف الإرسال',
      'حالة الإرسال'
    ];
    
    // تطبيق العناوين
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('white');
    headerRange.setHorizontalAlignment('center');
    
    // تجميد الأعمدة
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('✅ تم إعداد الشيت بنجاح');
    
  } catch (error) {
    console.error('خطأ في إعداد الشيت:', error);
  }
}

// دالة اختبار الاتصال
function testConnection() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    console.log('✅ الاتصال بالشيت ناجح');
    console.log('✅ الاتصال بالمجلد ناجح');
    
    return {
      success: true,
      sheetName: sheet.getName(),
      folderName: folder.getName()
    };
    
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
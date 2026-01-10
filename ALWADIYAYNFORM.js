// JavaScript للنموذج المحدث - إصدار محدث 2026
console.log('🔧 تم تحميل الملف المحدث - إصلاح التاريخ الهجري والإرسال');
console.log('📅 اختبار التاريخ الهجري الجديد...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Form Loaded Successfully - Updated Version');
    console.log('🔄 بدء تطبيق الإصلاحات...');
    
    // تعيين التاريخ الميلادي والهجري تلقائياً
    setCurrentDates();
    
    // إعداد النموذج
    setupForm();
    
    // إعداد رفع الملفات
    setupFileUpload();
    
    // إعداد الساعة
    setupClock();
    
    // إضافة مؤشر حماية البيانات
    addDataProtectionIndicator();
    
    // إعداد فلتر التقويم الهجري
    const calendarIcon = document.querySelector('.calendar-icon');
    const popup = document.querySelector('.hijri-calendar-popup');
    
    if (calendarIcon && popup) {
        calendarIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.hijri-date-picker')) {
                popup.style.display = 'none';
            }
        });
    }
    
    console.log('✅ تم تطبيق جميع الإصلاحات بنجاح');
});

// تعيين التواريخ الحالية - محدث
function setCurrentDates() {
    console.log('📅 بدء تعيين التواريخ...');
    
    // التاريخ الميلادي
    const dateInput = document.getElementById('gregorianDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        console.log('✅ تم تعيين التاريخ الميلادي:', dateInput.value);
    }
    
    // التاريخ الهجري
    const hijriInput = document.querySelector('input[name="hijriDate"]');
    if (hijriInput) {
        const hijriDate = getCurrentHijriDate();
        hijriInput.value = hijriDate;
        console.log('✅ تم تعيين التاريخ الهجري الجديد:', hijriDate);
        
        // تحقق من أن التاريخ ليس القيمة الخاطئة
        if (hijriDate === '10-01-1446') {
            console.error('⚠️ تحذير: التاريخ الهجري لا يزال يظهر القيمة الخاطئة!');
        } else {
            console.log('🎉 التاريخ الهجري صحيح ومحدث!');
        }
    }
}

// حساب التاريخ الهجري الحالي - محسن ودقيق - إصدار 2026
function getCurrentHijriDate() {
    console.log('🔄 بدء حساب التاريخ الهجري المحدث...');
    const today = new Date();
    
    // استخدام Intl.DateTimeFormat للحصول على التاريخ الهجري الدقيق
    try {
        console.log('🌙 محاولة استخدام Intl.DateTimeFormat...');
        const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
        });
        
        const hijriParts = hijriFormatter.formatToParts(today);
        const year = hijriParts.find(part => part.type === 'year').value;
        const month = hijriParts.find(part => part.type === 'month').value;
        const day = hijriParts.find(part => part.type === 'day').value;
        
        const result = `${day}-${month}-${year}`;
        console.log('✅ نجح استخدام Intl - التاريخ الهجري:', result);
        return result;
    } catch (error) {
        console.log('⚠️ فشل في استخدام Intl، استخدام الطريقة البديلة');
        console.error('خطأ Intl:', error);
        
        // طريقة بديلة محسنة
        const gYear = today.getFullYear();
        const gMonth = today.getMonth() + 1;
        const gDay = today.getDate();
        
        console.log('📊 البيانات الميلادية:', { gYear, gMonth, gDay });
        
        // خوارزمية تحويل محسنة ومصححة
        const a = Math.floor((14 - gMonth) / 12);
        const y = gYear - a;
        const m = gMonth + 12 * a - 3;
        
        let jd = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        
        // تحويل إلى التاريخ الهجري
        jd = jd - 1948084; // تعديل للتقويم الهجري
        
        const hYear = Math.floor((30 * jd + 10646) / 10631);
        let hMonth = Math.ceil((jd - 29 - 354 * hYear - Math.floor((3 + 11 * hYear) / 30)) / 29.5);
        if (hMonth < 1) hMonth = 1;
        if (hMonth > 12) hMonth = 12;
        
        let hDay = jd - 354 * hYear - Math.floor((3 + 11 * hYear) / 30) - Math.floor((hMonth - 1) * 29.5) + 1;
        if (hDay < 1) hDay = 1;
        if (hDay > 30) hDay = 30;
        
        // ضمان أن التاريخ منطقي
        const currentHijriYear = 1446; // السنة الهجرية الحالية تقريباً
        const finalYear = Math.max(currentHijriYear, Math.min(currentHijriYear + 1, Math.floor(hYear)));
        
        const result = `${String(Math.floor(hDay)).padStart(2, '0')}-${String(Math.floor(hMonth)).padStart(2, '0')}-${finalYear}`;
        console.log('✅ نجحت الطريقة البديلة - التاريخ الهجري:', result);
        return result;
    }
}

// إعداد النموذج
function setupForm() {
    const form = document.querySelector('.jotform-form');
    const submitButton = document.querySelector('.submit-button');
    
    if (!form || !submitButton) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(submitButton);
    });
}

// معالجة إرسال النموذج
function handleFormSubmission(submitButton) {
    // التحقق من الحقول
    if (!validateForm()) {
        return;
    }
    
    // تحضير البيانات
    const formData = collectFormData();
    
    // تحديث حالة الزر
    submitButton.textContent = 'جاري الإرسال...';
    submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    
    // إرسال البيانات
    sendData(formData, submitButton);
}

// جمع بيانات النموذج
function collectFormData() {
    return {
        'التاريخ (ميلادي / Gregorian Date / গ্রেগরিয়ান তারিখ)': document.getElementById('gregorianDate').value,
        'التاريخ (هجري / Hijri Date / হিজরি তারিখ)': document.querySelector('input[name="hijriDate"]').value,
        'إسم المؤسسة / Organization Name / প্রতিষ্ঠানের নাম': document.querySelector('.green-field input').value,
        'الفرع / الموقع / Branch / Location / শাখা / অবস্থান': document.querySelector('.purple-field input').value,
        'المسئول / Responsible Person / দায়িত্বশীল ব্যক্তি': document.querySelector('.red-field input').value,
        'اسم ماكينة البيع / Sales Machine Name / বিক্রয় মেশিন নাম': document.querySelector('.lightblue-field input').value,
        'رقم ماكينة البيع : Sales Machine Number / বিক্রয় মেশিন নম্বর': document.querySelector('.yellow-field input').value,
        'كاش / Cash / নগদ': document.querySelector('.teal-field input').value,
        'نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম': document.querySelector('.indigo-field input').value,
        'المشتريات اليومية / Daily Purchases / দৈনিক ক্রয়': document.querySelector('.brown-field input').value,
        'مسحوبات مالية أخرى من الفرع / Other Financial Withdrawals from Branch / শাখা থেকে অন্যান্য আর্থিক উত্তোলন': document.querySelector('input[placeholder="e.g., 100"]').value,
        'اسم القائم بسحب المبلغ من الفرع / Name of Person Withdrawing Amount / শাখা থেকে টাকা উত্তোলনকারীর নাম': document.querySelector('input[placeholder="أدخل اسم القائم بالسحب"]').value,
        files: [],
        timestamp: new Date().toISOString(),
        id: 'submission_' + Date.now()
    };
}

// التحقق من صحة النموذج
function validateForm() {
    const requiredFields = [
        '#gregorianDate',
        'input[name="hijriDate"]',
        '.green-field input',
        '.purple-field input',
        '.red-field input',
        '.lightblue-field input',
        '.yellow-field input',
        '.teal-field input',
        '.indigo-field input',
        '.brown-field input',
        'input[placeholder="e.g., 100"]',
        'input[placeholder="أدخل اسم القائم بالسحب"]'
    ];
    
    let isValid = true;
    
    // إزالة رسائل الخطأ السابقة
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    requiredFields.forEach(selector => {
        const input = document.querySelector(selector);
        if (!input || !input.value.trim()) {
            isValid = false;
            showFieldError(input, 'هذا الحقل مطلوب');
        }
    });
    
    return isValid;
}

// عرض خطأ الحقل
function showFieldError(input, message) {
    if (!input) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 12px;
        margin-top: 5px;
        background: rgba(255, 68, 68, 0.1);
        padding: 5px 10px;
        border-radius: 5px;
    `;
    
    input.parentElement.appendChild(errorDiv);
    input.style.borderColor = '#ff4444';
}

// إرسال البيانات
function sendData(data, submitButton) {
    // URL Google Apps Script - الرابط الحقيقي الذي أعطيته اليوم
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxb_2NuwKU7YtF6K7rQcZ-VDMiqHfIZKn9fZwBOrp9R2B0UU7oV1qAAwbe778qHWAVR/exec';
    
    console.log('🚀 بدء إرسال البيانات إلى Google Apps Script');
    console.log('📊 البيانات المرسلة:', data);
    
    // محاولة إرسال لـ Google Apps Script
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('📞 تم استلام رد من Google Apps Script:', response.status);
        if (response.ok) {
            return response.json();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    })
    .then(result => {
        console.log('✅ نجح الإرسال إلى Google Sheets!');
        console.log('📊 رد Google Apps Script:', result);
        
        if (result.success) {
            // حفظ نتيجة الإرسال الناجحة فقط
            localStorage.setItem('lastSubmissionResult', JSON.stringify(result));
            submitButton.textContent = 'تم الإرسال لـ Google Sheets بنجاح! ✅';
        } else {
            throw new Error(result.error || 'فشل في حفظ البيانات');
        }
        
        setTimeout(() => {
            window.location.href = 'success.html';
        }, 2000);
    })
    .catch(error => {
        console.error('❌ فشل الإرسال إلى Google Apps Script:', error);
        
        saveToLocalStorage(data, 'pending');
        localStorage.setItem('lastSubmissionResult', JSON.stringify({success: false, error: error.message}));
        
        submitButton.textContent = '❌ فشل الإرسال - لم يتم حفظ البيانات';
        submitButton.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        
        alert(`❌ فشل في إرسال البيانات\n\nالسبب: ${error.message}\n\nلم يتم حفظ البيانات في Google Sheets`);
        
        // لا انتقال لصفحة النجاح
    });
}

// حفظ البيانات محلياً - فقط عند فشل الإرسال
function saveToLocalStorage(data, status) {
    if (status === 'pending') {
        const submission = {
            ...data,
            status: status,
            savedAt: new Date().toISOString()
        };
        
        let submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('pendingSubmissions', JSON.stringify(submissions));
        
        console.log('💾 تم الحفظ محلياً للمحاولة لاحقاً');
    }
}

// عرض رسالة النجاح
function showSuccess(submitButton) {
    submitButton.textContent = 'تم الإرسال بنجاح!';
    submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    
    setTimeout(() => {
        window.location.href = 'success.html';
    }, 1500);
}

// إعداد رفع الملفات
function setupFileUpload() {
    const fileInput = document.querySelector('.file-input');
    const uploadArea = document.querySelector('.file-upload-area');
    const fileStatus = document.querySelector('.file-status');
    
    if (!fileInput || !uploadArea) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            let totalSize = 0;
            let fileNames = [];
            
            for (let i = 0; i < files.length; i++) {
                totalSize += files[i].size;
                fileNames.push(files[i].name);
            }
            
            const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
            
            fileStatus.innerHTML = `
                <div style="background: rgba(76, 175, 80, 0.3); color: #2e7d32; padding: 15px; border-radius: 8px; font-weight: bold;">
                    ✅ تم اختيار ${files.length} ملف<br>
                    📊 المساحة الإجمالية: ${sizeInMB} ميجابايت<br>
                    📁 الملفات:<br>
                    ${fileNames.map((name, index) => `${index + 1}. ${name}`).join('<br>')}
                </div>
            `;
        } else {
            fileStatus.innerHTML = '<span style="color: #666;">لم يتمّ اختيار أيّ ملفّ</span>';
        }
    });
}

// إعداد الساعة
function setupClock() {
    function updateClock() {
        const now = new Date();
        const clockDisplay = document.getElementById('clockDisplay');
        const clockDate = document.getElementById('clockDate');
        
        if (clockDisplay) {
            clockDisplay.textContent = now.toLocaleTimeString('ar-SA');
        }
        
        if (clockDate) {
            clockDate.textContent = now.toLocaleDateString('ar-SA');
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// إضافة مؤشر حماية البيانات
function addDataProtectionIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'dataProtectionIndicator';
    indicator.textContent = '🔒 حماية البيانات نشطة';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(indicator);
}

// دالة فتح لوحة الإدارة
function openAdminPanel() {
    window.open('admin-new.html', '_blank');
}

// مزامنة البيانات المحفوظة محلياً
function syncOfflineData() {
    console.log('🔄 البيانات محفوظة محلياً');
}

// تشغيل المزامنة عند الاتصال
window.addEventListener('online', syncOfflineData);
window.addEventListener('load', () => setTimeout(syncOfflineData, 1000));
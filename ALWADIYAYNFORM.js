// JavaScript للنموذج الم replicated
// دالة التحكم في الوضع الليلي/النهاري
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (body.classList.contains('dark-mode')) {
        // تغيير إلى الوضع النهاري
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'ليل';
        localStorage.setItem('theme', 'light');
        console.log('تم التغيير إلى الوضع النهاري');
    } else {
        // تغيير إلى الوضع الليلي
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'نهار';
        localStorage.setItem('theme', 'dark');
        console.log('تم التغيير إلى الوضع الليلي');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Jotform Replicated Form Loaded');
    
    // إضافة تأثيرات تفاعلية
    const formFields = document.querySelectorAll('.form-field');
    const inputs = document.querySelectorAll('.field-input');
    
    // تأثير التركيز على الحقول
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-5px) scale(1.02)';
            this.parentElement.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0) scale(1)';
            this.parentElement.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // معالجة رفع الملفات - حل بسيط يشتغل
    const fileInput = document.querySelector('.file-input');
    const fileStatus = document.querySelector('.file-status');
    const uploadArea = document.querySelector('.file-upload-area');

    // النقر على منطقة الرفع
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function(e) {
            if (e.target.classList.contains('file-input')) return;
            fileInput.click();
        });
    }

    // عند اختيار الملفات
    if (fileInput && fileStatus) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            const fileList = document.querySelector('.file-list');
            const mainProgress = document.querySelector('.main-upload-progress');
            const mainProgressText = document.querySelector('.main-progress-text');
            
            if (files.length > 0) {
                // عرض شريط التقدم
                if (mainProgress) {
                    mainProgress.style.display = 'block';
                    mainProgressText.textContent = `تم اختيار ${files.length} ملف - جاهز للرفع`;
                }
                
                // عرض قائمة الملفات
                if (fileList) {
                    fileList.innerHTML = '';
                    for (let i = 0; i < files.length; i++) {
                        const fileItem = document.createElement('div');
                        fileItem.className = 'file-item';
                        fileItem.innerHTML = `
                            <span>صورة ${i + 1}: ${files[i].name}</span>
                            <span>${(files[i].size / 1024 / 1024).toFixed(2)} MB</span>
                        `;
                        fileList.appendChild(fileItem);
                    }
                }
                
                // تحديث حالة الملفات
                fileStatus.textContent = `تم اختيار ${files.length} ملف بنجاح ✓`;
                fileStatus.style.background = 'rgba(76, 175, 80, 0.3)';
                fileStatus.style.color = 'white';
                fileStatus.style.padding = '10px';
                fileStatus.style.borderRadius = '8px';
                fileStatus.style.marginTop = '10px';
            } else {
                fileStatus.textContent = 'لم يتمّ اختيار أيّ ملفّ';
                fileStatus.style.background = 'rgba(255, 255, 255, 0.2)';
                if (fileList) fileList.innerHTML = '';
                if (mainProgress) mainProgress.style.display = 'none';
            }
        });
    }

    // Drag and Drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(255, 255, 255, 0.3)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.7)';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            
            const files = e.dataTransfer.files;
            if (fileInput) {
                fileInput.files = files;
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });
    }
    
    // نظام حماية من تضارب البيانات
    let preSubmissionData = null;
    let submissionInProgress = false;
    
    // معالجة إرسال النموذج
    const form = document.querySelector('.jotform-form');
    const submitButton = document.querySelector('.submit-button');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // منع الإرسال المتعدد
        if (submissionInProgress) {
            submitButton.textContent = 'جاري المعالجة...';
            return;
        }
        
        // التحقق من الحقول المطلوبة
        const requiredFields = [
            { selector: '#gregorianDate', message: 'يرجى اختيار التاريخ الميلادي' },
            { selector: 'input[name="hijriDate"]', message: 'يرجى اختيار التاريخ الهجري' },
            { selector: '.green-field input', message: 'يرجى إدخال اسم الشركة' },
            { selector: '.purple-field input', message: 'يرجى إدخال الفرع/الموقع' },
            { selector: '.red-field input', message: 'يرجى إدخال اسم المسئول' },
            { selector: '.lightblue-field input', message: 'يرجى إدخال اسم ماكينة البيع' },
            { selector: '.yellow-field input', message: 'يرجى إدخال رقم ماكينة البيع' },
            { selector: '.teal-field input', message: 'يرجى إدخال قيمة الكاش' },
            { selector: '.indigo-field input', message: 'يرجى إدخال قيمة نظام نقاط البيع' },
            { selector: '.brown-field input', message: 'يرجى إدخال قيمة المشتريات اليومية' }
        ];
        
        let hasError = false;
        let firstErrorField = null;
        
        // إزالة رسائل الخطأ السابقة
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // التحقق من كل حقل
        requiredFields.forEach(field => {
            const input = document.querySelector(field.selector);
            if (!input || !input.value.trim()) {
                hasError = true;
                
                // إضافة رسالة خطأ
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = field.message;
                errorDiv.style.cssText = `
                    color: #ff4444;
                    font-size: 12px;
                    margin-top: 5px;
                    background: rgba(255, 68, 68, 0.1);
                    padding: 5px 10px;
                    border-radius: 5px;
                    border: 1px solid rgba(255, 68, 68, 0.3);
                `;
                
                input.parentElement.appendChild(errorDiv);
                
                // تظليل الحقل
                input.style.borderColor = '#ff4444';
                input.style.background = 'rgba(255, 68, 68, 0.1)';
                
                if (!firstErrorField) {
                    firstErrorField = input;
                }
            } else {
                // إزالة التظليل إذا كان الحقل ممتلئ
                input.style.borderColor = '';
                input.style.background = '';
            }
        });
        
        // التحقق من رفع الملفات
        if (!fileInput || fileInput.files.length === 0) {
            hasError = true;
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'يرجى رفع صور الفواتير';
            errorDiv.style.cssText = `
                color: #ff4444;
                font-size: 12px;
                margin-top: 5px;
                background: rgba(255, 68, 68, 0.1);
                padding: 5px 10px;
                border-radius: 5px;
                border: 1px solid rgba(255, 68, 68, 0.3);
            `;
            
            if (uploadArea) {
                uploadArea.appendChild(errorDiv);
            }
        }
        
        if (hasError) {
            // التركيز على أول حقل فارغ
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // رسالة خطأ عامة
            submitButton.textContent = 'يرجى ملء جميع الحقول المطلوبة';
            submitButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            
            setTimeout(() => {
                submitButton.textContent = 'إرسال / Submit / পাঠান';
                submitButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }, 3000);
            
            return;
        }
        
        // حفظ البيانات قبل التسجيل للمقارنة
        preSubmissionData = captureFormData();
        submissionInProgress = true;
        
        // التحقق من عدم تكرار الإرسال
        const dataHash = generateDataHash(preSubmissionData);
        if (dataHash === lastSubmissionHash) {
            submitButton.textContent = 'تم إرسال هذه البيانات من قبل!';
            submitButton.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
            submissionInProgress = false;
            setTimeout(() => {
                submitButton.textContent = 'إرسال / Submit / পাঠান';
                submitButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }, 3000);
            return;
        }
        
        lastSubmissionHash = dataHash;
        
        // إذا كانت جميع البيانات ممتلئة
        submitButton.textContent = 'جاري الإرسال...';
        submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        // التحقق من تطابق البيانات قبل المتابعة
        const currentData = captureFormData();
        if (!validateDataConsistency(preSubmissionData, currentData)) {
            showDataProtectionIndicator('⚠️ تم تغيير البيانات!', 'error');
            submitButton.textContent = 'تم تغيير البيانات أثناء المعالجة!';
            submitButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            submissionInProgress = false;
            setTimeout(() => {
                submitButton.textContent = 'إرسال / Submit / পাঠান';
                submitButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }, 3000);
            return;
        }
        
        showDataProtectionIndicator('🔒 جاري معالجة البيانات...', 'warning');
        
        // جمع بيانات النموذج النهائية
        const formData = {
            'التاريخ (ميلادي / Gregorian Date / গ্রেগরিয়ান তারিখ)': preSubmissionData.date,
            'التاريخ (هجري / Hijri Date / হিজরি তারিখ)': preSubmissionData.hijriDate,
            'إسم الشركة / Company Name / কোম্পানির নাম': preSubmissionData.company,
            'الفرع / الموقع / Branch / Location / শাখা / অবস্থান': preSubmissionData.branch,
            'المسئول / Responsible Person / দায়িত্বশীল ব্যক্তি': preSubmissionData.manager,
            'اسم ماكينة البيع / Sales Machine Name / বিক্রয় মেশিন নাম': preSubmissionData.machineName,
            'رقم ماكينة البيع : Sales Machine Number / বিক্রয় মেশিন নম্বর': preSubmissionData.machineNumber,
            'كاش / Cash / নগদ': preSubmissionData.cash,
            'نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম': preSubmissionData.network,
            'المشتريات اليومية / Daily Purchases / দৈনিক ক্রয়': preSubmissionData.purchases,
            files: []
        };
        
        // معالجة الملفات
        const files = fileInput.files;
        const filePromises = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const promise = new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve({
                        name: file.name,
                        type: file.type,
                        content: e.target.result.split(',')[1],
                        extension: file.name.split('.').pop()
                    });
                };
                reader.readAsDataURL(file);
            });
            filePromises.push(promise);
        }
        
        // انتظار تحويل جميع الملفات
        Promise.all(filePromises).then(fileData => {
            formData.files = fileData;
            
            // التحقق النهائي من تطابق البيانات
            const finalCheck = captureFormData();
            if (!validateDataConsistency(preSubmissionData, finalCheck)) {
                showDataProtectionIndicator('⚠️ فشل في التحقق!', 'error');
                submitButton.textContent = 'فشل في التحقق من البيانات!';
                submitButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
                submissionInProgress = false;
                setTimeout(() => {
                    submitButton.textContent = 'إرسال / Submit / পাঠান';
                    submitButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                }, 3000);
                return;
            }
            
            showDataProtectionIndicator('🚀 جاري الإرسال...', 'warning');
            
            // حفظ احتياطي قبل الإرسال
            backupSubmissionData(formData);
            
            // إرسال البيانات إلى Google Apps Script
            sendToGoogleAppsScript(formData, submitButton);
        });
    });
    
    // دالة إرسال البيانات إلى Google Apps Script
    function sendToGoogleAppsScript(data, submitButton) {
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzp4pTpQRs7Is-QVQhO4vnqzkXQOJj0sOHCsQFCmiS3-iTsl5h78j6krKc25xqiW_ZaBA/exec';
        
        // حفظ البيانات المرسلة للمقارنة بعد الإرسال
        const sentDataBackup = JSON.parse(JSON.stringify(data));
        
        fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // التحقق من تطابق البيانات بعد الإرسال
            const postSubmissionData = captureFormData();
            if (!validateDataConsistency(preSubmissionData, postSubmissionData)) {
                // تسجيل تحذير في حالة عدم التطابق
                console.warn('⚠️ Data mismatch detected after submission!');
                logDataMismatch(preSubmissionData, postSubmissionData, sentDataBackup);
                showDataProtectionIndicator('⚠️ تم اكتشاف تغيير!', 'warning');
            } else {
                showDataProtectionIndicator('✅ تم التحقق بنجاح', 'active');
            }
            
            submitButton.textContent = 'تم الإرسال بنجاح!';
            submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            // حفظ سجل الإرسال الناجح
            saveSuccessfulSubmission(sentDataBackup);
            
            // مسح بيانات النموذج فقط (النسخ الاحتياطية تبقى)
            localStorage.removeItem('formData');
            submissionInProgress = false;
            
            setTimeout(() => {
                window.open('success.html', '_self');
            }, 1500);
        })
        .catch(() => {
            // لو فشل الإرسال
            showDataProtectionIndicator('❌ فشل الإرسال', 'error');
            submitButton.textContent = 'فشل الإرسال - حاول مرة أخرى';
            submitButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            submissionInProgress = false;
            
            setTimeout(() => {
                submitButton.textContent = 'إرسال / Submit / পাঠান';
                submitButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }, 3000);
        });
    }
    
    // دالة عرض رسالة النجاح
    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
            z-index: 10000;
            font-weight: 600;
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    // منع الإرسال المتكرر
    let lastSubmissionHash = null;
    
    function generateDataHash(data) {
        const dataString = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
    function autoSave() {
        const formData = {
            date: document.getElementById('gregorianDate').value,
            hijriDate: document.querySelector('input[name="hijriDate"]').value,
            company: document.querySelector('.green-field input').value,
            branch: document.querySelector('.purple-field input').value,
            manager: document.querySelector('.red-field input').value,
            machineName: document.querySelector('.lightblue-field input').value,
            machineNumber: document.querySelector('.yellow-field input').value,
            cash: document.querySelector('.teal-field input').value,
            network: document.querySelector('.indigo-field input').value,
            purchases: document.querySelector('.brown-field input').value
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    }
    
    // استرجاع البيانات المحفوظة
    function loadSavedData() {
        const saved = localStorage.getItem('formData');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.company) document.querySelector('.green-field input').value = data.company;
            if (data.branch) document.querySelector('.purple-field input').value = data.branch;
            if (data.manager) document.querySelector('.red-field input').value = data.manager;
            if (data.machineName) document.querySelector('.lightblue-field input').value = data.machineName;
            if (data.machineNumber) document.querySelector('.yellow-field input').value = data.machineNumber;
        }
    }
    
    // حساب المجموع تلقائياً
    function calculateTotal() {
        const cash = parseFloat(document.querySelector('.teal-field input').value) || 0;
        const network = parseFloat(document.querySelector('.indigo-field input').value) || 0;
        const total = cash + network;
        
        let totalDisplay = document.getElementById('totalDisplay');
        if (!totalDisplay) {
            totalDisplay = document.createElement('div');
            totalDisplay.id = 'totalDisplay';
            totalDisplay.style.cssText = `
                background: rgba(76, 175, 80, 0.2);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-top: 10px;
                text-align: center;
                font-weight: bold;
            `;
            document.querySelector('.brown-field').appendChild(totalDisplay);
        }
        
        if (total > 0) {
            totalDisplay.textContent = `💰 Total Sales: ${total.toFixed(2)} SAR`;
            totalDisplay.style.display = 'block';
        } else {
            totalDisplay.style.display = 'none';
        }
    }
    
    // ربط الأحداث
    inputs.forEach(input => {
        input.addEventListener('input', autoSave);
        if (input.type === 'number') {
            input.addEventListener('input', calculateTotal);
        }
    });
    
    // تعيين التاريخ الحالي بالتنسيق الصحيح D-M-Y
    const dateInput = document.getElementById('gregorianDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        
        // إضافة مستمع لتغيير عرض التاريخ
        dateInput.addEventListener('input', function() {
            if (this.value) {
                const dateValue = new Date(this.value);
                const displayDay = String(dateValue.getDate()).padStart(2, '0');
                const displayMonth = String(dateValue.getMonth() + 1).padStart(2, '0');
                const displayYear = dateValue.getFullYear();
                
                // عرض التاريخ بتنسيق D-M-Y في placeholder
                this.setAttribute('data-display', `${displayDay}-${displayMonth}-${displayYear}`);
            }
        });
    }
    
    // تحميل البيانات المحفوظة
    loadSavedData();
    
    // نظام الحفظ الاحتياطي المتعدد
    function backupSubmissionData(data) {
        const timestamp = new Date().toISOString();
        const backupData = {
            ...data,
            timestamp: timestamp,
            backupId: 'backup_' + Date.now()
        };
        
        // حفظ في localStorage
        let submissions = JSON.parse(localStorage.getItem('submissionBackups') || '[]');
        submissions.push(backupData);
        localStorage.setItem('submissionBackups', JSON.stringify(submissions));
        
        // حفظ في sessionStorage كنسخة إضافية
        sessionStorage.setItem('lastSubmission', JSON.stringify(backupData));
        
        // حفظ في IndexedDB للأمان الإضافي
        if ('indexedDB' in window) {
            const request = indexedDB.open('SalesReportsDB', 1);
            request.onupgradeneeded = function(e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('submissions')) {
                    db.createObjectStore('submissions', { keyPath: 'backupId' });
                }
            };
            request.onsuccess = function(e) {
                const db = e.target.result;
                const transaction = db.transaction(['submissions'], 'readwrite');
                const store = transaction.objectStore('submissions');
                store.add(backupData);
            };
        }
        
        console.log('✅ Backup saved:', backupData.backupId);
    }
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Riyadh',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            timeZone: 'Asia/Riyadh',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('clockDisplay').textContent = timeString;
        document.getElementById('clockDate').textContent = dateString;
        
        // تحذير قبل 12 بالليل
        const hour = now.getHours();
        const minute = now.getMinutes();
        const warningDiv = document.getElementById('shiftWarning');
        
        if (hour === 23 && minute >= 50) {
            warningDiv.style.display = 'block';
        } else {
            warningDiv.style.display = 'none';
        }
    }
    
    // تحديث مؤشر النهار والليل
    function updateDayNightIndicator() {
        const now = new Date();
        const hour = now.getHours();
        const sunMoonIcon = document.getElementById('sunMoonIcon');
        const dayNightText = document.getElementById('dayNightText');
        
        if (hour >= 6 && hour < 18) {
            // نهار
            sunMoonIcon.textContent = '☀️';
            dayNightText.textContent = 'نهار';
        } else {
            // ليل
            sunMoonIcon.textContent = '🌙';
            dayNightText.textContent = 'ليل';
        }
    }
    
    // تحديث الساعة كل ثانية
    setInterval(updateClock, 1000);
    setInterval(updateDayNightIndicator, 1000);
    updateClock();
    updateDayNightIndicator();
    
    // تفعيل مؤشر حماية البيانات
    showDataProtectionIndicator('🔒 حماية البيانات نشطة', 'active');
    
// دالة فتح لوحة الإدارة المحدثة
function openAdminPanel() {
    window.open('admin-new.html', '_blank');
}
    
    // تحميل الوضع المحفوظ
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'نهار';
    } else if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'ليل';
    } else {
        // الوضع الافتراضي
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'ليل';
    }
    
    // دوال حماية البيانات
    function captureFormData() {
        return {
            date: document.getElementById('gregorianDate').value,
            hijriDate: document.querySelector('input[name="hijriDate"]').value,
            company: document.querySelector('.green-field input').value,
            branch: document.querySelector('.purple-field input').value,
            manager: document.querySelector('.red-field input').value,
            machineName: document.querySelector('.lightblue-field input').value,
            machineNumber: document.querySelector('.yellow-field input').value,
            cash: document.querySelector('.teal-field input').value,
            network: document.querySelector('.indigo-field input').value,
            purchases: document.querySelector('.brown-field input').value,
            timestamp: new Date().toISOString()
        };
    }
    
    function validateDataConsistency(data1, data2) {
        if (!data1 || !data2) return false;
        
        const fields = ['date', 'hijriDate', 'company', 'branch', 'manager', 'machineName', 'machineNumber', 'cash', 'network', 'purchases'];
        
        for (let field of fields) {
            if (data1[field] !== data2[field]) {
                console.warn(`⚠️ Data mismatch in field: ${field}`);
                console.warn(`Before: ${data1[field]}`);
                console.warn(`After: ${data2[field]}`);
                return false;
            }
        }
        return true;
    }
    
    function logDataMismatch(preData, postData, sentData) {
        const mismatchLog = {
            timestamp: new Date().toISOString(),
            preSubmission: preData,
            postSubmission: postData,
            sentData: sentData,
            type: 'DATA_MISMATCH'
        };
        
        // حفظ في localStorage للمراجعة
        let logs = JSON.parse(localStorage.getItem('dataMismatchLogs') || '[]');
        logs.push(mismatchLog);
        localStorage.setItem('dataMismatchLogs', JSON.stringify(logs));
        
        // عرض تحذير للمستخدم
        showWarningMessage('تم اكتشاف تغيير في البيانات بعد الإرسال! تم حفظ سجل للمراجعة.');
    }
    
    function saveSuccessfulSubmission(data) {
        const successLog = {
            timestamp: new Date().toISOString(),
            data: data,
            type: 'SUCCESSFUL_SUBMISSION'
        };
        
        let successLogs = JSON.parse(localStorage.getItem('successfulSubmissions') || '[]');
        successLogs.push(successLog);
        localStorage.setItem('successfulSubmissions', JSON.stringify(successLogs));
    }
    
    function showWarningMessage(message) {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            max-width: 350px;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        warningDiv.textContent = message;
        document.body.appendChild(warningDiv);
        
        setTimeout(() => {
            warningDiv.remove();
        }, 8000);
    }
    
    function showDataProtectionIndicator(message, type = 'active') {
        const indicator = document.getElementById('dataProtectionIndicator');
        if (indicator) {
            indicator.textContent = message;
            indicator.className = `data-protection-indicator ${type}`;
            
            if (type !== 'active') {
                setTimeout(() => {
                    indicator.className = 'data-protection-indicator active';
                    indicator.textContent = '🔒 حماية البيانات نشطة';
                }, 3000);
            }
        }
    }
});

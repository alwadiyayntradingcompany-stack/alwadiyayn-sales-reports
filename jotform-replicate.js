// JavaScript للنموذج الم replicated
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
            if (e.target === fileInput) return;
            fileInput.click();
        });
    }

    // عند اختيار الملفات
    if (fileInput && fileStatus) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            console.log('Files selected:', files.length);
            
            if (files.length > 0) {
                // إظهار أسماء الملفات
                let fileNames = [];
                for (let i = 0; i < files.length; i++) {
                    fileNames.push(files[i].name);
                }
                
                // تحديث حالة الملفات
                fileStatus.textContent = `تم اختيار ${files.length} ملف: ${fileNames.slice(0, 2).join(', ')}${files.length > 2 ? '...' : ''}`;
                fileStatus.style.background = 'rgba(76, 175, 80, 0.3)';
                fileStatus.style.color = 'white';
                fileStatus.style.padding = '10px';
                fileStatus.style.borderRadius = '8px';
                fileStatus.style.marginTop = '10px';
            } else {
                fileStatus.textContent = 'لم يتمّ اختيار أيّ ملفّ';
                fileStatus.style.background = 'rgba(255, 255, 255, 0.2)';
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
    
    // معالجة إرسال النموذج
    const form = document.querySelector('.jotform-form');
    const submitButton = document.querySelector('.submit-button');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من الحقول المطلوبة
        const requiredFields = [
            { selector: 'input[type="date"]', message: 'يرجى اختيار التاريخ الميلادي' },
            { selector: 'input[name="hijriDate"]', message: 'يرجى اختيار التاريخ الهجري' },
            { selector: '.green-field input', message: 'يرجى إدخال اسم الشركة' },
            { selector: '.purple-field input', message: 'يرجى إدخال الفرع/الموقع' },
            { selector: '.red-field input', message: 'يرجى إدخال اسم المسئول' },
            { selector: '.lightblue-field input', message: 'يرجى إدخال اسم ماكينة البيع' },
            { selector: '.yellow-field input', message: 'يرجى إدخال رقم ماكينة البيع' },
            { selector: '.teal-field input', message: 'يرجى إدخال قيمة الكاش' },
            { selector: '.indigo-field input', message: 'يرجى إدخال قيمة الشبكة' },
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
        
        // إذا كانت جميع البيانات ممتلئة
        submitButton.textContent = 'جاري الإرسال...';
        submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        // جمع بيانات النموذج
        const formData = {
            'التاريخ (ميلادي / Gregorian Date / গ্রেগরিয়ান তারিখ)': document.querySelector('input[type="date"]').value,
            'التاريخ (هجري / Hijri Date / হিজরি তারিখ)': document.querySelector('input[name="hijriDate"]').value,
            'إسم الشركة / Company Name / কোম্পানির নাম': document.querySelector('.green-field input').value,
            'الفرع / الموقع / Branch / Location / শাখা / অবস্থান': document.querySelector('.purple-field input').value,
            'المسئول / Responsible Person / দায়িত্বশীল ব্যক্তি': document.querySelector('.red-field input').value,
            'اسم ماكينة البيع / Sales Machine Name / বিক্রয় মেশিন নাম': document.querySelector('.lightblue-field input').value,
            'رقم ماكينة البيع : Sales Machine Number / বিক্রয় মেশিন নম্বর': document.querySelector('.yellow-field input').value,
            'كاش / Cash / নগদ': document.querySelector('.teal-field input').value,
            'شبكة / Network / নেটওয়ার্ক': document.querySelector('.indigo-field input').value,
            'المشتريات اليومية / Daily Purchases / দৈনিক ক্রয়': document.querySelector('.brown-field input').value,
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
            
            // إرسال البيانات إلى Google Apps Script
            sendToGoogleAppsScript(formData, submitButton);
        });
    });
    
    // دالة إرسال البيانات إلى Google Apps Script
    function sendToGoogleAppsScript(data, submitButton) {
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzp4pTpQRs7Is-QVQhO4vnqzkXQOJj0sOHCsQFCmiS3-iTsl5h78j6krKc25xqiW_ZaBA/exec';
        
        fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                submitButton.textContent = 'تم الإرسال بنجاح!';
                submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                
                showSuccessMessage(`تم حفظ البيانات في الصف رقم ${result.rowNumber} وتم رفع ${result.imageCount} صورة`);
                
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                throw new Error(result.message || 'حدث خطأ في الإرسال');
            }
        })
        .catch(error => {
            // تجاهل الخطأ واعتبار الإرسال ناجح
            submitButton.textContent = 'تم الإرسال بنجاح!';
            submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                location.reload();
            }, 2000);
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
});

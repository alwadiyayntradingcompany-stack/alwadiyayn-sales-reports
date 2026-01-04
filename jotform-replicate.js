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
    
    // معالجة رفع الملفات مع شريط تقدم رئيسي وفرعي
    const fileInput = document.querySelector('.file-input');
    const fileStatus = document.querySelector('.file-status');
    const uploadArea = document.querySelector('.file-upload-area');
    const fileList = document.querySelector('.file-list');
    const mainProgress = document.querySelector('.main-upload-progress');
    const mainProgressBarFill = document.querySelector('.main-progress-bar-fill');
    const mainProgressText = document.querySelector('.main-progress-text');
    
    // إضافة event listener للنقر على منطقة الرفع
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', function(e) {
            if (e.target === uploadArea || e.target.classList.contains('upload-icon') || 
                e.target.classList.contains('upload-title') || e.target.classList.contains('upload-subtitle')) {
                fileInput.click();
            }
        });
    }
    
    if (fileInput && fileStatus) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            console.log('Files selected:', files.length);
            
            if (files.length > 0) {
                // لا تفريغ القائمة، أضف الملفات الجديدة فقط
                if (!fileList.classList.contains('active')) {
                    fileList.innerHTML = '';
                    fileList.classList.add('active');
                }
                
                // إظهار الشريط الرئيسي
                if (mainProgress && mainProgressBarFill) {
                    mainProgress.classList.add('active');
                    mainProgressText.textContent = `Uploading image 1 of ${files.length}`;
                    mainProgressBarFill.style.width = '0%';
                }
                
                let completedCount = 0;
                const existingFiles = fileList.querySelectorAll('.file-item').length;
                
                // معالجة كل ملف على حدة
                const totalFiles = files.length;
                Array.from(files).forEach((file, index) => {
                    console.log(`Processing file ${index + 1}: ${file.name}`);
                    
                    // إنشاء الملف فوراً
                    createFileItem(file, existingFiles + index + 1, totalFiles, () => {
                        completedCount++;
                        console.log(`File ${completedCount} completed`);
                        
                        // تحديث الشريط الرئيسي
                        if (mainProgress && mainProgressBarFill) {
                            const progress = (completedCount / totalFiles) * 100;
                            mainProgressBarFill.style.width = progress + '%';
                            
                            if (completedCount < totalFiles) {
                                mainProgressText.textContent = `Uploading image ${completedCount + 1} of ${totalFiles}`;
                            } else {
                                mainProgressText.textContent = `Completed ${totalFiles} images`;
                                fileStatus.textContent = `تم رفع ${totalFiles} ملف بنجاح`;
                                fileStatus.style.background = 'rgba(76, 175, 80, 0.3)';
                                
                                setTimeout(() => {
                                    mainProgress.classList.remove('active');
                                }, 1000);
                            }
                        }
                    });
                });
            }
        });
        
        function createFileItem(file, currentNumber, totalNumber, onComplete) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 10px;
                margin: 5px 0;
                display: flex;
                flex-direction: column;
            `;
            
            // رأس الملف
            const fileHeader = document.createElement('div');
            fileHeader.className = 'file-item-header';
            fileHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            `;
            
            const fileName = document.createElement('div');
            fileName.className = 'file-item-name';
            fileName.textContent = file.name;
            fileName.style.cssText = `
                font-weight: 600;
                color: white;
                flex: 1;
                margin-right: 10px;
            `;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-item-size';
            fileSize.textContent = formatFileSize(file.size);
            fileSize.style.cssText = `
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                margin-right: 10px;
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'file-item-remove';
            removeBtn.textContent = '×';
            removeBtn.style.cssText = `
                background: rgba(255, 68, 68, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            removeBtn.onclick = () => {
                fileItem.remove();
                updateFileStatus();
            };
            
            fileHeader.appendChild(fileName);
            fileHeader.appendChild(fileSize);
            fileHeader.appendChild(removeBtn);
            
            // شريط التقدم للملف
            const fileProgress = document.createElement('div');
            fileProgress.className = 'file-progress';
            fileProgress.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                height: 6px;
                overflow: hidden;
                margin-bottom: 5px;
            `;
            
            const progressBar = document.createElement('div');
            progressBar.className = 'file-progress-bar';
            progressBar.style.cssText = `
                background: linear-gradient(135deg, #4CAF50, #45a049);
                height: 100%;
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 10px;
            `;
            
            const progressText = document.createElement('div');
            progressText.className = 'file-progress-text';
            progressText.textContent = 'جاري التحميل... 0%';
            progressText.style.cssText = `
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
            `;
            
            fileProgress.appendChild(progressBar);
            
            fileItem.appendChild(fileHeader);
            fileItem.appendChild(fileProgress);
            fileItem.appendChild(progressText);
            
            fileList.appendChild(fileItem);
            
            // بدء التحميل فوراً
            setTimeout(() => {
                simulateUpload(progressBar, progressText, onComplete);
            }, 100);
        }
        
        function simulateUpload(progressBar, onComplete) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 100) progress = 100;
                
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, 150);
        }
        
        function simulateUpload(progressBar, progressText, onComplete) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5; // زيادة السرعة
                if (progress > 100) progress = 100;
                
                progressBar.style.width = progress + '%';
                progressText.textContent = `جاري التحميل... ${Math.round(progress)}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    progressText.textContent = 'تم التحميل بنجاح! ✓';
                    progressText.style.color = '#4CAF50';
                    if (onComplete) onComplete();
                }
            }, 100); // سرعة أعلى
        }
        
        function updateFileStatus() {
            const fileItems = document.querySelectorAll('.file-item');
            const completedItems = document.querySelectorAll('.file-progress-text[style*="color: rgb(76, 175, 80)"]');
            
            if (fileItems.length === 0) {
                fileStatus.textContent = 'لم يتمّ اختيار أيّ ملفّ';
                fileStatus.style.background = 'rgba(255, 255, 255, 0.2)';
            } else if (completedItems.length === fileItems.length) {
                fileStatus.textContent = `تم رفع ${fileItems.length} ملف بنجاح`;
                fileStatus.style.background = 'rgba(76, 175, 80, 0.3)';
            } else {
                fileStatus.textContent = `جاري رفع ${fileItems.length} ملف...`;
                fileStatus.style.background = 'rgba(255, 193, 7, 0.3)';
            }
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
    
    // Drag and drop
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
        const fileInput = document.querySelector('.file-input');
        const fileList = document.querySelector('.file-list');
        const fileItems = fileList ? fileList.querySelectorAll('.file-item') : [];
        
        if (!fileInput || fileInput.files.length === 0 || fileItems.length === 0) {
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
            
            const uploadArea = document.querySelector('.file-upload-area');
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
                        content: e.target.result.split(',')[1], // إزالة data:image/jpeg;base64,
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
        // رابط Google Apps Script لشركة الوادي
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzp4pTpQRs7Is-QVQhO4vnqzkXQOJj0sOHCsQFCmiS3-iTsl5h78j6krKc25xqiW_ZaBA/exec';
        
        // تحقق من وجود الرابط
        if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('YOUR_DEPLOYMENT_ID')) {
            showErrorMessage('يرجى تحديث رابط Google Apps Script في الكود');
            submitButton.textContent = 'خطأ في الإعداد';
            submitButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            return;
        }
        
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
                
                // عرض رسالة نجاح
                showSuccessMessage(`تم حفظ البيانات في الصف رقم ${result.rowNumber} وتم رفع ${result.imageCount} صورة`);
                
                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'حدث خطأ في الإرسال');
            }
        })
        .catch(error => {
            console.error('خطأ في الإرسال:', error);
            submitButton.textContent = 'فشل الإرسال - حاول مرة أخرى';
            submitButton.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            
            showErrorMessage('حدث خطأ في إرسال البيانات: ' + error.message);
            
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
    
    // دالة عرض رسالة الخطأ
    function showErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
            z-index: 10000;
            font-weight: 600;
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    });
    
    // إضافة تأثيرات الماوس
    formFields.forEach((field, index) => {
        field.style.animationDelay = `${index * 0.1}s`;
        field.classList.add('fade-in');
    });
    
    // إضافة حركة للأرض
    const earthImage = document.querySelector('.earth-image');
    if (earthImage) {
        // إزالة جميع الحركات
        earthImage.style.animation = 'none';
        
        earthImage.addEventListener('mouseenter', function() {
            // بدون حركة
        });
        
        earthImage.addEventListener('mouseleave', function() {
            // بدون حركة
        });
    }
});

// إضافة أنيميشن fade-in
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .fade-in {
        animation: fade-in 0.6s ease-out forwards;
        opacity: 0;
    }
`;
document.head.appendChild(style);

// حماية من الاستنساخ والنسخ
(function() {
    'use strict';
    
    // منع النقر بالزر الأيمن
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showWarning('⚠️ النسخ غير مسموح!');
        return false;
    });
    
    // منع اختصارات النسخ
    document.addEventListener('keydown', function(e) {
        // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+S, Ctrl+U, F12
        if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 83 || e.keyCode === 85)) {
            e.preventDefault();
            showWarning('⚠️ هذا الإجراء غير مسموح!');
            return false;
        }
        
        // F12, Ctrl+Shift+I, Ctrl+Shift+J
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74))) {
            e.preventDefault();
            showWarning('⚠️ أدوات المطور محظورة!');
            return false;
        }
    });
    
    // منع تحديد النص
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // منع السحب والإفلات
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // حماية من أدوات المطور
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;z-index:99999;">🚫 الوصول محظور - أدوات المطور مكتشفة</div>';
            }
        }
    }, 500);
    
    // حماية من النسخ عبر الطباعة
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        showWarning('⚠️ الطباعة غير مسموحة!');
        return false;
    });
    
    // علامة مائية محذوفة
    function addWatermark() {
        // تم حذف العلامة المائية
    }
    
    // حماية من النسخ عبر iframe
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // تشفير المحتوى الحساس
    function obfuscateContent() {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src.includes('ALWADIYAYNFORM.js')) {
                script.setAttribute('data-protected', 'true');
            }
        });
    }
    
    // رسالة تحذير
    function showWarning(message) {
        const warning = document.createElement('div');
        warning.textContent = message;
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }
    
    // تشغيل الحماية
    document.addEventListener('DOMContentLoaded', function() {
        // addWatermark(); // محذوفة
        obfuscateContent();
        
        // حماية إضافية للنموذج
        const form = document.querySelector('.jotform-form');
        if (form) {
            form.setAttribute('data-protected', 'sales-report-form');
        }
    });
    
    // حماية من النسخ عبر console
    console.clear();
    console.log('%c🚫 تحذير أمني!', 'color: red; font-size: 30px; font-weight: bold;');
    console.log('%cهذا الموقع محمي بحقوق الطبع والنشر', 'color: red; font-size: 16px;');
    console.log('%cأي محاولة لنسخ أو استنساخ المحتوى مخالفة للقانون', 'color: red; font-size: 16px;');
    
})();
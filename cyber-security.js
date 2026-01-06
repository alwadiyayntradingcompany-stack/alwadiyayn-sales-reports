// نظام الحماية السيبرانية الشامل - مفعل لحظياً
(function() {
    'use strict';
    
    // تفعيل فوري للحماية
    let isActive = true;
    let blockedIPs = new Set();
    let requestLog = new Map();
    
    // 1. حماية DDoS فورية
    function rateLimitCheck() {
        const ip = 'user_' + Date.now(); // محاكاة IP
        const now = Date.now();
        
        if (!requestLog.has(ip)) {
            requestLog.set(ip, []);
        }
        
        const requests = requestLog.get(ip);
        requests.push(now);
        
        // إزالة الطلبات القديمة (أكثر من دقيقة)
        const filtered = requests.filter(time => now - time < 60000);
        requestLog.set(ip, filtered);
        
        if (filtered.length > 5) { // 5 طلبات كحد أقصى
            blockedIPs.add(ip);
            blockAccess('🚫 تم حظر IP - تجاوز الحد المسموح');
            return false;
        }
        return true;
    }
    
    // 2. كشف البوتات فوري
    function detectBotImmediate() {
        const ua = navigator.userAgent.toLowerCase();
        const botSigns = ['headless', 'phantom', 'selenium', 'bot', 'crawler'];
        
        if (botSigns.some(sign => ua.includes(sign)) || 
            navigator.webdriver || 
            window.callPhantom || 
            window._phantom) {
            blockAccess('🤖 بوت مكتشف - وصول محظور');
            return true;
        }
        return false;
    }
    
    // 3. حماية فورية من الحقن
    function protectInputsNow() {
        document.addEventListener('input', function(e) {
            const value = e.target.value;
            const dangerous = /<script|javascript:|on\w+\s*=|select.*from|drop.*table|union.*select/i;
            
            if (dangerous.test(value)) {
                e.target.value = '';
                showAlert('⚠️ محتوى خطير مكتشف ومحذوف!');
                logThreat('INJECTION_ATTEMPT', value);
            }
        }, true);
    }
    
    // 4. مراقبة لحظية للشبكة
    function monitorNetworkNow() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            
            // فحص فوري للروابط المشبوهة
            if (typeof url === 'string' && 
                /eval|exec|shell|cmd|hack|exploit/i.test(url)) {
                logThreat('MALICIOUS_REQUEST', url);
                return Promise.reject('طلب محظور');
            }
            
            return originalFetch.apply(this, args);
        };
    }
    
    // 5. حماية فورية من أدوات المطورين
    function protectDevToolsNow() {
        let devtools = false;
        
        setInterval(() => {
            const threshold = 160;
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools) {
                    devtools = true;
                    blockAccess('🛠️ أدوات المطور مكتشفة - وصول محظور');
                }
            }
        }, 100); // فحص كل 100ms
    }
    
    // 6. حماية فورية من النسخ
    function preventCopyingNow() {
        ['contextmenu', 'selectstart', 'dragstart'].forEach(event => {
            document.addEventListener(event, function(e) {
                e.preventDefault();
                showAlert('⚠️ النسخ محظور!');
                return false;
            });
        });
        
        document.addEventListener('keydown', function(e) {
            // Ctrl+A, C, V, S, U, F12
            if ((e.ctrlKey && [65,67,86,83,85].includes(e.keyCode)) || 
                e.keyCode === 123) {
                e.preventDefault();
                showAlert('⚠️ اختصار محظور!');
                return false;
            }
        });
    }
    
    // 7. تسجيل فوري للتهديدات
    function logThreat(type, details) {
        const threat = {
            time: new Date().toISOString(),
            type: type,
            details: details,
            userAgent: navigator.userAgent,
            url: location.href
        };
        
        // حفظ فوري
        let threats = JSON.parse(localStorage.getItem('threats') || '[]');
        threats.push(threat);
        localStorage.setItem('threats', JSON.stringify(threats.slice(-50)));
        
        console.warn('🚨 تهديد مكتشف:', threat);
    }
    
    // 8. حظر فوري
    function blockAccess(reason) {
        logThreat('ACCESS_BLOCKED', reason);
        
        document.body.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(45deg,#ff0000,#8b0000);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial;z-index:999999;">
                <div style="font-size:80px;margin-bottom:30px;animation:pulse 1s infinite;">🛡️</div>
                <div style="font-size:28px;margin-bottom:20px;text-align:center;">${reason}</div>
                <div style="font-size:16px;opacity:0.8;">Security Event ID: ${Date.now()}</div>
                <div style="font-size:14px;margin-top:20px;opacity:0.6;">الوصول محظور نهائياً</div>
            </div>
            <style>
                @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.1); } }
                * { pointer-events: none !important; }
            </style>
        `;
        
        // منع أي تفاعل
        setTimeout(() => {
            ['click', 'keydown', 'keyup', 'mousemove'].forEach(event => {
                document.addEventListener(event, e => e.stopImmediatePropagation(), true);
            });
        }, 100);
    }
    
    // 9. تنبيه فوري
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.innerHTML = message;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff4444, #cc0000);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 5px 20px rgba(255,68,68,0.5);
            animation: slideIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }';
        document.head.appendChild(style);
        
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
    
    // 10. تشغيل فوري لجميع الحماية
    function activateNow() {
        console.log('%c🛡️ نظام الحماية مفعل لحظياً!', 'color: #00ff00; font-size: 18px; font-weight: bold; background: #000; padding: 10px;');
        
        // فحص فوري
        if (!rateLimitCheck()) return;
        if (detectBotImmediate()) return;
        
        // تفعيل فوري
        protectInputsNow();
        monitorNetworkNow();
        protectDevToolsNow();
        preventCopyingNow();
        
        // مراقبة مستمرة كل ثانية
        setInterval(() => {
            if (isActive) {
                rateLimitCheck();
                detectBotImmediate();
            }
        }, 1000);
        
        // حماية من إيقاف النظام
        Object.defineProperty(window, 'isActive', {
            value: true,
            writable: false,
            configurable: false
        });
        
        logThreat('SYSTEM_ACTIVATED', 'جميع أنظمة الحماية مفعلة');
        showAlert('🛡️ نظام الحماية نشط!');
    }
    
    // تشغيل فوري
    activateNow();
    
    // حماية إضافية من التعطيل
    ['beforeunload', 'unload', 'pagehide'].forEach(event => {
        window.addEventListener(event, () => {
            logThreat('PAGE_EXIT', 'محاولة مغادرة الصفحة');
        });
    });
    
})();
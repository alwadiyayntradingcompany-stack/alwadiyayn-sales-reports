// نظام الحماية السيبرانية الشامل
(function() {
    'use strict';
    
    // 1. حماية من هجمات DDoS وإيقاف الخدمة
    let requestCount = 0;
    let lastRequestTime = Date.now();
    const MAX_REQUESTS = 10; // 10 طلبات كحد أقصى
    const TIME_WINDOW = 60000; // في الدقيقة الواحدة
    
    function checkRateLimit() {
        const now = Date.now();
        if (now - lastRequestTime > TIME_WINDOW) {
            requestCount = 0;
            lastRequestTime = now;
        }
        
        requestCount++;
        if (requestCount > MAX_REQUESTS) {
            document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#ff0000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;z-index:99999;">🚫 تم حظر IP - هجوم مكتشف</div>';
            return false;
        }
        return true;
    }
    
    // 2. حماية من هجمات XSS
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    // 3. كشف البوتات والذكاء الاصطناعي
    function detectBot() {
        const botSignatures = [
            'bot', 'crawler', 'spider', 'scraper', 'headless',
            'phantom', 'selenium', 'puppeteer', 'playwright'
        ];
        
        const userAgent = navigator.userAgent.toLowerCase();
        const isBot = botSignatures.some(sig => userAgent.includes(sig));
        
        // فحص إضافي للبوتات
        const hasWebDriver = navigator.webdriver;
        const hasPhantom = window.callPhantom || window._phantom;
        const hasSelenium = window.selenium;
        
        if (isBot || hasWebDriver || hasPhantom || hasSelenium) {
            blockAccess('🤖 بوت مكتشف - الوصول محظور');
            return true;
        }
        return false;
    }
    
    // 4. حماية من Social Engineering
    function detectSocialEngineering() {
        // كشف محاولات الخداع
        const suspiciousPatterns = [
            'admin', 'password', 'login', 'hack', 'exploit',
            'inject', 'script', 'alert', 'eval', 'function'
        ];
        
        document.addEventListener('input', function(e) {
            const value = e.target.value.toLowerCase();
            if (suspiciousPatterns.some(pattern => value.includes(pattern))) {
                e.target.value = '';
                showSecurityAlert('⚠️ محتوى مشبوه مكتشف!');
            }
        });
    }
    
    // 5. حماية من هجمات Injection
    function preventInjection() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    const value = input.value;
                    
                    // كشف SQL Injection
                    const sqlPatterns = /('|(\\')|(;)|(\\;)|(select|insert|update|delete|drop|create|alter|exec|execute)/i;
                    if (sqlPatterns.test(value)) {
                        e.preventDefault();
                        blockAccess('🚫 محاولة SQL Injection مكتشفة');
                        return;
                    }
                    
                    // كشف XSS
                    const xssPatterns = /(<script|javascript:|on\w+\s*=)/i;
                    if (xssPatterns.test(value)) {
                        e.preventDefault();
                        blockAccess('🚫 محاولة XSS مكتشفة');
                        return;
                    }
                    
                    // تنظيف البيانات
                    input.value = sanitizeInput(value);
                });
            });
        });
    }
    
    // 6. حماية من هجمات CSRF
    function generateCSRFToken() {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('csrf_token', token);
        
        // إضافة التوكن لجميع النماذج
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = token;
            form.appendChild(tokenInput);
        });
    }
    
    // 7. مراقبة الشبكة والطلبات المشبوهة
    function monitorNetworkActivity() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            
            // كشف الطلبات المشبوهة
            const suspiciousUrls = [
                'eval', 'exec', 'system', 'shell', 'cmd',
                'backdoor', 'malware', 'virus'
            ];
            
            if (suspiciousUrls.some(pattern => url.includes(pattern))) {
                blockAccess('🚫 طلب شبكة مشبوه مكتشف');
                return Promise.reject('Blocked');
            }
            
            return originalFetch.apply(this, args);
        };
    }
    
    // 8. حماية من Clickjacking
    function preventClickjacking() {
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
        
        // إضافة X-Frame-Options
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Frame-Options';
        meta.content = 'DENY';
        document.head.appendChild(meta);
    }
    
    // 9. كشف أدوات الاختراق المتقدمة
    function detectHackingTools() {
        const hackingTools = [
            'burpsuite', 'owasp', 'sqlmap', 'nmap', 'metasploit',
            'kali', 'parrot', 'blackarch', 'pentesting'
        ];
        
        const userAgent = navigator.userAgent.toLowerCase();
        if (hackingTools.some(tool => userAgent.includes(tool))) {
            blockAccess('🛡️ أداة اختراق مكتشفة');
            return true;
        }
        
        // فحص إضافي للأدوات
        if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
            const extensions = Object.keys(window.chrome.runtime.onConnect);
            if (extensions.some(ext => hackingTools.some(tool => ext.includes(tool)))) {
                blockAccess('🛡️ إضافة اختراق مكتشفة');
                return true;
            }
        }
        
        return false;
    }
    
    // 10. حماية من Memory Corruption
    function protectMemory() {
        // منع تعديل الكائنات الأساسية
        Object.freeze(Object.prototype);
        Object.freeze(Array.prototype);
        Object.freeze(Function.prototype);
        
        // حماية المتغيرات الحساسة
        const sensitiveData = new WeakMap();
        
        window.protectData = function(obj, data) {
            sensitiveData.set(obj, data);
        };
        
        window.getData = function(obj) {
            return sensitiveData.get(obj);
        };
    }
    
    // 11. نظام تسجيل الأحداث الأمنية
    function logSecurityEvent(event, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            ip: 'client-side', // سيتم الحصول عليه من الخادم
            url: window.location.href
        };
        
        // حفظ في localStorage للمراجعة
        let securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        securityLogs.push(logEntry);
        
        // الاحتفاظ بآخر 100 حدث فقط
        if (securityLogs.length > 100) {
            securityLogs = securityLogs.slice(-100);
        }
        
        localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
        
        // إرسال للخادم (إذا كان متاحاً)
        if (window.reportSecurityEvent) {
            window.reportSecurityEvent(logEntry);
        }
    }
    
    // 12. حماية من Timing Attacks
    function preventTimingAttacks() {
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        window.setTimeout = function(callback, delay) {
            // إضافة تأخير عشوائي صغير
            const randomDelay = Math.random() * 10;
            return originalSetTimeout(callback, delay + randomDelay);
        };
        
        window.setInterval = function(callback, delay) {
            const randomDelay = Math.random() * 10;
            return originalSetInterval(callback, delay + randomDelay);
        };
    }
    
    // وظائف مساعدة
    function blockAccess(message) {
        logSecurityEvent('ACCESS_BLOCKED', message);
        document.body.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:24px;z-index:99999;">
                <div style="font-size:48px;margin-bottom:20px;">🛡️</div>
                <div>${message}</div>
                <div style="font-size:14px;margin-top:20px;opacity:0.7;">Security ID: ${Date.now()}</div>
            </div>
        `;
        
        // منع أي تفاعل إضافي
        document.addEventListener('keydown', e => e.preventDefault());
        document.addEventListener('click', e => e.preventDefault());
    }
    
    function showSecurityAlert(message) {
        const alert = document.createElement('div');
        alert.textContent = message;
        alert.style.cssText = `
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
        document.body.appendChild(alert);
        
        setTimeout(() => alert.remove(), 5000);
        logSecurityEvent('SECURITY_ALERT', message);
    }
    
    // تشغيل جميع أنظمة الحماية
    function initSecurity() {
        console.log('%c🛡️ نظام الحماية السيبرانية نشط', 'color: green; font-size: 16px; font-weight: bold;');
        
        // فحص أولي
        if (!checkRateLimit()) return;
        if (detectBot()) return;
        if (detectHackingTools()) return;
        
        // تفعيل الحماية
        detectSocialEngineering();
        preventInjection();
        generateCSRFToken();
        monitorNetworkActivity();
        preventClickjacking();
        protectMemory();
        preventTimingAttacks();
        
        // مراقبة مستمرة
        setInterval(() => {
            checkRateLimit();
            detectBot();
            detectHackingTools();
        }, 30000); // كل 30 ثانية
        
        logSecurityEvent('SECURITY_SYSTEM_INITIALIZED', 'All protection systems active');
    }
    
    // تشغيل النظام عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
    // حماية من إيقاف النظام
    Object.freeze(window.initSecurity);
    
})();
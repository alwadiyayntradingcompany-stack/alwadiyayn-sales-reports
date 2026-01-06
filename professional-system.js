// نظام التطوير الاحترافي الشامل
class ProfessionalSystem {
    constructor() {
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.notifications = [];
        this.analytics = new Map();
        this.init();
    }

    // 1. Progressive Web App
    initPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('PWA Ready'))
                .catch(err => console.log('PWA Error:', err));
        }
    }

    // 2. Dark Mode System
    initDarkMode() {
        const toggle = document.createElement('button');
        toggle.innerHTML = this.darkMode ? '☀️' : '🌙';
        toggle.className = 'dark-mode-toggle';
        toggle.style.cssText = `
            position: fixed;
            top: 70px;
            left: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        toggle.onclick = () => this.toggleDarkMode();
        document.body.appendChild(toggle);
        
        if (this.darkMode) this.applyDarkMode();
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        
        if (this.darkMode) {
            this.applyDarkMode();
        } else {
            this.removeDarkMode();
        }
        
        document.querySelector('.dark-mode-toggle').innerHTML = this.darkMode ? '☀️' : '🌙';
    }

    applyDarkMode() {
        const darkCSS = `
            body { background: #1a1a1a !important; color: #e0e0e0 !important; }
            .form-section { background: rgba(40, 40, 40, 0.9) !important; }
            .field-input { background: #333 !important; color: #fff !important; }
            .stat-card { background: #2d2d2d !important; color: #fff !important; }
            .chart-container { background: #2d2d2d !important; }
        `;
        
        let darkStyle = document.getElementById('darkModeStyle');
        if (!darkStyle) {
            darkStyle = document.createElement('style');
            darkStyle.id = 'darkModeStyle';
            document.head.appendChild(darkStyle);
        }
        darkStyle.textContent = darkCSS;
    }

    removeDarkMode() {
        const darkStyle = document.getElementById('darkModeStyle');
        if (darkStyle) darkStyle.remove();
    }

    // 3. Real-time Analytics
    initAnalytics() {
        this.trackPageView();
        this.trackUserInteractions();
        this.generateRealTimeStats();
    }

    trackPageView() {
        const visit = {
            timestamp: Date.now(),
            page: location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        let visits = JSON.parse(localStorage.getItem('pageVisits') || '[]');
        visits.push(visit);
        localStorage.setItem('pageVisits', JSON.stringify(visits.slice(-100)));
    }

    trackUserInteractions() {
        ['click', 'input', 'submit'].forEach(event => {
            document.addEventListener(event, (e) => {
                this.analytics.set(event, (this.analytics.get(event) || 0) + 1);
            });
        });
    }

    generateRealTimeStats() {
        setInterval(() => {
            const stats = {
                interactions: Object.fromEntries(this.analytics),
                timestamp: new Date().toISOString(),
                performance: {
                    loadTime: performance.now(),
                    memory: performance.memory ? performance.memory.usedJSHeapSize : 0
                }
            };
            
            localStorage.setItem('realtimeStats', JSON.stringify(stats));
        }, 5000);
    }

    // 4. Push Notifications System
    initNotifications() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }

    sendNotification(title, body, icon = '🔔') {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: icon,
                badge: icon
            });
        }
    }

    // 5. Advanced Loading System
    showAdvancedLoader(message = 'جاري التحميل...') {
        const loader = document.createElement('div');
        loader.id = 'advancedLoader';
        loader.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;">
                <div style="width:60px;height:60px;border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
                <div style="color:white;font-size:18px;font-weight:600;">${message}</div>
                <div style="width:200px;height:4px;background:#333;border-radius:2px;margin-top:15px;overflow:hidden;">
                    <div style="width:0%;height:100%;background:linear-gradient(90deg,#3498db,#2ecc71);border-radius:2px;animation:progress 3s ease-in-out infinite;" id="progressBar"></div>
                </div>
            </div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
            </style>
        `;
        document.body.appendChild(loader);
    }

    hideAdvancedLoader() {
        const loader = document.getElementById('advancedLoader');
        if (loader) loader.remove();
    }

    // 6. AI-powered Insights
    generateAIInsights() {
        const submissions = JSON.parse(localStorage.getItem('successfulSubmissions') || '[]');
        if (submissions.length < 3) return null;

        const insights = {
            trends: this.analyzeTrends(submissions),
            predictions: this.generatePredictions(submissions),
            recommendations: this.getRecommendations(submissions),
            anomalies: this.detectAnomalies(submissions)
        };

        return insights;
    }

    analyzeTrends(data) {
        const dailyTotals = data.reduce((acc, item) => {
            const date = item.timestamp.split('T')[0];
            const sales = parseFloat(item.data['كاش / Cash / নগদ'] || 0) + 
                         parseFloat(item.data['نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম'] || 0);
            acc[date] = (acc[date] || 0) + sales;
            return acc;
        }, {});

        const values = Object.values(dailyTotals);
        const trend = values.length > 1 ? 
            (values[values.length - 1] - values[0]) / values.length : 0;

        return {
            direction: trend > 0 ? 'صاعد' : trend < 0 ? 'هابط' : 'مستقر',
            percentage: Math.abs(trend * 100 / (values[0] || 1)).toFixed(1)
        };
    }

    generatePredictions(data) {
        const recent = data.slice(-7);
        const avgSales = recent.reduce((sum, item) => {
            return sum + parseFloat(item.data['كاش / Cash / নগদ'] || 0) + 
                   parseFloat(item.data['نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম'] || 0);
        }, 0) / recent.length;

        return {
            nextWeek: Math.round(avgSales * 7),
            confidence: recent.length >= 7 ? 'عالية' : 'متوسطة'
        };
    }

    getRecommendations(data) {
        const recommendations = [];
        
        const avgProfit = this.calculateAverageProfit(data);
        if (avgProfit < 0.15) {
            recommendations.push('💡 يُنصح بمراجعة استراتيجية التسعير لزيادة الربحية');
        }
        
        const consistency = this.checkConsistency(data);
        if (!consistency) {
            recommendations.push('📊 يُنصح بتحسين انتظام التقارير اليومية');
        }

        return recommendations;
    }

    detectAnomalies(data) {
        const anomalies = [];
        // خوارزمية بسيطة لكشف الشذوذ
        const values = data.map(item => 
            parseFloat(item.data['كاش / Cash / নগদ'] || 0) + 
            parseFloat(item.data['نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম'] || 0)
        );
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
        
        values.forEach((value, index) => {
            if (Math.abs(value - mean) > 2 * stdDev) {
                anomalies.push({
                    date: data[index].timestamp.split('T')[0],
                    value: value,
                    type: value > mean ? 'مبيعات استثنائية عالية' : 'مبيعات منخفضة غير عادية'
                });
            }
        });

        return anomalies;
    }

    calculateAverageProfit(data) {
        let totalSales = 0, totalPurchases = 0;
        
        data.forEach(item => {
            totalSales += parseFloat(item.data['كاش / Cash / নগদ'] || 0) + 
                         parseFloat(item.data['نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম'] || 0);
            totalPurchases += parseFloat(item.data['المشتريات اليومية / Daily Purchases / দৈনিক ক্রয়'] || 0);
        });

        return totalSales > 0 ? (totalSales - totalPurchases) / totalSales : 0;
    }

    checkConsistency(data) {
        const dates = data.map(item => item.timestamp.split('T')[0]);
        const uniqueDates = new Set(dates);
        return uniqueDates.size === dates.length; // لا توجد تقارير مكررة
    }

    // 7. Performance Optimization
    optimizePerformance() {
        // Lazy loading للصور
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));

        // تحسين الذاكرة
        setInterval(() => {
            if (performance.memory && performance.memory.usedJSHeapSize > 50000000) {
                this.cleanupMemory();
            }
        }, 30000);
    }

    cleanupMemory() {
        // تنظيف البيانات القديمة
        const oldLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        if (oldLogs.length > 50) {
            localStorage.setItem('securityLogs', JSON.stringify(oldLogs.slice(-50)));
        }
    }

    // 8. Advanced Charts Integration
    initAdvancedCharts() {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this.createCharts();
            document.head.appendChild(script);
        } else {
            this.createCharts();
        }
    }

    createCharts() {
        const submissions = JSON.parse(localStorage.getItem('successfulSubmissions') || '[]');
        if (submissions.length === 0) return;

        // إنشاء canvas للرسم البياني
        const chartContainer = document.querySelector('#branchesAnalysis');
        if (chartContainer) {
            chartContainer.innerHTML = '<canvas id="salesChart" width="400" height="200"></canvas>';
            
            const ctx = document.getElementById('salesChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: this.prepareChartData(submissions),
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'تطور المبيعات' }
                    }
                }
            });
        }
    }

    prepareChartData(submissions) {
        const dailyData = submissions.reduce((acc, item) => {
            const date = item.timestamp.split('T')[0];
            const sales = parseFloat(item.data['كاش / Cash / নগদ'] || 0) + 
                         parseFloat(item.data['نظام نقاط البيع / Point of Sale System / পয়েন্ট অফ সেল সিস্টেম'] || 0);
            acc[date] = (acc[date] || 0) + sales;
            return acc;
        }, {});

        return {
            labels: Object.keys(dailyData),
            datasets: [{
                label: 'المبيعات اليومية',
                data: Object.values(dailyData),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4
            }]
        };
    }

    // تشغيل جميع الأنظمة للمستخدمين العاديين فقط
    init() {
        // فحص إذا كانت صفحة المستخدم (النموذج)
        if (location.pathname.includes('ALWADIYAYNFORM.html') || location.pathname === '/') {
            console.log('%c📝 نظام إدخال البيانات نشط', 'color: #2ecc71; font-size: 16px; font-weight: bold;');
            
            this.showAdvancedLoader('تحميل نموذج الإدخال...');
            
            setTimeout(() => {
                // ميزات أساسية للمستخدمين فقط
                this.initPWA();
                this.initDarkMode();
                this.optimizePerformance();
                
                this.hideAdvancedLoader();
                
                // إشعار بسيط
                setTimeout(() => {
                    this.sendNotification('✅ النموذج جاهز!', 'يمكنك الآن إدخال بيانات المبيعات');
                }, 1000);
                
            }, 1500);
        } 
        // ميزات متقدمة للإدارة فقط
        else if (location.pathname.includes('admin')) {
            console.log('%c🚀 تشغيل النظام الاحترافي الشامل', 'color: #2ecc71; font-size: 16px; font-weight: bold;');
            
            this.showAdvancedLoader('تحميل الميزات الاحترافية...');
            
            setTimeout(() => {
                this.initPWA();
                this.initDarkMode();
                this.initAnalytics();
                this.initNotifications();
                this.optimizePerformance();
                this.initAdvancedCharts();
                
                this.hideAdvancedLoader();
                
                setTimeout(() => {
                    this.sendNotification('🎉 النظام جاهز!', 'تم تفعيل جميع الميزات الاحترافية بنجاح');
                }, 1000);
                
            }, 2000);
        }
    }
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.professionalSystem = new ProfessionalSystem();
});
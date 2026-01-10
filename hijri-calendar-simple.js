// التقويم الهجري المبسط والمختبر
class SimpleHijriCalendar {
    constructor() {
        // الشهور الهجرية مع أرقامها
        this.hijriMonths = [
            { name: 'محرم', number: 1 },
            { name: 'صفر', number: 2 },
            { name: 'ربيع الأول', number: 3 },
            { name: 'ربيع الثاني', number: 4 },
            { name: 'جمادى الأولى', number: 5 },
            { name: 'جمادى الثانية', number: 6 },
            { name: 'رجب', number: 7 },
            { name: 'شعبان', number: 8 },
            { name: 'رمضان', number: 9 },
            { name: 'شوال', number: 10 },
            { name: 'ذو القعدة', number: 11 },
            { name: 'ذو الحجة', number: 12 }
        ];
        this.currentDate = this.getCurrentHijriDate();
        this.selectedDate = null;
        this.init();
    }

    getCurrentHijriDate() {
        const today = new Date();
        
        // استخدام Intl.DateTimeFormat للحصول على التاريخ الهجري الدقيق
        try {
            const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit'
            });
            
            const hijriParts = hijriFormatter.formatToParts(today);
            const year = parseInt(hijriParts.find(part => part.type === 'year').value);
            const month = parseInt(hijriParts.find(part => part.type === 'month').value);
            const day = parseInt(hijriParts.find(part => part.type === 'day').value);
            
            return { year, month, day };
        } catch (error) {
            console.log('فشل في استخدام Intl، استخدام الطريقة البديلة');
            
            // طريقة بديلة محسنة
            const gYear = today.getFullYear();
            const gMonth = today.getMonth() + 1;
            const gDay = today.getDate();
            
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
            
            return {
                year: finalYear,
                month: Math.max(1, Math.min(12, Math.floor(hMonth))),
                day: Math.max(1, Math.min(30, Math.floor(hDay)))
            };
        }
    }

    init() {
        console.log('Initializing Hijri Calendar...');
        
        const input = document.querySelector('input[name="hijriDate"]');
        const popup = document.querySelector('.hijri-calendar-popup');
        
        console.log('Input found:', !!input);
        console.log('Popup found:', !!popup);
        
        if (!input || !popup) {
            console.error('Calendar elements not found!');
            return;
        }

        // تعيين التاريخ الحالي في الحقل عند التحميل
        const today = this.getCurrentHijriDate();
        this.selectedDate = today;
        this.updateInput();

        // إضافة الفلاتر مباشرة عند التهيئة
        this.addFilters();

        // فتح التقويم عند الضغط - نفس طريقة النموذج القديم
        input.addEventListener('click', (e) => {
            console.log('Calendar input clicked');
            e.preventDefault();
            e.stopPropagation();
            popup.classList.toggle('show');
            this.renderCalendar();
        });

        // إغلاق التقويم عند الضغط خارجه
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.hijri-date-picker')) {
                popup.classList.remove('show');
            }
        });

        // معالجة النقرات داخل التقويم
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                this.navigate(actionBtn.dataset.action);
                return;
            }

            const dayEl = e.target.closest('.calendar-day');
            if (dayEl) {
                const day = parseInt(dayEl.textContent, 10);
                if (!isNaN(day)) this.selectDate(day);
                return;
            }

            const todayBtn = e.target.closest('.today-btn');
            if (todayBtn) {
                this.confirmDate();
                return;
            }
        });

        console.log('Calendar initialized successfully');
    }

    setupFilters() {
        // سيتم إعداد الفلاتر في renderCalendar
    }

    updateDropdownYear() {
        const dateSelect = document.querySelector('.filter-select');
        if (!dateSelect) return;
        
        // مسح الخيارات الحالية
        dateSelect.innerHTML = '';
        
        // إعادة إنشاء الخيارات بالسنة المحدثة
        this.hijriMonths.forEach((month, monthIndex) => {
            const daysInMonth = this.getDaysInMonth(monthIndex + 1);
            for (let day = 1; day <= daysInMonth; day++) {
                const option = document.createElement('option');
                const dayStr = day.toString().padStart(2, '0');
                const dateStr = `${dayStr}-${monthIndex + 1}-${this.currentDate.year}`;
                option.value = dateStr;
                option.textContent = `${dayStr} ${month.name} (${month.number}) ${this.currentDate.year}`;
                
                // تحديد التاريخ المحدد حالياً
                if (this.selectedDate &&
                    this.selectedDate.year === this.currentDate.year &&
                    this.selectedDate.month === monthIndex + 1 &&
                    this.selectedDate.day === day) {
                    option.selected = true;
                }
                
                dateSelect.appendChild(option);
            }
        });
    }

    navigate(action) {
        switch (action) {
            case 'prev-year':
                this.currentDate.year--;
                break;
            case 'next-year':
                this.currentDate.year++;
                break;
            case 'prev-month':
                this.currentDate.month--;
                if (this.currentDate.month < 1) {
                    this.currentDate.month = 12;
                    this.currentDate.year--;
                }
                break;
            case 'next-month':
                this.currentDate.month++;
                if (this.currentDate.month > 12) {
                    this.currentDate.month = 1;
                    this.currentDate.year++;
                }
                break;
        }
        this.updateDropdownYear();
        this.renderCalendar();
    }

    renderCalendar() {
        const title = document.querySelector('.calendar-title');
        const grid = document.querySelector('.calendar-grid');
        const popup = document.querySelector('.hijri-calendar-popup');

        if (!title || !grid || !popup) return;

        title.textContent = `${this.hijriMonths[this.currentDate.month - 1].name} (${this.hijriMonths[this.currentDate.month - 1].number}) ${this.currentDate.year}`;

        // إزالة الأيام السابقة
        const existingDays = grid.querySelectorAll('.calendar-day');
        existingDays.forEach(d => d.remove());

        // إضافة أيام الشهر
        const daysInMonth = this.getDaysInMonth(this.currentDate.month);
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // تحديد اليوم المحدد
            if (this.selectedDate &&
                this.selectedDate.year === this.currentDate.year &&
                this.selectedDate.month === this.currentDate.month &&
                this.selectedDate.day === day) {
                dayElement.classList.add('selected');
            }

            // تحديد اليوم الحالي
            const today = this.getCurrentHijriDate();
            if (today.year === this.currentDate.year &&
                today.month === this.currentDate.month &&
                today.day === day) {
                dayElement.classList.add('today');
            }

            grid.appendChild(dayElement);
        }

        // الفلاتر تتم إضافتها مرة واحدة فقط في init
    }

    addFilters() {
        const popup = document.querySelector('.hijri-calendar-popup');
        
        // التحقق إذا كانت الفلاتر موجودة بالفعل
        const existingFilters = popup.querySelector('.calendar-filters');
        if (existingFilters) {
            return; // لا تضف الفلاتر مرة أخرى
        }

        // إنشاء فلتر واحد للتاريخ الكامل
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'calendar-filters';

        // فلتر التاريخ الكامل
        const dateSelect = document.createElement('select');
        dateSelect.className = 'filter-select';
        
        // إضافة جميع الأشهر والأيام الممكنة
        this.hijriMonths.forEach((month, monthIndex) => {
            const daysInMonth = this.getDaysInMonth(monthIndex + 1);
            for (let day = 1; day <= daysInMonth; day++) {
                const option = document.createElement('option');
                const dayStr = day.toString().padStart(2, '0');
                const dateStr = `${dayStr}-${monthIndex + 1}-${this.currentDate.year}`;
                option.value = dateStr;
                option.textContent = `${dayStr} ${month.name} (${month.number}) ${this.currentDate.year}`;
                
                // تحديد التاريخ الحالي
                const today = this.getCurrentHijriDate();
                if (today.year === this.currentDate.year &&
                    today.month === monthIndex + 1 &&
                    today.day === day) {
                    option.selected = true;
                }
                
                dateSelect.appendChild(option);
            }
        });
        
        dateSelect.addEventListener('change', (e) => {
            const dateValue = e.target.value;
            const [day, month, year] = dateValue.split('-').map(Number);
            
            this.currentDate = { year, month, day };
            this.selectedDate = { year, month, day };
            
            // تحديث حقل الإدخال
            const input = document.querySelector('input[name="hijriDate"]');
            if (input) {
                input.value = dateValue;
            }
            
            // تحديث القائمة المنسدلة لتعكس السنة الجديدة
            this.updateDropdownYear();
            this.renderCalendar();
        });

        filtersDiv.appendChild(dateSelect);
        
        // إضافة الفلاتر في أعلى التقويم
        const header = popup.querySelector('.calendar-header');
        if (header) {
            header.parentNode.insertBefore(filtersDiv, header.nextSibling);
        }
    }

    getDaysInMonth(month) {
        // الشهور الهجرية: الفردية 30 يوم، الزوجية 29 يوم
        return (month % 2 === 1) ? 30 : 29;
    }

    selectDate(day) {
        this.selectedDate = {
            year: this.currentDate.year,
            month: this.currentDate.month,
            day: day
        };
        this.updateInput();
        const popup = document.querySelector('.hijri-calendar-popup');
        if (popup) popup.classList.remove('show');
        this.renderCalendar();
    }

    confirmDate() {
        // تأكيد التاريخ المحدد حالياً
        if (!this.selectedDate) {
            this.selectedDate = this.getCurrentHijriDate();
        }
        this.updateInput();
        const popup = document.querySelector('.hijri-calendar-popup');
        if (popup) popup.classList.remove('show');
    }

    selectToday() {
        this.selectedDate = this.getCurrentHijriDate();
        this.currentDate = { ...this.selectedDate };
        this.updateInput();
        const popup = document.querySelector('.hijri-calendar-popup');
        if (popup) popup.classList.remove('show');
        this.renderCalendar();
    }

    updateInput() {
        const input = document.querySelector('input[name="hijriDate"]');
        if (this.selectedDate && input) {
            const formatted = `${this.selectedDate.day.toString().padStart(2, '0')}-${this.selectedDate.month.toString().padStart(2, '0')}-${this.selectedDate.year}`;
            input.value = formatted;
        }
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing calendar...');
    const calendar = new SimpleHijriCalendar();
});

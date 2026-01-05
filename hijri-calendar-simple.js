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
        // تحويل أكثر دقة للتاريخ الهجري
        const hijriYear = Math.floor(today.getFullYear() - 579.3);
        let hijriMonth = today.getMonth() + 1;
        let hijriDay = today.getDate();
        
        // تعديل بسيط للدقة
        if (hijriMonth > 12) {
            hijriMonth = hijriMonth - 12;
        }
        if (hijriDay > 30) {
            hijriDay = 30;
        }
        
        return {
            year: hijriYear,
            month: hijriMonth,
            day: hijriDay
        };
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

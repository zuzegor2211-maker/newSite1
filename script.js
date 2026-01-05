// Таймер обратного отсчета до 7 февраля 2025 года, 10:00 (Москва, GMT+3)
class SportsCountdown {
    constructor() {
        // Устанавливаем целевую дату: 7 февраля 2025, 10:00 по Москве (GMT+3)
        // В JavaScript месяцы начинаются с 0, поэтому февраль = 1
        this.targetDate = new Date(Date.UTC(2026, 1, 7, 7, 0, 0)); // 7:00 UTC = 10:00 MSK
        
        // Элементы DOM
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            dayProgress: document.getElementById('dayProgress'),
            hourProgress: document.getElementById('hourProgress'),
            minuteProgress: document.getElementById('minuteProgress'),
            secondProgress: document.getElementById('secondProgress'),
            totalSeconds: document.getElementById('totalSeconds'),
            progressPercent: document.getElementById('progressPercent'),
            statusBadge: document.getElementById('statusBadge'),
            currentTime: document.getElementById('currentTime'),
            currentDate: document.getElementById('currentDate'),
            motivationText: document.getElementById('motivationText')
        };
        
        // Мотивационные сообщения
        this.motivations = [
            "Горы зовут тех, чья душа им по росту! Готовьтесь к самому захватывающему спортивному событию года.",
            "Сильнейшие команды страны готовятся к битве за вершину. Кто станет чемпионом?",
            "Приключение начинается с первого шага. Осталось совсем немного до старта!",
            "Спортивный туризм - это искусство побеждать себя и покорять вершины.",
            "В горах нет легких путей, но есть те, что ведут к победе. Готовьтесь!",
            "24 команды, 6 дисциплин, 1 цель - стать лучшими в стране!",
            "Снежные вершины ждут своих героев. Остались считанные дни до старта!",
            "Подготовка, выносливость, команда - ключи к победе в горных соревнованиях.",
            "Каждая секунда отсчета приближает нас к началу великих состязаний.",
            "Горный воздух, адреналин и дух соперничества - всё это ждет участников!"
        ];
        
        // Статусы
        this.statuses = {
            normal: { text: "СОРЕВНОВАНИЯ НАЧИНАЮТСЯ", color: "#4facfe", icon: "fa-spinner" },
            soon: { text: "СКОРО СТАРТ!", color: "#ffd700", icon: "fa-bolt" },
            verySoon: { text: "ОСТАЛОСЬ МЕНЬШЕ СУТОК!", color: "#ff9800", icon: "fa-hourglass-half" },
            immediate: { text: "СТАРТ УЖЕ СЕГОДНЯ!", color: "#ff5722", icon: "fa-running" },
            ended: { text: "СОРЕВНОВАНИЯ НАЧАЛИСЬ!", color: "#4CAF50", icon: "fa-flag-checkered" }
        };
        
        // Инициализация
        this.init();
    }
    
    init() {
        // Запускаем обновление времени
        this.update();
        setInterval(() => this.update(), 1000);
        
        // Обновляем текущее время
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // Меняем мотивационные сообщения каждые 30 секунд
        this.changeMotivation();
        setInterval(() => this.changeMotivation(), 30000);
        
        // Запрашиваем разрешение на уведомления
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    update() {
        const now = new Date();
        const timeDiff = this.targetDate - now;
        
        // Если время наступило
        if (timeDiff <= 0) {
            this.handleCountdownEnd();
            return;
        }
        
        // Рассчитываем оставшееся время
        const totalSeconds = Math.floor(timeDiff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Обновляем отображение
        this.elements.days.textContent = days.toString().padStart(2, '0');
        this.elements.hours.textContent = hours.toString().padStart(2, '0');
        this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
        
        // Обновляем прогресс-бары
        this.elements.dayProgress.style.width = `${100 - (days % 30) * 3.33}%`;
        this.elements.hourProgress.style.width = `${100 - (hours % 24) * 4.17}%`;
        this.elements.minuteProgress.style.width = `${100 - (minutes % 60) * 1.67}%`;
        this.elements.secondProgress.style.width = `${100 - (seconds % 60) * 1.67}%`;
        
        // Обновляем общую информацию
        this.elements.totalSeconds.textContent = this.formatNumber(totalSeconds);
        
        // Рассчитываем процент до события (от 1 января до 7 февраля)
        const yearStart = new Date(Date.UTC(2025, 0, 1, 0, 0, 0));
        const totalTime = this.targetDate - yearStart;
        const elapsedTime = now - yearStart;
        const progress = Math.min(100, (elapsedTime / totalTime) * 100);
        this.elements.progressPercent.textContent = `${progress.toFixed(1)}%`;
        
        // Обновляем статус
        this.updateStatus(days, hours);
        
        // Добавляем анимацию для последней минуты
        if (days === 0 && hours === 0 && minutes < 5) {
            this.addFinalMinuteAnimation();
        }
        
        // Отправляем уведомления при приближении
        this.sendNotifications(days, hours, minutes);
    }
    
    updateStatus(days, hours) {
        let status;
        
        if (days > 7) {
            status = this.statuses.normal;
        } else if (days > 1) {
            status = this.statuses.soon;
        } else if (days === 1) {
            status = this.statuses.verySoon;
        } else if (days === 0 && hours > 1) {
            status = this.statuses.immediate;
        } else {
            status = this.statuses.immediate;
        }
        
        const badge = this.elements.statusBadge;
        badge.innerHTML = `<i class="fas ${status.icon}"></i><span>${status.text}</span>`;
        badge.style.background = `linear-gradient(135deg, ${status.color} 0%, ${this.lightenColor(status.color, 20)} 100%)`;
        
        // Добавляем пульсацию для срочных статусов
        if (days < 2) {
            badge.classList.add('pulse-animation');
        } else {
            badge.classList.remove('pulse-animation');
        }
    }
    
    updateCurrentTime() {
        const now = new Date();
        
        // Форматируем время
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            timeZone: 'Europe/Moscow'
        };
        
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Europe/Moscow'
        };
        
        this.elements.currentTime.textContent = 
            now.toLocaleTimeString('ru-RU', timeOptions);
        
        this.elements.currentDate.textContent = 
            now.toLocaleDateString('ru-RU', dateOptions);
    }
    
    handleCountdownEnd() {
        // Время наступило
        this.elements.days.textContent = '00';
        this.elements.hours.textContent = '00';
        this.elements.minutes.textContent = '00';
        this.elements.seconds.textContent = '00';
        
        this.elements.totalSeconds.textContent = '0';
        this.elements.progressPercent.textContent = '100%';
        
        // Обновляем статус
        const status = this.statuses.ended;
        const badge = this.elements.statusBadge;
        badge.innerHTML = `<i class="fas ${status.icon}"></i><span>${status.text}</span>`;
        badge.style.background = `linear-gradient(135deg, ${status.color} 0%, ${this.lightenColor(status.color, 20)} 100%)`;
        
        // Добавляем праздничную анимацию
        this.startCelebration();
        
        // Отправляем уведомление
        this.sendNotification('Соревнования начались! Удачи всем участникам!');
    }
    
    addFinalMinuteAnimation() {
        // Добавляем класс анимации для элементов таймера
        const numbers = [
            this.elements.days,
            this.elements.hours,
            this.elements.minutes,
            this.elements.seconds
        ];
        
        numbers.forEach(el => {
            el.classList.add('pulse-animation');
            
            // Удаляем анимацию через 1 секунду
            setTimeout(() => {
                el.classList.remove('pulse-animation');
            }, 1000);
        });
    }
    
    changeMotivation() {
        const randomIndex = Math.floor(Math.random() * this.motivations.length);
        this.elements.motivationText.textContent = this.motivations[randomIndex];
        
        // Добавляем анимацию появления
        this.elements.motivationText.classList.add('fade-in');
        setTimeout(() => {
            this.elements.motivationText.classList.remove('fade-in');
        }, 1000);
    }
    
    sendNotifications(days, hours, minutes) {
        // Уведомление за 7 дней
        if (days === 7 && hours === 0 && minutes === 0) {
            this.sendNotification('Ровно неделя до старта соревнований по спортивному туризму!');
        }
        
        // Уведомление за 1 день
        if (days === 1 && hours === 0 && minutes === 0) {
            this.sendNotification('Остался 1 день до начала соревнований!');
        }
        
        // Уведомление за 1 час
        if (days === 0 && hours === 1 && minutes === 0) {
            this.sendNotification('Всего 1 час до старта соревнований!');
        }
    }
    
    sendNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('Спортивный туризм 2025', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏔️</text></svg>'
            });
        }
    }
    
    startCelebration() {
        // Добавляем CSS для анимаций
        const style = document.createElement('style');
        style.textContent = `
            .pulse-animation {
                animation: pulse 0.5s ease-in-out infinite alternate;
            }
            
            .fade-in {
                animation: fadeIn 1s ease-in-out;
            }
            
            @keyframes pulse {
                from { transform: scale(1); }
                to { transform: scale(1.05); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Запускаем конфетти-эффект
        this.createConfetti();
    }
    
    createConfetti() {
        const colors = ['#4facfe', '#00f2fe', '#ffd700', '#4CAF50', '#ff9800'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Анимация падения
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            // Удаляем после анимации
            animation.onfinish = () => confetti.remove();
        }
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const countdown = new SportsCountdown();
    
    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        .pulse-animation {
            animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});
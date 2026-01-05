// Файл weather.js - Получение реальной погоды для Архипо-Осиповки
class LiveWeather {
    constructor() {
        // ⚠️ ЗАМЕНИТЕ ЭТОТ КЛЮЧ НА ВАШ НАСТОЯЩИЙ КЛЮЧ ОТ OPENWEATHERMAP
        this.apiKey = 'f0223a950652fa67c4f8d83b67118876';
        
        // Используем координаты Архипо-Осиповки (более надежно)
        this.lat = 44.3644;
        this.lon = 38.5303;
        
        this.units = 'metric'; // Градусы Цельсия
        this.lang = 'ru';
        this.updateInterval = 10 * 60 * 1000; // Каждые 10 минут

        this.elements = {
            temp: document.getElementById('weatherTemp'),
            condition: document.getElementById('weatherCondition'),
            windSpeed: document.getElementById('windSpeed'),
            icon: document.getElementById('weatherIcon'),
            updateTime: document.getElementById('updateTime')
        };

        // Сопоставление иконок OpenWeatherMap с эмодзи
        this.iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '⛅',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌦️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };

        this.init();
    }

    async init() {
        await this.fetchWeather();
        setInterval(() => this.fetchWeather(), this.updateInterval);
    }

    async fetchWeather() {
        try {
            // URL для запроса по координатам
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&units=${this.units}&lang=${this.lang}&appid=${this.apiKey}`;
            
            console.log('Запрашиваем погоду по URL:', url); // Для отладки
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.cod === 200) {
                this.updateDisplay(data);
            } else {
                throw new Error(`Ошибка API: ${data.message}`);
            }
            
        } catch (error) {
            console.error('Ошибка при получении погоды:', error);
            this.showError();
        }
    }

    updateDisplay(data) {
        console.log('Получены данные:', data); // Для отладки
        
        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const iconCode = data.weather[0].icon;
        const cityName = data.name;

        this.elements.temp.textContent = `${temp}°C`;
        this.elements.condition.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
        this.elements.windSpeed.textContent = windSpeed.toFixed(1);
        this.elements.icon.textContent = this.iconMap[iconCode] || '⛅';
        this.elements.updateTime.textContent = new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // Меняем цвет рамки в зависимости от температуры
        this.updateWeatherCardStyle(temp);
    }

    updateWeatherCardStyle(temp) {
        const card = document.querySelector('.weather-info');
        if (!card) return;
        
        if (temp < 0) {
            card.style.borderColor = '#4dabf7'; // Холодно - синий
        } else if (temp > 20) {
            card.style.borderColor = '#ff9800'; // Тепло - оранжевый
        } else {
            card.style.borderColor = '#4CAF50'; // Нормально - зеленый
        }
    }

    showError() {
        this.elements.temp.textContent = '--°C';
        this.elements.condition.textContent = 'Данные временно недоступны';
        this.elements.windSpeed.textContent = '--';
        this.elements.icon.textContent = '❓';
        this.elements.updateTime.textContent = '--:--';
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    new LiveWeather();
});
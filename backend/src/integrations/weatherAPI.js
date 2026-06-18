import axios from 'axios';
import config from '../config/env.js';

class WeatherAPI {
    constructor() {
        this.apiKey = config.openWeather.apiKey;
        this.baseUrl = config.openWeather.baseUrl;
    }

    async getCurrentWeather(city) {
        try {
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric',
                    lang: 'es'
                }
            });

            return {
                success: true,
                data: {
                    city: response.data.name,
                    country: response.data.sys.country,
                    temperature: Math.round(response.data.main.temp),
                    feels_like: Math.round(response.data.main.feels_like),
                    humidity: response.data.main.humidity,
                    description: response.data.weather[0].description,
                    icon: response.data.weather[0].icon,
                    wind_speed: response.data.wind.speed,
                    timestamp: new Date().toISOString()
                },
                api: 'OpenWeather'
            };
        } catch (error) {
            console.error('Error en WeatherAPI:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                throw new Error('⏳ API de clima en activación (espera 2 horas)');
            } else if (error.response?.status === 429) {
                throw new Error('Límite de uso de OpenWeather excedido');
            } else if (error.response?.status === 404) {
                throw new Error(`Ciudad "${city}" no encontrada`);
            } else {
                throw new Error('Error al consultar el clima');
            }
        }
    }
}

export default new WeatherAPI();
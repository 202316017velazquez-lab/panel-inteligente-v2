// backend/src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    openWeather: {
        apiKey: process.env.OPENWEATHER_API_KEY,
        baseUrl: process.env.OPENWEATHER_BASE_URL || 'http://api.openweathermap.org/data/2.5'
    },
    nasa: {
        apiKey: process.env.NASA_API_KEY,
        baseUrl: process.env.NASA_BASE_URL || 'https://api.nasa.gov'
    },
    news: {
        apiKey: process.env.NEWS_API_KEY,
        baseUrl: process.env.NEWS_BASE_URL || 'https://newsapi.org/v2'
    },
    github: {
        baseUrl: process.env.GITHUB_BASE_URL || 'https://api.github.com'
    }
};
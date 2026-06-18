import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    openWeather: {
        apiKey: process.env.OPENWEATHER_API_KEY,
        baseUrl: process.env.OPENWEATHER_BASE_URL
    },
    nasa: {
        apiKey: process.env.NASA_API_KEY,
        baseUrl: process.env.NASA_BASE_URL
    },
    news: {
        apiKey: process.env.NEWS_API_KEY,
        baseUrl: process.env.NEWS_BASE_URL
    },
    github: {
        baseUrl: process.env.GITHUB_BASE_URL
    }
};
// frontend/js/config.js
// Configuración automática para local y producción

const getApiUrl = () => {
    // Detectar si estamos en producción
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' &&
                        !window.location.hostname.includes('192.168');
    
    // ✅ URL DE TU BACKEND EN RENDER (¡LA CORRECTA!)
    const PRODUCTION_API_URL = 'https://panel-inteligente-v2.onrender.com/api';
    
    if (isProduction) {
        return PRODUCTION_API_URL;
    }
    
    // URL para desarrollo local
    return 'http://localhost:3000/api';
};

export const CONFIG = {
    API_BASE_URL: getApiUrl(),
    isProduction: window.location.hostname !== 'localhost' && 
                  window.location.hostname !== '127.0.0.1'
};

console.log(`🌍 Entorno: ${CONFIG.isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log(`🔗 API URL: ${CONFIG.API_BASE_URL}`);
// frontend/js/config.js
// Configuración automática para local y producción

const getApiUrl = () => {
    // Detectar si estamos en producción
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' &&
                        !window.location.hostname.includes('192.168');
    
    // 🔥 CAMBIA ESTA URL por la de tu backend en Render
    const PRODUCTION_API_URL = 'https://panel-inteligente-api.onrender.com/api';
    
    // Si estamos en producción (Render, Cyclic, etc.)
    if (isProduction) {
        return PRODUCTION_API_URL;
    }
    
    // Si estamos en local (desarrollo)
    return 'http://localhost:3000/api';
};

// Exportar configuración
export const CONFIG = {
    API_BASE_URL: getApiUrl(),
    isProduction: window.location.hostname !== 'localhost' && 
                  window.location.hostname !== '127.0.0.1'
};

console.log(`🌍 Entorno: ${CONFIG.isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log(`🔗 API URL: ${CONFIG.API_BASE_URL}`);
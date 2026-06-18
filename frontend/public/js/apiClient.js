// frontend/js/apiClient.js
import { CONFIG } from './config.js';

export class APIClient {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
        this.cache = new Map();
        console.log('🔗 API Client URL:', this.baseUrl);
    }

    async request(endpoint, options = {}, useCache = true) {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = url + JSON.stringify(options);
        
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) {
                console.log('📦 Usando caché para:', url);
                return cached.data;
            }
        }
        
        console.log(`📡 Petición a: ${url}`);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            console.log(`📥 Estado: ${response.status}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Error ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Datos recibidos');
            
            if (useCache) {
                this.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
            }
            
            return data;
        } catch (error) {
            console.error('❌ Error:', error);
            throw error;
        }
    }

    // ===== CLIMA =====
    async getCurrentWeather(city) {
        return this.request(`/weather/current?city=${encodeURIComponent(city)}`, {}, false);
    }

    // ===== NASA =====
    async getAPOD() {
        return this.request('/nasa/apod', {}, true);
    }

    // ===== NOTICIAS =====
    async getTopHeadlines(topic = 'technology', country = 'us') {
        return this.request(`/news/headlines?topic=${encodeURIComponent(topic)}&country=${country}`, {}, false);
    }

    // ===== GITHUB =====
    async getRepoInfo(owner, repo) {
        return this.request(`/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`, {}, false);
    }

    // ===== ADMINISTRACIÓN =====
    async getConsultas() {
        return this.request('/admin/consultas');
    }

    async getEstadisticas() {
        return this.request('/admin/estadisticas');
    }

    // ===== FAVORITOS =====
    async guardarFavorito(consulta) {
        return this.request('/favoritos', {
            method: 'POST',
            body: JSON.stringify({ consulta })
        });
    }

    async getFavoritos() {
        return this.request('/favoritos');
    }

    async eliminarFavorito(id) {
        return this.request(`/favoritos/${id}`, {
            method: 'DELETE'
        });
    }
}
import axios from 'axios';
import config from '../config/env.js';

class NewsAPI {
    constructor() {
        this.apiKey = config.news.apiKey;
        this.baseUrl = config.news.baseUrl;
    }

    async getTopHeadlines(topic = 'technology', country = 'us') {
        try {
            // Buscar en varios idiomas si no encuentra en español
            const languages = ['es', 'en'];
            let allArticles = [];
            
            for (const lang of languages) {
                try {
                    const response = await axios.get(`${this.baseUrl}/everything`, {
                        params: {
                            q: topic,
                            language: lang,
                            apiKey: this.apiKey,
                            pageSize: 5,
                            sortBy: 'publishedAt'
                        }
                    });
                    
                    if (response.data.articles && response.data.articles.length > 0) {
                        allArticles = [...allArticles, ...response.data.articles];
                    }
                } catch (e) {
                    // Si falla un idioma, continuar con el siguiente
                    console.log(`No se encontraron noticias en ${lang}`);
                }
            }

            // Si no hay artículos, intentar con búsqueda más amplia
            if (allArticles.length === 0) {
                const response = await axios.get(`${this.baseUrl}/everything`, {
                    params: {
                        q: topic,
                        apiKey: this.apiKey,
                        pageSize: 5,
                        sortBy: 'publishedAt'
                    }
                });
                allArticles = response.data.articles || [];
            }

            const articles = allArticles.slice(0, 10).map(article => ({
                title: article.title || 'Sin título',
                description: article.description || 'Sin descripción',
                url: article.url || '#',
                source: article.source?.name || 'Fuente desconocida',
                publishedAt: article.publishedAt || new Date().toISOString(),
                author: article.author || 'Autor desconocido',
                imageUrl: article.urlToImage
            }));

            return {
                success: true,
                data: {
                    articles,
                    total: articles.length,
                    topic,
                    country
                },
                api: 'NewsAPI'
            };
        } catch (error) {
            console.error('Error en NewsAPI:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                throw new Error('Credenciales de NewsAPI inválidas');
            } else if (error.response?.status === 429) {
                throw new Error('Límite de uso de NewsAPI excedido');
            } else {
                throw new Error('Error al consultar noticias');
            }
        }
    }
}

export default new NewsAPI();
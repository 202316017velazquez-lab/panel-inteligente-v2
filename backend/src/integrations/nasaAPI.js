import axios from 'axios';
import config from '../config/env.js';

class NASAAPI {
    constructor() {
        this.apiKey = config.nasa.apiKey;
        this.baseUrl = config.nasa.baseUrl;
    }

    async getAPOD() {
        try {
            const response = await axios.get(`${this.baseUrl}/planetary/apod`, {
                params: {
                    api_key: this.apiKey,
                    thumbs: true
                }
            });

            return {
                success: true,
                data: {
                    title: response.data.title,
                    explanation: response.data.explanation,
                    url: response.data.url,
                    hdurl: response.data.hdurl,
                    media_type: response.data.media_type,
                    date: response.data.date,
                    copyright: response.data.copyright || 'Dominio público'
                },
                api: 'NASA'
            };
        } catch (error) {
            console.error('Error en NASA API:', error.response?.data || error.message);
            
            if (error.response?.status === 403) {
                throw new Error('Credenciales de NASA inválidas');
            } else if (error.response?.status === 429) {
                throw new Error('Límite de uso de NASA API excedido');
            } else {
                throw new Error('Error al consultar NASA');
            }
        }
    }
}

export default new NASAAPI();
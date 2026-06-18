import { APIClient } from './apiClient.js';
import { UIManager } from './uiManager.js';

class App {
    constructor() {
        console.log('🚀 Inicializando aplicación...');
        this.api = new APIClient();
        this.ui = new UIManager();
        this.init();
    }

    init() {
        console.log('⚙️ Configurando event listeners...');
        
        document.getElementById('consultarBtn').addEventListener('click', () => {
            console.log('🖱️ Click en Consultar Todo');
            this.consultarTodo();
        });
        
        document.getElementById('favoritosBtn').addEventListener('click', () => {
            console.log('🖱️ Click en Favoritos');
            this.toggleFavoritos();
        });
        
        document.getElementById('adminBtn').addEventListener('click', () => {
            console.log('🖱️ Click en Admin');
            this.toggleAdmin();
        });
        
        document.getElementById('closeAdminBtn').addEventListener('click', () => {
            console.log('🖱️ Click en Cerrar Admin');
            this.ocultarAdmin();
        });
        
        document.getElementById('closeFavoritosBtn').addEventListener('click', () => {
            console.log('🖱️ Click en Cerrar Favoritos');
            this.ocultarFavoritos();
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-favorito')) {
                const btn = e.target.closest('.btn-favorito');
                const api = btn.dataset.api;
                const titulo = btn.dataset.titulo;
                console.log(`⭐ Guardando favorito: ${api} - ${titulo}`);
                this.guardarFavorito(api, titulo);
            }
            if (e.target.closest('.btn-eliminar')) {
                const btn = e.target.closest('.btn-eliminar');
                const id = btn.dataset.id;
                console.log(`🗑️ Eliminando favorito: ${id}`);
                this.eliminarFavorito(id);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                console.log('⌨️ Enter presionado en input');
                this.consultarTodo();
            }
        });

        this.consultarTodo();
    }

    async consultarTodo() {
        console.log('🔍 Iniciando consulta...');
        
        const city = document.getElementById('cityInput').value.trim() || 'Madrid';
        const topic = document.getElementById('topicInput').value.trim() || 'tecnología';
        const githubInput = document.getElementById('githubInput').value.trim() || 'facebook/react';
        const [owner, repo] = githubInput.split('/');
        
        console.log(`📝 Parámetros: Ciudad=${city}, Tema=${topic}, GitHub=${githubInput}`);

        // Resetear progreso
        this.ui.actualizarProgreso(0, 4, 'Iniciando consultas...');

        // Mostrar loading
        this.ui.mostrarLoading(this.ui.elements.weatherContent);
        this.ui.mostrarLoading(this.ui.elements.nasaContent);
        this.ui.mostrarLoading(this.ui.elements.newsContent);
        this.ui.mostrarLoading(this.ui.elements.githubContent);
        
        this.ui.actualizarBadge(this.ui.elements.weatherStatus, 'loading', 'Cargando...');
        this.ui.actualizarBadge(this.ui.elements.nasaStatus, 'loading', 'Cargando...');
        this.ui.actualizarBadge(this.ui.elements.newsStatus, 'loading', 'Cargando...');
        this.ui.actualizarBadge(this.ui.elements.githubStatus, 'loading', 'Cargando...');

        // Ejecutar consultas
        const timeout = (ms) => new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout de conexión')), ms)
        );

        const promises = [
            Promise.race([
                this.api.getCurrentWeather(city),
                timeout(10000)
            ]).catch(err => ({ success: false, error: err.message, api: 'OpenWeather' })),
            
            Promise.race([
                this.api.getAPOD(),
                timeout(15000)
            ]).catch(err => ({ success: false, error: err.message, api: 'NASA' })),
            
            Promise.race([
                this.api.getTopHeadlines(topic),
                timeout(10000)
            ]).catch(err => ({ success: false, error: err.message, api: 'NewsAPI' })),
            
            Promise.race([
                this.api.getRepoInfo(owner || 'facebook', repo || 'react'),
                timeout(10000)
            ]).catch(err => ({ success: false, error: err.message, api: 'GitHub' }))
        ];

        try {
            this.ui.actualizarProgreso(0, 4, 'Consultando APIs...');
            
            const results = await Promise.all(promises);
            console.log('📥 Resultados:', results);

            // Procesar cada resultado
            const [weather, nasa, news, github] = results;

            // Clima
            if (weather.success) {
                this.ui.renderWeather(weather);
            } else {
                const mensaje = weather.error.includes('activación') 
                    ? '⏳ API de clima en activación (espera 2 horas)'
                    : `Error: ${weather.error}`;
                this.ui.mostrarError(this.ui.elements.weatherContent, mensaje);
                this.ui.actualizarBadge(this.ui.elements.weatherStatus, 'warning', '⏳ Pendiente');
            }
            this.ui.actualizarProgreso(1, 4, 'Clima completado');

            // NASA
            if (nasa.success) {
                setTimeout(() => {
                    this.ui.renderNASA(nasa);
                }, 100);
            } else {
                this.ui.mostrarError(this.ui.elements.nasaContent, `Error: ${nasa.error}`);
                this.ui.actualizarBadge(this.ui.elements.nasaStatus, 'error', 'Error');
            }
            this.ui.actualizarProgreso(2, 4, 'NASA completado');

            // Noticias
            if (news.success) {
                this.ui.renderNews(news);
            } else {
                this.ui.mostrarError(this.ui.elements.newsContent, `Error: ${news.error}`);
                this.ui.actualizarBadge(this.ui.elements.newsStatus, 'error', 'Error');
            }
            this.ui.actualizarProgreso(3, 4, 'Noticias completado');

            // GitHub
            if (github.success) {
                this.ui.renderGitHub(github);
            } else {
                this.ui.mostrarError(this.ui.elements.githubContent, `Error: ${github.error}`);
                this.ui.actualizarBadge(this.ui.elements.githubStatus, 'error', 'Error');
            }
            this.ui.actualizarProgreso(4, 4, '¡Completado!');

            // Ocultar progreso después de un momento
            setTimeout(() => {
                this.ui.actualizarProgreso(4, 4, '✅ Todas las consultas completadas');
            }, 500);

        } catch (error) {
            console.error('❌ Error general:', error);
            this.ui.actualizarProgreso(0, 4, '❌ Error en la consulta');
        }
    }

    async toggleAdmin() {
        const panel = this.ui.elements.adminPanel;
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            await this.cargarDatosAdmin();
        } else {
            panel.style.display = 'none';
        }
    }

    ocultarAdmin() {
        this.ui.elements.adminPanel.style.display = 'none';
    }

    async cargarDatosAdmin() {
        console.log('📊 Cargando datos de administración...');
        try {
            const [estadisticas, consultas] = await Promise.all([
                this.api.getEstadisticas(),
                this.api.getConsultas()
            ]);
            
            this.ui.renderEstadisticas(estadisticas);
            this.ui.renderConsultas(consultas.data);
            console.log('✅ Datos de admin cargados');
        } catch (error) {
            console.error('❌ Error cargando datos de admin:', error);
            this.ui.elements.estadisticasContent.innerHTML = 
                `<p style="color:#fc8181;">Error: ${error.message}</p>`;
            this.ui.elements.consultasContent.innerHTML = 
                `<p style="color:#fc8181;">Error: ${error.message}</p>`;
        }
    }

    async toggleFavoritos() {
        const panel = this.ui.elements.favoritosPanel;
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            await this.cargarFavoritos();
        } else {
            panel.style.display = 'none';
        }
    }

    ocultarFavoritos() {
        this.ui.elements.favoritosPanel.style.display = 'none';
    }

    async cargarFavoritos() {
        console.log('⭐ Cargando favoritos...');
        try {
            const result = await this.api.getFavoritos();
            this.ui.renderFavoritos(result.data);
            console.log('✅ Favoritos cargados');
        } catch (error) {
            console.error('❌ Error cargando favoritos:', error);
            this.ui.elements.favoritosContent.innerHTML = 
                `<p style="color:#fc8181;">Error: ${error.message}</p>`;
        }
    }

    async guardarFavorito(api, titulo) {
        console.log(`⭐ Guardando favorito: ${api} - ${titulo}`);
        try {
            const consulta = {
                api,
                titulo,
                fecha: new Date().toISOString(),
                parametros: {
                    ciudad: document.getElementById('cityInput').value,
                    tema: document.getElementById('topicInput').value,
                    github: document.getElementById('githubInput').value
                }
            };
            
            await this.api.guardarFavorito(consulta);
            alert('✅ Consulta guardada como favorita');
            
            if (this.ui.elements.favoritosPanel.style.display !== 'none') {
                await this.cargarFavoritos();
            }
        } catch (error) {
            console.error('❌ Error guardando favorito:', error);
            alert(`❌ Error al guardar favorito: ${error.message}`);
        }
    }

    async eliminarFavorito(id) {
        if (!confirm('¿Eliminar este favorito?')) return;
        
        console.log(`🗑️ Eliminando favorito: ${id}`);
        try {
            await this.api.eliminarFavorito(id);
            await this.cargarFavoritos();
        } catch (error) {
            console.error('❌ Error eliminando favorito:', error);
            alert(`❌ Error al eliminar favorito: ${error.message}`);
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, iniciando App...');
    new App();
});
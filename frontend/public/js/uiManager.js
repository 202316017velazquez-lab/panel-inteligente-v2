export class UIManager {
    constructor() {
        this.elements = {
            weatherContent: document.getElementById('weatherContent'),
            weatherStatus: document.getElementById('weatherStatus'),
            nasaContent: document.getElementById('nasaContent'),
            nasaStatus: document.getElementById('nasaStatus'),
            newsContent: document.getElementById('newsContent'),
            newsStatus: document.getElementById('newsStatus'),
            githubContent: document.getElementById('githubContent'),
            githubStatus: document.getElementById('githubStatus'),
            adminPanel: document.getElementById('adminPanel'),
            favoritosPanel: document.getElementById('favoritosPanel'),
            estadisticasContent: document.getElementById('estadisticasContent'),
            consultasContent: document.getElementById('consultasContent'),
            favoritosContent: document.getElementById('favoritosContent')
        };
        
        // Referencias al progress bar
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.progressCount = document.getElementById('progressCount');
    }

    actualizarProgreso(completados, total, texto) {
        if (this.progressBar) {
            const porcentaje = (completados / total) * 100;
            this.progressBar.style.width = `${porcentaje}%`;
            this.progressBar.style.transition = 'width 0.5s ease';
        }
        if (this.progressText) {
            this.progressText.textContent = texto || `Procesando ${completados}/${total}`;
        }
        if (this.progressCount) {
            this.progressCount.textContent = `${completados}/${total}`;
        }
    }

    mostrarError(element, mensaje) {
        element.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <i class="fas fa-exclamation-circle" style="color:#fc8181;font-size:2rem;"></i>
                <p style="color:#9b2c2c;margin-top:10px;">${mensaje}</p>
            </div>
        `;
    }

    mostrarLoading(element) {
        element.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Cargando...
            </div>
        `;
    }

    actualizarBadge(element, estado, mensaje = '') {
        element.className = `badge ${estado}`;
        element.textContent = mensaje || estado.charAt(0).toUpperCase() + estado.slice(1);
    }

    renderWeather(data) {
        const { weatherContent, weatherStatus } = this.elements;
        
        if (!data.success) {
            this.mostrarError(weatherContent, data.error);
            this.actualizarBadge(weatherStatus, 'warning', '⏳ Pendiente');
            return;
        }

        const d = data.data;
        weatherContent.innerHTML = `
            <div class="weather-info">
                <div class="weather-main">
                    <div class="temp">${d.temperature}°C</div>
                    <div style="font-size:1rem;color:#718096;">${d.description}</div>
                    <div style="font-size:0.9rem;color:#718096;">${d.city}, ${d.country}</div>
                </div>
                <div class="weather-detail">
                    <span class="label">Sensación térmica</span>
                    <span class="value">${d.feels_like}°C</span>
                </div>
                <div class="weather-detail">
                    <span class="label">Humedad</span>
                    <span class="value">${d.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <span class="label">Viento</span>
                    <span class="value">${d.wind_speed} m/s</span>
                </div>
            </div>
            <div style="margin-top:10px;text-align:center;">
                <button class="btn-favorito" data-api="OpenWeather" data-titulo="Clima en ${d.city}">
                    <i class="fas fa-star"></i> Guardar favorito
                </button>
            </div>
        `;
        
        this.actualizarBadge(weatherStatus, 'success', '✓ OK');
    }

    renderNASA(data) {
        const { nasaContent, nasaStatus } = this.elements;
        
        if (!data.success) {
            this.mostrarError(nasaContent, data.error);
            this.actualizarBadge(nasaStatus, 'error', 'Error');
            return;
        }

        const d = data.data;
        
        const imageHtml = d.media_type === 'image' 
            ? `<img src="${d.url}" alt="${d.title}" loading="lazy" 
                  style="max-width:100%; border-radius:10px; margin-bottom:10px; min-height:200px; background:#f7fafc;"
                  onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2216%22%3EImagen no disponible%3C/text%3E%3C/svg%3E'">`
            : `<video controls style="max-width:100%; border-radius:10px;">
                <source src="${d.url}" type="video/mp4">
                Tu navegador no soporta video.
              </video>`;

        nasaContent.innerHTML = `
            <div class="nasa-content">
                ${imageHtml}
                <div style="font-weight:600;color:#2d3748;margin-top:10px;">${d.title}</div>
                <div style="color:#718096;font-size:0.9rem;margin-top:5px;max-height:100px;overflow-y:auto;">
                    ${d.explanation.substring(0, 200)}${d.explanation.length > 200 ? '...' : ''}
                </div>
                <div style="font-size:0.8rem;color:#718096;margin-top:5px;">
                    📅 ${d.date} ${d.copyright ? `• © ${d.copyright.substring(0, 30)}${d.copyright.length > 30 ? '...' : ''}` : ''}
                </div>
            </div>
            <div style="margin-top:10px;text-align:center;">
                <button class="btn-favorito" data-api="NASA" data-titulo="${d.title.substring(0, 50)}">
                    <i class="fas fa-star"></i> Guardar favorito
                </button>
            </div>
        `;
        
        this.actualizarBadge(nasaStatus, 'success', '✓ OK');
    }

    renderNews(data) {
        const { newsContent, newsStatus } = this.elements;
        
        if (!data.success) {
            this.mostrarError(newsContent, data.error);
            this.actualizarBadge(newsStatus, 'error', 'Error');
            return;
        }

        const d = data.data;
        if (!d.articles || d.articles.length === 0) {
            newsContent.innerHTML = `
                <div style="text-align:center; padding:20px;">
                    <i class="fas fa-newspaper" style="font-size:2rem; color:#a0aec0;"></i>
                    <p style="color:#718096;margin-top:10px;">No se encontraron noticias para "${d.topic}"</p>
                    <p style="color:#a0aec0;font-size:0.9rem;">Intenta con otro tema como: tecnología, ciencia, deportes</p>
                </div>
            `;
            this.actualizarBadge(newsStatus, 'warning', 'Sin resultados');
            return;
        }

        let html = '';
        d.articles.slice(0, 5).forEach(article => {
            html += `
                <div class="news-item">
                    <div class="title">
                        <a href="${article.url}" target="_blank">${article.title}</a>
                    </div>
                    <div style="font-size:0.85rem;color:#718096;">
                        ${article.source} • ${new Date(article.publishedAt).toLocaleDateString('es-ES')}
                    </div>
                </div>
            `;
        });

        newsContent.innerHTML = html;
        this.actualizarBadge(newsStatus, 'success', `${d.articles.length} noticias`);
    }

    renderGitHub(data) {
        const { githubContent, githubStatus } = this.elements;
        
        if (!data.success) {
            this.mostrarError(githubContent, data.error);
            this.actualizarBadge(githubStatus, 'error', 'Error');
            return;
        }

        const d = data.data;
        githubContent.innerHTML = `
            <div class="github-content">
                <div style="text-align:center;font-weight:600;font-size:1.2rem;color:#2d3748;">
                    <a href="${d.html_url}" target="_blank" style="color:#667eea;text-decoration:none;">
                        ${d.full_name}
                    </a>
                </div>
                <div style="text-align:center;color:#718096;margin:5px 0;">${d.description || 'Sin descripción'}</div>
                <div class="repo-info">
                    <div class="stat">
                        <div class="number">${d.stars}</div>
                        <div class="label">⭐ Stars</div>
                    </div>
                    <div class="stat">
                        <div class="number">${d.forks}</div>
                        <div class="label">🔀 Forks</div>
                    </div>
                    <div class="stat">
                        <div class="number">${d.open_issues}</div>
                        <div class="label">🐛 Issues</div>
                    </div>
                    <div class="stat">
                        <div class="number">${d.language || 'N/A'}</div>
                        <div class="label">Lenguaje</div>
                    </div>
                </div>
            </div>
            <div style="margin-top:10px;text-align:center;">
                <button class="btn-favorito" data-api="GitHub" data-titulo="Repositorio: ${d.name}">
                    <i class="fas fa-star"></i> Guardar favorito
                </button>
            </div>
        `;
        
        this.actualizarBadge(githubStatus, 'success', '✓ OK');
    }

    renderEstadisticas(data) {
        const { estadisticasContent } = this.elements;
        
        if (!data.success) {
            estadisticasContent.innerHTML = `<p style="color:#fc8181;">Error: ${data.error}</p>`;
            return;
        }

        const d = data.data;
        let html = `
            <div class="estadistica-item">
                <span>Total consultas</span>
                <span><strong>${d.total}</strong></span>
            </div>
            <div class="estadistica-item">
                <span>Exitosas</span>
                <span><strong style="color:#48bb78;">${d.exitos}</strong></span>
            </div>
            <div class="estadistica-item">
                <span>Errores</span>
                <span><strong style="color:#fc8181;">${d.errores}</strong></span>
            </div>
        `;

        for (const [api, count] of Object.entries(d.porAPI)) {
            html += `
                <div class="estadistica-item">
                    <span>${api}</span>
                    <span><strong>${count}</strong></span>
                </div>
            `;
        }

        html += `<div style="margin-top:10px;border-top:2px solid #e2e8f0;padding-top:10px;">`;
        for (const [api, tiempo] of Object.entries(d.tiemposPromedio)) {
            html += `
                <div class="estadistica-item">
                    <span>⏱ ${api} (promedio)</span>
                    <span><strong>${tiempo}ms</strong></span>
                </div>
            `;
        }
        html += `</div>`;

        estadisticasContent.innerHTML = html;
    }

    renderConsultas(consultas) {
        const { consultasContent } = this.elements;
        
        if (!consultas || consultas.length === 0) {
            consultasContent.innerHTML = '<p style="color:#718096;">No hay consultas registradas.</p>';
            return;
        }

        let html = '';
        consultas.slice(0, 20).forEach(c => {
            const isError = c.estado === 'error';
            html += `
                <div class="consulta-item ${isError ? 'error' : ''}">
                    <div style="font-weight:600;color:#2d3748;">${c.api}</div>
                    <div style="color:#718096;font-size:0.9rem;">📌 ${c.parametro || 'Sin parámetro'}</div>
                    <div style="font-size:0.8rem;color:#a0aec0;">${new Date(c.fecha).toLocaleString()}</div>
                    <div style="font-size:0.85rem;color:${isError ? '#9b2c2c' : '#2d3748'};">
                        ${isError ? '❌ Error' : '✅ Éxito'} • ${c.tiempoRespuesta || 0}ms
                    </div>
                </div>
            `;
        });

        consultasContent.innerHTML = html;
    }

    renderFavoritos(favoritos) {
        const { favoritosContent } = this.elements;
        
        if (!favoritos || favoritos.length === 0) {
            favoritosContent.innerHTML = '<p style="color:#718096;">No tienes consultas favoritas.</p>';
            return;
        }

        let html = '';
        favoritos.forEach(f => {
            html += `
                <div class="favorito-item" data-id="${f.id}">
                    <div class="info">
                        <div style="font-weight:600;color:#2d3748;">${f.titulo || 'Consulta favorita'}</div>
                        <div style="color:#718096;font-size:0.9rem;">${f.api} • ${new Date(f.fecha).toLocaleDateString()}</div>
                    </div>
                    <button class="btn-eliminar" data-id="${f.id}" style="background:#fc8181;color:white;border:none;padding:5px 12px;border-radius:5px;cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        favoritosContent.innerHTML = html;
    }
}
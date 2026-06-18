import consultaModel from '../models/consultaModel.js';

class AuditoriaService {
    async registrarConsulta(api, parametro, respuesta, estado, tiempoRespuesta) {
        return await consultaModel.guardarConsulta({
            api,
            parametro,
            respuesta: this.resumirRespuesta(respuesta),
            estado,
            tiempoRespuesta
        });
    }

    resumirRespuesta(respuesta) {
        if (!respuesta) return null;
        
        const resumen = {};
        if (respuesta.data?.city) resumen.city = respuesta.data.city;
        if (respuesta.data?.temperature) resumen.temperature = respuesta.data.temperature;
        if (respuesta.data?.title) resumen.title = respuesta.data.title;
        if (respuesta.data?.articles) resumen.articles_count = respuesta.data.articles.length;
        if (respuesta.data?.name) resumen.name = respuesta.data.name;
        
        return resumen;
    }

    async obtenerEstadisticas() {
        const consultas = await consultaModel.obtenerConsultas(1000);
        
        const estadisticas = {
            total: consultas.length,
            porAPI: {},
            errores: 0,
            exitos: 0,
            tiemposPromedio: {}
        };

        consultas.forEach(c => {
            if (!estadisticas.porAPI[c.api]) {
                estadisticas.porAPI[c.api] = 0;
            }
            estadisticas.porAPI[c.api]++;

            if (c.estado === 'error') {
                estadisticas.errores++;
            } else {
                estadisticas.exitos++;
            }

            if (c.tiempoRespuesta) {
                if (!estadisticas.tiemposPromedio[c.api]) {
                    estadisticas.tiemposPromedio[c.api] = [];
                }
                estadisticas.tiemposPromedio[c.api].push(c.tiempoRespuesta);
            }
        });

        Object.keys(estadisticas.tiemposPromedio).forEach(api => {
            const tiempos = estadisticas.tiemposPromedio[api];
            estadisticas.tiemposPromedio[api] = Math.round(
                tiempos.reduce((a, b) => a + b, 0) / tiempos.length
            );
        });

        return estadisticas;
    }
}

export default new AuditoriaService();
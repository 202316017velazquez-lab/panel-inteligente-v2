import express from 'express';
import weatherAPI from '../integrations/weatherAPI.js';
import nasaAPI from '../integrations/nasaAPI.js';
import newsAPI from '../integrations/newsAPI.js';
import githubAPI from '../integrations/githubAPI.js';
import auditoriaService from '../services/auditoriaService.js';
import consultaModel from '../models/consultaModel.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.use(limiter);

// Middleware para registrar consultas
const registrarConsulta = async (api, parametro, respuesta, error = null) => {
    const estado = error ? 'error' : 'exito';
    const tiempoRespuesta = respuesta?.tiempoRespuesta || 0;
    
    await auditoriaService.registrarConsulta(
        api,
        parametro,
        respuesta,
        estado,
        tiempoRespuesta
    );
};

// ===== CLIMA =====
router.get('/weather/current', async (req, res) => {
    const { city } = req.query;
    const startTime = Date.now();
    
    try {
        if (!city) {
            return res.status(400).json({ error: 'Se requiere el parámetro "city"' });
        }

        const result = await weatherAPI.getCurrentWeather(city);
        result.tiempoRespuesta = Date.now() - startTime;
        
        await registrarConsulta('OpenWeather', city, result);
        
        res.json(result);
    } catch (error) {
        const tiempoRespuesta = Date.now() - startTime;
        await registrarConsulta('OpenWeather', city, null, error);
        
        res.status(error.message.includes('Credenciales') ? 401 : 
                 error.message.includes('Límite') ? 429 : 
                 error.message.includes('no encontrada') ? 404 : 500)
            .json({
                success: false,
                error: error.message,
                api: 'OpenWeather',
                tiempoRespuesta
            });
    }
});

// ===== NASA =====
router.get('/nasa/apod', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const result = await nasaAPI.getAPOD();
        result.tiempoRespuesta = Date.now() - startTime;
        
        await registrarConsulta('NASA', 'apod', result);
        
        res.json(result);
    } catch (error) {
        const tiempoRespuesta = Date.now() - startTime;
        await registrarConsulta('NASA', 'apod', null, error);
        
        res.status(error.message.includes('Credenciales') ? 401 : 
                 error.message.includes('Límite') ? 429 : 500)
            .json({
                success: false,
                error: error.message,
                api: 'NASA',
                tiempoRespuesta
            });
    }
});

// ===== NOTICIAS =====
router.get('/news/headlines', async (req, res) => {
    const { topic, country } = req.query;
    const startTime = Date.now();
    
    try {
        const result = await newsAPI.getTopHeadlines(topic || 'technology', country || 'us');
        result.tiempoRespuesta = Date.now() - startTime;
        
        await registrarConsulta('NewsAPI', `headlines_${topic}_${country}`, result);
        
        res.json(result);
    } catch (error) {
        const tiempoRespuesta = Date.now() - startTime;
        await registrarConsulta('NewsAPI', `headlines_${topic}_${country}`, null, error);
        
        res.status(error.message.includes('Credenciales') ? 401 : 
                 error.message.includes('Límite') ? 429 : 500)
            .json({
                success: false,
                error: error.message,
                api: 'NewsAPI',
                tiempoRespuesta
            });
    }
});

// ===== GITHUB =====
router.get('/github/repo', async (req, res) => {
    const { owner, repo } = req.query;
    const startTime = Date.now();
    
    try {
        if (!owner || !repo) {
            return res.status(400).json({ error: 'Se requieren los parámetros "owner" y "repo"' });
        }

        const result = await githubAPI.getRepoInfo(owner, repo);
        result.tiempoRespuesta = Date.now() - startTime;
        
        await registrarConsulta('GitHub', `repo_${owner}_${repo}`, result);
        
        res.json(result);
    } catch (error) {
        const tiempoRespuesta = Date.now() - startTime;
        await registrarConsulta('GitHub', `repo_${owner}_${repo}`, null, error);
        
        res.status(error.message.includes('no encontrado') ? 404 : 
                 error.message.includes('Límite') ? 429 : 500)
            .json({
                success: false,
                error: error.message,
                api: 'GitHub',
                tiempoRespuesta
            });
    }
});

// ===== ADMINISTRACIÓN =====
router.get('/admin/consultas', async (req, res) => {
    try {
        const consultas = await consultaModel.obtenerConsultas(50);
        res.json({
            success: true,
            data: consultas,
            total: consultas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener consultas'
        });
    }
});

router.get('/admin/estadisticas', async (req, res) => {
    try {
        const estadisticas = await auditoriaService.obtenerEstadisticas();
        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas'
        });
    }
});

// ===== FAVORITOS =====
let favoritos = [];

router.post('/favoritos', async (req, res) => {
    try {
        const { consulta } = req.body;
        
        if (!consulta) {
            return res.status(400).json({ error: 'Se requiere el objeto "consulta"' });
        }

        const nuevoFavorito = {
            id: Date.now().toString(),
            ...consulta,
            fecha: new Date().toISOString()
        };
        
        favoritos.push(nuevoFavorito);
        
        res.json({
            success: true,
            data: nuevoFavorito
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al guardar favorito'
        });
    }
});

router.get('/favoritos', async (req, res) => {
    try {
        res.json({
            success: true,
            data: favoritos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener favoritos'
        });
    }
});

router.delete('/favoritos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        favoritos = favoritos.filter(f => f.id !== id);
        
        res.json({
            success: true,
            message: 'Favorito eliminado'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al eliminar favorito'
        });
    }
});

export default router;
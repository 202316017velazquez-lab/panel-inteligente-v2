import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Configurar dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== LOGGING =====
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ===== VERIFICAR QUE EXISTAN LOS ARCHIVOS DE RUTAS =====
console.log('📁 Verificando archivos...');
const routesPath = path.join(__dirname, 'src', 'routes', 'apiRoutes.js');
if (fs.existsSync(routesPath)) {
    console.log('✅ apiRoutes.js encontrado');
} else {
    console.log('❌ apiRoutes.js NO encontrado en:', routesPath);
}

// ===== IMPORTAR RUTAS =====
let apiRoutes;
try {
    // Importar dinámicamente las rutas
    const routesModule = await import('./src/routes/apiRoutes.js');
    apiRoutes = routesModule.default;
    console.log('✅ Rutas importadas correctamente');
} catch (error) {
    console.error('❌ Error importando rutas:', error);
    // Crear rutas de respaldo
    apiRoutes = express.Router();
    apiRoutes.get('/test', (req, res) => {
        res.json({ message: 'Rutas de respaldo funcionando' });
    });
}

// ===== RUTAS =====
app.use('/api', apiRoutes);

// ===== RUTAS DE PRUEBA (FUERA DE /api) =====
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        apis: ['OpenWeather', 'NASA', 'NewsAPI', 'GitHub'],
        version: '1.0.0'
    });
});

app.get('/api-test', (req, res) => {
    res.json({ 
        message: 'API test endpoint funcionando',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Panel Inteligente de Información - Backend',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            apiTest: 'GET /api-test',
            weather: 'GET /api/weather/current?city=Madrid',
            nasa: 'GET /api/nasa/apod',
            news: 'GET /api/news/headlines?topic=technology',
            github: 'GET /api/github/repo?owner=facebook&repo=react',
            admin: 'GET /api/admin/consultas',
            favorites: 'GET /api/favoritos'
        }
    });
});

// ===== MANEJADOR DE ERRORES 404 =====
app.use((req, res) => {
    console.log(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: `Ruta no encontrada: ${req.method} ${req.path}`,
        message: 'Verifica que la ruta sea correcta'
    });
});

// ===== MANEJADOR DE ERRORES GENERAL =====
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Error interno del servidor'
    });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Accesible desde: http://0.0.0.0:${PORT}`);
    console.log('\n📋 Prueba los endpoints:');
    console.log(`  ✅ GET http://localhost:${PORT}/health`);
    console.log(`  ✅ GET http://localhost:${PORT}/api-test`);
    console.log(`  ✅ GET http://localhost:${PORT}/api/weather/current?city=Madrid`);
    console.log(`  ✅ GET http://localhost:${PORT}/api/nasa/apod`);
    console.log(`  ✅ GET http://localhost:${PORT}/api/news/headlines?topic=technology`);
    console.log(`  ✅ GET http://localhost:${PORT}/api/github/repo?owner=facebook&repo=react`);
    console.log('\n📋 APIs disponibles:');
    console.log('  ✅ OpenWeather (Clima)');
    console.log('  ✅ NASA (Astronomía)');
    console.log('  ✅ NewsAPI (Noticias)');
    console.log('  ✅ GitHub (Repositorios)');
    console.log(`\n🌐 Servidor listo para recibir peticiones\n`);
});
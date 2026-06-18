import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, '../logs/consultas.json');

class ConsultaModel {
    constructor() {
        this.ensureLogFile();
    }

    async ensureLogFile() {
        try {
            // Verificar si el archivo existe
            await fs.access(LOG_FILE);
            
            // Verificar que el JSON sea válido
            const data = await fs.readFile(LOG_FILE, 'utf8');
            JSON.parse(data);
            
            console.log('✅ Archivo de logs válido');
        } catch (error) {
            // Si el archivo no existe o está corrupto, crearlo nuevo
            console.log('⚠️ Archivo de logs corrupto o inexistente, recreando...');
            try {
                await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
                await fs.writeFile(LOG_FILE, JSON.stringify([]));
                console.log('✅ Archivo de logs recreado correctamente');
            } catch (err) {
                console.error('❌ Error al recrear archivo de logs:', err);
            }
        }
    }

    async guardarConsulta(consulta) {
        try {
            // Leer el archivo actual
            let consultas = [];
            try {
                const data = await fs.readFile(LOG_FILE, 'utf8');
                consultas = JSON.parse(data);
            } catch (error) {
                // Si el archivo no existe o está corrupto, empezar con array vacío
                consultas = [];
            }
            
            // Agregar nueva consulta
            const nuevaConsulta = {
                id: Date.now().toString(),
                ...consulta,
                fecha: new Date().toISOString()
            };
            
            consultas.push(nuevaConsulta);
            
            // Guardar solo las últimas 1000 consultas
            if (consultas.length > 1000) {
                consultas = consultas.slice(-1000);
            }
            
            await fs.writeFile(LOG_FILE, JSON.stringify(consultas, null, 2));
            
            return nuevaConsulta;
        } catch (error) {
            console.error('❌ Error guardando consulta:', error);
            // No lanzar error para que no afecte a la respuesta de la API
            return null;
        }
    }

    async obtenerConsultas(limit = 50) {
        try {
            const data = await fs.readFile(LOG_FILE, 'utf8');
            const consultas = JSON.parse(data);
            return consultas.slice(-limit).reverse();
        } catch (error) {
            console.error('❌ Error obteniendo consultas:', error);
            return [];
        }
    }

    async obtenerConsultasPorAPI(api) {
        try {
            const data = await fs.readFile(LOG_FILE, 'utf8');
            const consultas = JSON.parse(data);
            return consultas.filter(c => c.api === api);
        } catch (error) {
            console.error('❌ Error obteniendo consultas por API:', error);
            return [];
        }
    }
}

export default new ConsultaModel();
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
            await fs.access(LOG_FILE);
        } catch {
            await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
            await fs.writeFile(LOG_FILE, JSON.stringify([]));
        }
    }

    async guardarConsulta(consulta) {
        try {
            const data = await fs.readFile(LOG_FILE, 'utf8');
            const consultas = JSON.parse(data);
            
            const nuevaConsulta = {
                id: Date.now().toString(),
                ...consulta,
                fecha: new Date().toISOString()
            };
            
            consultas.push(nuevaConsulta);
            await fs.writeFile(LOG_FILE, JSON.stringify(consultas, null, 2));
            
            return nuevaConsulta;
        } catch (error) {
            console.error('Error guardando consulta:', error);
            throw new Error('Error al guardar la consulta');
        }
    }

    async obtenerConsultas(limit = 50) {
        try {
            const data = await fs.readFile(LOG_FILE, 'utf8');
            const consultas = JSON.parse(data);
            return consultas.slice(-limit).reverse();
        } catch (error) {
            console.error('Error obteniendo consultas:', error);
            return [];
        }
    }
}

export default new ConsultaModel();
# Manual de Uso - Panel Inteligente de Información

## Requisitos Previos

- Node.js (v14 o superior)
- NPM o Yarn
- Conexión a internet

## Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd panel-inteligente

2. **Instalar dependencias del backend**

cd backend
npm install

3. **Configurar variables de entorno**
Crear archivo .env en la carpeta backend con:
PORT=3000
OPENWEATHER_API_KEY=tu_api_key
NASA_API_KEY=tu_api_key
NEWS_API_KEY=tu_api_key

Iniciar el servidor

bash
npm start
# o para desarrollo
npm run dev
Abrir el frontend
Abrir frontend/public/index.html en el navegador

Uso de la Aplicación
1. Consulta Principal
Ingresa una Ciudad para el clima

Ingresa un Tema para las noticias

Ingresa un Usuario/Repositorio de GitHub (formato: usuario/repo)

Haz clic en "Consultar Todo"

2. Visualización de Resultados
El panel muestra 4 tarjetas:

Clima (OpenWeather)

Temperatura actual

Sensación térmica

Humedad

Velocidad del viento

NASA

Imagen o video astronómico del día

Título y descripción

Fecha

Noticias (NewsAPI)

Últimas noticias del tema seleccionado

Fuente y fecha

GitHub

Información del repositorio/usuario

Estrellas, forks, issues

3. Guardar Favoritos
Cada tarjeta tiene un botón "Guardar favorito"

Guarda la consulta para referencia futura

Accesible desde el panel de favoritos

4. Panel de Administración
Muestra:

Estadísticas: Total de consultas, éxitos, errores

Detalle por API: Número de consultas por API

Tiempos de respuesta: Promedio por API

Últimas consultas: Historial detallado

5. Manejo de Errores
El sistema muestra mensajes claros cuando:

La API key es inválida

Se excede el límite de uso

El recurso no existe

Hay problemas de conexión

APIs Utilizadas
OpenWeather
Endpoint: /api/weather/current?city={ciudad}

Requiere: API Key gratuita

Límites: 60 peticiones/minuto (plan gratuito)

NASA
Endpoint: /api/nasa/apod

Requiere: API Key gratuita

Límites: 1000 peticiones/hora (plan gratuito)

NewsAPI
Endpoint: /api/news/headlines?topic={tema}

Requiere: API Key gratuita

Límites: 100 peticiones/día (plan gratuito)

GitHub
Endpoint: /api/github/repo?owner={owner}&repo={repo}

No requiere API Key

Límites: 60 peticiones/hora (sin autenticación)

Solución de Problemas
Error: "Credenciales inválidas"
Verificar que las API keys estén correctas en el archivo .env

Asegurar que las keys tengan acceso a los endpoints

Error: "Límite de uso excedido"
Esperar al reinicio del límite (generalmente 1 hora)

Considerar upgrade del plan en la API correspondiente

Error: "Ciudad no encontrada"
Verificar el nombre de la ciudad

Probar con formato en inglés (ej: "Madrid" en lugar de "Madrid, España")

El servidor no inicia
Verificar que el puerto 3000 esté libre

Revisar que todas las dependencias estén instaladas

Personalización
Agregar una nueva API
Crear módulo en backend/src/integrations/

Agregar ruta en backend/src/routes/apiRoutes.js

Agregar método en frontend/js/apiClient.js

Agregar renderizado en frontend/js/uiManager.js

Cambiar estilos
Modificar frontend/css/styles.css

Seguridad
Las API keys nunca se exponen al cliente

El servidor actúa como intermediario

Se implementa rate limiting en el servidor

CORS está configurado para seguridad adicional

## EVIDENCIAS DE FUNCIONAMIENTO

### Capturas de pantalla (incluir en la entrega)

1. **Pantalla Principal** - Mostrando las 4 tarjetas con datos
2. **Clima** - Temperatura, humedad, etc.
3. **NASA** - Imagen APOD
4. **Noticias** - Lista de noticias
5. **GitHub** - Información del repositorio
6. **Panel de Administración** - Estadísticas y consultas
7. **Favoritos** - Lista de consultas guardadas
8. **Manejo de Errores** - Mensajes de error

## ENTREGA FINAL

### Estructura de Archivos a Entregar
Entrega/
├── codigo/
│ ├── backend/
│ │ ├── src/
│ │ ├── .env (con variables de ejemplo)
│ │ ├── package.json
│ │ └── server.js
│ └── frontend/
│ ├── public/
│ ├── css/
│ └── js/
├── docs/
│ ├── arquitectura.md
│ ├── manual_uso.md
│ └── capturas/
│ ├── pantalla_principal.png
│ ├── clima.png
│ ├── nasa.png
│ ├── noticias.png
│ ├── github.png
│ ├── admin_panel.png
│ └── errores.png
└── README.md


### Checklist de Entrega

- [ ] Código fuente completo
- [ ] Documento técnico de arquitectura
- [ ] Capturas de funcionamiento de cada API
- [ ] Manual de uso
- [ ] Evidencia de manejo seguro de credenciales (archivo .env en .gitignore)
- [ ] Repositorio organizado por módulos

---

**¡Éxito en tu examen!** Esta solución cumple con todos los requisitos del examen y está lista para ser presentada. Recuerda:

1. Reemplazar las API keys en el archivo `.env` con tus propias claves
2. Incluir las capturas de pantalla en la documentación
3. Revisar que todos los módulos funcionen correctamente
4. Probar el manejo de errores (usar keys inválidas para simular)

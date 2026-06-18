# Documento de Arquitectura - Panel Inteligente de Información

## 1. Visión General

El sistema implementa una arquitectura cliente-servidor con capas claramente definidas:

- **Frontend**: Interfaz de usuario en HTML/CSS/JavaScript vanilla
- **Backend**: Servidor Node.js con Express
- **Integración**: Módulos independientes para cada API externa
- **Persistencia**: Almacenamiento en archivo JSON para consultas y favoritos

## 2. Diagrama de Arquitectura
┌─────────────────────────────────────────────────────────────────┐
│ CLIENTE (Frontend) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ index.html │ │ styles.css │ │ app.js │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ └───────────────┼───────────────┘ │
│ │ HTTP/HTTPS │
└─────────────────────────┼──────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ SERVIDOR (Backend) │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Express Server │ │
│ │ app.js │ │
│ └──────────────────────────────────────────────────────────┘ │
│ │ │
│ ┌────────────────────┼────────────────────┐ │
│ ▼ ▼ ▼ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Routes │ │ Services │ │ Models │ │
│ │ apiRoutes.js│ │auditoriaSrv │ │consultaModel│ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ └────────────────────┼────────────────────┘ │
│ │ │
│ ┌────────────────────┼────────────────────┐ │
│ ▼ ▼ ▼ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Integrations│ │ Config │ │ Logger │ │
│ │ weatherAPI │ │ env.js │ │ consultas │ │
│ │ nasaAPI │ │ .env │ │ .json │ │
│ │ newsAPI │ └─────────────┘ └─────────────┘ │
│ │ githubAPI │ │
│ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
│
▼
┌──────────────────────────────────────┐
│ APIs Externas │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │OpenW │ │NASA │ │News │ │GitHub││
│ └──────┘ └──────┘ └──────┘ └──────┘│
└──────────────────────────────────────┘


## 3. Flujo de Datos

1. **Solicitud del Usuario**: El usuario interactúa con el frontend
2. **Petición al Servidor**: El frontend envía una petición HTTP al backend
3. **Validación**: El servidor valida los parámetros de entrada
4. **Integración API**: El módulo correspondiente consulta la API externa
5. **Procesamiento**: La respuesta se procesa y formatea
6. **Auditoría**: Se registra la consulta en el sistema
7. **Respuesta**: El servidor devuelve los datos al frontend
8. **Visualización**: El frontend renderiza los datos

## 4. Seguridad

### Protección de Credenciales
- Las API keys se almacenan en variables de entorno (.env)
- El archivo .env está en .gitignore
- Las credenciales nunca se envían al frontend
- El servidor actúa como proxy intermediario

### Riesgos de Exponer API Keys
- **Uso no autorizado**: Alguien podría usar la key para hacer peticiones
- **Costos económicos**: APIs pagas podrían generar gastos
- **Límites de uso**: Se podría exceder el límite gratuito
- **Prohibición de cuenta**: El proveedor podría suspender la cuenta

### Mitigación
- Variables de entorno
- Rate limiting en el servidor
- Logs de auditoría
- CORS configurado

## 5. Modularidad

El sistema está organizado en módulos con responsabilidades únicas:

- **Integrations**: Cada API tiene su propio módulo
- **Routes**: Endpoints separados por funcionalidad
- **Services**: Lógica de negocio
- **Models**: Persistencia de datos
- **Config**: Configuración centralizada

## 6. Manejo de Errores

Cada integración incluye:
- Try/catch con mensajes específicos
- Detección de credenciales inválidas (401)
- Detección de límite de uso (429)
- Detección de recursos no encontrados (404)
- Mensajes claros para el usuario

## 7. Trazabilidad

El sistema registra:
- Fecha y hora de cada consulta
- API utilizada
- Parámetros de búsqueda
- Estado de la solicitud (éxito/error)
- Tiempo de respuesta
- Resumen de la respuesta

## 8. Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- Axios (HTTP client)
- Dotenv (variables de entorno)
- Helmet (seguridad)
- CORS

### Frontend
- HTML5
- CSS3 (responsive design)
- JavaScript (ES Modules)
- Font Awesome (iconos)

### APIs
- OpenWeather (Clima)
- NASA (Astronomía)
- NewsAPI (Noticias)
- GitHub (Repositorios)
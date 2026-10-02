# 🚀 COMELEC - Catálogo de Productos

Página web moderna para el catálogo de electrodomésticos COMELEC con backend seguro.

## 🎯 Características

- ✅ Catálogo dinámico de productos desde Airtable
- ✅ Sistema multiidioma (Español, Inglés, Portugués)
- ✅ Filtrado por categorías
- ✅ Búsqueda en tiempo real
- ✅ Diseño responsive
- ✅ Backend seguro (API token protegido)
- ✅ Animaciones suaves

## 🛠️ Tecnologías

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Google Fonts (Montserrat, Open Sans)

**Backend:**
- Node.js + Express
- CORS habilitado
- Variables de entorno con dotenv

**Base de Datos:**
- Airtable (headless CMS)

## 📦 Instalación Local

1. **Clonar repositorio:**
```bash
git clone https://github.com/tu-usuario/pagina-comelec.git
cd pagina-comelec
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto:
```env
AIRTABLE_TOKEN=tu_token_de_airtable
AIRTABLE_BASE_ID=tu_base_id_aqui
AIRTABLE_TABLE=Productos
PORT=3000
```

4. **Iniciar servidor:**
```bash
npm start
```

La página estará disponible en: `http://localhost:3000`

## 🌐 Despliegue en Render

### Pasos:

1. **Sube el código a GitHub** (si no lo has hecho ya)

2. **Ve a [Render.com](https://render.com)** y crea una cuenta

3. **Nuevo Web Service:**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `pagina-comelec`

4. **Configuración:**
   - **Name:** `comelec-productos` (o el que prefieras)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Variables de Entorno:**

   En la sección "Environment Variables", añade:
   
   | Key | Value |
   |-----|-------|
   | `AIRTABLE_TOKEN` | `patXXXXXXXXXXXXXXXXX...` (configurar en Render) |
   | `AIRTABLE_BASE_ID` | `appXXXXXXXXXXXXXX` (configurar en Render) |
   | `AIRTABLE_TABLE` | `Productos` |
   | `NODE_ENV` | `production` |

6. **Deploy:**
   - Click en "Create Web Service"
   - Render automáticamente construirá y desplegará tu aplicación
   - Obtendrás una URL como: `https://comelec-productos.onrender.com`

## 🔧 Estructura del Proyecto

```
pagina-comelec/
├── server.js              # Servidor Express (backend)
├── package.json           # Dependencias
├── .gitignore            # Archivos a ignorar en Git
├── .env.example          # Ejemplo de variables de entorno
├── index.html            # Página principal
├── detalle.html          # Página de detalle de producto
├── styles.css            # Estilos
├── script.js             # Lógica del frontend
├── img/                  # Imágenes y logos
│   ├── logocomelec.png
│   └── logos/
└── README.md             # Esta documentación
```

## 🔒 Seguridad

- ✅ El token de Airtable está protegido en variables de entorno
- ✅ No se expone información sensible en el código del cliente
- ✅ CORS configurado correctamente
- ✅ El `.gitignore` evita subir el archivo `.env`

## 📝 Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AIRTABLE_TOKEN` | Token de API de Airtable | `patXXXXX...` |
| `AIRTABLE_BASE_ID` | ID de la base de Airtable | `appXXXXX...` |
| `AIRTABLE_TABLE` | Nombre de la tabla | `Productos` |
| `PORT` | Puerto del servidor (opcional) | `3000` |

## 🚦 API Endpoints

El backend expone los siguientes endpoints:

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener un producto específico
- `GET /api/health` - Health check del servidor

## 🎨 Personalización

### Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --color-brand: #6f2c3e;       /* Color principal de marca */
    --color-text-main: #111111;   /* Texto principal */
    --color-text-body: #555555;   /* Texto del cuerpo */
    --color-bg: #f9f9f9;          /* Fondo */
}
```

### Idiomas

Los textos están en `script.js` en el objeto `traducciones`. Para añadir un idioma:

1. Añade el idioma al objeto `traducciones`
2. Añade la bandera al objeto `banderas`
3. Añade la opción en el selector de idioma (HTML)

## 📱 Responsive

La página es completamente responsive y se adapta a:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1200px)
- 🖥️ Desktop (> 1200px)

## 🐛 Problemas Comunes

**Error: "Token de API no configurado"**
- Verifica que las variables de entorno estén configuradas en Render

**Error de CORS**
- El backend ya tiene CORS habilitado, no debería haber problemas

**Las imágenes no cargan**
- Verifica que la carpeta `img/` esté en el repositorio
- Comprueba los permisos de Airtable

## 📄 Licencia

© 2025 COMELEC ELECTRODOMÉSTICOS - Todos los derechos reservados

## 👤 Autor

Desarrollado para COMELEC

---

**¿Necesitas ayuda?** Consulta la documentación de [Render](https://render.com/docs) o [Airtable](https://airtable.com/api).

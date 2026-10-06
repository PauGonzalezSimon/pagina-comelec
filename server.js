const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a SQLite local
const dbPath = path.join(__dirname, 'comelec.db');
const db = new Database(dbPath);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Función auxiliar para mapear el formato SQLite al formato compatible que espera el frontend
function formatearProductoParaFrontend(row) {
    if (!row) return null;

    let fotos = [];
    let fichaTecnica = [];

    try {
        const parsed = row.fotos_json ? JSON.parse(row.fotos_json) : [];
        fotos = parsed.map(f => ({
            ...f,
            url: f.filename ? `img/${f.filename}` : f.url
        }));
    } catch (e) {
        fotos = [];
    }

    try {
        fichaTecnica = row.ficha_tecnica_json ? JSON.parse(row.ficha_tecnica_json) : [];
    } catch (e) {
        fichaTecnica = [];
    }

    return {
        id: row.id,
        fields: {
            Referencia: row.referencia,
            Categoria: row.categoria,
            Nombre: row.nombre,
            Nombre_EN: row.nombre_en,
            Nombre_PT: row.nombre_pt,
            Precio: row.precio,
            Descripcion: row.descripcion,
            Descripcion_EN: row.descripcion_en,
            Descripcion_PT: row.descripcion_pt,
            Caracteristicas: row.caracteristicas,
            Caracteristicas_EN: row.caracteristicas_en,
            Caracteristicas_PT: row.caracteristicas_pt,
            Especificaciones: row.especificaciones,
            Especificaciones_EN: row.especificaciones_en,
            Especificaciones_PT: row.especificaciones_pt,
            Etiqueta: row.etiqueta === 1,
            Fotos: fotos,
            FichaTecnica: fichaTecnica
        }
    };
}

// ==========================================
// API ENDPOINTS - BASE DE DATOS SQLITE LOCAL
// ==========================================

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM productos ORDER BY rowid ASC').all();
        const records = rows.map(formatearProductoParaFrontend);
        res.json({ records });
    } catch (error) {
        console.error('Error al obtener productos desde SQLite:', error);
        res.status(500).json({
            error: 'Error al cargar el catálogo local',
            details: error.message
        });
    }
});

// Obtener un producto específico por ID
app.get('/api/productos/:id', (req, res) => {
    try {
        const productId = req.params.id;
        const row = db.prepare('SELECT * FROM productos WHERE id = ?').get(productId);

        if (!row) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const formatted = formatearProductoParaFrontend(row);
        res.json(formatted);
    } catch (error) {
        console.error('Error al obtener producto desde SQLite:', error);
        res.status(500).json({
            error: 'Error al cargar producto local',
            details: error.message
        });
    }
});

// Ruta de health check
app.get('/api/health', (req, res) => {
    try {
        const count = db.prepare('SELECT count(*) as total FROM productos').get();
        res.json({
            status: 'ok',
            motor: 'SQLite (comelec.db)',
            total_productos: count.total,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Servir sitemap.xml dinámico desde SQLite
app.get('/sitemap.xml', (req, res) => {
    try {
        const rows = db.prepare('SELECT id FROM productos').all();
        const baseUrl = process.env.BASE_URL || 'https://comelec-web.onrender.com';
        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

        xml += `  <url>\n    <loc>${baseUrl}/aviso-legal.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>${baseUrl}/privacidad.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>${baseUrl}/cookies.html</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;

        rows.forEach(p => {
            xml += `  <url>\n    <loc>${baseUrl}/detalle.html?id=${encodeURIComponent(p.id)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });

        xml += `</urlset>\n`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Error generando sitemap:', err);
        res.sendFile(path.join(__dirname, 'sitemap.xml'));
    }
});

// Servir robots.txt
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor COMELEC (SQLite local) corriendo en http://localhost:${PORT}`);
    console.log(`📡 API local disponible en http://localhost:${PORT}/api/productos`);
});

// ==========================================
// 1. CONFIGURACIÓN
// ==========================================

// ✅ CONFIGURACIÓN SEGURA CON BACKEND
// El token de API ahora está protegido en el servidor (server.js)
// y configurado en las variables de entorno de Render

// API del backend (detecta automáticamente si estás en local o en producción)
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'  // Desarrollo local
    : '/api';                        // Producción (Render)

let todosLosProductos = [];

// ==========================================
// 2. DICCIONARIO
// ==========================================
const traducciones = {
    es: {
        loading: "Cargando catálogo...",
        nav_ovens: "Hornos",
        nav_kitchen: "Cocina",
        nav_vacuum: "Aspiración",
        nav_personal: "Cuidado Personal",
        nav_houseware: "Menaje",
        nav_accessories: "Accesorios",
        nav_others: "Otros",
        hero_title: "NUNCA NADIE DIO TANTO<br>POR TAN POCO",
        hero_subtitle: "Electrodomésticos adaptados a todas las necesidades.",
        news_title: "Novedades 2025",
        footer_text: "© 2025 COMELEC ELECTRODOMESTICOS | Tecnología para todos",
        back: "← Volver al catálogo",
        details: "Ver Detalles",
        features: "Características Generales",
        specs: "Especificaciones Técnicas",
        buy: "Consultar Disponibilidad",
        consult: "Consultar",
        new: "NUEVO",
        no_desc: "Sin descripción disponible.",
        download_pdf: "📄 Descargar Ficha Técnica",
        empty_category: "No hay productos que coincidan.",
        error_load: "No se han podido cargar los productos",
        error_load_sub: "Ha ocurrido un problema al conectar con el servidor. Por favor, inténtalo de nuevo.",
        retry: "↻ Reintentar"
    },
    en: {
        loading: "Loading catalog...",
        nav_ovens: "Ovens",
        nav_kitchen: "Kitchen",
        nav_vacuum: "Vacuuming",
        nav_personal: "Personal Care",
        nav_houseware: "Kitchenware",
        nav_accessories: "Accessories",
        nav_others: "Others",
        hero_title: "NO ONE EVER GAVE SO MUCH<br>FOR SO LITTLE",
        hero_subtitle: "Appliances adapted to all needs.",
        news_title: "New Arrivals 2025",
        footer_text: "© 2025 COMELEC APPLIANCES | Technology for everyone",
        back: "← Back to catalog",
        details: "View Details",
        features: "General Features",
        specs: "Technical Specifications",
        buy: "Check Availability",
        consult: "Consult",
        new: "NEW",
        no_desc: "No description available.",
        download_pdf: "📄 Download Data Sheet",
        empty_category: "No matching products found.",
        error_load: "Could not load products",
        error_load_sub: "A problem occurred while connecting to the server. Please try again.",
        retry: "↻ Retry"
    },
    pt: {
        loading: "Carregando catálogo...",
        nav_ovens: "Fornos",
        nav_kitchen: "Cozinha",
        nav_vacuum: "Aspiração",
        nav_personal: "Cuidados Pessoais",
        nav_houseware: "Utilidades", /* CORREGIDO: Más corto */
        nav_accessories: "Acessórios",
        nav_others: "Outros",
        hero_title: "NINGUÉM NUNCA DEU TANTO<br>POR TÃO POUCO",
        hero_subtitle: "Eletrodomésticos adaptados a todas as necessidades.",
        news_title: "Novidades 2025",
        footer_text: "© 2025 COMELEC ELETRODOMÉSTICOS | Tecnologia para todos",
        back: "← Voltar ao catálogo",
        details: "Ver Detalhes",
        features: "Características Gerais",
        specs: "Especificações Técnicas",
        buy: "Consultar Disponibilidade",
        consult: "Consultar",
        new: "NOVO",
        no_desc: "Sem descrição disponível.",
        download_pdf: "📄 Baixar Ficha Técnica",
        empty_category: "Não há produtos correspondentes.",
        error_load: "Não foi possível carregar os produtos",
        error_load_sub: "Ocorreu um problema ao conectar com o servidor. Por favor, tente novamente.",
        retry: "↻ Tentar novamente"
    }
};

// ==========================================
// 3. IDIOMA
// ==========================================
let idiomaActual = localStorage.getItem('idioma') || 'es';
const banderas = { es: 'es', en: 'gb', pt: 'pt' };

function cambiarIdioma(lang) {
    localStorage.setItem('idioma', lang);
    location.reload();
}

function toggleLangMenu() {
    const menu = document.getElementById('lang-menu');
    const dropdown = document.querySelector('.lang-dropdown');
    if (menu) menu.classList.toggle('show');
    if (dropdown) dropdown.classList.toggle('active');
}

window.onclick = function (event) {
    if (!event.target.closest('.lang-dropdown')) {
        const menu = document.getElementById('lang-menu');
        const dropdown = document.querySelector('.lang-dropdown');
        if (menu && menu.classList.contains('show')) {
            menu.classList.remove('show');
            dropdown.classList.remove('active');
        }
    }
}

function getCampo(fields, baseName) {
    if (idiomaActual === 'es') return fields[baseName];
    const translatedName = `${baseName}_${idiomaActual.toUpperCase()}`;
    return fields[translatedName] ? fields[translatedName] : fields[baseName];
}

// ==========================================
// 4. INICIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Anti-parpadeo
    document.body.classList.add('loaded');

    // Bandera
    const imgActual = document.getElementById('img-current-lang');
    if (imgActual) imgActual.src = `https://flagcdn.com/w40/${banderas[idiomaActual]}.png`;

    // Traducciones
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (traducciones[idiomaActual][key]) el.innerHTML = traducciones[idiomaActual][key];
    });

    const gridCatalogo = document.getElementById('contenedor-catalogo');
    const vistaDetalle = document.getElementById('contenedor-detalle');
    if (gridCatalogo) cargarCatalogo();
    if (vistaDetalle) cargarDetalle();
});

// ==========================================
// 5. CATÁLOGO & FILTROS
// ==========================================
function mostrarSkeleton() {
    const grid = document.getElementById('contenedor-catalogo');
    if (!grid) return;
    grid.innerHTML = `
        <div class="skeleton-card">
            <div class="skeleton-shimmer skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-shimmer skeleton-ref"></div>
                <div class="skeleton-shimmer skeleton-title"></div>
                <div class="skeleton-shimmer skeleton-desc"></div>
                <div class="skeleton-shimmer skeleton-btn"></div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-shimmer skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-shimmer skeleton-ref"></div>
                <div class="skeleton-shimmer skeleton-title"></div>
                <div class="skeleton-shimmer skeleton-desc"></div>
                <div class="skeleton-shimmer skeleton-btn"></div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-shimmer skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-shimmer skeleton-ref"></div>
                <div class="skeleton-shimmer skeleton-title"></div>
                <div class="skeleton-shimmer skeleton-desc"></div>
                <div class="skeleton-shimmer skeleton-btn"></div>
            </div>
        </div>
        <div class="skeleton-card">
            <div class="skeleton-shimmer skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-shimmer skeleton-ref"></div>
                <div class="skeleton-shimmer skeleton-title"></div>
                <div class="skeleton-shimmer skeleton-desc"></div>
                <div class="skeleton-shimmer skeleton-btn"></div>
            </div>
        </div>
    `;
}

function mostrarErrorCatalogo() {
    const grid = document.getElementById('contenedor-catalogo');
    if (!grid) return;
    const t = traducciones[idiomaActual] || traducciones.es;
    grid.innerHTML = `
        <div class="error-container fade-in">
            <div class="error-icon">⚠️</div>
            <h3 class="error-message">${t.error_load}</h3>
            <p class="error-subtitle">${t.error_load_sub}</p>
            <button class="btn-retry" onclick="cargarCatalogo()">
                ${t.retry}
            </button>
        </div>
    `;
}

async function cargarCatalogo() {
    const grid = document.getElementById('contenedor-catalogo');
    if (!grid) return;
    mostrarSkeleton();

    try {
        if (todosLosProductos.length === 0) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

            const url = `${API_BASE_URL}/productos`;
            const respuesta = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            const data = await respuesta.json();
            todosLosProductos = data.records || [];
        }
        renderizarProductos(todosLosProductos);
    } catch (error) {
        console.error('Fallo al cargar catálogo:', error);
        mostrarErrorCatalogo();
    }
}

function renderizarProductos(lista) {
    const grid = document.getElementById('contenedor-catalogo');
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = `<p style="text-align:center; width:100%; margin-top:30px; color:#777;">${traducciones[idiomaActual].empty_category}</p>`;
        return;
    }

    let contadorDelay = 0;
    lista.forEach(record => {
        const f = record.fields;
        if (!f.Nombre) return; // Evita productos vacíos

        const imgUrl = (f.Fotos && f.Fotos.length > 0) ? f.Fotos[0].url : 'https://via.placeholder.com/300';
        const nombre = getCampo(f, 'Nombre');
        const etiqueta = f.Etiqueta ? `<span class="badge">${traducciones[idiomaActual].new}</span>` : '';

        const card = document.createElement('article');
        card.className = 'card fade-in';
        card.style.animationDelay = `${contadorDelay * 0.05}s`;
        contadorDelay++;

        card.innerHTML = `
            <div class="image-wrapper">
                ${etiqueta}
                <img src="${imgUrl}" alt="${nombre}">
            </div>
            <div class="card-body">
                <span class="card-ref">REF. ${f.Referencia || ''}</span>
                <h4>${nombre}</h4>
                <a href="detalle.html?id=${record.id}" class="btn-view">${traducciones[idiomaActual].details}</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filtrar(categoria, elementoBtn) {
    // 1. Botón activo
    if (elementoBtn) {
        document.querySelectorAll('nav a').forEach(el => el.classList.remove('nav-active'));
        elementoBtn.classList.add('nav-active');
    }
    // 2. Limpiar búsqueda
    const buscador = document.getElementById('buscador');
    if (buscador) buscador.value = '';

    // 3. Título
    const titulo = document.querySelector('.section-title');
    if (titulo) titulo.innerText = (categoria === 'todo') ? traducciones[idiomaActual].news_title : categoria.toUpperCase();

    // 4. LÓGICA DE FILTRADO
    if (categoria === 'todo') {
        renderizarProductos(todosLosProductos);
    } else {
        // Busca en Airtable productos que tengan EXACTAMENTE esa categoría
        const filtrados = todosLosProductos.filter(record => record.fields.Categoria === categoria);
        renderizarProductos(filtrados);
    }

    // 5. Scroll arriba
    const grid = document.getElementById('contenedor-catalogo');
    if (grid) {
        const y = grid.getBoundingClientRect().top + window.pageYOffset - 150;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

// ==========================================
// 6. BÚSQUEDA
// ==========================================
function buscarProducto() {
    const texto = document.getElementById('buscador').value.toLowerCase();

    if (texto === '') {
        document.querySelectorAll('nav a').forEach(el => el.classList.remove('nav-active'));
        const btnTodo = document.querySelector('nav a[onclick*="todo"]');
        if (btnTodo) btnTodo.classList.add('nav-active');
        renderizarProductos(todosLosProductos);
        return;
    }

    document.querySelectorAll('nav a').forEach(el => el.classList.remove('nav-active'));

    const filtrados = todosLosProductos.filter(record => {
        const f = record.fields;
        if (!f.Nombre) return false;
        const nombre = getCampo(f, 'Nombre').toLowerCase();
        const ref = (f.Referencia || '').toLowerCase();
        return nombre.includes(texto) || ref.includes(texto);
    });

    renderizarProductos(filtrados);
}

// ==========================================
// 7. DETALLE
// ==========================================
async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    if (!idProducto) return;

    try {
        // Llamada al backend para obtener producto específico
        const url = `${API_BASE_URL}/productos/${idProducto}`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }

        const record = await respuesta.json();
        const f = record.fields;

        const nombreProducto = getCampo(f, 'Nombre');
        const descProducto = getCampo(f, 'Descripcion');
        const caracProducto = getCampo(f, 'Caracteristicas');
        const especProducto = getCampo(f, 'Especificaciones');

        document.title = `${nombreProducto} - COMELEC`;
        document.getElementById('d-nombre').innerText = nombreProducto;
        document.getElementById('d-ref').innerText = `REF. ${f.Referencia || '---'}`;
        document.getElementById('d-descripcion').innerText = descProducto || traducciones[idiomaActual].no_desc;
        document.getElementById('d-precio').innerText = f.Precio ? `${f.Precio} €` : traducciones[idiomaActual].consult;
        document.getElementById('d-caracteristicas').innerHTML = caracProducto ? caracProducto.replace(/\n/g, '<br>') : '-';
        document.getElementById('d-especificaciones').innerHTML = especProducto ? especProducto.replace(/\n/g, '<br>') : '-';

        if (f.Fotos && f.Fotos.length > 0) {
            document.getElementById('d-foto').src = f.Fotos[0].url;
        }

        const btnPdf = document.getElementById('btn-pdf');
        if (btnPdf) {
            if (f.FichaTecnica && f.FichaTecnica.length > 0) {
                btnPdf.href = f.FichaTecnica[0].url;
                btnPdf.style.display = 'inline-block';
                btnPdf.innerText = traducciones[idiomaActual].download_pdf;
            } else {
                btnPdf.style.display = 'none';
            }
        }
    } catch (error) {
        console.error(error);
        document.getElementById('d-nombre').innerText = "Error cargando producto";
    }
}

// ==========================================
// 8. SCROLL TOP
// ==========================================
const btnTop = document.getElementById("btn-top");
if (btnTop) {
    window.onscroll = function () {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btnTop.style.display = "block";
        } else {
            btnTop.style.display = "none";
        }
    };
}
function subirArriba() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
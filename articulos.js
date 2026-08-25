let articles = [];

// Load and parse CSV file
async function loadCSV() {
    const list = document.getElementById('articlesList');
    const showError = (message) => {
        if (list) list.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
    };

    if (typeof Papa === 'undefined') {
        showError('No se pudo cargar el lector CSV. Recarga la página.');
        return;
    }

    if (window.location.protocol === 'file:') {
        showError('Abre el sitio con un servidor local (python3 -m http.server) o en https://cdsap.github.io/hombre-memoria/ — el navegador bloquea el archivo CSV en file://.');
        return;
    }

    try {
        const response = await fetch(new URL('db.csv', window.location.href).href);
        if (!response.ok) {
            showError(`No se pudo cargar db.csv (${response.status}).`);
            return;
        }
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                articles = results.data.filter(article =>
                    article.Titulo && article.memoria && String(article.memoria).trim() !== ''
                );
                if (articles.length === 0) {
                    showError('El archivo CSV no contiene artículos legibles.');
                    return;
                }
                displayArticles();
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                showError('Error al interpretar los artículos del CSV.');
            }
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
        showError('Error al cargar el archivo CSV. Prueba recargando la página.');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display all articles
function displayArticles() {
    const container = document.getElementById('articlesList');
    
    // Sort articles by title
    const sortedArticles = [...articles].sort((a, b) => {
        const titleA = (a.Titulo || '').toLowerCase();
        const titleB = (b.Titulo || '').toLowerCase();
        return titleA.localeCompare(titleB, 'es');
    });
    
    const articlesHTML = sortedArticles.map((article, index) => {
        const preview = article.memoria ? 
            escapeHtml(article.memoria.substring(0, 150)) + (article.memoria.length > 150 ? '...' : '') : 
            'Sin contenido';
        
        return `
            <div class="article-list-item">
                <div class="article-list-header">
                    <h3 class="article-list-title">${escapeHtml(article.Titulo || 'Sin título')}</h3>
                    ${article.Lugar ? `<span class="article-list-lugar">${escapeHtml(article.Lugar)}</span>` : ''}
                </div>
                ${article['Hombre Memoria'] ? `<div class="article-list-meta"><strong>Persona:</strong> ${escapeHtml(article['Hombre Memoria'])}</div>` : ''}
                ${article.Fecha ? `<div class="article-list-meta"><strong>Fecha:</strong> ${escapeHtml(article.Fecha)}</div>` : ''}
                <div class="article-list-preview">${preview}</div>
                <a href="index.html?article=${index}" class="article-list-link">Leer artículo completo →</a>
            </div>
        `;
    }).join('');
    
    container.innerHTML = articlesHTML;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCSV();
});


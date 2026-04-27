let articles = [];

// Load and parse CSV file
async function loadCSV() {
    try {
        const response = await fetch('db.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                articles = results.data.filter(article => 
                    article.Titulo && article.memoria && article.memoria.trim() !== ''
                );
                console.log(`Loaded ${articles.length} articles`);
                displayArticles();
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                document.getElementById('articlesList').innerHTML = 
                    '<div class="error">Error al cargar los artículos. Por favor, asegúrate de que db.csv esté en el mismo directorio.</div>';
            }
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('articlesList').innerHTML = 
            '<div class="error">Error al cargar el archivo CSV. Por favor, verifica que estés usando un servidor local (no file://).</div>';
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


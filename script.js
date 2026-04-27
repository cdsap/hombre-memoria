let articles = [];
let currentArticle = null;

// List of images in the pictures folder
const images = [
    '21 Nov Batanes 008.jpg',
    '9 nov 056.jpg',
    'Carrizosa.jpg',
    'Castellar II 90.jpg',
    'Castellar III 90.jpg',
    'Castellar V 90.jpg',
    'CCriptanaI.jpg',
    'Chu. CozarII.jpg',
    'DIA_0013.JPG',
    'dia_0031.jpg',
    'dia_0032-1.jpg',
    'DIA_0046.JPG',
    'DIA_0060.JPG',
    'DIA_0063.JPG',
    'DSC02359.JPG',
    'El Rey de Montiel.jpg',
    'L1170854.JPG',
    'L1170902.JPG',
    'L1170956.JPG',
    'L1170967.JPG',
    'L1180322.JPG',
    'L1180323.JPG',
    'Mulas II.jpg',
    'Navajas 001.jpg',
    'Solana 8 11 07 079.jpg',
    'Sta Maria de la Vega 001.jpg',
    'Torre.jpg',
    'Torre19762.jpg',
    'TracaI 001.jpg',
    'Vacos.jpg',
    'Villamanrique 76 001.jpg'
];

// Get a random image path
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return `pictures/${images[randomIndex]}`;
}

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
                displayRandomArticle();
                generateTagCloud();
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                document.getElementById('articleContainer').innerHTML = 
                    '<div class="error">Error al cargar los artículos. Por favor, asegúrate de que db.csv esté en el mismo directorio.</div>';
            }
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('articleContainer').innerHTML = 
            '<div class="error">Error al cargar el archivo CSV. Por favor, verifica que estés usando un servidor local (no file://).</div>';
    }
}

// Display a random article
function displayRandomArticle() {
    if (articles.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * articles.length);
    currentArticle = articles[randomIndex];
    renderArticle(currentArticle);
}

// Render article to the page
function renderArticle(article) {
    const container = document.getElementById('articleContainer');
    const randomImagePath = getRandomImage();
    
    const articleHTML = `
        <div class="article">
            <div class="article-header">
                <div class="article-header-content">
                    <h2 class="article-title">${escapeHtml(article.Titulo || 'Sin título')}</h2>
                    <div class="article-meta">
                        ${article['Hombre Memoria'] ? `<div class="meta-item"><strong>Persona:</strong> ${escapeHtml(article['Hombre Memoria'])}</div>` : ''}
                        ${article.Lugar ? `<div class="meta-item"><strong>Lugar:</strong> ${escapeHtml(article.Lugar)}</div>` : ''}
                        ${article.Fecha ? `<div class="meta-item"><strong>Fecha:</strong> ${escapeHtml(article.Fecha)}</div>` : ''}
                        ${article.notes ? `<div class="meta-item"><strong>Notas:</strong> ${escapeHtml(article.notes)}</div>` : ''}
                    </div>
                </div>
                <div class="article-image-container">
                    <img src="${randomImagePath}" alt="Imagen" class="article-image" onerror="this.style.display='none'">
                </div>
            </div>
            <div class="article-content">${escapeHtml(article.memoria || '')}</div>
        </div>
    `;
    
    container.innerHTML = articleHTML;
}

// Generate tag cloud based on places (Lugar)
function generateTagCloud() {
    const tagsContainer = document.getElementById('tagsContainer');
    const tagCounts = {};
    
    // Count occurrences of each place
    articles.forEach(article => {
        if (article.Lugar && article.Lugar.trim() !== '') {
            const lugar = article.Lugar.trim();
            tagCounts[lugar] = (tagCounts[lugar] || 0) + 1;
        }
    });
    
    // Sort tags by count
    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50); // Show top 50 tags
    
    if (sortedTags.length === 0) {
        tagsContainer.innerHTML = '<p>No hay etiquetas disponibles.</p>';
        return;
    }
    
    // Find min and max counts for sizing
    const counts = sortedTags.map(tag => tag[1]);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    
    tagsContainer.innerHTML = sortedTags.map(([tag, count]) => {
        // Calculate size based on count (0.75em to 1.4em)
        const size = minCount === maxCount ? 1 : 
            0.75 + (count - minCount) / (maxCount - minCount) * 0.65;
        const sizeClass = size < 0.85 ? 'tag-small' : 
                         size < 1.0 ? 'tag-medium' : 
                         size < 1.2 ? 'tag-large' : 'tag-xlarge';
        
        return `<span class="tag ${sizeClass}" data-tag="${escapeHtml(tag)}" title="${count} artículo${count > 1 ? 's' : ''}">${escapeHtml(tag)}</span>`;
    }).join('');
    
    // Add click handlers to tags for filtering
    tagsContainer.querySelectorAll('.tag').forEach(tagEl => {
        tagEl.addEventListener('click', () => {
            const tagName = tagEl.getAttribute('data-tag');
            searchByTag(tagName);
        });
    });
}

// Search articles by tag (place)
function searchByTag(tagName) {
    const filteredArticles = articles.filter(article => 
        article.Lugar && article.Lugar.trim() === tagName
    );
    
    if (filteredArticles.length > 0) {
        const randomFromFiltered = filteredArticles[Math.floor(Math.random() * filteredArticles.length)];
        renderArticle(randomFromFiltered);
        // Scroll to article
        document.getElementById('articleContainer').scrollIntoView({ behavior: 'smooth' });
    }
}

// Search functionality
function searchArticles(query) {
    if (!query || query.trim() === '') {
        displayRandomArticle();
        return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = articles.filter(article => {
        const title = (article.Titulo || '').toLowerCase();
        const content = (article.memoria || '').toLowerCase();
        const lugar = (article.Lugar || '').toLowerCase();
        const persona = (article['Hombre Memoria'] || '').toLowerCase();
        
        return title.includes(searchTerm) || 
               content.includes(searchTerm) || 
               lugar.includes(searchTerm) || 
               persona.includes(searchTerm);
    });
    
    displaySearchResults(results, searchTerm);
}

// Display search results
function displaySearchResults(results, searchTerm) {
    const container = document.getElementById('articleContainer');
    
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron artículos que coincidan con "' + escapeHtml(searchTerm) + '"</div>';
        return;
    }
    
    const resultsHTML = `
        <div class="search-results">
            <h3>${results.length} artículo${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''}</h3>
            ${results.map(article => {
                const preview = article.memoria ? 
                    escapeHtml(article.memoria.substring(0, 200)) + (article.memoria.length > 200 ? '...' : '') : 
                    'Sin contenido';
                
                return `
                    <div class="search-result-item" onclick="selectSearchResult(${articles.indexOf(article)})">
                        <div class="search-result-title">${escapeHtml(article.Titulo || 'Sin título')}</div>
                        <div class="search-result-preview">${preview}</div>
                        ${article.Lugar ? `<div class="search-result-preview" style="margin-top: 5px; font-weight: 600;">Lugar: ${escapeHtml(article.Lugar)}</div>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = resultsHTML;
}

// Select a search result
function selectSearchResult(index) {
    if (articles[index]) {
        renderArticle(articles[index]);
        document.getElementById('searchInput').value = '';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCSV();
    
    document.getElementById('randomBtn').addEventListener('click', () => {
        displayRandomArticle();
        document.getElementById('searchInput').value = '';
    });
    
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        searchArticles(query);
    });
    
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('searchInput').value;
            searchArticles(query);
        }
    });
});

// Make selectSearchResult available globally
window.selectSearchResult = selectSearchResult;


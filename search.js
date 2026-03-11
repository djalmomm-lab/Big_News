// ============================================
// Big News - Sistema de Busca Funcional
// ============================================

(function() {
    'use strict';

    // ===== CONFIGURAÇÕES =====
    const CONFIG = {
        searchInputId: 'search-input',
        searchResultsId: 'search-results',
        searchOverlayId: 'search-overlay',
        searchCloseId: 'search-close',
        minQueryLength: 2,
        maxResults: 10
    };

    // ===== BASE DE DADOS DE ARTIGOS =====
    // Esta base pode ser expandida conforme novos artigos são adicionados
    const articlesDB = [
        {
            id: 1,
            title: 'Os 100 dias do novo governo: promessas vs. realidade em números',
            excerpt: 'Análise completa das 12 promessas de campanha do prefeito de Itapema e o status atual de cada uma, com dados oficiais da prefeitura.',
            category: 'Análise',
            url: 'analises.html',
            tags: ['itapema', 'governo', 'promessas', 'política']
        },
        {
            id: 2,
            title: 'Projeto de zoneamento divide vereadores: entenda os argumentos',
            excerpt: 'Apresentamos as visões da base governista e da oposição sobre a mudança no código urbanístico de Porto Belo.',
            category: 'Perspectivas',
            url: 'analises.html',
            tags: ['porto belo', 'zoneamento', 'vereadores', 'urbanismo']
        },
        {
            id: 3,
            title: 'Como funciona a Câmara de Vereadores: guia completo para cidadãos',
            excerpt: 'Entenda o processo legislativo municipal, como acompanhar votações e como participar das sessões.',
            category: 'Explica',
            url: 'explica.html',
            tags: ['câmara', 'vereadores', 'legislativo', 'guia']
        },
        {
            id: 4,
            title: 'Câmara aprova projeto de lei que altera regras de zoneamento urbano',
            excerpt: 'Projeto foi aprovado por 9 votos a 2 após três horas de debate. Oposição questiona falta de audiências públicas.',
            category: 'Política',
            url: 'politica.html',
            tags: ['itapema', 'câmara', 'zoneamento', 'lei']
        },
        {
            id: 5,
            title: 'Prefeitura anuncia projeto de despoluição da Baía de Porto Belo',
            excerpt: 'Investimento de R$ 12 milhões prevê saneamento básico para 80% da área urbana até 2026. Especialistas analisam viabilidade.',
            category: 'Meio Ambiente',
            url: 'politica.html',
            tags: ['porto belo', 'meio ambiente', 'baía', 'saneamento']
        },
        {
            id: 6,
            title: 'Promessa de campanha sobre iluminação pública não foi cumprida',
            excerpt: 'Dados da prefeitura mostram que apenas 40% das metas de iluminação LED foram atingidas em três anos de gestão.',
            category: 'Transparência',
            url: 'politica.html',
            tags: ['bombinhas', 'iluminação', 'promessas', 'transparência']
        },
        {
            id: 7,
            title: 'Dados mostram crescimento do turismo na região, mas com desafios',
            excerpt: 'Análise exclusiva dos números do turismo na Costa Esmeralda durante a temporada 2024-2025.',
            category: 'Economia',
            url: 'analises.html',
            tags: ['turismo', 'economia', 'costa esmeralda', 'dados']
        },
        {
            id: 8,
            title: 'Turismo 2025: dados oficiais mostram crescimento na região',
            excerpt: 'Itapema lidera em número de visitantes, mas Bombinhas apresenta maior ticket médio por turista.',
            category: 'Economia',
            url: 'noticias.html',
            tags: ['turismo', 'itapema', 'bombinhas', 'economia']
        },
        {
            id: 9,
            title: 'Prefeito de Itapema afirma que obra foi entregue "dentro do prazo"',
            excerpt: 'Verificamos a cronologia completa do projeto e comparamos com as promessas de campanha de 2020.',
            category: 'Fact-Checking',
            url: 'fact-checking.html',
            tags: ['itapema', 'prefeito', 'obra', 'verificação']
        },
        {
            id: 10,
            title: 'Sessão Ordinária da Câmara de Itapema',
            excerpt: 'Transmissão ao vivo com comentários em tempo real da nossa equipe.',
            category: 'Ao Vivo',
            url: 'politica.html',
            tags: ['itapema', 'câmara', 'transmissão', 'ao vivo']
        }
    ];

    // ===== ESTADO =====
    let searchModal = null;
    let searchInput = null;
    let searchResults = null;
    let isSearchOpen = false;

    // ===== FUNÇÕES =====

    /**
     * Cria o modal de busca dinamicamente
     */
    function createSearchModal() {
        // Verifica se já existe
        if (document.getElementById('search-modal')) {
            return document.getElementById('search-modal');
        }

        const modal = document.createElement('div');
        modal.id = 'search-modal';
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-overlay" id="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            id="search-input" 
                            class="search-input" 
                            placeholder="Buscar notícias, análises, política..."
                            autocomplete="off"
                            aria-label="Campo de busca"
                        >
                        <kbd class="search-shortcut">ESC</kbd>
                    </div>
                    <button class="search-close" id="search-close" aria-label="Fechar busca">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-results" id="search-results">
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>Digite pelo menos 2 caracteres para buscar</p>
                    </div>
                </div>
                <div class="search-footer">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> Navegar</span>
                    <span><kbd>↵</kbd> Selecionar</span>
                    <span><kbd>ESC</kbd> Fechar</span>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Adiciona os estilos CSS do modal de busca
     */
    function addSearchStyles() {
        if (document.getElementById('search-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'search-styles';
        styles.textContent = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 10vh;
            }

            .search-modal.active {
                display: flex;
            }

            .search-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
            }

            .search-container {
                position: relative;
                width: 90%;
                max-width: 700px;
                background: var(--white, #ffffff);
                border-radius: 12px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                animation: searchSlideDown 0.2s ease;
            }

            @keyframes searchSlideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .search-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid var(--border, #e5e7eb);
            }

            .search-input-wrapper {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: var(--bg-paper, #fafaf9);
                border-radius: 8px;
                padding: 0.75rem 1rem;
            }

            .search-icon {
                color: var(--text-light, #4b5563);
                font-size: 1.125rem;
            }

            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                font-family: 'Inter', sans-serif;
                font-size: 1rem;
                color: var(--text-dark, #1f2937);
                outline: none;
            }

            .search-input::placeholder {
                color: var(--text-light, #4b5563);
            }

            .search-shortcut {
                background: var(--white, #ffffff);
                border: 1px solid var(--border, #e5e7eb);
                border-radius: 4px;
                padding: 0.25rem 0.5rem;
                font-family: 'Inter', monospace;
                font-size: 0.75rem;
                color: var(--text-light, #4b5563);
            }

            .search-close {
                width: 40px;
                height: 40px;
                border: none;
                background: transparent;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-light, #4b5563);
                transition: all 0.2s;
            }

            .search-close:hover {
                background: var(--bg-paper, #fafaf9);
                color: var(--text-dark, #1f2937);
            }

            .search-results {
                max-height: 400px;
                overflow-y: auto;
                padding: 0.5rem;
            }

            .search-empty {
                text-align: center;
                padding: 3rem 1rem;
                color: var(--text-light, #4b5563);
            }

            .search-empty i {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.3;
            }

            .search-empty p {
                font-family: 'Inter', sans-serif;
                font-size: 0.9375rem;
            }

            .search-result-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-decoration: none;
                color: inherit;
            }

            .search-result-item:hover,
            .search-result-item.selected {
                background: var(--bg-paper, #fafaf9);
            }

            .search-result-item.selected {
                outline: 2px solid var(--accent, #b8860b);
                outline-offset: -2px;
            }

            .search-result-icon {
                width: 40px;
                height: 40px;
                background: var(--primary, #1a365d);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }

            .search-result-content {
                flex: 1;
                min-width: 0;
            }

            .search-result-title {
                font-family: 'Merriweather', serif;
                font-size: 0.9375rem;
                font-weight: 600;
                color: var(--primary, #1a365d);
                margin-bottom: 0.25rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .search-result-excerpt {
                font-family: 'Inter', sans-serif;
                font-size: 0.8125rem;
                color: var(--text-light, #4b5563);
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .search-result-category {
                display: inline-block;
                background: var(--accent, #b8860b);
                color: white;
                font-family: 'Inter', sans-serif;
                font-size: 0.625rem;
                font-weight: 600;
                text-transform: uppercase;
                padding: 0.125rem 0.5rem;
                border-radius: 4px;
                margin-top: 0.5rem;
            }

            .search-no-results {
                text-align: center;
                padding: 3rem 1rem;
                color: var(--text-light, #4b5563);
            }

            .search-no-results i {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.3;
            }

            .search-footer {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1.5rem;
                padding: 0.75rem 1rem;
                background: var(--bg-paper, #fafaf9);
                border-top: 1px solid var(--border, #e5e7eb);
                font-family: 'Inter', sans-serif;
                font-size: 0.75rem;
                color: var(--text-light, #4b5563);
            }

            .search-footer kbd {
                background: var(--white, #ffffff);
                border: 1px solid var(--border, #e5e7eb);
                border-radius: 4px;
                padding: 0.125rem 0.375rem;
                font-family: monospace;
            }

            @media (max-width: 768px) {
                .search-modal {
                    padding-top: 5vh;
                }

                .search-container {
                    width: 95%;
                }

                .search-footer {
                    display: none;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    /**
     * Realiza a busca nos artigos
     */
    function performSearch(query) {
        if (!query || query.length < CONFIG.minQueryLength) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length >= 2);

        return articlesDB
            .map(article => {
                let score = 0;
                const normalizedTitle = article.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const normalizedExcerpt = article.excerpt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const normalizedCategory = article.category.toLowerCase();
                const normalizedTags = article.tags.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                // Pontuação por correspondência no título (maior peso)
                if (normalizedTitle.includes(normalizedQuery)) {
                    score += 10;
                }
                queryWords.forEach(word => {
                    if (normalizedTitle.includes(word)) score += 5;
                });

                // Pontuação por correspondência no resumo
                if (normalizedExcerpt.includes(normalizedQuery)) {
                    score += 5;
                }
                queryWords.forEach(word => {
                    if (normalizedExcerpt.includes(word)) score += 2;
                });

                // Pontuação por correspondência na categoria
                if (normalizedCategory.includes(normalizedQuery)) {
                    score += 3;
                }

                // Pontuação por correspondência nas tags
                queryWords.forEach(word => {
                    if (normalizedTags.includes(word)) score += 4;
                });

                return { article, score };
            })
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, CONFIG.maxResults)
            .map(result => result.article);
    }

    /**
     * Renderiza os resultados da busca
     */
    function renderResults(results, query) {
        if (!searchResults) return;

        if (!query || query.length < CONFIG.minQueryLength) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <p>Digite pelo menos 2 caracteres para buscar</p>
                </div>
            `;
            return;
        }

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum resultado encontrado para "${escapeHtml(query)}"</p>
                    <p style="font-size: 0.8125rem; margin-top: 0.5rem;">Tente usar termos diferentes ou mais genéricos</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map((article, index) => `
            <a href="${article.url}" class="search-result-item" data-index="${index}">
                <div class="search-result-icon">
                    <i class="fas ${getCategoryIcon(article.category)}"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${highlightMatch(article.title, query)}</div>
                    <div class="search-result-excerpt">${article.excerpt}</div>
                    <span class="search-result-category">${article.category}</span>
                </div>
            </a>
        `).join('');

        searchResults.innerHTML = resultsHTML;

        // Adiciona event listeners aos resultados
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                closeSearch();
            });
        });
    }

    /**
     * Retorna o ícone apropriado para cada categoria
     */
    function getCategoryIcon(category) {
        const icons = {
            'Análise': 'fa-chart-line',
            'Perspectivas': 'fa-balance-scale',
            'Explica': 'fa-lightbulb',
            'Política': 'fa-landmark',
            'Meio Ambiente': 'fa-leaf',
            'Transparência': 'fa-eye',
            'Economia': 'fa-chart-pie',
            'Fact-Checking': 'fa-check-double',
            'Ao Vivo': 'fa-broadcast-tower',
            'Esportes': 'fa-trophy'
        };
        return icons[category] || 'fa-newspaper';
    }

    /**
     * Destaca o termo de busca no texto
     */
    function highlightMatch(text, query) {
        const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        const index = normalizedText.indexOf(normalizedQuery);
        if (index === -1) return escapeHtml(text);

        const before = text.slice(0, index);
        const match = text.slice(index, index + query.length);
        const after = text.slice(index + query.length);

        return `${escapeHtml(before)}<mark style="background: rgba(184, 134, 11, 0.3); padding: 0 2px; border-radius: 2px;">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
    }

    /**
     * Escapa caracteres HTML especiais
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Abre o modal de busca
     */
    function openSearch() {
        if (!searchModal) {
            searchModal = createSearchModal();
            searchInput = document.getElementById(CONFIG.searchInputId);
            searchResults = document.getElementById(CONFIG.searchResultsId);
            setupEventListeners();
        }

        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        isSearchOpen = true;

        // Foca no input após a animação
        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }, 100);
    }

    /**
     * Fecha o modal de busca
     */
    function closeSearch() {
        if (searchModal) {
            searchModal.classList.remove('active');
        }
        document.body.style.overflow = '';
        isSearchOpen = false;
    }

    /**
     * Configura os event listeners
     */
    function setupEventListeners() {
        if (!searchModal || !searchInput) return;

        const overlay = document.getElementById(CONFIG.searchOverlayId);
        const closeBtn = document.getElementById(CONFIG.searchCloseId);

        // Fechar ao clicar no overlay
        overlay?.addEventListener('click', closeSearch);

        // Fechar ao clicar no botão de fechar
        closeBtn?.addEventListener('click', closeSearch);

        // Busca em tempo real
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.trim();
                const results = performSearch(query);
                renderResults(results, query);
            }, 150);
        });

        // Navegação por teclado
        let selectedIndex = -1;

        searchInput.addEventListener('keydown', (e) => {
            const resultItems = searchResults?.querySelectorAll('.search-result-item');

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    closeSearch();
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    if (resultItems && resultItems.length > 0) {
                        selectedIndex = Math.min(selectedIndex + 1, resultItems.length - 1);
                        updateSelection(resultItems, selectedIndex);
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (resultItems && resultItems.length > 0) {
                        selectedIndex = Math.max(selectedIndex - 1, -1);
                        updateSelection(resultItems, selectedIndex);
                    }
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && resultItems && resultItems[selectedIndex]) {
                        resultItems[selectedIndex].click();
                    } else if (resultItems && resultItems.length > 0) {
                        resultItems[0].click();
                    }
                    break;
            }
        });

        // Resetar seleção ao digitar
        searchInput.addEventListener('input', () => {
            selectedIndex = -1;
        });
    }

    /**
     * Atualiza a seleção visual dos resultados
     */
    function updateSelection(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });

        if (index >= 0 && items[index]) {
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    /**
     * Inicializa o sistema de busca
     */
    function init() {
        addSearchStyles();

        // Configura o botão de busca
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.addEventListener('click', openSearch);
            searchButton.style.cursor = 'pointer';
        }

        // Atalho de teclado global (/)
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.target.matches('input, textarea')) {
                e.preventDefault();
                openSearch();
            }
        });

        // Atalho Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });
    }

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expõe funções globalmente
    window.BigNewsSearch = {
        open: openSearch,
        close: closeSearch,
        search: performSearch
    };

})();

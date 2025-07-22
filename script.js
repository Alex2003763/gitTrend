document.addEventListener('DOMContentLoaded', () => {
    const repoContainer = document.getElementById('repo-container');
    const searchInput = document.getElementById('search-input');
    const languageFilter = document.getElementById('language-filter');
    const timeFilterGroup = document.getElementById('time-filter-group');
    const themeToggle = document.getElementById('theme-toggle');
    const paginationContainer = document.getElementById('pagination-container');

    let state = {
        repos: [],
        currentPage: 1,
        isLoading: false,
        totalResults: 0,
        filters: {
            time: 'all',
            language: '',
            searchTerm: ''
        }
    };

    // --- Theme Management ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }

    // --- API and Data Fetching ---
    function getDateQuery(timeFilter) {
        const date = new Date();
        switch (timeFilter) {
            case 'week': date.setDate(date.getDate() - 7); break;
            case 'month': date.setMonth(date.getMonth() - 1); break;
            case 'year': date.setFullYear(date.getFullYear() - 1); break;
            default: return null;
        }
        return date.toISOString().split('T')[0];
    }

    function buildApiUrl() {
        const { time, language, searchTerm } = state.filters;
        const dateQuery = getDateQuery(time);
        let queryParts = [];

        if (searchTerm) queryParts.push(searchTerm);
        
        if (dateQuery) {
            queryParts.push(`created:>${dateQuery}`);
        } else if (!searchTerm) {
            queryParts.push('stars:>1');
        }

        if (language) queryParts.push(`language:${language}`);
        
        const query = queryParts.join(' ');
        return `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30&page=${state.currentPage}`;
    }

    async function fetchRepos() {
        if (state.isLoading) return;

        state.isLoading = true;
        repoContainer.innerHTML = '<p>正在載入專案...</p>';
        paginationContainer.innerHTML = '';

        const url = buildApiUrl();

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();

            state.totalResults = data.total_count;
            state.repos = data.items;

            displayRepos();
            renderPagination();
            
            if (state.currentPage === 1) {
                populateLanguageFilter(state.repos);
            }

        } catch (error) {
            console.error("無法獲取 GitHub 專案:", error);
            repoContainer.innerHTML = '<p class="error-message">無法載入專案列表，請稍後再試。</p>';
        } finally {
            state.isLoading = false;
        }
    }

    // --- UI Rendering ---
    function populateLanguageFilter(repos) {
        const languages = new Set();
        repos.forEach(repo => {
            if (repo.language) languages.add(repo.language);
        });

        const currentLang = languageFilter.value;
        languageFilter.innerHTML = '<option value="">所有語言</option>';
        Array.from(languages).sort().forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang;
            languageFilter.appendChild(option);
        });
        languageFilter.value = currentLang;
    }

    function displayRepos() {
        repoContainer.innerHTML = '';
        if (state.repos.length === 0) {
            repoContainer.innerHTML = '<p>找不到符合條件的專案。</p>';
            return;
        }

        state.repos.forEach(repo => {
            const repoEl = document.createElement('div');
            repoEl.classList.add('repo-card');
            repoEl.innerHTML = `
                <div class="repo-header">
                    <img src="${repo.owner.avatar_url}" alt="${repo.owner.login}" class="owner-avatar">
                    <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                </div>
                <p class="repo-description">${repo.description || '沒有提供描述。'}</p>
                <div class="repo-meta">
                    <span>⭐ ${repo.stargazers_count.toLocaleString()}</span>
                    <span><strong>${repo.language || 'N/A'}</strong></span>
                </div>
            `;
            repoContainer.appendChild(repoEl);
        });
    }

    function renderPagination() {
        const totalPages = Math.min(Math.ceil(state.totalResults / 30), 34); // GitHub API limit
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        function createButton(text, page, isDisabled = false, isActive = false) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.classList.add('pagination-btn');
            if (isActive) btn.classList.add('active');
            btn.disabled = isDisabled;
            btn.addEventListener('click', () => {
                state.currentPage = page;
                fetchRepos();
            });
            return btn;
        }

        function createEllipsis() {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('pagination-ellipsis');
            return ellipsis;
        }

        paginationContainer.appendChild(createButton('‹', state.currentPage - 1, state.currentPage === 1));

        const pagesToShow = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pagesToShow.push(i);
            }
        } else {
            pagesToShow.push(1);
            if (state.currentPage > 3) {
                pagesToShow.push('...');
            }
            for (let i = Math.max(2, state.currentPage - 1); i <= Math.min(totalPages - 1, state.currentPage + 1); i++) {
                pagesToShow.push(i);
            }
            if (state.currentPage < totalPages - 2) {
                pagesToShow.push('...');
            }
            pagesToShow.push(totalPages);
        }

        pagesToShow.forEach(page => {
            if (page === '...') {
                paginationContainer.appendChild(createEllipsis());
            } else {
                paginationContainer.appendChild(createButton(page, page, false, state.currentPage === page));
            }
        });

        paginationContainer.appendChild(createButton('›', state.currentPage + 1, state.currentPage === totalPages));
    }

    function handleFilterChange() {
        state.currentPage = 1;
        fetchRepos();
    }

    // --- Event Listeners ---
    themeToggle.addEventListener('change', toggleTheme);

    searchInput.addEventListener('input', () => {
        state.filters.searchTerm = searchInput.value;
        handleFilterChange();
    });

    languageFilter.addEventListener('change', () => {
        state.filters.language = languageFilter.value;
        handleFilterChange();
    });

    timeFilterGroup.addEventListener('click', (e) => {
        if (e.target.classList.contains('time-filter-btn')) {
            const time = e.target.dataset.time;
            if (time === state.filters.time) return;

            timeFilterGroup.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            state.filters.time = time;
            handleFilterChange();
        }
    });

    // --- Initial Load ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    handleFilterChange();
});
document.addEventListener('DOMContentLoaded', () => {
    const cacheVersion = window.__CACHE_BUST_VERSION__ || Date.now().toString();
    const withCacheBust = (path) => {
        const url = new URL(path, window.location.href);
        url.searchParams.set('v', cacheVersion);
        return `${url.pathname}${url.search}`;
    };

    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    const highlightActiveNav = (container) => {
        const currentPage = location.pathname.split('/').pop() || 'index.html';
        const links = container.querySelectorAll('a[href]');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && currentPage.endsWith(href)) {
                link.classList.add('is-active');
            }
        });
    };

    const setHeaderMarkup = (markup) => {
        placeholder.innerHTML = markup;
        highlightActiveNav(placeholder);
    };

    const fallbackHeader = `
        <header class="main-header">
            <div class="header-container">
                <h1 class="logo">BetEngine</h1>
                <nav class="nav-menu">
                    <a href="index.html">Home</a>
                    <a href="matches.html">Matches</a>
                    <a href="leagues.html">Leagues</a>
                    <a href="stats.html">Stats</a>
                    <a class="premium-btn" href="#">Premium</a>
                </nav>
            </div>
        </header>`;

    fetch(withCacheBust('components/header.html'))
        .then((res) => (res.ok ? res.text() : Promise.reject()))
        .then(setHeaderMarkup)
        .catch(() => {
            setHeaderMarkup(fallbackHeader);
        });
});

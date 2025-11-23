document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = (placeholderId, path, fallback = '', onLoad = null) => {
        const target = document.getElementById(placeholderId);
        if (!target) return;

        const setMarkup = (markup) => {
            target.innerHTML = markup;
            if (typeof onLoad === 'function') {
                onLoad(target);
            }
        };

        fetch(path)
            .then((res) => (res.ok ? res.text() : Promise.reject()))
            .then(setMarkup)
            .catch(() => {
                setMarkup(fallback);
            });
    };

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

    const enhanceFilterChips = () => {
        const chips = document.querySelectorAll('.filter-chip');
        if (!chips.length) return;

        const setActive = (chip) => {
            chips.forEach((c) => c.classList.remove('is-active'));
            chip.classList.add('is-active');
        };

        chips.forEach((chip) => {
            chip.addEventListener('click', () => setActive(chip));
            chip.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActive(chip);
                }
            });
        });
    };

    loadComponent(
        'header-placeholder',
        'components/header.html',
        `<header class="main-header">
            <div class="header-container">
                <h1 class="logo">BetEngine</h1>
                <nav class="nav-menu">
                    <a href="index.html">Home</a>
                    <a href="matches.html">Matches</a>
                    <a href="#">Leagues</a>
                    <a href="#">Stats</a>
                </nav>
            </div>
        </header>`,
        highlightActiveNav
    );

    loadComponent(
        'footer-placeholder',
        'components/footer.html',
        `<footer class="main-footer">
            <div class="footer-container">
                <p>© 2025 BetEngine. All rights reserved.</p>
                <div class="footer-links" aria-label="Footer navigation">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Support</a>
                </div>
            </div>
        </footer>`
    );

    enhanceFilterChips();
});

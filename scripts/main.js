document.addEventListener('DOMContentLoaded', () => {
    const cacheVersion = window.__CACHE_BUST_VERSION__ || Date.now().toString();
    const withCacheBust = (path) => {
        const url = new URL(path, window.location.href);
        url.searchParams.set('v', cacheVersion);
        return `${url.pathname}${url.search}`;
    };

    const loadComponent = (placeholderId, path, fallback = '', onLoad = null) => {
        const target = document.getElementById(placeholderId);
        if (!target) return;

        const setMarkup = (markup) => {
            target.innerHTML = markup;
            if (typeof onLoad === 'function') {
                onLoad(target);
            }
        };

        fetch(withCacheBust(path))
            .then((res) => (res.ok ? res.text() : Promise.reject()))
            .then(setMarkup)
            .catch(() => {
                setMarkup(fallback);
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

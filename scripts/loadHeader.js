(() => {
    const mainHeader = document.getElementById('header') || document.getElementById('header-placeholder');
    const legacyPlaceholder = document.getElementById('header-placeholder');

    if (!mainHeader) return;

    const cacheVersion = window.__CACHE_BUST_VERSION__ || Date.now().toString();

    const resolveHeaderUrl = () => {
        const scriptEl = document.currentScript;
        const base = scriptEl ? scriptEl.src : window.location.href;
        const headerUrl = new URL('../components/header.html', base);
        headerUrl.searchParams.set('v', cacheVersion);
        return headerUrl.toString();
    };

    const highlightActiveNav = (container) => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = container.querySelectorAll('a[href]');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && currentPage.endsWith(href)) {
                link.classList.add('is-active');
            }
        });
    };

    const enhanceNavigation = (container) => {
        const navToggle = container.querySelector('[data-menu-toggle]');
        const navMenu = container.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('is-open');
                navToggle.setAttribute('aria-expanded', navMenu.classList.contains('is-open'));
            });
        }

        const searchToggle = container.querySelector('[data-search-toggle]');
        const searchInput = container.querySelector('.header-search input');
        if (searchToggle && searchInput) {
            searchToggle.addEventListener('click', () => {
                const expanded = searchToggle.getAttribute('aria-expanded') === 'true';
                searchToggle.setAttribute('aria-expanded', (!expanded).toString());
                searchInput.classList.toggle('is-visible');
                if (!expanded) {
                    searchInput.focus();
                }
            });
        }

        const notificationToggle = container.querySelector('[data-notification-toggle]');
        const notificationPanel = container.querySelector('.notification-panel');
        if (notificationToggle && notificationPanel) {
            notificationToggle.addEventListener('click', () => {
                const isOpen = notificationPanel.classList.toggle('is-open');
                notificationToggle.setAttribute('aria-expanded', isOpen);
            });
        }
    };

    fetch(resolveHeaderUrl())
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to load header: ${res.status}`);
            }
            return res.text();
        })
        .then((html) => {
            mainHeader.innerHTML = html;
            highlightActiveNav(mainHeader);
            enhanceNavigation(mainHeader);
            if (legacyPlaceholder && legacyPlaceholder !== mainHeader) {
                legacyPlaceholder.setAttribute('hidden', '');
            }
        })
        .catch((err) => {
            console.error('Header load error:', err);
        });
})();

document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = (placeholderId, path, fallback = '') => {
        const target = document.getElementById(placeholderId);
        if (!target) return;

        fetch(path)
            .then((res) => (res.ok ? res.text() : Promise.reject()))
            .then((markup) => {
                target.innerHTML = markup;
            })
            .catch(() => {
                target.innerHTML = fallback;
            });
    };

    loadComponent(
        'header-placeholder',
        'Frontend/components/header.html',
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
        </header>`
    );

    loadComponent(
        'footer-placeholder',
        'Frontend/components/footer.html',
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
});

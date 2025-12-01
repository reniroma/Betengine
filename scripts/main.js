// Main site bootstrap
// TODO: Replace fixturesData with API response (SportMonks).

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

    const baseDate = new Date();
    const toIsoDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    const isoToday = toIsoDate(baseDate);
    const isoTomorrow = toIsoDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1));
    const isoYesterday = toIsoDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - 1));

    const fixturesData = [
        {
            id: 'pl-001',
            date: isoToday,
            time: '19:45',
            league: 'Premier League',
            country: 'England',
            sport: 'Football',
            homeTeam: 'Brighton',
            awayTeam: 'Newcastle',
            status: 'live',
            score: '2-1',
            odds: { home: 1.95, draw: 3.25, away: 3.8 },
        },
        {
            id: 'pl-002',
            date: isoToday,
            time: '21:00',
            league: 'Premier League',
            country: 'England',
            sport: 'Football',
            homeTeam: 'Chelsea',
            awayTeam: 'Tottenham',
            status: 'upcoming',
            score: null,
            odds: { home: 2.1, draw: 3.1, away: 3.4 },
        },
        {
            id: 'pl-003',
            date: isoYesterday,
            time: 'FT',
            league: 'Premier League',
            country: 'England',
            sport: 'Football',
            homeTeam: 'Brentford',
            awayTeam: 'Fulham',
            status: 'finished',
            score: '1-0',
            odds: { home: 2.3, draw: 3.0, away: 3.2 },
        },
        {
            id: 'sa-001',
            date: isoToday,
            time: '18:00',
            league: 'Serie A',
            country: 'Italy',
            sport: 'Football',
            homeTeam: 'Napoli',
            awayTeam: 'Roma',
            status: 'live',
            score: '1-1',
            odds: { home: 2.0, draw: 3.05, away: 3.95 },
        },
        {
            id: 'sa-002',
            date: isoToday,
            time: '20:45',
            league: 'Serie A',
            country: 'Italy',
            sport: 'Football',
            homeTeam: 'Inter',
            awayTeam: 'Lazio',
            status: 'upcoming',
            score: null,
            odds: { home: 1.7, draw: 3.6, away: 5.0 },
        },
        {
            id: 'sa-003',
            date: isoTomorrow,
            time: '17:30',
            league: 'Serie A',
            country: 'Italy',
            sport: 'Football',
            homeTeam: 'Atalanta',
            awayTeam: 'Torino',
            status: 'upcoming',
            score: null,
            odds: { home: 2.45, draw: 3.1, away: 2.95 },
        },
        {
            id: 'laliga-001',
            date: isoToday,
            time: '19:30',
            league: 'La Liga',
            country: 'Spain',
            sport: 'Football',
            homeTeam: 'Valencia',
            awayTeam: 'Sevilla',
            status: 'upcoming',
            score: null,
            odds: { home: 2.25, draw: 3.1, away: 3.25 },
        },
        {
            id: 'mls-001',
            date: isoTomorrow,
            time: '22:00',
            league: 'MLS',
            country: 'USA',
            sport: 'Football',
            homeTeam: 'LA Galaxy',
            awayTeam: 'Seattle Sounders',
            status: 'upcoming',
            score: null,
            odds: { home: 2.6, draw: 3.2, away: 2.6 },
        },
    ];

    const matchesContainer = document.getElementById('matches-list');
    const trendingList = document.getElementById('trending-picks');
    const quickDateChips = document.querySelectorAll('.quick-dates .filter-chip');
    const datePicker = document.getElementById('date-picker');
    const searchInput = document.getElementById('search');
    const sportSelect = document.getElementById('sport');
    const countrySelect = document.getElementById('country');
    const leagueSelect = document.getElementById('league');
    const oddsFormatSelect = document.getElementById('odds-format');

    let activeQuickDate = 'today';

    const isSameDate = (a, b) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const getDateFromSelection = () => {
        if (datePicker && datePicker.value) {
            const customDate = new Date(datePicker.value);
            return new Date(customDate.getFullYear(), customDate.getMonth(), customDate.getDate());
        }
        if (!activeQuickDate) return null;
        const base = new Date();
        if (activeQuickDate === 'tomorrow') {
            base.setDate(base.getDate() + 1);
        }
        return new Date(base.getFullYear(), base.getMonth(), base.getDate());
    };

    const convertOdds = (value, format) => {
        if (format === 'decimal') return value.toFixed(2);
        // Placeholder for fractional/American conversions
        return value.toFixed(2);
    };

    const formatScore = (fixture) => {
        if (fixture.status === 'upcoming' || !fixture.score) return '—';
        return fixture.score.replace('-', ' — ');
    };

    const createMatchRow = (fixture, oddsFormat) => {
        const row = document.createElement('div');
        row.className = `match-row ${fixture.status !== 'upcoming' ? fixture.status : ''}`.trim();

        const statusLabel = fixture.status === 'live' ? 'LIVE' : fixture.status === 'finished' ? 'FT' : '';

        row.innerHTML = `
            <div class="time">${fixture.time}</div>
            <div class="home team-cell">
                <span class="team-name" title="${fixture.homeTeam}">${fixture.homeTeam}</span>
            </div>
            <div class="away team-cell">
                <span class="team-name" title="${fixture.awayTeam}">${fixture.awayTeam}</span>
            </div>
            <div class="status">
                ${statusLabel ? `<span class="status-badge ${fixture.status}">${statusLabel}</span>` : ''}
                <span class="score">${formatScore(fixture)}</span>
            </div>
            <div class="odds-row">
                <button class="odd-cell" type="button">${convertOdds(fixture.odds.home, oddsFormat)}</button>
                <button class="odd-cell" type="button">${convertOdds(fixture.odds.draw, oddsFormat)}</button>
                <button class="odd-cell" type="button">${convertOdds(fixture.odds.away, oddsFormat)}</button>
            </div>
            <div class="match-action"><a href="#">Details</a></div>
        `;

        return row;
    };

    const renderFixtures = (fixtures, oddsFormat) => {
        if (!matchesContainer) return;
        matchesContainer.innerHTML = '';

        if (!fixtures.length) {
            const empty = document.createElement('div');
            empty.className = 'league-card empty-state';
            empty.innerHTML = '<div class="league-header"><h3>No matches found</h3><span class="label">Adjust filters</span></div>';
            matchesContainer.appendChild(empty);
            return;
        }

        const grouped = fixtures.reduce((acc, fixture) => {
            const key = `${fixture.league}-${fixture.country}`;
            if (!acc[key]) {
                acc[key] = { league: fixture.league, country: fixture.country, fixtures: [] };
            }
            acc[key].fixtures.push(fixture);
            return acc;
        }, {});

        Object.values(grouped)
            .sort((a, b) => a.league.localeCompare(b.league))
            .forEach((group) => {
                const article = document.createElement('article');
                article.className = 'league-card';

                const header = document.createElement('div');
                header.className = 'league-header';
                header.innerHTML = `<h3>${group.league} · ${group.country}</h3><span class="label">Matches</span>`;
                article.appendChild(header);

                group.fixtures
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .forEach((fixture) => {
                        article.appendChild(createMatchRow(fixture, oddsFormat));
                    });

                matchesContainer.appendChild(article);
            });
    };

    const buildTrendingLabel = (fixture, index) => {
        const picks = ['BTTS', 'Over 2.5', 'Home win', 'Draw no bet', 'Value pick'];
        const tag = picks[index % picks.length];
        return `${fixture.homeTeam} vs ${fixture.awayTeam} – ${tag}`;
    };

    const renderTrendingPicks = (fixtures) => {
        if (!trendingList) return;
        trendingList.innerHTML = '';

        const candidates = (fixtures.length ? fixtures : fixturesData)
            .filter((fixture) => fixture.status !== 'finished')
            .slice(0, 5);

        if (!candidates.length) {
            trendingList.innerHTML = '<li><span>No picks available</span></li>';
            return;
        }

        candidates.forEach((fixture, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${buildTrendingLabel(fixture, index)}</span><span class="pill">${fixture.status === 'live' ? 'Live boost' : 'Value'}</span>`;
            trendingList.appendChild(li);
        });
    };

    const populateSelectOptions = () => {
        if (!countrySelect || !leagueSelect) return;
        const countries = new Set(['all']);
        const leagues = new Set(['all']);
        fixturesData.forEach((fixture) => {
            countries.add(fixture.country);
            leagues.add(fixture.league);
        });

        const buildOptions = (select, values) => {
            const current = select.value;
            select.innerHTML = '';
            values.forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value === 'all' ? `All ${select.id === 'country' ? 'countries' : 'leagues'}` : value;
                select.appendChild(option);
            });
            if ([...values].includes(current)) {
                select.value = current;
            }
        };

        buildOptions(countrySelect, Array.from(countries).sort());
        buildOptions(leagueSelect, Array.from(leagues).sort());
    };

    const applyFilters = () => {
        if (!matchesContainer) return;
        const targetDate = getDateFromSelection();
        const searchTerm = (searchInput?.value || '').trim().toLowerCase();
        const selectedSport = sportSelect?.value;
        const selectedCountry = countrySelect?.value || 'all';
        const selectedLeague = leagueSelect?.value || 'all';
        const oddsFormat = oddsFormatSelect?.value || 'decimal';

        const filtered = fixturesData.filter((fixture) => {
            const fixtureDate = new Date(fixture.date);
            if (selectedSport && fixture.sport !== selectedSport) return false;
            if (selectedCountry !== 'all' && fixture.country !== selectedCountry) return false;
            if (selectedLeague !== 'all' && fixture.league !== selectedLeague) return false;
            if (targetDate && !isSameDate(fixtureDate, targetDate)) return false;
            if (searchTerm) {
                const haystack = `${fixture.homeTeam} ${fixture.awayTeam} ${fixture.league}`.toLowerCase();
                if (!haystack.includes(searchTerm)) return false;
            }
            return true;
        });

        renderFixtures(filtered, oddsFormat);
        renderTrendingPicks(filtered);
    };

    const setActiveChip = (chip) => {
        quickDateChips.forEach((c) => c.classList.remove('is-active'));
        if (chip) {
            chip.classList.add('is-active');
            activeQuickDate = chip.dataset.date;
        } else {
            activeQuickDate = null;
        }
    };

    const attachFilterHandlers = () => {
        quickDateChips.forEach((chip) => {
            const activateChip = () => {
                setActiveChip(chip);
                if (datePicker) datePicker.value = '';
                applyFilters();
            };
            chip.addEventListener('click', activateChip);
            chip.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activateChip();
                }
            });
        });

        if (datePicker) {
            datePicker.addEventListener('change', () => {
                setActiveChip(null);
                applyFilters();
            });
        }

        [sportSelect, countrySelect, leagueSelect, oddsFormatSelect].forEach((select) => {
            if (!select) return;
            select.addEventListener('change', applyFilters);
        });

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
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

    if (matchesContainer) {
        populateSelectOptions();
        attachFilterHandlers();
        applyFilters();
    }
});

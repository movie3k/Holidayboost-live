// Enhanced Admin Panel for Holiday-Based Vacation Card Creation

class HolidayCalendarAdmin {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.selectedHoliday = null;
        this.holidays = {};
        this.recommendations = [];
        this.tooltip = null;

        this.init();
    }

    async init() {
        console.log('🚀 Initializing Enhanced Admin Panel v2.0');

        this.tooltip = document.getElementById('holiday-tooltip');

        // Dynamische Jahresauswahl generieren
        this.generateYearTabs();

        // Aktuelles Jahr im Titel setzen
        document.getElementById('selected-year').textContent = this.currentYear;

        await this.loadRecommendations();
        await this.loadHolidays();

        this.setupEventListeners();
        this.renderCalendar();
        this.renderRecommendationsList();
        this.updateLiveCounter();
        this.updateStatistics();
        this.updateSystemInfo();

        console.log('✅ Admin Panel fully initialized');
    }

    generateYearTabs() {
        const yearSelector = document.querySelector('.year-tabs');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-11

        // Intelligente Jahr-Auswahl:
        // - Wenn wir nach Oktober sind (Monat >= 9), zeige auch nächstes Jahr prominent
        // - Zeige immer 4 Jahre insgesamt
        const years = [];

        if (currentMonth >= 9) { // Oktober oder später
            // Zeige: aktuelles Jahr, nächstes Jahr (aktiv), +2, +3
            years.push(currentYear);
            years.push(currentYear + 1); // Nächstes Jahr als Default
            years.push(currentYear + 2);
            years.push(currentYear + 3);

            // Setze nächstes Jahr als aktiv wenn wir spät im Jahr sind
            this.currentYear = currentYear + 1;
        } else {
            // Zeige: aktuelles Jahr (aktiv), +1, +2, +3
            years.push(currentYear);
            years.push(currentYear + 1);
            years.push(currentYear + 2);
            years.push(currentYear + 3);

            this.currentYear = currentYear;
        }

        yearSelector.innerHTML = years.map(year => `
            <button class="year-tab ${year === this.currentYear ? 'active' : ''}" data-year="${year}">
                ${year}
                ${year === currentYear ? ' (Aktuell)' : ''}
                ${year === currentYear + 1 && currentMonth >= 9 ? ' ⭐' : ''}
            </button>
        `).join('');

        // Zusätzlich: "Mehr Jahre" Button für erweiterte Planung
        yearSelector.innerHTML += `
            <button class="year-tab" onclick="holidayAdmin.showMoreYears()" style="background: rgba(59, 130, 246, 0.1); border-style: dashed;">
                + Mehr
            </button>
        `;
    }

    showMoreYears() {
        const yearSelector = document.querySelector('.year-tabs');
        const currentYear = new Date().getFullYear();
        const years = [];

        // Zeige 10 Jahre in die Zukunft
        for (let i = 0; i < 10; i++) {
            years.push(currentYear + i);
        }

        yearSelector.innerHTML = years.map(year => `
            <button class="year-tab ${year === this.currentYear ? 'active' : ''}" data-year="${year}">
                ${year}
            </button>
        `).join('');

        // "Weniger" Button
        yearSelector.innerHTML += `
            <button class="year-tab" onclick="holidayAdmin.generateYearTabs()" style="background: rgba(239, 68, 68, 0.1); border-style: dashed;">
                − Weniger
            </button>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Jahr-Tabs (mit Event Delegation für dynamisch generierte Tabs)
        document.querySelector('.year-tabs').addEventListener('click', (e) => {
            if (e.target.classList.contains('year-tab') && e.target.dataset.year) {
                document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentYear = parseInt(e.target.dataset.year);
                document.getElementById('selected-year').textContent = this.currentYear;
                this.loadHolidays();
                this.renderRecommendationsList(); // Empfehlungen für neues Jahr anzeigen
                this.updateStatistics(); // Statistiken aktualisieren
            }
        });

        // Filter/Sortierung
        document.getElementById('sort-filter').addEventListener('change', (e) => {
            this.renderRecommendationsList(e.target.value);
        });

        // Global mouse move for tooltip
        document.addEventListener('mousemove', (e) => {
            if (this.tooltip && this.tooltip.classList.contains('visible')) {
                this.tooltip.style.left = e.pageX + 10 + 'px';
                this.tooltip.style.top = e.pageY + 10 + 'px';
            }
        });
    }

    async loadHolidays() {
        console.log(`📅 Loading holidays for ${this.currentYear}`);

        // Zuerst Fallback laden für sofortige Anzeige
        this.loadFallbackHolidays();

        try {
            // Dann versuche API-Daten zu laden
            const states = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'];
            const apiHolidays = {};

            for (const state of states) {
                const holidays = await this.fetchHolidaysForState(state);

                for (const holiday of holidays) {
                    const date = holiday.datum;
                    if (!apiHolidays[date]) {
                        apiHolidays[date] = {
                            name: holiday.name,
                            date: date,
                            states: [],
                            isNational: false
                        };
                    }
                    if (!apiHolidays[date].states.includes(state)) {
                        apiHolidays[date].states.push(state);
                    }
                }
            }

            // Nur übernehmen wenn Daten vorhanden
            if (Object.keys(apiHolidays).length > 0) {
                Object.values(apiHolidays).forEach(holiday => {
                    holiday.states = [...new Set(holiday.states)];
                    if (holiday.states.length === 16) {
                        holiday.isNational = true;
                    }
                });

                this.holidays = apiHolidays;
                console.log(`✅ Loaded ${Object.keys(this.holidays).length} holidays from API`);
                this.renderCalendar();
            }

        } catch (error) {
            console.log('ℹ️ Using fallback holidays (API not available)');
        }
    }

    async fetchHolidaysForState(state) {
        try {
            const response = await fetch(`https://feiertage-api.de/api/?jahr=${this.currentYear}&nur_land=${state}`);
            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            return Object.entries(data).map(([name, info]) => ({
                name: name,
                datum: info.datum,
                hinweis: info.hinweis
            }));
        } catch (error) {
            console.error(`Error fetching holidays for ${state}:`, error);
            return [];
        }
    }

    loadFallbackHolidays() {
        const year = this.currentYear;

        // Berechne bewegliche Feiertage (Ostern-basiert)
        const easter = this.calculateEaster(year);
        const karfreitag = new Date(easter);
        karfreitag.setDate(easter.getDate() - 2);
        const ostermontag = new Date(easter);
        ostermontag.setDate(easter.getDate() + 1);
        const himmelfahrt = new Date(easter);
        himmelfahrt.setDate(easter.getDate() + 39);
        const pfingstmontag = new Date(easter);
        pfingstmontag.setDate(easter.getDate() + 50);
        const fronleichnam = new Date(easter);
        fronleichnam.setDate(easter.getDate() + 60);

        const formatDate = (d) => d.toISOString().split('T')[0];

        this.holidays = {};

        // Feste Feiertage
        const fixedHolidays = [
            { date: `${year}-01-01`, name: 'Neujahr', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: `${year}-01-06`, name: 'Heilige Drei Könige', states: ['BW', 'BY', 'ST'], isNational: false },
            { date: `${year}-05-01`, name: 'Tag der Arbeit', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: `${year}-10-03`, name: 'Tag der Deutschen Einheit', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: `${year}-10-31`, name: 'Reformationstag', states: ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'], isNational: false },
            { date: `${year}-11-01`, name: 'Allerheiligen', states: ['BW', 'BY', 'NW', 'RP', 'SL'], isNational: false },
            { date: `${year}-12-25`, name: '1. Weihnachtsfeiertag', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: `${year}-12-26`, name: '2. Weihnachtsfeiertag', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true }
        ];

        // Bewegliche Feiertage
        const movableHolidays = [
            { date: formatDate(karfreitag), name: 'Karfreitag', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: formatDate(ostermontag), name: 'Ostermontag', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: formatDate(himmelfahrt), name: 'Christi Himmelfahrt', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: formatDate(pfingstmontag), name: 'Pfingstmontag', states: ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'], isNational: true },
            { date: formatDate(fronleichnam), name: 'Fronleichnam', states: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'], isNational: false }
        ];

        [...fixedHolidays, ...movableHolidays].forEach(h => {
            this.holidays[h.date] = { name: h.name, date: h.date, states: h.states, isNational: h.isNational };
        });

        console.log(`✅ Loaded ${Object.keys(this.holidays).length} fallback holidays for ${year}`);
        this.renderCalendar();
    }

    // Berechne Ostersonntag (Gauss-Algorithmus)
    calculateEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month, day);
    }

    renderCalendar() {
        const container = document.getElementById('full-year-calendar');
        container.innerHTML = '';

        const months = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];

        const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month-calendar';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'month-header';
            headerDiv.textContent = months[month];
            monthDiv.appendChild(headerDiv);

            const gridDiv = document.createElement('div');
            gridDiv.className = 'calendar-grid';

            // Wochentage
            weekdays.forEach(day => {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-weekday';
                dayDiv.textContent = day;
                gridDiv.appendChild(dayDiv);
            });

            // Tage des Monats
            const firstDay = new Date(this.currentYear, month, 1);
            const lastDay = new Date(this.currentYear, month + 1, 0);
            const startWeekday = (firstDay.getDay() + 6) % 7; // Mo = 0

            // Leere Tage am Anfang
            for (let i = 0; i < startWeekday; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'calendar-day other-month';
                gridDiv.appendChild(emptyDiv);
            }

            // Tage des Monats
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(this.currentYear, month, day);
                const dateStr = this.formatDate(date);
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day';
                dayDiv.textContent = day;

                const weekday = date.getDay();
                if (weekday === 0 || weekday === 6) {
                    dayDiv.classList.add('weekend');
                }

                // Prüfe ob Feiertag
                if (this.holidays[dateStr]) {
                    dayDiv.classList.add('holiday');
                    dayDiv.dataset.date = dateStr;
                    dayDiv.dataset.holiday = JSON.stringify(this.holidays[dateStr]);

                    // Event Listeners
                    dayDiv.addEventListener('click', () => this.selectHoliday(this.holidays[dateStr]));
                    dayDiv.addEventListener('mouseenter', (e) => this.showTooltip(e, this.holidays[dateStr]));
                    dayDiv.addEventListener('mouseleave', () => this.hideTooltip());
                }

                // Prüfe auf Brückentage
                if (this.isBridgeDay(date)) {
                    dayDiv.classList.add('bridge-day');
                }

                gridDiv.appendChild(dayDiv);
            }

            monthDiv.appendChild(gridDiv);
            container.appendChild(monthDiv);
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isBridgeDay(date) {
        const dayBefore = new Date(date);
        dayBefore.setDate(date.getDate() - 1);
        const dayAfter = new Date(date);
        dayAfter.setDate(date.getDate() + 1);

        const dateStr = this.formatDate(date);
        const beforeStr = this.formatDate(dayBefore);
        const afterStr = this.formatDate(dayAfter);

        // Ist Brückentag wenn zwischen zwei Feiertagen oder Feiertag und Wochenende
        const weekday = date.getDay();
        if (weekday === 1 || weekday === 5) { // Montag oder Freitag
            return this.holidays[beforeStr] || this.holidays[afterStr];
        }

        return false;
    }

    showTooltip(event, holiday) {
        const stateNames = {
            'BW': 'Baden-Württemberg', 'BY': 'Bayern', 'BE': 'Berlin',
            'BB': 'Brandenburg', 'HB': 'Bremen', 'HH': 'Hamburg',
            'HE': 'Hessen', 'MV': 'Mecklenburg-Vorpommern', 'NI': 'Niedersachsen',
            'NW': 'Nordrhein-Westfalen', 'RP': 'Rheinland-Pfalz', 'SL': 'Saarland',
            'SN': 'Sachsen', 'ST': 'Sachsen-Anhalt', 'SH': 'Schleswig-Holstein', 'TH': 'Thüringen'
        };

        let content = `<strong>${holiday.name}</strong><br>`;

        if (holiday.isNational || holiday.states.includes('ALL')) {
            content += '🇩🇪 Bundesweit';
        } else {
            const stateList = holiday.states.map(s => stateNames[s] || s).slice(0, 3);
            content += stateList.join(', ');
            if (holiday.states.length > 3) {
                content += ` +${holiday.states.length - 3} weitere`;
            }
        }

        this.tooltip.innerHTML = content;
        this.tooltip.style.left = event.pageX + 10 + 'px';
        this.tooltip.style.top = event.pageY + 10 + 'px';
        this.tooltip.classList.add('visible');
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    selectHoliday(holiday) {
        this.selectedHoliday = holiday;
        this.renderHolidayDetails(holiday);
        this.renderCardGenerator(holiday);
    }

    renderHolidayDetails(holiday) {
        const detailsDiv = document.getElementById('holiday-details');
        const stateNames = {
            'BW': 'BW', 'BY': 'BY', 'BE': 'BE', 'BB': 'BB', 'HB': 'HB', 'HH': 'HH',
            'HE': 'HE', 'MV': 'MV', 'NI': 'NI', 'NW': 'NW', 'RP': 'RP', 'SL': 'SL',
            'SN': 'SN', 'ST': 'ST', 'SH': 'SH', 'TH': 'TH'
        };

        const date = new Date(holiday.date);
        const weekday = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][date.getDay()];

        // Stelle sicher, dass states ein Array ist und keine Duplikate hat
        const uniqueStates = [...new Set(holiday.states || [])].sort();

        detailsDiv.innerHTML = `
            <div class="holiday-name">${holiday.name}</div>
            <div class="holiday-date">${weekday}, ${date.getDate()}.${date.getMonth() + 1}.</div>

            <div class="holiday-regions">
                <div class="region-list">
                    ${holiday.isNational || uniqueStates.includes('ALL') || uniqueStates.length === 16 ?
                        '<span class="region-badge">🇩🇪 Bundesweit</span>' :
                        uniqueStates.map(s => `<span class="region-badge">${stateNames[s] || s}</span>`).join('')
                    }
                </div>
            </div>

            <div class="holiday-statistics">
                <div class="stat-row">
                    <span class="stat-label">Abdeckung:</span>
                    <span class="stat-value">${uniqueStates.length}/16 (${Math.round(uniqueStates.length / 16 * 100)}%)</span>
                </div>
            </div>
        `;

        document.getElementById('card-generator').style.display = 'block';
    }

    renderCardGenerator(holiday) {
        const generatorDiv = document.getElementById('card-generator');
        const suggestions = this.generateCardSuggestions(holiday);

        generatorDiv.innerHTML = `
            <div class="card-generator-header">🎯 Schnell-Erstellung</div>

            <div class="quick-card-buttons">
                ${suggestions.map(s => `
                    <button class="quick-card-btn" onclick="holidayAdmin.createQuickCard('${s.type}')">
                        <span>${s.icon} ${s.title}</span>
                        <span class="efficiency">${s.efficiency}x</span>
                    </button>
                `).join('')}
            </div>

            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: #94a3b8; font-size: 13px; font-weight: 600; padding: 8px; background: rgba(45, 55, 72, 0.4); border-radius: 6px;">
                    ⚙️ Erweiterte Optionen
                </summary>

                <div class="card-form" style="margin-top: 10px;">
                    <div class="form-group">
                        <label>Titel</label>
                        <input type="text" id="card-title" placeholder="Titel" value="${holiday.name}-Paket">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div class="form-group">
                            <label>Typ</label>
                            <select id="card-type" style="width: 100%;">
                                <option value="bridge">Brückentag</option>
                                <option value="optimal">Optimal</option>
                                <option value="extended">Verlängert</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Urlaubstage</label>
                            <input type="number" id="vacation-count" placeholder="Anzahl" min="1" max="30" value="1">
                        </div>
                    </div>

                    <!-- Stadt-Auswahl für Städte mit eigenen Feiertagen -->
                    <div class="form-group" id="city-selection-group" style="margin-bottom: 10px;">
                        <label>Stadt (nur bei Stadtfeiertagen)</label>
                        <select id="card-city" style="width: 100%;">
                            <option value="">-- Keine spezifische Stadt --</option>
                            <option value="augsburg" ${holiday.name.toLowerCase().includes('augsburg') || holiday.name.toLowerCase().includes('friedensfest') ? 'selected' : ''}>Augsburg (Friedensfest 8. Aug)</option>
                            <option value="köln" ${holiday.name.toLowerCase().includes('köln') || holiday.name.toLowerCase().includes('rosenmontag') ? 'selected' : ''}>Köln (Rosenmontag)</option>
                        </select>
                        <small style="color: #94a3b8; font-size: 10px; margin-top: 4px; display: block;">
                            ${this.detectCityHoliday(holiday.name).isCity ?
                                '⚠️ Stadtfeiertag erkannt!' :
                                'Nur für Augsburger Friedensfest oder Kölner Karneval'}
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Beschreibung</label>
                        <input type="text" id="card-description" placeholder="Kurze Beschreibung...">
                    </div>

                    <div class="vacation-day-selector" style="margin-top: 10px;">
                        <label style="color: #cbd5e0; font-size: 11px; display: block; margin-bottom: 6px;">
                            Urlaubstage auswählen (ca. 3 Wochen):
                        </label>
                        <div id="vacation-days-grid" class="vacation-day-grid" style="max-height: 150px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 8px; display: flex; flex-wrap: wrap; gap: 4px;">
                            <!-- Wird dynamisch gefüllt -->
                        </div>
                    </div>

                    <button class="btn-create-card" onclick="holidayAdmin.createCustomCard()" style="padding: 8px 16px; font-size: 13px; width: 100%; margin-top: 10px;">
                        ✨ Individuelle Karte erstellen
                    </button>
                </div>
            </details>
        `;

        this.renderVacationDayOptions(holiday);
    }

    generateCardSuggestions(holiday) {
        const suggestions = [];
        const date = new Date(holiday.date);
        const weekday = date.getDay();

        // Brückentag-Vorschläge
        if (weekday === 2) { // Dienstag - Montag frei nehmen
            const vacationDays = [this.getPreviousWorkday(date)];
            const effectiveDays = this.calculateEffectiveFreeDays(vacationDays);
            suggestions.push({
                type: 'bridge-monday',
                icon: '🌉',
                title: `${effectiveDays}-Tage-Wochenende`,
                efficiency: this.calculateEfficiency(vacationDays).toFixed(1),
                vacationDays: vacationDays
            });
        } else if (weekday === 4) { // Donnerstag - Freitag frei nehmen
            const vacationDays = [this.getNextWorkday(date)];
            const effectiveDays = this.calculateEffectiveFreeDays(vacationDays);
            suggestions.push({
                type: 'bridge-friday',
                icon: '🌉',
                title: `${effectiveDays}-Tage-Wochenende`,
                efficiency: this.calculateEfficiency(vacationDays).toFixed(1),
                vacationDays: vacationDays
            });
        }

        // Wochenverlängerung (ganze Woche)
        if (weekday >= 1 && weekday <= 5) {
            const vacationDays = this.getWeekExtension(date);
            const effectiveDays = this.calculateEffectiveFreeDays(vacationDays);
            suggestions.push({
                type: 'week-extension',
                icon: '📅',
                title: `${effectiveDays}-Tage-Auszeit`,
                efficiency: this.calculateEfficiency(vacationDays).toFixed(1),
                vacationDays: vacationDays
            });
        }

        // Optimale Erholung (2 Wochen)
        const optimalVacation = this.getOptimalVacation(date);
        const optimalEffectiveDays = this.calculateEffectiveFreeDays(optimalVacation);
        suggestions.push({
            type: 'optimal',
            icon: '🏖️',
            title: `${optimalEffectiveDays}-Tage-Urlaub`,
            efficiency: this.calculateEfficiency(optimalVacation).toFixed(1),
            vacationDays: optimalVacation
        });

        return suggestions;
    }

    getPreviousWorkday(date) {
        const prevDay = new Date(date);
        prevDay.setDate(date.getDate() - 1);
        while (prevDay.getDay() === 0 || prevDay.getDay() === 6) {
            prevDay.setDate(prevDay.getDate() - 1);
        }
        return this.formatDate(prevDay);
    }

    getNextWorkday(date) {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
            nextDay.setDate(nextDay.getDate() + 1);
        }
        return this.formatDate(nextDay);
    }

    getWeekExtension(date) {
        const vacationDays = [];
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));

        for (let i = 0; i < 5; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayStr = this.formatDate(day);
            if (!this.holidays[dayStr]) {
                vacationDays.push(dayStr);
            }
        }

        return vacationDays;
    }

    getOptimalVacation(date) {
        const vacationDays = [];
        const start = new Date(date);
        start.setDate(date.getDate() - 7);

        for (let i = 0; i < 14; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const weekday = day.getDay();
            const dayStr = this.formatDate(day);

            if (weekday !== 0 && weekday !== 6 && !this.holidays[dayStr]) {
                vacationDays.push(dayStr);
            }
        }

        return vacationDays.slice(0, 10);
    }

    renderVacationDayOptions(holiday) {
        const grid = document.getElementById('vacation-days-grid');
        const date = new Date(holiday.date);

        // Zeige Werktage um den Feiertag herum (3 Wochen)
        const daysToShow = [];
        for (let i = -7; i <= 14; i++) {
            const day = new Date(date);
            day.setDate(date.getDate() + i);

            const weekday = day.getDay();
            if (weekday === 0 || weekday === 6) continue; // Wochenenden überspringen

            const dayStr = this.formatDate(day);
            if (this.holidays[dayStr]) continue; // Feiertage überspringen

            daysToShow.push({
                date: dayStr,
                display: `${day.getDate()}.${day.getMonth() + 1}.`,
                weekday: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][weekday]
            });
        }

        grid.innerHTML = daysToShow.map(day =>
            `<div class="vacation-day-option" data-date="${day.date}">${day.weekday} ${day.display}</div>`
        ).join('');

        // Klick-Events
        grid.querySelectorAll('.vacation-day-option').forEach(option => {
            option.addEventListener('click', () => option.classList.toggle('selected'));
        });
    }

    createQuickCard(type) {
        const holiday = this.selectedHoliday;
        const suggestions = this.generateCardSuggestions(holiday);
        const suggestion = suggestions.find(s => s.type === type);

        if (!suggestion) return;

        // Erkenne Stadtfeiertage anhand des Namens
        const cityInfo = this.detectCityHoliday(holiday.name);

        // Berechne effektive freie Tage und Effizienz korrekt
        const effectiveDays = this.calculateEffectiveFreeDays(suggestion.vacationDays);
        const efficiency = this.calculateEfficiency(suggestion.vacationDays);

        const card = {
            id: Date.now(),
            year: this.currentYear,
            title: `${holiday.name} - ${suggestion.title}`,
            description: `${suggestion.vacationDays.length} Urlaubstage → ${effectiveDays} freie Tage`,
            type: type.includes('bridge') ? 'bridge' : type,
            vacationDates: suggestion.vacationDays,
            holidays: [holiday.name],
            regions: holiday.isNational ? ['ALL'] : holiday.states,
            cities: cityInfo.cities,
            effectiveDays: effectiveDays,
            efficiency: efficiency,
            createdAt: new Date().toISOString()
        };

        this.saveRecommendation(card);
        this.showNotification(`✅ Karte "${card.title}" wurde erstellt! (${effectiveDays} freie Tage)`);
        this.renderRecommendationsList();
    }

    // Erkennt Stadtfeiertage anhand des Namens
    detectCityHoliday(holidayName) {
        const lowerName = holidayName.toLowerCase();

        // Bekannte Stadtfeiertage - nur Augsburg und Köln
        const cityHolidays = {
            'augsburg': ['augsburger friedensfest', 'friedensfest'],
            'köln': ['rosenmontag', 'karneval', 'kölner']
        };

        for (const [city, keywords] of Object.entries(cityHolidays)) {
            if (keywords.some(kw => lowerName.includes(kw))) {
                return { cities: [city], isCity: true };
            }
        }

        return { cities: [], isCity: false };
    }

    createCustomCard() {
        const selectedDays = Array.from(document.querySelectorAll('.vacation-day-option.selected'))
            .map(el => el.dataset.date);

        if (selectedDays.length === 0) {
            alert('Bitte wählen Sie mindestens einen Urlaubstag aus!');
            return;
        }

        // Prüfe Stadt-Auswahl aus dem Formular
        const citySelect = document.getElementById('card-city');
        const selectedCity = citySelect ? citySelect.value : '';

        // Wenn Stadt ausgewählt, nutze diese; sonst versuche Auto-Erkennung
        let cities = [];
        if (selectedCity) {
            cities = [selectedCity];
        } else {
            const cityInfo = this.detectCityHoliday(this.selectedHoliday.name);
            cities = cityInfo.cities;
        }

        // Berechne effektive freie Tage und Effizienz korrekt
        const effectiveDays = this.calculateEffectiveFreeDays(selectedDays);
        const efficiency = this.calculateEfficiency(selectedDays);

        // Auto-generiere Beschreibung wenn leer
        const customDescription = document.getElementById('card-description').value;
        const description = customDescription || `${selectedDays.length} Urlaubstage → ${effectiveDays} freie Tage`;

        const card = {
            id: Date.now(),
            year: this.currentYear,
            title: document.getElementById('card-title').value,
            description: description,
            type: document.getElementById('card-type').value,
            vacationDates: selectedDays,
            holidays: [this.selectedHoliday.name],
            regions: this.selectedHoliday.isNational ? ['ALL'] : this.selectedHoliday.states,
            cities: cities,
            effectiveDays: effectiveDays,
            efficiency: efficiency,
            createdAt: new Date().toISOString()
        };

        this.saveRecommendation(card);
        this.showNotification(`✅ Karte "${card.title}" wurde erstellt! (${effectiveDays} freie Tage)`);
        this.renderRecommendationsList();
    }

    // 2.7. calculateEffectiveFreeDays - Berechnet effektive freie Tage für Arbeitnehmer (Mo-Fr)
    // Berücksichtigt: Urlaubstage + angrenzende Wochenenden + Feiertage im Block
    calculateEffectiveFreeDays(vacationDates) {
        if (!vacationDates || vacationDates.length === 0) return 0;

        // Sortiere Daten
        const sortedDates = vacationDates
            .map(d => new Date(d))
            .sort((a, b) => a - b);

        // Finde den ersten und letzten Urlaubstag
        const firstVacationDay = sortedDates[0];
        const lastVacationDay = sortedDates[sortedDates.length - 1];

        // Erweitere rückwärts um angrenzende freie Tage (Wochenende/Feiertag)
        let extendedStart = new Date(firstVacationDay);
        extendedStart.setDate(extendedStart.getDate() - 1);
        while (this.isDayFree(extendedStart)) {
            extendedStart.setDate(extendedStart.getDate() - 1);
        }
        extendedStart.setDate(extendedStart.getDate() + 1); // Korrektur: letzter war Werktag

        // Erweitere vorwärts um angrenzende freie Tage (Wochenende/Feiertag)
        let extendedEnd = new Date(lastVacationDay);
        extendedEnd.setDate(extendedEnd.getDate() + 1);
        while (this.isDayFree(extendedEnd)) {
            extendedEnd.setDate(extendedEnd.getDate() + 1);
        }
        extendedEnd.setDate(extendedEnd.getDate() - 1); // Korrektur: letzter war Werktag

        // Berechne Gesamtzahl der Tage im erweiterten Block (inklusive Start und Ende)
        const timeDiff = extendedEnd.getTime() - extendedStart.getTime();
        const effectiveDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        return effectiveDays;
    }

    // Hilfsfunktion: Prüft ob ein Tag frei ist (Wochenende oder Feiertag)
    isDayFree(date) {
        const dayOfWeek = date.getDay();
        // Samstag (6) oder Sonntag (0) = Wochenende
        if (dayOfWeek === 0 || dayOfWeek === 6) return true;

        // Prüfe auf Feiertag
        const dateStr = this.formatDate(date);
        if (this.holidays[dateStr]) return true;

        return false;
    }

    // Berechnet Effizienz: Effektive freie Tage / Benötigte Urlaubstage
    calculateEfficiency(vacationDays) {
        if (!vacationDays || vacationDays.length === 0) return 0;
        const effectiveDays = this.calculateEffectiveFreeDays(vacationDays);
        return Math.round((effectiveDays / vacationDays.length) * 100) / 100;
    }

    async loadRecommendations() {
        try {
            // Versuche zuerst von Server-API zu laden
            const response = await fetch('/api/recommendations');
            if (response.ok) {
                const data = await response.json();
                if (data.recommendations) {
                    this.recommendations = data.recommendations;
                    console.log(`✅ Loaded ${this.recommendations.length} recommendations from server`);
                    return;
                }
            }
        } catch (error) {
            console.log('API not available, trying static file...');
        }

        // Fallback: Statische Datei
        try {
            const response = await fetch('/data/recommendations.json');
            if (response.ok) {
                const data = await response.json();
                if (data.recommendations) {
                    this.recommendations = data.recommendations;
                } else if (Array.isArray(data)) {
                    this.recommendations = data;
                }
                console.log(`✅ Loaded ${this.recommendations.length} recommendations from file`);
            }
        } catch (error) {
            console.log('Loading recommendations from localStorage');
            this.recommendations = JSON.parse(localStorage.getItem('customVacationRecommendations') || '[]');
        }
    }

    saveRecommendation(card) {
        this.recommendations.push(card);
        this.saveToServer();
        this.updateLiveCounter();
        this.updateStatistics();
    }

    async saveToServer() {
        const configData = {
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalRecommendations: this.recommendations.length,
                version: "2.0.0",
                generatedBy: "HolidayBoost Admin Panel"
            },
            recommendations: this.recommendations
        };

        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ Saved ${result.count} recommendations to server`);
                return true;
            }
        } catch (error) {
            console.log('Server not available, saving to localStorage');
        }

        // Fallback: localStorage
        localStorage.setItem('customVacationRecommendations', JSON.stringify(this.recommendations));
        return false;
    }

    renderRecommendationsList(filterType = 'all') {
        const listDiv = document.getElementById('recommendations-list');
        const filterTabsDiv = document.getElementById('filter-tabs');

        // Filter Empfehlungen nach aktuellem Jahr
        const yearRecommendations = this.recommendations.filter(r => r.year === this.currentYear);

        if (yearRecommendations.length === 0) {
            listDiv.innerHTML = `
                <p style="text-align: center; color: #94a3b8; margin: 40px 0;">
                    Noch keine Empfehlungen für ${this.currentYear} vorhanden
                </p>
            `;
            filterTabsDiv.style.display = 'none';
            return;
        }

        // Gruppiere Empfehlungen basierend auf Filter
        let groups = {};

        switch(filterType) {
            case 'year':
                // Gruppiere nach Jahr
                yearRecommendations.forEach(rec => {
                    const key = `${rec.year}`;
                    if (!groups[key]) groups[key] = { icon: '📅', items: [] };
                    groups[key].items.push(rec);
                });
                break;

            case 'type':
                // Gruppiere nach Typ
                yearRecommendations.forEach(rec => {
                    const typeNames = {
                        'bridge': '🌉 Brückentage',
                        'optimal': '🏖️ Optimale Erholung',
                        'extended': '🗓️ Verlängerte Auszeit'
                    };
                    const key = typeNames[rec.type] || '📋 Sonstige';
                    if (!groups[key]) groups[key] = { items: [] };
                    groups[key].items.push(rec);
                });
                break;

            case 'holiday':
                // Gruppiere nach Feiertag
                yearRecommendations.forEach(rec => {
                    const holiday = rec.holidays?.[0] || 'Unbekannt';
                    const key = `🎯 ${holiday}`;
                    if (!groups[key]) groups[key] = { items: [] };
                    groups[key].items.push(rec);
                });
                break;

            case 'efficiency':
                // Gruppiere nach Effizienz
                yearRecommendations.forEach(rec => {
                    let key;
                    if (rec.efficiency >= 3) key = '⭐ Sehr Effizient (3x+)';
                    else if (rec.efficiency >= 2) key = '✨ Effizient (2-3x)';
                    else key = '📊 Standard (unter 2x)';

                    if (!groups[key]) groups[key] = { items: [] };
                    groups[key].items.push(rec);
                });
                break;

            default:
                // Alle anzeigen ohne Gruppierung
                groups['Alle Empfehlungen'] = { icon: '📋', items: yearRecommendations };
        }

        // Zeige Filter-Tabs wenn gruppiert
        if (filterType !== 'all' && Object.keys(groups).length > 1) {
            filterTabsDiv.style.display = 'block';
            filterTabsDiv.innerHTML = `
                <div class="filter-tabs-container">
                    ${Object.keys(groups).map(key => `
                        <button class="filter-tab" onclick="holidayAdmin.toggleFolder('${key.replace(/'/g, '')}')">
                            ${key} (${groups[key].items.length})
                        </button>
                    `).join('')}
                </div>
            `;
        } else {
            filterTabsDiv.style.display = 'none';
        }

        // Rendere Ordner-Struktur
        listDiv.innerHTML = Object.keys(groups).map(groupName => `
            <div class="folder-container">
                <div class="folder-header ${filterType === 'all' ? 'active' : ''}" onclick="holidayAdmin.toggleFolder('${groupName.replace(/'/g, '')}')">
                    <div class="folder-title">
                        <span>${filterType === 'all' ? '📂' : '📁'}</span>
                        <span>${groupName}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="folder-count">${groups[groupName].items.length}</span>
                        <span style="color: #94a3b8; font-size: 18px;">
                            ${filterType === 'all' ? '▼' : '▶'}
                        </span>
                    </div>
                </div>
                <div class="folder-content ${filterType === 'all' ? 'expanded' : ''}" id="folder-${groupName.replace(/[^a-zA-Z0-9]/g, '')}">
                    ${groups[groupName].items.map(rec => this.renderRecommendationCard(rec)).join('')}
                </div>
            </div>
        `).join('');
    }

    renderRecommendationCard(rec) {
        const vacationDays = rec.vacationDates?.length || 0;
        const effectiveDays = rec.effectiveDays || vacationDays; // Fallback für alte Einträge

        return `
            <div class="recommendation-item">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <h4 style="color: #f8fafc; margin: 0; font-size: 16px;">${rec.title}</h4>
                    <button onclick="holidayAdmin.deleteRecommendation(${rec.id})" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        🗑️
                    </button>
                </div>
                <p style="color: #cbd5e0; margin: 5px 0; font-size: 13px;">${rec.description}</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                    <span style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px;" title="Effizienz: Freie Tage pro Urlaubstag">
                        ${rec.efficiency}x Effizienz
                    </span>
                    <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px;" title="Benötigte Urlaubstage">
                        📋 ${vacationDays} Urlaubstage
                    </span>
                    <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px;" title="Effektive freie Tage (inkl. Wochenenden)">
                        🏖️ ${effectiveDays} freie Tage
                    </span>
                    ${rec.holidays?.[0] ? `
                        <span style="background: rgba(255, 215, 0, 0.2); color: #ffd700; padding: 3px 8px; border-radius: 12px; font-size: 11px;">
                            ${rec.holidays[0]}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
    }

    toggleFolder(folderId) {
        const cleanId = folderId.replace(/[^a-zA-Z0-9]/g, '');
        const folderContent = document.getElementById(`folder-${cleanId}`);
        const folderHeader = folderContent?.previousElementSibling;

        if (folderContent) {
            folderContent.classList.toggle('expanded');
            if (folderHeader) {
                folderHeader.classList.toggle('active');
                const arrow = folderHeader.querySelector('span:last-child');
                if (arrow) {
                    arrow.textContent = folderContent.classList.contains('expanded') ? '▼' : '▶';
                }
            }
        }
    }

    deleteRecommendation(id) {
        if (!confirm('Möchten Sie diese Empfehlung wirklich löschen?')) return;

        this.recommendations = this.recommendations.filter(r => r.id !== id);
        this.saveToServer();
        this.renderRecommendationsList();
        this.updateLiveCounter();
        this.updateStatistics();
        this.showNotification('🗑️ Empfehlung gelöscht');
    }

    // Live-Counter für Auto-Save Status aktualisieren
    updateLiveCounter() {
        const counter = document.getElementById('live-counter');
        if (counter) {
            counter.textContent = this.recommendations.length;
            // Animation
            counter.style.transform = 'scale(1.2)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Manueller Export - speichert direkt auf Server
    async manualExport() {
        const saved = await this.saveToServer();
        if (saved) {
            this.showNotification(`✅ ${this.recommendations.length} Empfehlungen gespeichert!`);
        } else {
            // Fallback: Download
            const configData = {
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    totalRecommendations: this.recommendations.length,
                    version: "2.0.0",
                    generatedBy: "HolidayBoost Admin Panel"
                },
                recommendations: this.recommendations
            };

            const jsonString = JSON.stringify(configData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'recommendations.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification(`📥 ${this.recommendations.length} Empfehlungen als Datei exportiert`);
        }
    }

    // Benachrichtigung anzeigen
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Statistiken aktualisieren
    updateStatistics() {
        const total = this.recommendations.length;
        const currentYearRecs = this.recommendations.filter(r => r.year === this.currentYear);

        // Durchschnittliche Effizienz berechnen
        let avgEfficiency = 0;
        if (total > 0) {
            const totalEfficiency = this.recommendations.reduce((sum, r) => sum + (r.efficiency || 0), 0);
            avgEfficiency = totalEfficiency / total;
        }

        // Unique Feiertage zählen
        const allHolidays = new Set();
        this.recommendations.forEach(r => {
            if (r.holidays) {
                r.holidays.forEach(h => allHolidays.add(h));
            }
        });

        // DOM Updates
        const statTotal = document.getElementById('stat-total');
        const statCurrentYear = document.getElementById('stat-current-year');
        const statAvgEfficiency = document.getElementById('stat-avg-efficiency');
        const statHolidaysUsed = document.getElementById('stat-holidays-used');

        if (statTotal) statTotal.textContent = total;
        if (statCurrentYear) statCurrentYear.textContent = currentYearRecs.length;
        if (statAvgEfficiency) statAvgEfficiency.textContent = avgEfficiency.toFixed(1) + 'x';
        if (statHolidaysUsed) statHolidaysUsed.textContent = allHolidays.size;
    }

    // System Information aktualisieren
    updateSystemInfo() {
        const sysLastModified = document.getElementById('sys-last-modified');
        const sysStorageSize = document.getElementById('sys-storage-size');
        const sysBrowser = document.getElementById('sys-browser');

        // Letzte Änderung
        if (sysLastModified) {
            const stored = localStorage.getItem('customVacationRecommendations');
            if (stored) {
                sysLastModified.textContent = new Date().toLocaleString('de-DE');
            } else {
                sysLastModified.textContent = 'Nie';
            }
        }

        // Speichergröße
        if (sysStorageSize) {
            const stored = localStorage.getItem('customVacationRecommendations') || '[]';
            const sizeKB = (new Blob([stored]).size / 1024).toFixed(2);
            sysStorageSize.textContent = `${sizeKB} KB`;
        }

        // Browser
        if (sysBrowser) {
            const ua = navigator.userAgent;
            let browser = 'Unbekannt';
            if (ua.includes('Chrome')) browser = 'Chrome';
            else if (ua.includes('Firefox')) browser = 'Firefox';
            else if (ua.includes('Safari')) browser = 'Safari';
            else if (ua.includes('Edge')) browser = 'Edge';
            sysBrowser.textContent = browser;
        }
    }

    // JSON Modal anzeigen
    showJsonModal() {
        const configData = {
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalRecommendations: this.recommendations.length,
                version: "2.0.0",
                generatedBy: "HolidayBoost Admin Panel"
            },
            recommendations: this.recommendations
        };

        const jsonString = JSON.stringify(configData, null, 2);

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1e293b;
            border-radius: 15px;
            padding: 30px;
            max-width: 800px;
            max-height: 80vh;
            overflow: auto;
            border: 1px solid rgba(255,255,255,0.1);
            width: 100%;
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #f8fafc; margin: 0;">📄 Recommendations JSON</h2>
                <button id="close-json-modal" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">✕</button>
            </div>

            <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                <button id="copy-json" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">📋 Kopieren</button>
                <button id="download-json" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">💾 Download</button>
            </div>

            <textarea id="json-content" readonly style="width: 100%; height: 400px; background: #0f172a; color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; font-family: monospace; font-size: 12px; resize: none;">${jsonString}</textarea>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Event Listeners
        document.getElementById('close-json-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('copy-json').addEventListener('click', () => {
            navigator.clipboard.writeText(jsonString).then(() => {
                this.showNotification('✅ JSON kopiert!');
            });
        });

        document.getElementById('download-json').addEventListener('click', () => {
            this.manualExport();
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Daten neu laden
    async reloadData() {
        if (confirm('Daten vom Server neu laden? Lokale Änderungen gehen verloren.')) {
            await this.loadRecommendations();
            this.renderRecommendationsList();
            this.updateLiveCounter();
            this.updateStatistics();
            this.updateSystemInfo();
            this.showNotification('✅ Daten neu geladen!');
        }
    }

    // Alle Daten löschen
    resetAllData() {
        if (confirm('⚠️ WARNUNG: Alle Empfehlungen werden gelöscht! Diese Aktion kann nicht rückgängig gemacht werden.')) {
            if (confirm('Sind Sie wirklich sicher?')) {
                this.recommendations = [];
                localStorage.removeItem('customVacationRecommendations');
                localStorage.removeItem('adminRecommendations');
                this.saveToServer(); // Speichere leeres Array auf Server
                this.renderRecommendationsList();
                this.updateLiveCounter();
                this.updateStatistics();
                this.updateSystemInfo();
                this.showNotification('🗑️ Alle Daten gelöscht!');
            }
        }
    }

    // ========================================
    // AFFILIATE-LINKS VERWALTUNG (MODULE 8)
    // ========================================

    // Affiliate-Daten initialisieren
    initAffiliateLinks() {
        this.affiliateLinks = {
            flights: [],
            hotels: [],
            activities: [],
            insurance: []
        };
        this.loadAffiliateLinks();
    }

    // Affiliate-Links vom Server laden
    async loadAffiliateLinks() {
        try {
            const response = await fetch('/api/affiliates');
            if (response.ok) {
                this.affiliateLinks = await response.json();
            }
        } catch (error) {
            console.log('Keine Affiliate-Links gefunden, verwende Standard-Daten');
            // Standard-Beispiel-Links mit Template-URLs
            this.affiliateLinks = {
                flights: [
                    { name: 'Skyscanner', url: '', icon: '✈️', template: 'https://www.skyscanner.de/transport/fluge/{from}/{to}/' }
                ],
                hotels: [
                    { name: 'Booking.com', url: '', icon: '🏨', template: 'https://www.booking.com/{slug}.html' }
                ],
                activities: [
                    { name: 'GetYourGuide', url: '', icon: '🎯', template: 'https://www.getyourguide.de/{slug}/' }
                ],
                insurance: [
                    { name: 'HanseMerkur', url: '', icon: '🛡️' }
                ]
            };
        }
        this.renderAffiliateLinks();
    }

    // Affiliate-Links rendern
    renderAffiliateLinks() {
        const categories = ['flights', 'hotels', 'activities', 'insurance'];

        categories.forEach(category => {
            const container = document.getElementById(`${category}-links`);
            if (!container) return;

            container.innerHTML = '';

            const links = this.affiliateLinks[category] || [];
            links.forEach((link, index) => {
                const item = document.createElement('div');
                item.className = 'affiliate-link-item';

                // Template-Platzhalter erklären
                const templatePlaceholder = category === 'flights'
                    ? 'Template: .../{from}/{to}/?affiliateid=XXX'
                    : category === 'hotels'
                    ? 'Template: .../city/{city}.html?aid=XXX'
                    : category === 'activities'
                    ? 'Template: .../{location}/?partner=XXX'
                    : 'Affiliate-URL';

                item.innerHTML = `
                    <div class="affiliate-row">
                        <input type="text" class="icon-input" value="${link.icon || ''}" placeholder="Icon" data-category="${category}" data-index="${index}" data-field="icon">
                        <input type="text" class="name-input" value="${link.name || ''}" placeholder="Name (z.B. Skyscanner)" data-category="${category}" data-index="${index}" data-field="name">
                        <button class="delete-btn" onclick="holidayAdmin.deleteAffiliateLink('${category}', ${index})">🗑️</button>
                    </div>
                    <input type="text" class="template-input" value="${link.template || ''}" placeholder="${templatePlaceholder}" data-category="${category}" data-index="${index}" data-field="template">
                `;
                container.appendChild(item);
            });

            // Event-Listener für Änderungen
            container.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', (e) => this.updateAffiliateLinkField(e.target));
            });
        });
    }

    // Affiliate-Link Feld aktualisieren
    updateAffiliateLinkField(input) {
        const category = input.dataset.category;
        const index = parseInt(input.dataset.index);
        const field = input.dataset.field;
        const value = input.value;

        if (this.affiliateLinks[category] && this.affiliateLinks[category][index]) {
            this.affiliateLinks[category][index][field] = value;
        }
    }

    // Neuen Affiliate-Link hinzufügen
    addAffiliateLink(category) {
        if (!this.affiliateLinks[category]) {
            this.affiliateLinks[category] = [];
        }

        const defaultIcons = {
            flights: '✈️',
            hotels: '🏨',
            activities: '🎯',
            insurance: '🛡️'
        };

        this.affiliateLinks[category].push({
            name: '',
            url: '',
            icon: defaultIcons[category] || '🔗'
        });

        this.renderAffiliateLinks();
        this.showNotification(`➕ Neuer ${category}-Link hinzugefügt`);
    }

    // Affiliate-Link löschen
    deleteAffiliateLink(category, index) {
        if (this.affiliateLinks[category]) {
            this.affiliateLinks[category].splice(index, 1);
            this.renderAffiliateLinks();
            this.showNotification('🗑️ Link gelöscht');
        }
    }

    // Affiliate-Links speichern
    async saveAffiliateLinks() {
        // Validiere Links - entferne leere Einträge
        Object.keys(this.affiliateLinks).forEach(category => {
            this.affiliateLinks[category] = this.affiliateLinks[category].filter(link => link.name && link.name.trim() !== '');
        });

        try {
            const response = await fetch('/api/affiliates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.affiliateLinks)
            });

            if (response.ok) {
                this.showNotification('💾 Affiliate-Links erfolgreich gespeichert!');
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            this.showNotification('❌ Fehler beim Speichern der Affiliate-Links');
        }
    }

    // ========================================
    // MODULE: SOCIAL MEDIA VERWALTUNG
    // ========================================

    async initSocialMedia() {
        try {
            const response = await fetch('/api/config/socialMedia');
            if (response.ok) {
                const data = await response.json();
                // Instagram
                if (data.instagram) {
                    document.getElementById('social-instagram-url').value = data.instagram.url || '';
                    document.getElementById('social-instagram-active').checked = data.instagram.active !== false;
                }
                // TikTok
                if (data.tiktok) {
                    document.getElementById('social-tiktok-url').value = data.tiktok.url || '';
                    document.getElementById('social-tiktok-active').checked = data.tiktok.active !== false;
                }
                // Pinterest
                if (data.pinterest) {
                    document.getElementById('social-pinterest-url').value = data.pinterest.url || '';
                    document.getElementById('social-pinterest-active').checked = data.pinterest.active !== false;
                }
                // YouTube
                if (data.youtube) {
                    document.getElementById('social-youtube-url').value = data.youtube.url || '';
                    document.getElementById('social-youtube-active').checked = data.youtube.active === true;
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Social Media Daten:', error);
        }
    }

    async saveSocialMedia() {
        const data = {
            instagram: {
                url: document.getElementById('social-instagram-url').value,
                active: document.getElementById('social-instagram-active').checked
            },
            tiktok: {
                url: document.getElementById('social-tiktok-url').value,
                active: document.getElementById('social-tiktok-active').checked
            },
            pinterest: {
                url: document.getElementById('social-pinterest-url').value,
                active: document.getElementById('social-pinterest-active').checked
            },
            youtube: {
                url: document.getElementById('social-youtube-url').value,
                active: document.getElementById('social-youtube-active').checked
            }
        };

        try {
            const response = await fetch('/api/config/socialMedia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showNotification('📱 Social Media Links gespeichert!');
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            this.showNotification('❌ Fehler beim Speichern');
        }
    }

    // ========================================
    // MODULE: SEO-EINSTELLUNGEN
    // ========================================

    async initSeoSettings() {
        try {
            const response = await fetch('/api/config/seo');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('seo-meta-title').value = data.title || '';
                document.getElementById('seo-meta-description').value = data.description || '';
                document.getElementById('seo-keywords').value = data.keywords || '';
            }
        } catch (error) {
            console.error('Fehler beim Laden der SEO Daten:', error);
        }

        // Zeichen-Counter für Title
        const titleInput = document.getElementById('seo-meta-title');
        const titleCount = document.getElementById('seo-title-count');
        titleInput.addEventListener('input', () => {
            titleCount.textContent = `${titleInput.value.length}/60`;
            titleCount.style.color = titleInput.value.length > 55 ? '#f59e0b' : '#94a3b8';
        });
        titleCount.textContent = `${titleInput.value.length}/60`;

        // Zeichen-Counter für Description
        const descInput = document.getElementById('seo-meta-description');
        const descCount = document.getElementById('seo-desc-count');
        descInput.addEventListener('input', () => {
            descCount.textContent = `${descInput.value.length}/160`;
            descCount.style.color = descInput.value.length > 150 ? '#f59e0b' : '#94a3b8';
        });
        descCount.textContent = `${descInput.value.length}/160`;
    }

    async saveSeoSettings() {
        const data = {
            title: document.getElementById('seo-meta-title').value,
            description: document.getElementById('seo-meta-description').value,
            keywords: document.getElementById('seo-keywords').value
        };

        try {
            const response = await fetch('/api/config/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showNotification('🔍 SEO-Einstellungen gespeichert!');
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            this.showNotification('❌ Fehler beim Speichern');
        }
    }

    // ========================================
    // MODULE: KONTAKTDATEN VERWALTUNG
    // ========================================

    async initContactData() {
        try {
            const response = await fetch('/api/config/contact');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('contact-company').value = data.company || '';
                document.getElementById('contact-email').value = data.email || '';
                document.getElementById('contact-address').value = data.address || '';
                document.getElementById('contact-phone').value = data.phone || '';
            }
        } catch (error) {
            console.error('Fehler beim Laden der Kontaktdaten:', error);
        }
    }

    async saveContactData() {
        const data = {
            company: document.getElementById('contact-company').value,
            email: document.getElementById('contact-email').value,
            address: document.getElementById('contact-address').value,
            phone: document.getElementById('contact-phone').value
        };

        try {
            const response = await fetch('/api/config/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showNotification('📞 Kontaktdaten gespeichert!');
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            this.showNotification('❌ Fehler beim Speichern');
        }
    }

    // ========================================
    // MODULE: HERO IMAGE VERWALTUNG
    // ========================================

    async initHeroImage() {
        try {
            const response = await fetch('/api/config/heroImage');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('hero-image-filename').value = data.filename || 'urlaub2.jpg';
                document.getElementById('hero-header-position').value = data.headerPosition || 35;
                document.getElementById('hero-footer-position').value = data.footerPosition || 45;
                document.getElementById('hero-overlay-opacity').value = data.overlayOpacity || 70;
            }
        } catch (error) {
            console.error('Fehler beim Laden der Hero Image Daten:', error);
        }

        // Update Vorschau und Werte
        this.updateHeroPreview();

        // Event Listener für Slider
        const headerSlider = document.getElementById('hero-header-position');
        const footerSlider = document.getElementById('hero-footer-position');
        const opacitySlider = document.getElementById('hero-overlay-opacity');
        const filenameInput = document.getElementById('hero-image-filename');

        headerSlider.addEventListener('input', () => {
            document.getElementById('hero-header-position-value').textContent = `${headerSlider.value}%`;
        });

        footerSlider.addEventListener('input', () => {
            document.getElementById('hero-footer-position-value').textContent = `${footerSlider.value}%`;
        });

        opacitySlider.addEventListener('input', () => {
            document.getElementById('hero-overlay-opacity-value').textContent = `${opacitySlider.value}%`;
        });

        filenameInput.addEventListener('change', () => {
            this.updateHeroPreview();
        });

        // Initiale Werte setzen
        document.getElementById('hero-header-position-value').textContent = `${headerSlider.value}%`;
        document.getElementById('hero-footer-position-value').textContent = `${footerSlider.value}%`;
        document.getElementById('hero-overlay-opacity-value').textContent = `${opacitySlider.value}%`;

        // Verfügbare Bilder laden
        this.loadAvailableImages();
    }

    async loadAvailableImages() {
        try {
            const response = await fetch('/api/uploads');
            if (response.ok) {
                const data = await response.json();
                console.log('Verfügbare Bilder:', data);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Bilder:', error);
        }
    }

    updateHeroPreview() {
        const filename = document.getElementById('hero-image-filename').value;
        const preview = document.getElementById('hero-image-preview');
        preview.style.backgroundImage = `url('${filename}')`;
    }

    async saveHeroImage() {
        const data = {
            filename: document.getElementById('hero-image-filename').value,
            headerPosition: parseInt(document.getElementById('hero-header-position').value),
            footerPosition: parseInt(document.getElementById('hero-footer-position').value),
            overlayOpacity: parseInt(document.getElementById('hero-overlay-opacity').value)
        };

        try {
            const response = await fetch('/api/config/heroImage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showNotification('🖼️ Bildeinstellungen gespeichert! Seite neu laden für Änderungen.');
            } else {
                throw new Error('Server-Fehler');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            this.showNotification('❌ Fehler beim Speichern');
        }
    }

    // ========================================
    // MODULE: BILD-UPLOAD
    // ========================================

    async uploadHeroImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload?type=hero', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                document.getElementById('hero-image-filename').value = result.filename;
                this.updateHeroPreview();
                this.showNotification('✅ Bild hochgeladen: ' + result.filename);
                return result;
            } else {
                throw new Error('Upload fehlgeschlagen');
            }
        } catch (error) {
            console.error('Upload-Fehler:', error);
            this.showNotification('❌ Upload fehlgeschlagen');
            return null;
        }
    }

    // ========================================
    // MODULE: ALLE NEUEN MODULE INITIALISIEREN
    // ========================================

    async initAllNewModules() {
        await this.initSocialMedia();
        await this.initSeoSettings();
        await this.initContactData();
        await this.initHeroImage();
        console.log('✅ Alle Admin-Module initialisiert (API-Modus)');
    }
}

// Initialisierung
let holidayAdmin;
document.addEventListener('DOMContentLoaded', () => {
    holidayAdmin = new HolidayCalendarAdmin();
    holidayAdmin.initAffiliateLinks();
    holidayAdmin.initAllNewModules();
});
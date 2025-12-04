// MODULE 1: KONSTANTEN & DATEN (Data Module)

// 1.1. HOLIDAYS - Dynamische Feiertagsberechnung für beliebige Jahre
// Cache für bereits berechnete Feiertage
const HOLIDAYS = {};

// Alle Bundesländer
const ALL_STATES = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'];

// 1.1.1 Berechnet Ostersonntag nach dem Computus-Algorithmus (Gaußsche Osterformel)
function calculateEasterSunday(year) {
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
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

// 1.1.2 Berechnet Buß- und Bettag (Mittwoch vor dem 23. November)
function calculateBussUndBettag(year) {
    const nov23 = new Date(year, 10, 23); // 23. November
    const dayOfWeek = nov23.getDay();
    // Finde den Mittwoch davor (Mittwoch = 3)
    let daysToSubtract = dayOfWeek - 3;
    if (daysToSubtract <= 0) daysToSubtract += 7;
    const bussUndBettag = new Date(nov23);
    bussUndBettag.setDate(nov23.getDate() - daysToSubtract);
    return bussUndBettag;
}

// 1.1.3 Formatiert Datum als MM-DD String
function formatDateString(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
}

// 1.1.4 Addiert Tage zu einem Datum
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// 1.1.5 Generiert alle Feiertage für ein Jahr
function generateHolidaysForYear(year) {
    const easter = calculateEasterSunday(year);
    const bussUndBettag = calculateBussUndBettag(year);

    // Bewegliche Feiertage basierend auf Ostern
    const karfreitag = addDays(easter, -2);
    const ostermontag = addDays(easter, 1);
    const himmelfahrt = addDays(easter, 39);
    const pfingstmontag = addDays(easter, 50);
    const fronleichnam = addDays(easter, 60);
    const rosenmontag = addDays(easter, -48);

    const holidays = [
        // Feste Feiertage
        { d: '01-01', n: 'Neujahr', s: ALL_STATES },
        { d: '01-06', n: 'Heilige Drei Könige', s: ['BW', 'BY', 'ST'] },
        { d: '03-08', n: 'Internationaler Frauentag', s: ['BE', 'MV'] },
        { d: '05-01', n: 'Tag der Arbeit', s: ALL_STATES },
        { d: '08-08', n: 'Friedensfest', c: ['augsburg'] },
        { d: '08-15', n: 'Mariä Himmelfahrt', s: ['BY', 'SL'] },
        { d: '09-20', n: 'Weltkindertag', s: ['TH'] },
        { d: '10-03', n: 'Tag der Deutschen Einheit', s: ALL_STATES },
        { d: '10-31', n: 'Reformationstag', s: ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'] },
        { d: '11-01', n: 'Allerheiligen', s: ['BW', 'BY', 'NW', 'RP', 'SL'] },
        { d: '12-25', n: '1. Weihnachtsfeiertag', s: ALL_STATES },
        { d: '12-26', n: '2. Weihnachtsfeiertag', s: ALL_STATES },

        // Bewegliche Feiertage
        { d: formatDateString(rosenmontag), n: 'Rosenmontag', c: ['köln'] },
        { d: formatDateString(karfreitag), n: 'Karfreitag', s: ALL_STATES },
        { d: formatDateString(ostermontag), n: 'Ostermontag', s: ALL_STATES },
        { d: formatDateString(himmelfahrt), n: 'Christi Himmelfahrt', s: ALL_STATES },
        { d: formatDateString(pfingstmontag), n: 'Pfingstmontag', s: ALL_STATES },
        { d: formatDateString(fronleichnam), n: 'Fronleichnam', s: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'] },
        { d: formatDateString(bussUndBettag), n: 'Buß- und Bettag', s: ['SN'] }
    ];

    return holidays;
}

// 1.1.6 Holt Feiertage für ein Jahr (mit Caching)
function getHolidaysForYear(year) {
    const yearStr = String(year);
    if (!HOLIDAYS[yearStr]) {
        HOLIDAYS[yearStr] = generateHolidaysForYear(year);
    }
    return HOLIDAYS[yearStr];
}

// 1.2. STATES - Deutsche Bundesländer
const STATES = [
    { id: 'BW', name: 'Baden-Württemberg' },
    { id: 'BY', name: 'Bayern' },
    { id: 'BE', name: 'Berlin' },
    { id: 'BB', name: 'Brandenburg' },
    { id: 'HB', name: 'Bremen' },
    { id: 'HH', name: 'Hamburg' },
    { id: 'HE', name: 'Hessen' },
    { id: 'MV', name: 'Mecklenburg-Vorpommern' },
    { id: 'NI', name: 'Niedersachsen' },
    { id: 'NW', name: 'Nordrhein-Westfalen' },
    { id: 'RP', name: 'Rheinland-Pfalz' },
    { id: 'SL', name: 'Saarland' },
    { id: 'SN', name: 'Sachsen' },
    { id: 'ST', name: 'Sachsen-Anhalt' },
    { id: 'SH', name: 'Schleswig-Holstein' },
    { id: 'TH', name: 'Thüringen' }
];

// 1.3. CITIES - Städte mit eigenen Feiertagen
const CITIES = {
    'BY': [
        { id: 'augsburg', name: 'Augsburg (Friedensfest)' }
    ],
    'NW': [
        { id: 'köln', name: 'Köln (Rosenmontag)' }
    ]
};

// 1.4. RECOMMENDATIONS - Wird jetzt über Admin-Panel verwaltet (data/recommendations.json)
// Statische Empfehlungen wurden entfernt - alle Empfehlungen kommen aus dem Admin-Panel
const RECOMMENDATIONS = [];

// MODULE 2: ZUSTANDSMANAGEMENT & KERNLOGIK (State and Core Logic Module)

// 2.1. State - Zentraler Zustand der Anwendung
const State = {
    selectedYear: new Date().getFullYear(),
    selectedStateId: 'BW',
    selectedCityId: null,
    selectedDates: new Set(),
    vacationDays: 0,
    effectiveFreeDays: 0,
    extraMonths: new Set(), // Stores extra months to display: 'YYYY-MM' format
    // Arbeitswoche-Konfiguration: Welche Wochentage sind regulär frei?
    // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
    freeDays: new Set([0, 6]), // Default: Samstag + Sonntag frei (klassische 5-Tage-Woche)
    // Schulferien-Konfiguration (MODULE 10)
    schoolHolidaysVisible: false,        // Toggle-Status für Schulferien-Anzeige
    schoolHolidaysData: new Map(),       // Cache: "BW-2025" → Array mit Ferienperioden
    schoolHolidaysLoading: false         // Ladezustand für API-Calls
};

// 2.2. isRegularFreeDay - Zentrale Funktion: Ist ein Wochentag regulär frei?
function isRegularFreeDay(date) {
    const dayOfWeek = date.getDay();
    return State.freeDays.has(dayOfWeek);
}

// 2.3. Arbeitswoche aus LocalStorage laden
function loadWorkweekSettings() {
    try {
        const saved = localStorage.getItem('holidayboost_freedays');
        if (saved) {
            const freeDaysArray = JSON.parse(saved);
            State.freeDays = new Set(freeDaysArray);
        }
    } catch (e) {
        console.log('Keine gespeicherten Arbeitswoche-Einstellungen gefunden');
    }
}

// 2.4. Arbeitswoche in LocalStorage speichern
function saveWorkweekSettings() {
    try {
        const freeDaysArray = Array.from(State.freeDays);
        localStorage.setItem('holidayboost_freedays', JSON.stringify(freeDaysArray));
    } catch (e) {
        console.error('Fehler beim Speichern der Arbeitswoche:', e);
    }
}

// 2.5. Temporärer State für Workweek-Popup (wird erst bei Bestätigung übernommen)
let pendingFreeDays = new Set();

// 2.6. Arbeitswoche-Popup öffnen
function openWorkweekPopup() {
    const popup = document.getElementById('workweek-popup');
    if (!popup) return;

    // Temporären State mit aktuellem State initialisieren
    pendingFreeDays = new Set(State.freeDays);

    // Checkboxen auf aktuellen State setzen
    applyFreeDaysToCheckboxes();

    popup.classList.remove('hidden');
}

// 2.7. Arbeitswoche-Popup schließen (ohne Änderungen zu speichern)
function closeWorkweekPopup() {
    const popup = document.getElementById('workweek-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

// 2.8. Freien Tag umschalten (nur temporär im Popup)
function toggleFreeDay(day) {
    if (pendingFreeDays.has(day)) {
        pendingFreeDays.delete(day);
    } else {
        pendingFreeDays.add(day);
    }
    // Checkbox State wird automatisch durch Browser-Event geändert
}

// 2.9. Preset anwenden (nur temporär im Popup)
function applyWorkweekPreset(preset) {
    pendingFreeDays.clear();

    switch (preset) {
        case 'standard': // Mo-Fr Arbeit, Sa+So frei
            pendingFreeDays.add(0); // Sonntag
            pendingFreeDays.add(6); // Samstag
            break;
        case '4tage': // Mo-Do Arbeit, Fr+Sa+So frei
            pendingFreeDays.add(0); // Sonntag
            pendingFreeDays.add(5); // Freitag
            pendingFreeDays.add(6); // Samstag
            break;
        case 'gastro': // Di-Sa Arbeit, So+Mo frei
            pendingFreeDays.add(0); // Sonntag
            pendingFreeDays.add(1); // Montag
            break;
    }

    // Checkboxen aktualisieren (nur visuell)
    for (let day = 0; day <= 6; day++) {
        const checkbox = document.getElementById(`freeday-${day}`);
        if (checkbox) {
            checkbox.checked = pendingFreeDays.has(day);
        }
    }
}

// 2.10. Arbeitswoche-Änderungen bestätigen und übernehmen
function confirmWorkweekChanges() {
    // Temporären State in echten State übernehmen
    State.freeDays = new Set(pendingFreeDays);

    saveWorkweekSettings();
    updateLegendText();
    updateUI();
    closeWorkweekPopup();
}

// 2.10. Freie-Tage-Checkboxen mit State synchronisieren
function applyFreeDaysToCheckboxes() {
    for (let day = 0; day <= 6; day++) {
        const checkbox = document.getElementById(`freeday-${day}`);
        if (checkbox) {
            checkbox.checked = State.freeDays.has(day);
        }
    }
}

// 2.9. Legende-Text aktualisieren basierend auf freien Tagen
function updateLegendText() {
    const legendText = document.getElementById('legend-freedays-text');
    if (!legendText) return;

    // Standard: Sa+So = "Wochenende"
    if (State.freeDays.size === 2 && State.freeDays.has(0) && State.freeDays.has(6)) {
        legendText.textContent = 'Wochenende';
    } else {
        legendText.textContent = 'Freie Tage';
    }
}

// 2.12. Arbeitswoche-Event-Listener initialisieren
function initWorkweekSettings() {
    // Settings Button
    const settingsBtn = document.getElementById('workweek-settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openWorkweekPopup);
    }

    // Close Button
    const closeBtn = document.getElementById('close-workweek-popup');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeWorkweekPopup);
    }

    // Confirm Button
    const confirmBtn = document.getElementById('confirm-workweek');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmWorkweekChanges);
    }

    // Popup-Hintergrund schließt Popup
    const popup = document.getElementById('workweek-popup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closeWorkweekPopup();
            }
        });
    }

    // Day Checkboxen
    for (let day = 0; day <= 6; day++) {
        const checkbox = document.getElementById(`freeday-${day}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                toggleFreeDay(day);
            });
        }
    }

    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            applyWorkweekPreset(preset);
        });
    });

    // Legende initial setzen
    updateLegendText();
}

// 2.11. Extra Month Functions - Manages cross-year month display
function toggleExtraMonth(year, month) {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (State.extraMonths.has(monthKey)) {
        State.extraMonths.delete(monthKey);
    } else {
        State.extraMonths.add(monthKey);
    }
    updateUI();
}

function clearExtraMonths() {
    State.extraMonths.clear();
}

// 2.3. getHolidayInfo - Ermittelt Feiertagsname und Typ für ein Datum
function getHolidayInfo(date) {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;

    // Hole Feiertage für das Jahr (generiert sie falls nötig)
    const holidays = getHolidaysForYear(year);

    const holiday = holidays.find(h => h.d === dateStr);

    if (!holiday) return null;

    // Prüfe Stadt-spezifische Feiertage (höchste Priorität)
    if (holiday.c && State.selectedCityId && holiday.c.includes(State.selectedCityId)) {
        return { name: holiday.n, type: 'stadtfeiertag' };
    }

    // Prüfe Bundesland-spezifische Feiertage
    if (holiday.s && holiday.s.includes(State.selectedStateId)) {
        // Prüfe ob es ein bundesweiter Feiertag ist (alle Länder)
        if (holiday.s.length === ALL_STATES.length && ALL_STATES.every(state => holiday.s.includes(state))) {
            return { name: holiday.n, type: 'bundesfeiertag' };
        } else {
            return { name: holiday.n, type: 'landesfeiertag' };
        }
    }

    return null;
}

// Backward compatibility function
function getHolidayName(date) {
    const info = getHolidayInfo(date);
    return info ? info.name : null;
}

// 2.3. checkIfDayIsAlwaysFree - Prüft ob Tag Wochenende oder Feiertag
function checkIfDayIsAlwaysFree(date) {
    const isFreeDay = isRegularFreeDay(date); // Nutzt konfigurierte freie Tage
    const isHoliday = getHolidayName(date) !== null;

    return isFreeDay || isHoliday;
}

// 2.4. updateSummary - Aktualisiert Zähler im Sticky Footer
function updateSummary() {
    const selectedDatesArray = Array.from(State.selectedDates).sort();

    // Benötigte Urlaubstage = nur ECHTE Arbeitstage zählen
    // (ohne Wochenenden UND ohne Feiertage - denn diese sind sowieso frei!)
    State.vacationDays = selectedDatesArray.filter(dateStr => {
        const date = new Date(dateStr);
        // Prüfe ob es ein freier Tag ist (Wochenende ODER Feiertag)
        return !checkIfDayIsAlwaysFree(date);
    }).length;

    // Effektive freie Tage berechnen
    State.effectiveFreeDays = calculateEffectiveFreeDays(selectedDatesArray);

    // Effizienz berechnen
    const efficiency = State.vacationDays > 0
        ? (State.effectiveFreeDays / State.vacationDays).toFixed(1)
        : '0.0';

    // UI aktualisieren
    document.getElementById('vacation-days').textContent = State.vacationDays;
    document.getElementById('effective-days').textContent = State.effectiveFreeDays;

    // Effizienz-Anzeige (neuer Sticky Footer)
    const efficiencyDisplay = document.getElementById('efficiency-display');
    if (efficiencyDisplay) {
        efficiencyDisplay.textContent = efficiency + 'x';
    }

    // Perioden-Tooltip aktualisieren
    updatePeriodsTooltip();

    // Footer Perioden-Indicator aktualisieren (zeigt ob Perioden ausgewählt sind)
    updateFooterPeriodsIndicator();

    // Auswahl in localStorage speichern (für Navigation zwischen Seiten)
    saveSelectionToStorage();
}

// Perioden-Tooltip im Footer aktualisieren
function updatePeriodsTooltip() {
    const tooltip = document.getElementById('periods-tooltip');
    if (!tooltip) return;

    const periods = getVacationPeriods();

    if (periods.length === 0) {
        tooltip.innerHTML = '<span class="no-periods">Noch keine Urlaubstage ausgewählt</span>';
        return;
    }

    const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    const periodsHtml = periods.map(p => {
        const startDay = p.start.getDate();
        const startMonth = MONTH_NAMES_SHORT[p.start.getMonth()];
        const endDay = p.end.getDate();
        const endMonth = MONTH_NAMES_SHORT[p.end.getMonth()];

        const dateStr = startMonth === endMonth
            ? `${startDay}. - ${endDay}. ${endMonth}`
            : `${startDay}. ${startMonth} - ${endDay}. ${endMonth}`;

        return `<div class="period-item">
            <span class="period-date">${dateStr}</span>
            <span class="period-days">${p.totalDays} Tage</span>
        </div>`;
    }).join('');

    tooltip.innerHTML = periodsHtml;
}

// 2.5. Auswahl in localStorage speichern (für Navigation zwischen Seiten)
function saveSelectionToStorage() {
    // Konvertiere freeDays Set zu Array für JSON
    const freeDaysArray = State.freeDays instanceof Set
        ? Array.from(State.freeDays)
        : (Array.isArray(State.freeDays) ? State.freeDays : [0, 6]);
    const data = {
        year: State.selectedYear,
        state: State.selectedStateId,
        city: State.selectedCityId || '',
        dates: Array.from(State.selectedDates).sort(),
        freeDays: freeDaysArray,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem('holidayboost_selection', JSON.stringify(data));
    } catch (e) {
        console.warn('Konnte Auswahl nicht speichern:', e);
    }
}

// 2.6. Auswahl aus localStorage laden
function loadSelectionFromStorage() {
    try {
        const saved = localStorage.getItem('holidayboost_selection');
        if (!saved) return false;

        const data = JSON.parse(saved);

        // Prüfe ob Daten nicht älter als 24 Stunden sind
        const maxAge = 24 * 60 * 60 * 1000; // 24 Stunden
        if (Date.now() - data.timestamp > maxAge) {
            localStorage.removeItem('holidayboost_selection');
            return false;
        }

        // Daten wiederherstellen
        if (data.year) State.selectedYear = data.year;
        if (data.state) State.selectedStateId = data.state;
        if (data.city) State.selectedCityId = data.city;
        if (data.dates && Array.isArray(data.dates)) {
            State.selectedDates = new Set(data.dates);
        }
        if (data.freeDays && Array.isArray(data.freeDays)) {
            State.freeDays = new Set(data.freeDays); // Konvertiere zurück zu Set
        }

        return true;
    } catch (e) {
        console.warn('Konnte Auswahl nicht laden:', e);
        return false;
    }
}

// Hilfsfunktion für Berechnung effektiver freier Tage
function calculateEffectiveFreeDays(selectedDates) {
    if (selectedDates.length === 0) return 0;

    let totalEffectiveDays = 0;
    let currentBlock = [];

    // Sortiere Daten und normalisiere auf Mittag um DST-Probleme zu vermeiden
    const sortedDates = selectedDates.map(d => {
        const date = new Date(d);
        date.setHours(12, 0, 0, 0);
        return date;
    }).sort((a, b) => a - b);

    for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = sortedDates[i];

        if (currentBlock.length === 0) {
            currentBlock = [currentDate];
        } else {
            const lastDate = currentBlock[currentBlock.length - 1];

            // Prüfe ob Tage zusammenhängend sind (direkt aufeinander folgen oder durch freie Tage verbunden)
            if (isConnectedByFreeDays(lastDate, currentDate)) {
                currentBlock.push(currentDate);
            } else {
                // Block beenden und zählen
                totalEffectiveDays += calculateBlockLength(currentBlock);
                currentBlock = [currentDate];
            }
        }
    }

    // Letzten Block zählen
    if (currentBlock.length > 0) {
        totalEffectiveDays += calculateBlockLength(currentBlock);
    }

    return totalEffectiveDays;
}

// Prüft ob zwei Daten durch freie Tage verbunden sind
function isConnectedByFreeDays(startDate, endDate) {
    // Normalisiere auf Mittag um DST-Probleme zu vermeiden
    let current = new Date(startDate);
    current.setHours(12, 0, 0, 0);
    current.setDate(current.getDate() + 1);

    const end = new Date(endDate);
    end.setHours(12, 0, 0, 0);

    while (current < end) {
        if (!checkIfDayIsAlwaysFree(current)) {
            return false; // Es gibt einen Werktag dazwischen
        }
        current.setDate(current.getDate() + 1);
    }

    return true;
}

// Berechnet die Länge eines zusammenhängenden Blocks
function calculateBlockLength(block) {
    if (block.length === 0) return 0;

    // WICHTIG: Setze Uhrzeit auf Mittag um DST-Probleme zu vermeiden
    const startDate = new Date(block[0]);
    startDate.setHours(12, 0, 0, 0);
    const endDate = new Date(block[block.length - 1]);
    endDate.setHours(12, 0, 0, 0);

    // Erweitere Block rückwärts um vorhergehende freie Tage
    let extendedStart = new Date(startDate);
    extendedStart.setDate(extendedStart.getDate() - 1);
    while (checkIfDayIsAlwaysFree(extendedStart)) {
        extendedStart.setDate(extendedStart.getDate() - 1);
    }
    extendedStart.setDate(extendedStart.getDate() + 1); // Einen Tag vorwärts, da letzter kein freier Tag war

    // Erweitere Block vorwärts um nachfolgende freie Tage
    let extendedEnd = new Date(endDate);
    extendedEnd.setDate(extendedEnd.getDate() + 1);
    while (checkIfDayIsAlwaysFree(extendedEnd)) {
        extendedEnd.setDate(extendedEnd.getDate() + 1);
    }
    extendedEnd.setDate(extendedEnd.getDate() - 1); // Einen Tag rückwärts, da letzter kein freier Tag war

    // WICHTIG: Normalisiere auf Mittag NACH der Erweiterung um DST-Probleme zu vermeiden
    // (März 28 kann CET sein, April 12 kann CEST sein - 1 Stunde Unterschied!)
    extendedStart.setHours(12, 0, 0, 0);
    extendedEnd.setHours(12, 0, 0, 0);

    // Berechne Anzahl Tage zwischen erweiterten Grenzen (inklusive)
    const timeDiff = extendedEnd.getTime() - extendedStart.getTime();
    return Math.round(timeDiff / (1000 * 3600 * 24)) + 1;
}

// 2.5. updateUI - Zentrale UI-Update Funktion
function updateUI() {
    renderYearSelector();
    renderStateSelector();
    renderCitySelector();
    renderCalendar(State.selectedYear);
    renderRecommendations();
    renderRecommendationCards(); // MODULE 6: Update recommendation cards
    updateSummary();
    updateCalendarTitle();
    updateTravelTipsButton(); // MODULE 8: Update travel tips button
}

// 2.6. updateCalendarTitle - Synchronisiert Kalender-Titel mit ausgewähltem Jahr
function updateCalendarTitle() {
    const titleElement = document.getElementById('calendar-title');
    if (titleElement) {
        titleElement.textContent = `Kalender ${State.selectedYear}`;
    }
}

// MODULE 3: DROPDOWNS & NAVIGATION (Dropdowns and Navigation Module)

// 3.1. renderYearSelector - Rendert Jahres-Dropdown
function renderYearSelector() {
    const yearSelect = document.getElementById('year-select');
    yearSelect.innerHTML = '';

    const currentYear = new Date().getFullYear();
    // Zeige aktuelles Jahr + 3 Jahre (Vorjahr/Folgejahr nutzen Extra-Monate)
    const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

    // Sortiere Jahre
    years.sort((a, b) => a - b);

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === State.selectedYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    });
}

// 3.2. renderStateSelector - Rendert Bundesland-Dropdown
function renderStateSelector() {
    const stateSelect = document.getElementById('state-select');
    stateSelect.innerHTML = '';

    STATES.forEach(state => {
        const option = document.createElement('option');
        option.value = state.id;
        option.textContent = state.name;
        if (state.id === State.selectedStateId) {
            option.selected = true;
        }
        stateSelect.appendChild(option);
    });
}

// 3.3. renderCitySelector - Rendert Stadt-Dropdown (falls vorhanden)
function renderCitySelector() {
    const citySelect = document.getElementById('city-select');

    // Prüfe ob Städte für aktuelles Bundesland existieren
    if (CITIES[State.selectedStateId]) {
        citySelect.classList.remove('hidden');
        citySelect.innerHTML = '';

        // Standard-Option "Alle"
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'Alle';
        if (!State.selectedCityId) {
            allOption.selected = true;
        }
        citySelect.appendChild(allOption);

        // Stadt-Optionen
        CITIES[State.selectedStateId].forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            if (city.id === State.selectedCityId) {
                option.selected = true;
            }
            citySelect.appendChild(option);
        });
    } else {
        citySelect.classList.add('hidden');
        State.selectedCityId = null;
    }
}

// 3.4. changeYear - Hilfsfunktion für Jahr-Navigation
function changeYear(year) {
    // Prüfe ob Jahr in gültigen Bereich liegt (aktuelles Jahr + 3)
    const currentYear = new Date().getFullYear();
    const minYear = currentYear;
    const maxYear = currentYear + 3;

    if (year >= minYear && year <= maxYear) {
        State.selectedYear = year;
        updateUI();
    }
}

// MODULE 4: KALENDER-RENDERER (Calendar Renderer Module)

// 4.1. renderCalendar - Erstellt das 12-Monats-Grid plus extra Monate
function renderCalendar(year) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    const months = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    // Check if we need to add previous December first
    const prevDecemberKey = `${year - 1}-12`;
    if (State.extraMonths.has(prevDecemberKey)) {
        const extraMonthView = createMonthView(year - 1, 11);
        extraMonthView.classList.add('extra-month', 'extra-month-prev');
        calendarGrid.appendChild(extraMonthView);
    }

    // Add regular months
    months.forEach((monthName, monthIndex) => {
        const monthView = createMonthView(year, monthIndex);
        calendarGrid.appendChild(monthView);
    });

    // Check if we need to add next January last
    const nextJanuaryKey = `${year + 1}-01`;
    if (State.extraMonths.has(nextJanuaryKey)) {
        const extraMonthView = createMonthView(year + 1, 0);
        extraMonthView.classList.add('extra-month', 'extra-month-next');
        calendarGrid.appendChild(extraMonthView);
    }

    // Mobile View aktualisieren
    if (typeof MobileView !== 'undefined' && MobileView.refresh) {
        MobileView.refresh();
    }
}

// 4.2. createMonthView - Erzeugt einzelne Monatsansicht
function createMonthView(year, monthIndex) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-view';

    // Header mit Monatsname und Jahr-Navigation
    const header = document.createElement('div');
    header.className = 'month-header month-header-clickable';

    // Jahr-Navigation nur für Hauptjahr-Monate
    const isMainYearMonth = (year === State.selectedYear);

    if (monthIndex === 0 && isMainYearMonth) {
        const prevButton = document.createElement('button');
        prevButton.className = 'year-nav prev';
        prevButton.innerHTML = '←';
        const prevMonthKey = `${year - 1}-12`;
        if (State.extraMonths.has(prevMonthKey)) {
            prevButton.classList.add('active');
        }
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleExtraMonth(year - 1, 11); // Dezember vom Vorjahr
        });
        header.appendChild(prevButton);
    }

    const monthTitle = document.createElement('span');
    monthTitle.textContent = `${getMonthName(monthIndex)} ${year}`;
    header.appendChild(monthTitle);

    if (monthIndex === 11 && isMainYearMonth) {
        const nextButton = document.createElement('button');
        nextButton.className = 'year-nav next';
        nextButton.innerHTML = '→';
        const nextMonthKey = `${year + 1}-01`;
        if (State.extraMonths.has(nextMonthKey)) {
            nextButton.classList.add('active');
        }
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleExtraMonth(year + 1, 0); // Januar vom Folgejahr
        });
        header.appendChild(nextButton);
    }

    // Kein Popup für Januar und Dezember nötig - nur Pfeile verwenden

    monthDiv.appendChild(header);

    // Wochentage Header
    const weekdaysDiv = document.createElement('div');
    weekdaysDiv.className = 'weekdays';
    const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    weekdays.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'weekday';
        dayDiv.textContent = day;
        weekdaysDiv.appendChild(dayDiv);
    });
    monthDiv.appendChild(weekdaysDiv);

    // Tage Grid
    const daysDiv = document.createElement('div');
    daysDiv.className = 'days';

    // Berechne ersten Tag des Monats und Anzahl Tage
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Startposition (Montag = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6; // Sonntag wird zur 6

    // Fülle vorherige Monatstage (Tag 0 = letzter Tag des Vormonats)
    const prevMonthLastDay = new Date(year, monthIndex, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();

    for (let i = startDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day empty-cell';
        // Keine Zahl anzeigen - nur leerer Platzhalter für Grid-Layout
        daysDiv.appendChild(dayDiv);
    }

    // Fülle aktuelle Monatstage
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        const currentDate = new Date(year, monthIndex, day);
        const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        dayDiv.className = 'day';
        dayDiv.textContent = day;

        // Prüfe ob regulär freier Tag (konfigurierbare Arbeitswoche)
        if (isRegularFreeDay(currentDate)) {
            dayDiv.classList.add('weekend'); // CSS-Klasse bleibt 'weekend' für Styling
        }

        // Prüfe ob Feiertag
        const holidayInfo = getHolidayInfo(currentDate);
        if (holidayInfo) {
            dayDiv.classList.add('holiday');
            dayDiv.classList.add(`holiday-${holidayInfo.type}`);
            dayDiv.setAttribute('data-holiday', holidayInfo.name);
        }

        // Prüfe ob Schulferien (MODULE 10)
        const schoolHolidayInfo = getSchoolHolidayInfo(dateString);
        if (schoolHolidayInfo) {
            dayDiv.classList.add('school-holiday');
            dayDiv.setAttribute('data-school-holiday', schoolHolidayInfo.name);
        }

        // Prüfe ob ausgewählt
        if (State.selectedDates.has(dateString)) {
            dayDiv.classList.add('selected');
        }

        // Click Handler - auch für other-month days
        dayDiv.onclick = () => toggleVacationDay(dateString);

        daysDiv.appendChild(dayDiv);
    }

    // Fülle nächste Monatstage
    const totalCells = 42; // 6 Wochen × 7 Tage
    const cellsUsed = startDay + daysInMonth;
    const remainingCells = totalCells - cellsUsed;

    for (let day = 1; day <= remainingCells && remainingCells < 14; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day empty-cell';
        // Keine Zahl anzeigen - nur leerer Platzhalter für Grid-Layout
        daysDiv.appendChild(dayDiv);
    }

    monthDiv.appendChild(daysDiv);
    return monthDiv;
}

// 4.3. toggleVacationDay - Urlaubstag auswählen/abwählen
function toggleVacationDay(dateString) {
    if (State.selectedDates.has(dateString)) {
        State.selectedDates.delete(dateString);
    } else {
        State.selectedDates.add(dateString);
    }

    // UI aktualisieren
    updateCalendarDay(dateString);
    updateSummary();
    updateTravelTipsButton(); // MODULE 8: Update travel tips button
}

// Hilfsfunktion: Aktualisiert visuellen Zustand eines Kalendertags
function updateCalendarDay(dateString) {
    // Simply re-render the entire calendar for now to ensure consistency
    renderCalendar(State.selectedYear);
}

// Hilfsfunktion: Monatsname
function getMonthName(monthIndex) {
    const months = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months[monthIndex];
}

// Navigation Popup Functions
function createNavigationPopup(currentYear, currentMonthIndex) {
    const popup = document.createElement('div');
    popup.className = 'nav-popup';

    const content = document.createElement('div');
    content.className = 'nav-popup-content';

    // Bestimme Ziel-Jahr und Monate
    let targetYear, targetMonths;
    if (currentMonthIndex === 0) { // Januar - zeige Vorjahr
        targetYear = currentYear - 1;
        targetMonths = [11]; // Nur Dezember
    } else { // Dezember - zeige nächstes Jahr
        targetYear = currentYear + 1;
        targetMonths = [0]; // Nur Januar
    }

    // Jahr-Header
    const yearHeader = document.createElement('div');
    yearHeader.className = 'nav-popup-year';
    yearHeader.textContent = targetYear;
    content.appendChild(yearHeader);

    // Monate
    targetMonths.forEach(monthIndex => {
        const monthButton = document.createElement('div');
        monthButton.className = 'nav-popup-month';
        monthButton.textContent = getMonthName(monthIndex);
        monthButton.onclick = (e) => {
            e.stopPropagation();
            toggleExtraMonth(targetYear, monthIndex);
            closeAllPopups();
        };
        content.appendChild(monthButton);
    });

    popup.appendChild(content);
    return popup;
}

function toggleNavigationPopup(popup) {
    // Schließe alle anderen Popups
    closeAllPopups();

    // Toggle aktuelles Popup
    popup.classList.toggle('show');

    // Event Listener für Klick außerhalb
    if (popup.classList.contains('show')) {
        document.addEventListener('click', handleOutsideClick);
    }
}

function closeAllPopups() {
    document.querySelectorAll('.nav-popup').forEach(popup => {
        popup.classList.remove('show');
    });
    document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(e) {
    if (!e.target.closest('.nav-popup') && !e.target.closest('.month-header-clickable')) {
        closeAllPopups();
    }
}

function navigateToMonth(year, monthIndex) {
    State.selectedYear = year;
    updateUI();

    // Scroll zum entsprechenden Monat
    setTimeout(() => {
        const monthViews = document.querySelectorAll('.month-view');
        if (monthViews[monthIndex]) {
            monthViews[monthIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

// MODULE 5: URLAUBSEMPFEHLUNGEN (Recommendations Module)
// Alle Empfehlungen werden jetzt über das Admin-Panel verwaltet

// 5.1. renderRecommendations - Zeigt Hinweis auf Admin-Panel
async function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return; // Element nicht vorhanden im kompakten Layout
    container.innerHTML = '';

    // Prüfe ob Admin-Empfehlungen für dieses Jahr existieren
    let adminRecsCount = 0;
    try {
        // Statische JSON-Datei laden (für IONOS Webspace)
        const response = await fetch('/data/recommendations.json');
        if (response.ok) {
            const data = await response.json();
            const adminRecs = data.recommendations || [];
            adminRecsCount = adminRecs.filter(rec => rec.year === State.selectedYear).length;
        }
    } catch (error) {
        console.log('Recommendations nicht verfügbar');
    }

    const infoText = document.createElement('p');
    if (adminRecsCount > 0) {
        infoText.innerHTML = `<strong>${adminRecsCount}</strong> Empfehlung(en) für ${State.selectedYear} verfügbar. Nutze den Button <strong>"Urlaubsempfehlungen für ${State.selectedYear} anzeigen"</strong> um sie zu sehen.`;
        infoText.style.color = '#10b981';
    } else {
        infoText.innerHTML = `Keine Empfehlungen für ${State.selectedYear}. Erstelle welche im <a href="/admin.html" style="color: #3b82f6;">Admin-Panel</a>.`;
        infoText.style.color = '#94a3b8';
    }
    infoText.style.textAlign = 'center';
    infoText.style.padding = '10px';
    container.appendChild(infoText);
}

// Hilfsfunktion: Erstellt Empfehlungskarte
function createRecommendationCard(recommendation) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';

    // Header
    const header = document.createElement('div');
    header.className = 'recommendation-header';

    const period = document.createElement('div');
    period.className = 'recommendation-period';
    period.textContent = formatDateRange(recommendation.start, recommendation.end);
    header.appendChild(period);

    card.appendChild(header);

    // Description
    const description = document.createElement('div');
    description.textContent = recommendation.description;
    description.style.marginBottom = '15px';
    description.style.color = '#666';
    card.appendChild(description);

    // Stats
    const stats = document.createElement('div');
    stats.className = 'recommendation-stats';

    const requiredStat = document.createElement('div');
    requiredStat.className = 'stat';
    requiredStat.innerHTML = `
        <span class="stat-value">${recommendation.requiredDays}</span>
        <span class="stat-label">Urlaubstage</span>
    `;
    stats.appendChild(requiredStat);

    const effectiveStat = document.createElement('div');
    effectiveStat.className = 'stat';
    effectiveStat.innerHTML = `
        <span class="stat-value">${recommendation.effectiveDays}</span>
        <span class="stat-label">Freie Tage</span>
    `;
    stats.appendChild(effectiveStat);

    card.appendChild(stats);

    // Apply Button
    const applyButton = document.createElement('button');
    applyButton.className = 'btn-primary';
    applyButton.textContent = 'Im Kalender markieren';
    applyButton.onclick = () => applyRecommendation(recommendation);
    card.appendChild(applyButton);

    return card;
}

// 5.2. applyRecommendation - Wendet Empfehlung an
function applyRecommendation(recommendation) {
    // Parse dates correctly from MM-DD format
    const startParts = recommendation.start.split('-');
    const endParts = recommendation.end.split('-');

    const startDate = new Date(State.selectedYear, parseInt(startParts[0]) - 1, parseInt(startParts[1]));
    const endDate = new Date(State.selectedYear, parseInt(endParts[0]) - 1, parseInt(endParts[1]));

    // Handle year transition for December to January recommendations
    if (endDate < startDate) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Füge alle Tage zwischen Start und Ende hinzu
    const current = new Date(startDate);
    while (current <= endDate) {
        const dateString = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        State.selectedDates.add(dateString);
        current.setDate(current.getDate() + 1);
    }

    // UI aktualisieren
    renderCalendar(State.selectedYear);
    updateSummary();
}

// Hilfsfunktion: Formatiert Datumsbereich
function formatDateRange(start, end) {
    const startParts = start.split('-');
    const endParts = end.split('-');

    const startMonth = getMonthName(parseInt(startParts[0]) - 1);
    const endMonth = getMonthName(parseInt(endParts[0]) - 1);

    if (startParts[0] === endParts[0]) { // Gleicher Monat
        return `${parseInt(startParts[1])}. - ${parseInt(endParts[1])}. ${startMonth}`;
    } else {
        return `${parseInt(startParts[1])}. ${startMonth} - ${parseInt(endParts[1])}. ${endMonth}`;
    }
}

// MODULE 6: INITIALISIERUNG (Initialization Module)

// 6.1. initApp - Startpunkt der Anwendung
function initApp() {
    // Lade gespeicherte Arbeitswoche-Einstellungen
    loadWorkweekSettings();

    // Versuche gespeicherte Auswahl zu laden (für Navigation zwischen Seiten)
    const hasStoredSelection = loadSelectionFromStorage();

    if (!hasStoredSelection) {
        // Setze Standardwerte nur wenn keine gespeicherte Auswahl vorhanden
        const currentYear = new Date().getFullYear();
        State.selectedYear = Math.max(currentYear, 2025);
        State.selectedStateId = 'BW'; // Standard: Baden-Württemberg
    }

    // Event Listener für Dropdowns
    setupEventListeners();

    // Erste UI-Darstellung
    updateUI();
}

// Event Listener Setup
function setupEventListeners() {
    // Jahr-Dropdown
    const yearSelect = document.getElementById('year-select');
    yearSelect.addEventListener('change', (e) => {
        State.selectedYear = parseInt(e.target.value);
        updateUI();
    });

    // Bundesland-Dropdown
    const stateSelect = document.getElementById('state-select');
    stateSelect.addEventListener('change', (e) => {
        State.selectedStateId = e.target.value;
        State.selectedCityId = null; // Reset city selection
        onStateChangeSchoolHolidays(e.target.value); // MODULE 10: Schulferien aktualisieren
        updateUI();
    });

    // Stadt-Dropdown
    const citySelect = document.getElementById('city-select');
    citySelect.addEventListener('change', (e) => {
        State.selectedCityId = e.target.value || null;
        updateUI();
    });

    // Auswahl löschen Button
    const clearButton = document.getElementById('clear-selection');
    clearButton.addEventListener('click', () => {
        State.selectedDates.clear();
        clearExtraMonths();
        updateUI();
    });

    // MODULE 6: Initialize Recommendation Cards
    initRecommendationsModule();

    // MODULE 10: Initialize School Holidays
    initSchoolHolidays();
}

// MODULE 6: URLAUBSEMPFEHLUNGS-KARTEN (Holiday Recommendation Cards)

// 6.0. Modal State Management
const ModalState = {
    selectedRecommendations: new Set(),
    allRecommendations: [],
    conflictedRecommendations: new Set()
};

// 6.0. Hilfsfunktion: Generiert alle Tage zwischen Start und End-Datum
function generateDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        dates.push(formatFullDateString(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

// 6.0. Hilfsfunktion: Generiert nur Urlaubstage (Werktage außer Feiertagen)
function generateVacationDates(startDate, endDate) {
    const vacationDates = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        const isFreeDay = isRegularFreeDay(current); // Konfigurierbare freie Tage
        const isHoliday = getHolidayInfo(current) !== null;

        // Nur Arbeitstage hinzufügen, die keine Feiertage sind
        if (!isFreeDay && !isHoliday) {
            vacationDates.push(formatFullDateString(current));
        }

        current.setDate(current.getDate() + 1);
    }

    return vacationDates;
}

// 6.1. AUTOMATISCHE EMPFEHLUNGS-GENERIERUNG
// Generiert Brückentag-Empfehlungen basierend auf Jahr, Bundesland und Stadt

/**
 * Hauptfunktion: Generiert alle Empfehlungen für den aktuellen Kontext
 */
function generateAutoRecommendations(year, stateId, cityId) {
    console.log('🚀 generateAutoRecommendations:', { year, stateId, cityId });

    // 1. Feiertage für Kontext laden
    const holidays = getHolidaysForContext(year, stateId, cityId);
    console.log(`📅 Gefundene Feiertage: ${holidays.length}`);

    // 2. Brückentag-Möglichkeiten identifizieren (für Filter "Brückentage 1-2 Tage")
    const bridgeOpportunities = identifyBridgeOpportunities(holidays, year, stateId, cityId);
    console.log(`🌉 Brückentage gefunden: ${bridgeOpportunities.length}`);

    // 3. Erweiterte Perioden generieren (für Filter "9+ Tage" und "16+ Tage")
    const extended9Plus = generateExtendedPeriods(bridgeOpportunities, holidays, year, stateId, cityId, 9);
    const extended16Plus = generateExtendedPeriods(bridgeOpportunities, holidays, year, stateId, cityId, 16);

    console.log(`📊 9+ Tage Perioden: ${extended9Plus.length}`);
    console.log(`📊 16+ Tage Perioden: ${extended16Plus.length}`);

    // 4. Alle Empfehlungen zusammenführen
    const allRecommendations = [
        ...bridgeOpportunities,
        ...extended9Plus,
        ...extended16Plus
    ];

    // Nach Effizienz sortieren
    return allRecommendations.sort((a, b) => b.efficiency - a.efficiency);
}

/**
 * Filtert Feiertage für den aktuellen Kontext (Jahr, Bundesland, Stadt)
 * WICHTIG: Feiertage die auf benutzerdefinierte freie Tage fallen (State.freeDays)
 * werden ausgeschlossen, da sie keinen Brückentag-Vorteil bieten (man hat sowieso frei)
 * Standard: Samstag (6) und Sonntag (0), kann über Zahnrad-Icon angepasst werden
 */
function getHolidaysForContext(year, stateId, cityId) {
    // Hole Feiertage für das Jahr (generiert sie falls nötig)
    const holidays = getHolidaysForYear(year);

    return holidays.filter(h => {
        // 1. Prüfe ob Feiertag auf freien Tag fällt - dann ausschließen
        const [month, day] = h.d.split('-').map(Number);
        const holidayDate = new Date(year, month - 1, day);
        const dayOfWeek = holidayDate.getDay();

        // Feiertag auf benutzerdefinierten freien Tag = kein Brückentag-Vorteil
        if (State.freeDays.has(dayOfWeek)) {
            return false;
        }

        // 2. Stadtfeiertag - nur wenn Stadt ausgewählt und passt
        if (h.c && h.c.length > 0) {
            return cityId && h.c.includes(cityId);
        }
        // 3. Bundes-/Landesfeiertag - muss zum Bundesland passen
        if (h.s && h.s.length > 0) {
            return h.s.includes(stateId);
        }
        return false;
    });
}

/**
 * Prüft ob ein Datum ein freier Tag ist (benutzerdefinierter freier Tag oder Feiertag)
 * Nutzt State.freeDays für benutzerdefinierte Arbeitswoche (Standard: Sa+So)
 */
function isFreeDayInContext(date, year, stateId, cityId) {
    // Benutzerdefinierte freie Tage prüfen
    const dayOfWeek = date.getDay();
    if (State.freeDays.has(dayOfWeek)) return true;

    // Feiertag prüfen
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;

    // Hole Feiertage für das Jahr (generiert sie falls nötig)
    const holidays = getHolidaysForYear(year);

    const holiday = holidays.find(h => h.d === dateStr);
    if (!holiday) return false;

    // Stadtfeiertag
    if (holiday.c && holiday.c.length > 0) {
        return cityId && holiday.c.includes(cityId);
    }
    // Bundes-/Landesfeiertag
    if (holiday.s && holiday.s.length > 0) {
        return holiday.s.includes(stateId);
    }
    return false;
}

/**
 * Identifiziert alle Brückentag-Möglichkeiten
 * DYNAMISCH: Nutzt State.freeDays für benutzerdefinierte Arbeitswoche
 * Brückentag = 1-2 Urlaubstage die eine Lücke zwischen Feiertag und freien Tagen schließen
 */
function identifyBridgeOpportunities(holidays, year, stateId, cityId) {
    const opportunities = [];
    let idCounter = 1;

    holidays.forEach(holiday => {
        const [month, day] = holiday.d.split('-').map(Number);
        const holidayDate = new Date(year, month - 1, day);

        // Finde Brückentag-Möglichkeiten RÜCKWÄRTS (vor dem Feiertag)
        const backwardBridge = findBridgeOpportunity(holidayDate, year, stateId, cityId, -1);
        if (backwardBridge && backwardBridge.bridgeDays.length > 0 && backwardBridge.bridgeDays.length <= 2) {
            opportunities.push(createBridgeRecommendation(
                idCounter++,
                holiday.n + (backwardBridge.bridgeDays.length > 1 ? ' (verlängert)' : ''),
                backwardBridge.bridgeDays,
                backwardBridge.periodStart,
                backwardBridge.periodEnd,
                [holiday.n],
                year,
                stateId,
                cityId
            ));
        }

        // Finde Brückentag-Möglichkeiten VORWÄRTS (nach dem Feiertag)
        const forwardBridge = findBridgeOpportunity(holidayDate, year, stateId, cityId, 1);
        if (forwardBridge && forwardBridge.bridgeDays.length > 0 && forwardBridge.bridgeDays.length <= 2) {
            opportunities.push(createBridgeRecommendation(
                idCounter++,
                holiday.n + (forwardBridge.bridgeDays.length > 1 ? ' (verlängert)' : ''),
                forwardBridge.bridgeDays,
                forwardBridge.periodStart,
                forwardBridge.periodEnd,
                [holiday.n],
                year,
                stateId,
                cityId
            ));
        }
    });

    return opportunities;
}

/**
 * Findet Brückentag-Möglichkeit in eine Richtung
 * @param {Date} holidayDate - Der Feiertag
 * @param {number} direction - -1 für rückwärts, 1 für vorwärts
 * @returns {Object|null} - {bridgeDays, periodStart, periodEnd} oder null
 */
function findBridgeOpportunity(holidayDate, year, stateId, cityId, direction) {
    const bridgeDays = [];
    let currentDate = new Date(holidayDate);
    currentDate.setDate(currentDate.getDate() + direction);

    // Sammle Arbeitstage (max 2 für Brückentage)
    while (bridgeDays.length < 2) {
        if (isFreeDayInContext(currentDate, year, stateId, cityId)) {
            // Freier Tag gefunden - wir haben eine Brücke!
            break;
        }
        // Arbeitstag - potenzieller Brückentag
        bridgeDays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + direction);
    }

    // Wenn keine freien Tage danach kommen, keine Brücke
    if (!isFreeDayInContext(currentDate, year, stateId, cityId)) {
        return null;
    }

    // Jetzt die komplette Periode berechnen
    // Erweitere rückwärts vom frühesten Punkt
    let periodStart = direction === -1 ? new Date(currentDate) : new Date(holidayDate);
    let periodEnd = direction === 1 ? new Date(currentDate) : new Date(holidayDate);

    // Erweitere periodStart rückwärts um alle freien Tage
    let checkDate = new Date(periodStart);
    checkDate.setDate(checkDate.getDate() - 1);
    while (isFreeDayInContext(checkDate, year, stateId, cityId)) {
        periodStart = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Erweitere periodEnd vorwärts um alle freien Tage
    checkDate = new Date(periodEnd);
    checkDate.setDate(checkDate.getDate() + 1);
    while (isFreeDayInContext(checkDate, year, stateId, cityId)) {
        periodEnd = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() + 1);
    }

    // Sortiere bridgeDays chronologisch
    if (direction === -1) {
        bridgeDays.reverse();
    }

    return {
        bridgeDays: bridgeDays,
        periodStart: periodStart,
        periodEnd: periodEnd
    };
}

/**
 * Findet Brückentage VOR einem Feiertag
 * z.B. für Karfreitag (3. April): findet April 1-2 als Brückentage
 * Diese verbinden den Feiertag mit der vorherigen Arbeitswoche
 *
 * WICHTIG: Gibt bis zu 4 Arbeitstage zurück (Mo-Do vor einem Fr-Feiertag)
 * um maximale Effizienz bei erweiterten Perioden zu ermöglichen
 */
function findBridgeDaysBeforeHoliday(holidayDate, year, stateId, cityId) {
    const bridgeDays = [];
    let currentDate = new Date(holidayDate);
    currentDate.setDate(currentDate.getDate() - 1); // Tag vor dem Feiertag

    // Sammle Arbeitstage rückwärts (max 4 für erweiterte Perioden)
    let safetyCounter = 0;
    while (bridgeDays.length < 4 && safetyCounter < 10) {
        if (isFreeDayInContext(currentDate, year, stateId, cityId)) {
            // Freier Tag (Wochenende/Feiertag) - stoppen
            break;
        }
        // Arbeitstag - potenzieller Brückentag
        bridgeDays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() - 1);
        safetyCounter++;
    }

    // Chronologisch sortieren (ältestes Datum zuerst)
    return bridgeDays.sort((a, b) => a - b);
}

/**
 * Zählt die Kalendertage zwischen zwei Daten (inklusive beide Enden)
 * Robuste Methode die DST-Probleme vermeidet
 */
function countDaysBetween(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);

    // Setze Uhrzeit auf Mittag um DST-Probleme zu vermeiden
    current.setHours(12, 0, 0, 0);
    end.setHours(12, 0, 0, 0);

    while (current <= end) {
        count++;
        current.setDate(current.getDate() + 1);
    }

    return count;
}

/**
 * Zählt die freien Tage in einer Periode (freie Tage + Feiertage + Urlaubstage)
 * DYNAMISCH: Nutzt State.freeDays für benutzerdefinierte Arbeitswoche
 */
function countFreeDaysInPeriod(periodStart, periodEnd, year, stateId, cityId) {
    return countDaysBetween(periodStart, periodEnd);
}

/**
 * Erweitert ein Datum in eine Richtung bis zum äußersten freien Tag
 * DYNAMISCH: Nutzt State.freeDays für benutzerdefinierte Arbeitswoche
 * @param {Date} date - Ausgangsdatum (typischerweise ein Feiertag)
 * @param {number} direction - -1 für rückwärts, 1 für vorwärts
 * @returns {Date} - Das erweiterte Datum (äußerster freier Tag in dieser Richtung)
 */
function extendToFreeDay(date, year, stateId, cityId, direction) {
    let result = new Date(date);
    let current = new Date(date);

    // Gehe in die angegebene Richtung
    current.setDate(current.getDate() + direction);

    // Erweitere solange freie Tage (inkl. Feiertage) kommen
    let safetyCounter = 0;
    while (isFreeDayInContext(current, year, stateId, cityId) && safetyCounter < 60) {
        result = new Date(current);
        current.setDate(current.getDate() + direction);
        safetyCounter++;
    }

    return result;
}

/**
 * Erweitert Datum rückwärts um alle angrenzenden freien Tage
 * (wie calculateBlockLength für Footer)
 * @param {Date} date - Ausgangsdatum (typischerweise erster Urlaubstag)
 * @returns {Date} - Das erweiterte Datum (äußerster freier Tag rückwärts)
 */
function extendPeriodBackward(date, year, stateId, cityId) {
    let result = new Date(date);
    let current = new Date(date);
    current.setDate(current.getDate() - 1);

    let safetyCounter = 0;
    while (isFreeDayInContext(current, year, stateId, cityId) && safetyCounter < 60) {
        result = new Date(current);
        current.setDate(current.getDate() - 1);
        safetyCounter++;
    }

    return result;
}

/**
 * Erweitert Datum vorwärts um alle angrenzenden freien Tage
 * (wie calculateBlockLength für Footer)
 * @param {Date} date - Ausgangsdatum (typischerweise letzter Urlaubstag)
 * @returns {Date} - Das erweiterte Datum (äußerster freier Tag vorwärts)
 */
function extendPeriodForward(date, year, stateId, cityId) {
    let result = new Date(date);
    let current = new Date(date);
    current.setDate(current.getDate() + 1);

    let safetyCounter = 0;
    while (isFreeDayInContext(current, year, stateId, cityId) && safetyCounter < 60) {
        result = new Date(current);
        current.setDate(current.getDate() + 1);
        safetyCounter++;
    }

    return result;
}

/**
 * Entfernt "trailing" Urlaubstage am Ende einer Periode,
 * die zu keinem freien Tag führen.
 *
 * Beispiel: Periode endet mit Mo (Urlaub) → Di (Arbeit)
 * Dann ist Mo sinnlos - kein freier Tag danach!
 *
 * Aber: Mo (Urlaub) → Di (Urlaub) → Mi (frei)
 * Dann ist Mo+Di sinnvoll weil Mi frei ist.
 */
function trimTrailingVacationDays(vacationDays, periodEnd, year, stateId, cityId) {
    if (vacationDays.length === 0) return { vacationDays, periodEnd };

    const sortedDates = [...vacationDays].sort();
    let lastVacationDay = new Date(sortedDates[sortedDates.length - 1]);

    // Prüfe: Kommt NACH dem letzten Urlaubstag ein freier Tag?
    let nextDay = new Date(lastVacationDay);
    nextDay.setDate(nextDay.getDate() + 1);

    // Wenn der nächste Tag frei ist → alles OK, nichts trimmen
    if (isFreeDayInContext(nextDay, year, stateId, cityId)) {
        return { vacationDays, periodEnd };
    }

    // Sonst: Entferne Urlaubstage rückwärts bis wir einen finden,
    // der zu einem freien Tag führt
    let trimmedVacationDays = [...sortedDates];

    while (trimmedVacationDays.length > 0) {
        const lastDay = new Date(trimmedVacationDays[trimmedVacationDays.length - 1]);
        const dayAfter = new Date(lastDay);
        dayAfter.setDate(dayAfter.getDate() + 1);

        if (isFreeDayInContext(dayAfter, year, stateId, cityId)) {
            // Dieser Urlaubstag führt zu einem freien Tag → behalten
            break;
        }

        // Dieser Urlaubstag führt zu keinem freien Tag → entfernen
        trimmedVacationDays.pop();
    }

    // Neues periodEnd berechnen
    if (trimmedVacationDays.length > 0) {
        const newLastVacation = new Date(trimmedVacationDays[trimmedVacationDays.length - 1]);
        const newPeriodEnd = extendPeriodForward(newLastVacation, year, stateId, cityId);
        return { vacationDays: trimmedVacationDays, periodEnd: newPeriodEnd };
    }

    return { vacationDays: trimmedVacationDays, periodEnd };
}

/**
 * Entfernt "leading" Urlaubstage am Anfang einer Periode,
 * die von keinem freien Tag kommen.
 */
function trimLeadingVacationDays(vacationDays, periodStart, year, stateId, cityId) {
    if (vacationDays.length === 0) return { vacationDays, periodStart };

    const sortedDates = [...vacationDays].sort();
    let firstVacationDay = new Date(sortedDates[0]);

    // Prüfe: Kommt VOR dem ersten Urlaubstag ein freier Tag?
    let prevDay = new Date(firstVacationDay);
    prevDay.setDate(prevDay.getDate() - 1);

    if (isFreeDayInContext(prevDay, year, stateId, cityId)) {
        return { vacationDays, periodStart };
    }

    // Sonst: Entferne Urlaubstage vorwärts bis wir einen finden,
    // der von einem freien Tag kommt
    let trimmedVacationDays = [...sortedDates];

    while (trimmedVacationDays.length > 0) {
        const firstDay = new Date(trimmedVacationDays[0]);
        const dayBefore = new Date(firstDay);
        dayBefore.setDate(dayBefore.getDate() - 1);

        if (isFreeDayInContext(dayBefore, year, stateId, cityId)) {
            break;
        }

        trimmedVacationDays.shift();
    }

    if (trimmedVacationDays.length > 0) {
        const newFirstVacation = new Date(trimmedVacationDays[0]);
        const newPeriodStart = extendPeriodBackward(newFirstVacation, year, stateId, cityId);
        return { vacationDays: trimmedVacationDays, periodStart: newPeriodStart };
    }

    return { vacationDays: trimmedVacationDays, periodStart };
}

/**
 * Erstellt ein Brückentag-Empfehlungsobjekt
 * DYNAMISCH: Berechnet totalFreeDays basierend auf State.freeDays
 */
function createBridgeRecommendation(id, title, vacationDays, periodStart, periodEnd, holidayNames, year, stateId, cityId) {
    const vacationDates = vacationDays.map(d => formatFullDateString(d));
    // Berechne tatsächliche freie Tage (nicht nur Kalendertage)
    const totalFreeDays = countFreeDaysInPeriod(periodStart, periodEnd, year, stateId, cityId);
    const vacationDaysNeeded = vacationDates.length;
    const efficiency = totalFreeDays / vacationDaysNeeded;

    return {
        id: `bridge-${year}-${id}`,
        type: 'bridge',
        title: title,
        period: formatPeriodString(periodStart, periodEnd),
        periodStart: formatFullDateString(periodStart),
        periodEnd: formatFullDateString(periodEnd),
        vacationDates: vacationDates,
        vacationDaysNeeded: vacationDaysNeeded,
        totalFreeDays: totalFreeDays,
        efficiency: efficiency,
        efficiencyClass: getEfficiencyClass(efficiency),
        holidays: holidayNames,
        allDates: generateAllDatesInRange(periodStart, periodEnd)
    };
}

/**
 * ERWEITERTE PERIODEN - Kategorie "9-15 Tage" und "16+ Tage"
 * DYNAMISCH: Nutzt State.freeDays für benutzerdefinierte Arbeitswoche
 *
 * Regeln:
 * - Feiertage werden GRUPPIERT (innerhalb von 7 Tagen = eine Gruppe)
 * - Kategorie "9-15 Tage": 9-15 freie Tage
 * - Kategorie "16+ Tage": 16-30 freie Tage
 * - Maximum: 30 Tage (keine längeren Perioden)
 * - Nur NOTWENDIGE Urlaubstage (keine Feiertage, keine benutzerdefinierten freien Tage)
 */
function generateExtendedPeriods(bridgeOpportunities, holidays, year, stateId, cityId, minDays) {
    const periods = [];
    let idCounter = 1;

    // Konstanten
    const MAX_DAYS = 30;
    const CATEGORY_9_MIN = 9;
    const CATEGORY_9_MAX = 15;
    const CATEGORY_16_MIN = 16;

    // Sortiere Feiertage nach Datum
    const sortedHolidays = [...holidays]
        .map(h => {
            const [month, day] = h.d.split('-').map(Number);
            return {
                ...h,
                date: new Date(year, month - 1, day),
                dateStr: `${year}-${h.d}`
            };
        })
        .sort((a, b) => a.date - b.date);

    // SCHRITT 1: Gruppiere nahe beieinander liegende Feiertage (innerhalb 7 Tagen)
    const holidayGroups = [];
    let currentGroup = [];

    for (const holiday of sortedHolidays) {
        if (currentGroup.length === 0) {
            currentGroup.push(holiday);
        } else {
            const lastInGroup = currentGroup[currentGroup.length - 1];
            // DST-sicher: Math.round statt Math.floor für 1-Stunden-Unterschied
            const daysBetween = Math.round((holiday.date - lastInGroup.date) / (1000 * 60 * 60 * 24));

            // Innerhalb von 7 Tagen = gleiche Gruppe (z.B. Karfreitag + Ostermontag)
            if (daysBetween <= 7) {
                currentGroup.push(holiday);
            } else {
                holidayGroups.push([...currentGroup]);
                currentGroup = [holiday];
            }
        }
    }
    if (currentGroup.length > 0) {
        holidayGroups.push(currentGroup);
    }

    // SCHRITT 2: Für jede Feiertags-GRUPPE eine Periode erstellen
    for (const group of holidayGroups) {
        const firstHoliday = group[0];
        const lastHoliday = group[group.length - 1];

        if (minDays >= CATEGORY_16_MIN) {
            // ===== KATEGORIE 16+ TAGE (MEGA-URLAUB) =====
            // Strategie: Erweitere jede Feiertags-Gruppe großzügig auf 16-30 Tage
            // VERBESSERUNG: Erweitere sowohl RÜCKWÄRTS als auch VORWÄRTS für beste Effizienz

            // 1. Temporäre Periode basierend auf Feiertagen
            let tempStart = new Date(firstHoliday.date);
            let tempEnd = new Date(lastHoliday.date);

            // 2. WICHTIG: Prüfe auf Brückentag-Möglichkeit VOR dem ersten Feiertag
            const bridgeBeforeFirst = findBridgeDaysBeforeHoliday(firstHoliday.date, year, stateId, cityId);
            if (bridgeBeforeFirst.length > 0) {
                const earliestBridge = new Date(Math.min(...bridgeBeforeFirst.map(d => d.getTime())));
                tempStart = earliestBridge;
            }

            // 3. Berechne notwendige Urlaubstage (jetzt inkl. Brückentage VOR Feiertag)
            let vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);

            // 4. Wenn keine Urlaubstage gefunden, erweitere um eine Woche
            let safetyCounter = 0;
            while (vacationDays.length === 0 && safetyCounter < 4) {
                tempEnd.setDate(tempEnd.getDate() + 7);
                vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);
                safetyCounter++;
            }

            if (vacationDays.length === 0) continue; // Keine Urlaubstage gefunden

            // 5. Sortiere Urlaubstage und finde ersten/letzten
            const sortedVacationDates = [...vacationDays].sort();
            const firstVacationDay = new Date(sortedVacationDates[0]);
            const lastVacationDay = new Date(sortedVacationDates[sortedVacationDates.length - 1]);

            // 6. KORREKT: Erweitere vom ersten/letzten URLAUBSTAG (wie Footer)
            let periodStart = extendPeriodBackward(firstVacationDay, year, stateId, cityId);
            let periodEnd = extendPeriodForward(lastVacationDay, year, stateId, cityId);

            // Berechne natürliche Tage
            let totalDays = countDaysBetween(periodStart, periodEnd);

            // NUR erweitern wenn unter 16 Tagen (Minimum für diese Kategorie)
            // Ansonsten: Natürliche Periode beibehalten!
            while (totalDays < CATEGORY_16_MIN) {
                // Füge eine Woche hinzu und berechne neue Urlaubstage
                tempEnd.setDate(tempEnd.getDate() + 7);
                vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);

                // Neu berechnen
                const newSortedDates = [...vacationDays].sort();
                const newLastVacationDay = new Date(newSortedDates[newSortedDates.length - 1]);
                periodEnd = extendPeriodForward(newLastVacationDay, year, stateId, cityId);
                totalDays = countDaysBetween(periodStart, periodEnd);
            }

            // Max 30 Tage Limit
            if (totalDays > MAX_DAYS) {
                periodEnd = new Date(periodStart);
                periodEnd.setDate(periodEnd.getDate() + MAX_DAYS - 1);
                totalDays = countDaysBetween(periodStart, periodEnd);
                // Urlaubstage neu berechnen für gekürzte Periode
                vacationDays = calculateVacationDaysInPeriod(periodStart, periodEnd, year, stateId, cityId);
            }

            // EFFIZIENZ-FIX: Entferne "trailing" Urlaubstage die zu keinem freien Tag führen
            const trimmedEnd = trimTrailingVacationDays(vacationDays, periodEnd, year, stateId, cityId);
            vacationDays = trimmedEnd.vacationDays;
            periodEnd = trimmedEnd.periodEnd;

            const trimmedStart = trimLeadingVacationDays(vacationDays, periodStart, year, stateId, cityId);
            vacationDays = trimmedStart.vacationDays;
            periodStart = trimmedStart.periodStart;

            // Tage neu berechnen nach Trimming
            totalDays = countDaysBetween(periodStart, periodEnd);

            // Nur hinzufügen wenn noch genug Tage und Urlaubstage übrig
            if (vacationDays.length === 0) continue;

            // Nur hinzufügen wenn 16-30 Tage
            if (totalDays >= CATEGORY_16_MIN && totalDays <= MAX_DAYS && vacationDays.length > 0) {
                // KORREKT: Berechne tatsächliche freie Tage (nicht Kalendertage)
                const actualFreeDays = countFreeDaysInPeriod(periodStart, periodEnd, year, stateId, cityId);
                const efficiency = actualFreeDays / vacationDays.length;
                const involvedHolidays = getHolidaysInPeriod(sortedHolidays, periodStart, periodEnd);

                periods.push({
                    id: `extended16-${year}-${idCounter++}`,
                    type: 'extended',
                    title: generatePeriodTitle(involvedHolidays),
                    period: formatPeriodString(periodStart, periodEnd),
                    periodStart: formatFullDateString(periodStart),
                    periodEnd: formatFullDateString(periodEnd),
                    vacationDates: vacationDays,
                    vacationDaysNeeded: vacationDays.length,
                    totalFreeDays: actualFreeDays,
                    efficiency: efficiency,
                    efficiencyClass: getEfficiencyClass(efficiency),
                    holidays: involvedHolidays.map(h => h.n),
                    allDates: generateAllDatesInRange(periodStart, periodEnd)
                });
            }

        } else {
            // ===== KATEGORIE 9-15 TAGE =====
            // Ziel: 9-15 freie Tage
            // VERBESSERUNG: Erweitere sowohl RÜCKWÄRTS als auch VORWÄRTS für beste Effizienz

            // 1. Temporäre Periode basierend auf Feiertagen
            let tempStart = new Date(firstHoliday.date);
            let tempEnd = new Date(lastHoliday.date);

            // 2. WICHTIG: Prüfe auf Brückentag-Möglichkeit VOR dem ersten Feiertag
            // (z.B. April 1-2 vor Karfreitag für Ostern)
            const bridgeBeforeFirst = findBridgeDaysBeforeHoliday(firstHoliday.date, year, stateId, cityId);
            if (bridgeBeforeFirst.length > 0) {
                // Erweitere tempStart um die Brückentage vor dem Feiertag
                const earliestBridge = new Date(Math.min(...bridgeBeforeFirst.map(d => d.getTime())));
                tempStart = earliestBridge;
            }

            // 3. Berechne notwendige Urlaubstage (jetzt inkl. Brückentage VOR Feiertag)
            let vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);

            // 4. Wenn keine Urlaubstage gefunden, erweitere nach hinten
            let safetyCounter = 0;
            while (vacationDays.length === 0 && safetyCounter < 4) {
                tempEnd.setDate(tempEnd.getDate() + 7);
                vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);
                safetyCounter++;
            }

            if (vacationDays.length === 0) continue; // Keine Urlaubstage gefunden

            // 5. Sortiere Urlaubstage und finde ersten/letzten
            const sortedVacationDates = [...vacationDays].sort();
            const firstVacationDay = new Date(sortedVacationDates[0]);
            const lastVacationDay = new Date(sortedVacationDates[sortedVacationDates.length - 1]);

            // 6. KORREKT: Erweitere vom ersten/letzten URLAUBSTAG (wie Footer)
            let periodStart = extendPeriodBackward(firstVacationDay, year, stateId, cityId);
            let periodEnd = extendPeriodForward(lastVacationDay, year, stateId, cityId);

            // Berechne Tage
            let totalDays = countDaysBetween(periodStart, periodEnd);

            // Wenn unter 9 Tagen, erweitere um eine weitere Woche nach hinten
            if (totalDays < CATEGORY_9_MIN) {
                tempEnd.setDate(tempEnd.getDate() + 7);
                vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);

                const newSortedDates = [...vacationDays].sort();
                const newLastVacationDay = new Date(newSortedDates[newSortedDates.length - 1]);
                periodEnd = extendPeriodForward(newLastVacationDay, year, stateId, cityId);
                totalDays = countDaysBetween(periodStart, periodEnd);
            }

            // WICHTIG: Wenn > 15 Tage, gehört diese Periode in die 16+ Kategorie
            // NICHT kürzen, sondern überspringen - wird von generateExtendedPeriods(..16) behandelt
            if (totalDays > CATEGORY_9_MAX) {
                continue; // Überspringe diese Feiertags-Gruppe für 9-15 Kategorie
            }

            // EFFIZIENZ-FIX: Entferne "trailing" Urlaubstage die zu keinem freien Tag führen
            const trimmedEnd = trimTrailingVacationDays(vacationDays, periodEnd, year, stateId, cityId);
            vacationDays = trimmedEnd.vacationDays;
            periodEnd = trimmedEnd.periodEnd;

            const trimmedStart = trimLeadingVacationDays(vacationDays, periodStart, year, stateId, cityId);
            vacationDays = trimmedStart.vacationDays;
            periodStart = trimmedStart.periodStart;

            // Tage neu berechnen nach Trimming
            totalDays = countDaysBetween(periodStart, periodEnd);

            // Nur hinzufügen wenn noch Urlaubstage übrig
            if (vacationDays.length === 0) continue;

            // Nur hinzufügen wenn 9-15 Tage und Urlaubstage nötig
            if (totalDays >= CATEGORY_9_MIN && totalDays <= CATEGORY_9_MAX && vacationDays.length > 0) {
                // KORREKT: Berechne tatsächliche freie Tage (nicht Kalendertage)
                const actualFreeDays = countFreeDaysInPeriod(periodStart, periodEnd, year, stateId, cityId);
                const efficiency = actualFreeDays / vacationDays.length;
                const involvedHolidays = getHolidaysInPeriod(sortedHolidays, periodStart, periodEnd);

                periods.push({
                    id: `extended9-${year}-${idCounter++}`,
                    type: 'extended',
                    title: generatePeriodTitle(involvedHolidays),
                    period: formatPeriodString(periodStart, periodEnd),
                    periodStart: formatFullDateString(periodStart),
                    periodEnd: formatFullDateString(periodEnd),
                    vacationDates: vacationDays,
                    vacationDaysNeeded: vacationDays.length,
                    totalFreeDays: actualFreeDays,
                    efficiency: efficiency,
                    efficiencyClass: getEfficiencyClass(efficiency),
                    holidays: involvedHolidays.map(h => h.n),
                    allDates: generateAllDatesInRange(periodStart, periodEnd)
                });
            }
        }
    }

    // ===== MEGA-KOMBINATIONEN (nur für 16+ Kategorie) =====
    // Kombiniere benachbarte Feiertags-Gruppen (z.B. Himmelfahrt + Pfingsten)
    // WICHTIG: Nur wenn BEIDE Gruppen effiziente Feiertage haben (Mo-Fr, nicht Sa/So)
    if (minDays >= CATEGORY_16_MIN && holidayGroups.length >= 2) {
        for (let i = 0; i < holidayGroups.length - 1; i++) {
            const group1 = holidayGroups[i];
            const group2 = holidayGroups[i + 1];

            // Prüfe ob BEIDE Gruppen mindestens einen Feiertag Mo-Fr haben
            // (Wochenend-Feiertage lohnen sich nicht für Mega-Kombinationen)
            const group1HasWeekdayHoliday = group1.some(h => {
                const day = h.date.getDay();
                return day >= 1 && day <= 5; // Mo=1, Di=2, Mi=3, Do=4, Fr=5
            });
            const group2HasWeekdayHoliday = group2.some(h => {
                const day = h.date.getDay();
                return day >= 1 && day <= 5;
            });

            // Überspringe wenn eine Gruppe nur Wochenend-Feiertage hat
            if (!group1HasWeekdayHoliday || !group2HasWeekdayHoliday) continue;

            const firstHoliday = group1[0];
            const lastHoliday = group2[group2.length - 1];

            // Prüfe ob die Gruppen nahe genug beieinander sind (max 21 Tage Abstand)
            const daysBetween = Math.round((group2[0].date - group1[group1.length - 1].date) / (1000 * 60 * 60 * 24));
            if (daysBetween > 21) continue;

            // FIX: Berechne zuerst Urlaubstage, dann erweitere vom ersten/letzten Urlaubstag

            // 1. Temporäre Periode basierend auf Feiertagen
            let tempStart = new Date(firstHoliday.date);
            let tempEnd = new Date(lastHoliday.date);

            // 2. Berechne Urlaubstage
            let vacationDays = calculateVacationDaysInPeriod(tempStart, tempEnd, year, stateId, cityId);
            if (vacationDays.length === 0) continue;

            // 3. Sortiere Urlaubstage und finde ersten/letzten
            const sortedVacationDates = [...vacationDays].sort();
            const firstVacationDay = new Date(sortedVacationDates[0]);
            const lastVacationDay = new Date(sortedVacationDates[sortedVacationDates.length - 1]);

            // 4. KORREKT: Erweitere vom ersten/letzten URLAUBSTAG (wie Footer)
            let periodStart = extendPeriodBackward(firstVacationDay, year, stateId, cityId);
            let periodEnd = extendPeriodForward(lastVacationDay, year, stateId, cityId);

            let totalDays = countDaysBetween(periodStart, periodEnd);

            // Max 30 Tage
            if (totalDays > MAX_DAYS) {
                periodEnd = new Date(periodStart);
                periodEnd.setDate(periodEnd.getDate() + MAX_DAYS - 1);
                totalDays = MAX_DAYS;
                // Urlaubstage neu berechnen für gekürzte Periode
                vacationDays = calculateVacationDaysInPeriod(periodStart, periodEnd, year, stateId, cityId);
            }

            // EFFIZIENZ-FIX: Entferne "trailing" Urlaubstage die zu keinem freien Tag führen
            const trimmedEnd = trimTrailingVacationDays(vacationDays, periodEnd, year, stateId, cityId);
            vacationDays = trimmedEnd.vacationDays;
            periodEnd = trimmedEnd.periodEnd;

            const trimmedStart = trimLeadingVacationDays(vacationDays, periodStart, year, stateId, cityId);
            vacationDays = trimmedStart.vacationDays;
            periodStart = trimmedStart.periodStart;

            // Tage neu berechnen nach Trimming
            totalDays = countDaysBetween(periodStart, periodEnd);

            // Nur hinzufügen wenn noch Urlaubstage übrig
            if (vacationDays.length === 0) continue;

            // Nur wenn >= 16 Tage
            if (totalDays >= CATEGORY_16_MIN && vacationDays.length > 0) {
                // KORREKT: Berechne tatsächliche freie Tage (nicht Kalendertage)
                const actualFreeDays = countFreeDaysInPeriod(periodStart, periodEnd, year, stateId, cityId);
                const efficiency = actualFreeDays / vacationDays.length;

                // Mega-Kombinationen nur wenn Effizienz >= 1.5 (lohnt sich sonst nicht)
                if (efficiency < 1.5) continue;

                const involvedHolidays = getHolidaysInPeriod(sortedHolidays, periodStart, periodEnd);

                periods.push({
                    id: `mega-${year}-${idCounter++}`,
                    type: 'extended',
                    title: 'Mega: ' + generatePeriodTitle(involvedHolidays),
                    period: formatPeriodString(periodStart, periodEnd),
                    periodStart: formatFullDateString(periodStart),
                    periodEnd: formatFullDateString(periodEnd),
                    vacationDates: vacationDays,
                    vacationDaysNeeded: vacationDays.length,
                    totalFreeDays: actualFreeDays,
                    efficiency: efficiency,
                    efficiencyClass: efficiency >= 2.0 ? 'mega' : 'extended',
                    holidays: involvedHolidays.map(h => h.n),
                    allDates: generateAllDatesInRange(periodStart, periodEnd)
                });
            }
        }
    }

    // Duplikate entfernen (nach periodStart+periodEnd)
    const uniquePeriods = [];
    const seen = new Set();
    for (const p of periods) {
        const key = `${p.periodStart}-${p.periodEnd}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniquePeriods.push(p);
        }
    }

    // Sortiere nach Effizienz (höchste zuerst)
    return uniquePeriods.sort((a, b) => b.efficiency - a.efficiency);
}

/**
 * Hilfsfunktion: Berechnet Urlaubstage in einer Periode
 */
function calculateVacationDaysInPeriod(periodStart, periodEnd, year, stateId, cityId) {
    const vacationDays = [];
    const current = new Date(periodStart);

    while (current <= periodEnd) {
        if (!isFreeDayInContext(current, year, stateId, cityId)) {
            vacationDays.push(formatFullDateString(current));
        }
        current.setDate(current.getDate() + 1);
    }

    return vacationDays;
}

/**
 * Hilfsfunktion: Findet alle Feiertage in einer Periode
 */
function getHolidaysInPeriod(sortedHolidays, periodStart, periodEnd) {
    return sortedHolidays.filter(h => h.date >= periodStart && h.date <= periodEnd);
}

/**
 * Hilfsfunktion: Generiert Titel für eine Periode
 */
function generatePeriodTitle(holidays) {
    if (holidays.length === 0) return 'Verlängerte Auszeit';
    if (holidays.length === 1) return `${holidays[0].n} Verlängert`;
    if (holidays.length === 2) return `${holidays[0].n} & ${holidays[1].n}`;
    return `${holidays[0].n} bis ${holidays[holidays.length - 1].n}`;
}

// ENTFERNT: calculateGapVacationDays und generateSpecialPeriods
// Diese Funktionen wurden durch den universellen Algorithmus in generateExtendedPeriods ersetzt


/**
 * Hilfsfunktion: Generiert alle Daten in einem Bereich
 */
function generateAllDatesInRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(formatFullDateString(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

/**
 * Hilfsfunktion: Formatiert Periodenstring
 */
function formatPeriodString(startDate, endDate) {
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()}. - ${end.getDate()}. ${months[start.getMonth()]}`;
    }
    return `${start.getDate()}. ${months[start.getMonth()]} - ${end.getDate()}. ${months[end.getMonth()]}`;
}

// Hilfsfunktion: Berechne alle Tage einer Urlaubsperiode inkl. Wochenenden
function calculateAllDatesFromVacation(vacationDates, holidays) {
    if (!vacationDates || vacationDates.length === 0) return [];

    const sortedDates = [...vacationDates].sort();
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);
    const allDates = [];

    // Erweitere um angrenzende freie Tage
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - 1);

    // Prüfe Tage vor dem ersten Urlaubstag (freie Tage laut Konfiguration)
    while (isRegularFreeDay(currentDate)) {
        allDates.unshift(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Füge alle Tage von Start bis Ende hinzu
    currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        allDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Prüfe Tage nach dem letzten Urlaubstag (freie Tage laut Konfiguration)
    while (isRegularFreeDay(currentDate)) {
        allDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return [...new Set(allDates)].sort();
}

// Hilfsfunktion: Admin-Datumsbereich formatieren
function formatAdminDateRange(startDate, endDate) {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const startMonth = start.getMonth() + 1;
    const endDay = end.getDate();
    const endMonth = end.getMonth() + 1;

    // Formatiere als MM-DD String für formatDateRange
    const startFormatted = `${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const endFormatted = `${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

    return formatDateRange(startFormatted, endFormatted);
}

// 6.2. Utility Functions (Fallback-Generatoren wurden entfernt - alle Empfehlungen kommen aus Admin-Panel)
function getEfficiencyClass(efficiency) {
    if (efficiency >= 3) return 'high';
    if (efficiency >= 2) return 'medium';
    return 'mega';
}

function formatFullDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 6.6. Modal Management
function openRecommendationsModal() {
    console.log('🚀 openRecommendationsModal wurde aufgerufen');

    const modal = document.getElementById('recommendations-modal');
    const modalYear = document.getElementById('modal-year');
    const modalState = document.getElementById('modal-state');
    const modalCity = document.getElementById('modal-city');
    const modalCityWrapper = document.getElementById('modal-city-wrapper');

    if (!modal) {
        console.error('❌ Modal Element nicht gefunden!');
        return;
    }

    // Update year display
    if (modalYear) modalYear.textContent = State.selectedYear;

    // Update state display
    if (modalState) {
        const stateObj = STATES.find(s => s.id === State.selectedStateId);
        modalState.textContent = stateObj ? stateObj.name : State.selectedStateId;
    }

    // Update city display (nur anzeigen wenn Stadt ausgewählt)
    if (modalCityWrapper && modalCity) {
        if (State.selectedCityId) {
            const cities = CITIES[State.selectedStateId] || [];
            const cityObj = cities.find(c => c.id === State.selectedCityId);
            modalCity.textContent = cityObj ? cityObj.name.split(' (')[0] : State.selectedCityId;
            modalCityWrapper.style.display = 'inline';
        } else {
            modalCityWrapper.style.display = 'none';
        }
    }

    // Reset modal state
    ModalState.selectedRecommendations.clear();
    ModalState.conflictedRecommendations.clear();

    // Calculate and store recommendations (automatisch basierend auf Kontext)
    ModalState.allRecommendations = generateAutoRecommendations(
        State.selectedYear,
        State.selectedStateId,
        State.selectedCityId
    );
    console.log('📊 Generierte Empfehlungen:', ModalState.allRecommendations.length);

    // Synchronisiere Modal-Auswahl mit bereits im Kalender ausgewählten Tagen
    syncModalWithSelectedDates();

    // Render cards in modal
    renderModalRecommendationCards();
    updateSelectionSummary();

    // Show modal
    console.log('👁️ Modal wird angezeigt');
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function closeRecommendationsModal() {
    const modal = document.getElementById('recommendations-modal');
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    // Footer-Preview zurücksetzen wenn Modal ohne Speichern geschlossen wird
    resetMainFooterPreview();
}

function renderModalRecommendationCards() {
    const container = document.getElementById('modal-recommendation-cards');
    const categoryFilter = document.getElementById('modal-category-filter');
    const sortFilter = document.getElementById('modal-sort-filter');

    if (!container) return;

    // Filter by category
    const categoryValue = categoryFilter ? categoryFilter.value : 'all';
    const sortValue = sortFilter ? sortFilter.value : 'efficiency-desc';

    let filteredRecommendations = ModalState.allRecommendations.filter(rec => {
        // Kategorie-Filter
        if (categoryValue === 'all') return true;
        if (categoryValue === 'bridge') return rec.type === 'bridge';
        if (categoryValue === 'week9') return rec.type === 'extended' && rec.totalFreeDays >= 9 && rec.totalFreeDays < 16;
        if (categoryValue === 'week16') return rec.type === 'extended' && rec.totalFreeDays >= 16;
        return true;
    });

    // Sortierung anwenden
    filteredRecommendations = [...filteredRecommendations].sort((a, b) => {
        if (sortValue === 'efficiency-desc') {
            return b.efficiency - a.efficiency; // Höchste zuerst
        } else if (sortValue === 'efficiency-asc') {
            return a.efficiency - b.efficiency; // Niedrigste zuerst
        } else if (sortValue === 'date-asc') {
            return new Date(a.periodStart) - new Date(b.periodStart); // Jan → Dez
        } else if (sortValue === 'date-desc') {
            return new Date(b.periodStart) - new Date(a.periodStart); // Dez → Jan
        }
        return 0;
    });

    // Clear container
    container.innerHTML = '';

    // Event-Delegation: EIN Handler für alle Karten (verhindert Memory-Leak bei jedem Re-Render)
    container.onclick = null;
    container.onclick = (e) => {
        const card = e.target.closest('.recommendation-card');
        if (card && !card.classList.contains('conflicted')) {
            const recommendationId = card.dataset.recommendationId;
            if (recommendationId) {
                toggleRecommendationSelection(recommendationId);
            }
        }
    };

    // Render cards
    filteredRecommendations.forEach(recommendation => {
        const card = createModalRecommendationCard(recommendation);
        container.appendChild(card);
    });

    if (filteredRecommendations.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: rgba(255,255,255,0.6); padding: 40px;">
                <p>Keine Empfehlungen für die gewählten Filter gefunden.</p>
            </div>
        `;
    }
}

// 6.7. Conflict Detection
function checkRecommendationConflicts(newRecommendation) {
    const conflicts = new Set();

    for (const selectedId of ModalState.selectedRecommendations) {
        const selected = ModalState.allRecommendations.find(r => r.id === selectedId);
        if (selected && hasDateOverlap(selected.vacationDates, newRecommendation.vacationDates)) {
            conflicts.add(selectedId);
        }
    }

    return conflicts;
}

function hasDateOverlap(dates1, dates2) {
    return dates1.some(date => dates2.includes(date));
}

function updateConflictStates() {
    ModalState.conflictedRecommendations.clear();

    ModalState.allRecommendations.forEach(rec => {
        if (!ModalState.selectedRecommendations.has(rec.id)) {
            const conflicts = checkRecommendationConflicts(rec);
            if (conflicts.size > 0) {
                ModalState.conflictedRecommendations.add(rec.id);
            }
        }
    });
}

// 6.7.1. Synchronisiere Modal-Auswahl mit bereits im Kalender ausgewählten Tagen
function syncModalWithSelectedDates() {
    // Prüfe für jede Empfehlung, ob ALLE ihre Urlaubstage bereits ausgewählt sind
    ModalState.allRecommendations.forEach(rec => {
        // Prüfe ob alle Urlaubstage dieser Empfehlung bereits in State.selectedDates sind
        const allDatesSelected = rec.vacationDates.every(date =>
            State.selectedDates.has(date)
        );

        if (allDatesSelected && rec.vacationDates.length > 0) {
            ModalState.selectedRecommendations.add(rec.id);
        }
    });

    // Aktualisiere Konflikt-Status nach der Synchronisierung
    updateConflictStates();
}

// 6.8. Create Modal Recommendation Card
function createModalRecommendationCard(recommendation) {
    const card = document.createElement('div');

    // Determine card state
    const isSelected = ModalState.selectedRecommendations.has(recommendation.id);
    const isConflicted = ModalState.conflictedRecommendations.has(recommendation.id);

    let cardClasses = `recommendation-card efficiency-${recommendation.efficiencyClass}`;
    if (isSelected) cardClasses += ' selected';
    if (isConflicted) cardClasses += ' conflicted';

    card.className = cardClasses;

    const efficiencyLabel = {
        extended: 'Erweiterte Auszeit'
    };

    // Badge nur anzeigen wenn ein Label existiert (nicht für medium/mega)
    const badgeHtml = efficiencyLabel[recommendation.efficiencyClass]
        ? `<span class="efficiency-badge ${recommendation.efficiencyClass}">${efficiencyLabel[recommendation.efficiencyClass]}</span>`
        : '';

    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${recommendation.title}</h3>
            ${badgeHtml}
        </div>

        <div class="card-stats">
            <div class="stat-item">
                <span class="stat-value">${recommendation.vacationDaysNeeded}</span>
                <span class="stat-label">Urlaubstage</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${recommendation.totalFreeDays}</span>
                <span class="stat-label">Freie Tage</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${recommendation.efficiency.toFixed(1)}x</span>
                <span class="stat-label">Effizienz</span>
            </div>
        </div>

        <div class="card-period">${recommendation.period}</div>

        <div class="card-holidays">
            <h4>Enthaltene Feiertage:</h4>
            <div class="holiday-tags">
                ${recommendation.holidays.map(holiday => `<span class="holiday-tag">${holiday}</span>`).join('')}
            </div>
        </div>

        ${isSelected ? '<div class="selection-indicator">✓ Ausgewählt</div>' : ''}
    `;

    // Data-Attribut für Event-Delegation (Click-Handler ist auf Container)
    card.dataset.recommendationId = recommendation.id;

    return card;
}

// 6.9. Selection Management
function toggleRecommendationSelection(recommendationId) {
    if (ModalState.selectedRecommendations.has(recommendationId)) {
        ModalState.selectedRecommendations.delete(recommendationId);
    } else {
        ModalState.selectedRecommendations.add(recommendationId);
    }

    updateConflictStates();
    // Statt komplett neu rendern: Nur Klassen aktualisieren (Performance + kein Memory-Leak)
    updateCardSelectionStates();
    updateSelectionSummary();
}

// Hilfsfunktion: Aktualisiert nur die Klassen der Karten (ohne DOM neu zu erstellen)
function updateCardSelectionStates() {
    const cards = document.querySelectorAll('.recommendation-card');
    cards.forEach(card => {
        const id = card.dataset.recommendationId;
        if (!id) return;

        const isSelected = ModalState.selectedRecommendations.has(id);
        const isConflicted = ModalState.conflictedRecommendations.has(id);

        card.classList.toggle('selected', isSelected);
        card.classList.toggle('conflicted', isConflicted);

        // Selection-Indicator aktualisieren
        let indicator = card.querySelector('.selection-indicator');
        if (isSelected && !indicator) {
            indicator = document.createElement('div');
            indicator.className = 'selection-indicator';
            indicator.textContent = '✓ Ausgewählt';
            card.appendChild(indicator);
        } else if (!isSelected && indicator) {
            indicator.remove();
        }
    });
}

function updateSelectionSummary() {
    const totalVacationDaysEl = document.getElementById('total-vacation-days');
    const totalFreeDaysEl = document.getElementById('total-free-days');
    const totalEfficiencyEl = document.getElementById('total-efficiency');
    const applyButton = document.getElementById('apply-selection');

    let totalVacationDays = 0;
    let totalFreeDays = 0;
    const allSelectedDates = new Set();

    // Calculate combined stats
    for (const selectedId of ModalState.selectedRecommendations) {
        const recommendation = ModalState.allRecommendations.find(r => r.id === selectedId);
        if (recommendation) {
            recommendation.vacationDates.forEach(date => allSelectedDates.add(date));
        }
    }

    // Count unique vacation days and calculate free days
    totalVacationDays = allSelectedDates.size;

    // Calculate total free days correctly by summing up each selected recommendation's total free days
    for (const selectedId of ModalState.selectedRecommendations) {
        const recommendation = ModalState.allRecommendations.find(r => r.id === selectedId);
        if (recommendation) {
            totalFreeDays += recommendation.totalFreeDays;
        }
    }

    // Update Modal display
    if (totalVacationDaysEl) totalVacationDaysEl.textContent = totalVacationDays;
    if (totalFreeDaysEl) totalFreeDaysEl.textContent = totalFreeDays;
    if (totalEfficiencyEl) totalEfficiencyEl.textContent =
        totalVacationDays > 0 ? (totalFreeDays / totalVacationDays).toFixed(1) + 'x' : '0.0x';

    // PREVIEW: Aktualisiere auch den Haupt-Footer mit der Auswahl
    updateMainFooterPreview(allSelectedDates, totalVacationDays, totalFreeDays);

    // Enable/disable apply button
    if (applyButton) {
        applyButton.disabled = ModalState.selectedRecommendations.size === 0;
    }

    // Update clear button state (red when selections exist)
    const clearButton = document.getElementById('modal-clear-selection');
    if (clearButton) {
        if (ModalState.selectedRecommendations.size > 0) {
            clearButton.classList.add('active');
        } else {
            clearButton.classList.remove('active');
        }
    }

}

// PREVIEW: Aktualisiert den Haupt-Footer während Empfehlungen ausgewählt werden
function updateMainFooterPreview(selectedDatesSet, totalVacationDays, totalFreeDays) {
    const vacationDaysEl = document.getElementById('vacation-days');
    const effectiveDaysEl = document.getElementById('effective-days');
    const efficiencyEl = document.getElementById('efficiency-display');
    const footerEl = document.querySelector('.sticky-footer');

    if (selectedDatesSet.size > 0) {
        // Zeige Preview der Auswahl
        if (vacationDaysEl) vacationDaysEl.textContent = totalVacationDays;
        if (effectiveDaysEl) effectiveDaysEl.textContent = totalFreeDays;
        if (efficiencyEl) {
            const eff = totalVacationDays > 0 ? (totalFreeDays / totalVacationDays).toFixed(1) : '0.0';
            efficiencyEl.textContent = eff + 'x';
        }
        // Footer visuell als Preview markieren
        if (footerEl) footerEl.classList.add('preview-mode');
    } else {
        // Zurück zur normalen Anzeige
        updateSummary();
        if (footerEl) footerEl.classList.remove('preview-mode');
    }
}

// Setzt Footer zurück wenn Modal geschlossen wird ohne zu speichern
function resetMainFooterPreview() {
    const footerEl = document.querySelector('.sticky-footer');
    if (footerEl) footerEl.classList.remove('preview-mode');
    updateSummary();
}

function applySelectedRecommendations() {
    // Add all selected vacation dates to the main calendar
    const allSelectedDates = new Set();

    for (const selectedId of ModalState.selectedRecommendations) {
        const recommendation = ModalState.allRecommendations.find(r => r.id === selectedId);
        if (recommendation) {
            // Verwende vacationDates für tatsächliche Urlaubstage
            recommendation.vacationDates.forEach(date => {
                allSelectedDates.add(date);
                State.selectedDates.add(date);
            });
        }
    }

    // Update main UI
    updateUI();
    updateSummary(); // Explicitly update summary for sticky footer

    // Close modal
    closeRecommendationsModal();

    // Scroll to calendar
    setTimeout(() => {
        document.getElementById('calendar-grid').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 300);
}

// 6.10. Simple trigger button update function
function renderRecommendationCards() {
    const triggerYear = document.getElementById('trigger-year');
    if (triggerYear) triggerYear.textContent = State.selectedYear;
}

// 6.11. Initialize Recommendations Module
function initRecommendationsModule() {
    // Open modal button
    const openModalBtn = document.getElementById('open-recommendations-modal');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openRecommendationsModal);
    }

    // Close modal button
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeRecommendationsModal);
    }

    // Modal backdrop click
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeRecommendationsModal);
    }

    // Modal category filter
    const modalCategoryFilter = document.getElementById('modal-category-filter');
    if (modalCategoryFilter) {
        modalCategoryFilter.addEventListener('change', () => {
            renderModalRecommendationCards();
        });
    }

    // Modal sort filter
    const modalSortFilter = document.getElementById('modal-sort-filter');
    if (modalSortFilter) {
        modalSortFilter.addEventListener('change', () => {
            renderModalRecommendationCards();
        });
    }

    // Apply selection button
    const applyButton = document.getElementById('apply-selection');
    if (applyButton) {
        applyButton.addEventListener('click', applySelectedRecommendations);
    }

    // Clear selection button (in modal)
    const clearSelectionBtn = document.getElementById('modal-clear-selection');
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelectedRecommendations);
    }

    // Initial render
    renderRecommendationCards();

    // Footer Perioden-Popup initialisieren
    initFooterPeriodsPopup();
}

// Clear all selected recommendations in the modal
function clearSelectedRecommendations() {
    ModalState.selectedRecommendations.clear();
    ModalState.conflictedRecommendations.clear();
    renderModalRecommendationCards();
    updateSelectionSummary();
}

// 6.8. Footer Perioden-Popup für "freie Tage" Anzeige
function initFooterPeriodsPopup() {
    const freeDaysStat = document.getElementById('footer-free-days-stat');
    const popup = document.getElementById('footer-periods-popup');

    if (!freeDaysStat || !popup) return;

    // Toggle Popup bei Tap auf "freie Tage"
    freeDaysStat.addEventListener('click', (e) => {
        e.stopPropagation();

        // Nur anzeigen wenn Urlaubstage ausgewählt sind
        if (State.selectedDates.size === 0) {
            return;
        }

        // Popup toggle
        const isHidden = popup.classList.contains('hidden');
        if (isHidden) {
            updateFooterPeriodsPopup();
            popup.classList.remove('hidden');
        } else {
            popup.classList.add('hidden');
        }
    });

    // Popup schließen bei Klick außerhalb
    document.addEventListener('click', (e) => {
        if (!freeDaysStat.contains(e.target)) {
            popup.classList.add('hidden');
        }
    });
}

// Footer-Popup mit ausgewählten Perioden füllen
function updateFooterPeriodsPopup() {
    const periodsList = document.getElementById('footer-periods-list');
    if (!periodsList) return;

    periodsList.innerHTML = '';

    // Perioden aus State.selectedDates berechnen
    const periods = getVacationPeriods();

    if (periods.length === 0) {
        periodsList.innerHTML = '<div class="periods-empty">Keine Urlaubstage ausgewählt</div>';
        return;
    }

    // Alle Perioden anzeigen
    periods.forEach((period, index) => {
        const periodItem = document.createElement('div');
        periodItem.className = 'period-item';

        // Datum formatieren
        const startDate = new Date(period.start);
        const endDate = new Date(period.end);
        const formatDate = (d) => `${d.getDate()}.${d.getMonth() + 1}.`;

        // Monatsnamen für den Titel
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                           'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        const monthName = monthNames[startDate.getMonth()];

        periodItem.innerHTML = `
            <div class="period-item-info">
                <span class="period-item-name">Urlaub ${index + 1} (${monthName})</span>
                <span class="period-item-dates">${formatDate(startDate)} - ${formatDate(endDate)}</span>
                <span class="period-item-days">${period.totalDays} freie Tage</span>
            </div>
            <span class="period-item-arrow">→</span>
        `;

        // Bei Tap: Popup schließen und zum Monat navigieren
        periodItem.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateToMonthInCalendar(startDate.getMonth());
            document.getElementById('footer-periods-popup').classList.add('hidden');
        });

        periodsList.appendChild(periodItem);
    });
}

// Zum entsprechenden Monat im Kalender navigieren
function navigateToMonthInCalendar(targetMonth) {
    // Prüfen ob Mobile-Ansicht aktiv
    if (typeof MobileView !== 'undefined' && MobileView.isActive) {
        // Mobile: Zum Monat navigieren
        MobileView.showMonth(targetMonth);
    } else {
        // Desktop: Zum Monat scrollen
        const monthElements = document.querySelectorAll('.month-view');
        if (monthElements[targetMonth]) {
            monthElements[targetMonth].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

// Update Footer "freie Tage" Styling wenn Auswahl vorhanden
function updateFooterPeriodsIndicator() {
    const freeDaysStat = document.getElementById('footer-free-days-stat');
    if (!freeDaysStat) return;

    if (State.selectedDates.size > 0) {
        freeDaysStat.classList.add('has-periods');
    } else {
        freeDaysStat.classList.remove('has-periods');
    }
}

// MODULE 8: REISETIPPS (Travel Tips Module)
// Die Reisetipps-Logik ist in reisetipps.html ausgelagert.
// Dieses Modul verwaltet nur den Button und die URL-Parameter.

// 8.1. Mehrere zusammenhängende Urlaubszeiträume erkennen
function getVacationPeriods() {
    if (State.selectedDates.size === 0) return [];

    const dates = Array.from(State.selectedDates).sort();
    const periods = [];

    // Gruppiere zusammenhängende Urlaubstage in separate Perioden
    let currentGroup = [dates[0]];

    for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);

        // Prüfe ob die Tage zusammenhängend sind (inkl. Wochenenden/Feiertage dazwischen)
        const daysDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

        // Prüfe ob alle Tage dazwischen frei sind
        let allDaysFree = true;
        if (daysDiff > 1) {
            for (let d = 1; d < daysDiff; d++) {
                const checkDate = new Date(prevDate);
                checkDate.setDate(checkDate.getDate() + d);
                if (!isDayFreeForTravelTips(checkDate)) {
                    allDaysFree = false;
                    break;
                }
            }
        }

        if (daysDiff <= 1 || allDaysFree) {
            // Zusammenhängend - zur aktuellen Gruppe hinzufügen
            currentGroup.push(dates[i]);
        } else {
            // Nicht zusammenhängend - neue Gruppe starten
            periods.push(currentGroup);
            currentGroup = [dates[i]];
        }
    }
    periods.push(currentGroup); // Letzte Gruppe hinzufügen

    // Jede Gruppe zu einem erweiterten Zeitraum umwandeln
    return periods.map(group => {
        const startDate = new Date(group[0]);
        const endDate = new Date(group[group.length - 1]);

        // Erweitere um angrenzende freie Tage (Wochenenden/Feiertage)
        let extendedStart = new Date(startDate);
        extendedStart.setDate(extendedStart.getDate() - 1);
        while (isDayFreeForTravelTips(extendedStart)) {
            extendedStart.setDate(extendedStart.getDate() - 1);
        }
        extendedStart.setDate(extendedStart.getDate() + 1);

        let extendedEnd = new Date(endDate);
        extendedEnd.setDate(extendedEnd.getDate() + 1);
        while (isDayFreeForTravelTips(extendedEnd)) {
            extendedEnd.setDate(extendedEnd.getDate() + 1);
        }
        extendedEnd.setDate(extendedEnd.getDate() - 1);

        // WICHTIG: Normalisiere auf Mittag um DST-Probleme zu vermeiden
        extendedStart.setHours(12, 0, 0, 0);
        extendedEnd.setHours(12, 0, 0, 0);

        const timeDiff = extendedEnd.getTime() - extendedStart.getTime();
        const totalDays = Math.round(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        return {
            start: extendedStart,
            end: extendedEnd,
            totalDays: totalDays,
            month: extendedStart.getMonth() + 1,
            vacationDays: group.length
        };
    }).sort((a, b) => a.start - b.start); // Nach Startdatum sortieren
}

// 8.6. Hilfsfunktion: Ist ein Tag frei (Wochenende oder Feiertag)?
function isDayFreeForTravelTips(date) {
    if (isRegularFreeDay(date)) return true; // Konfigurierter freier Tag
    const holidayInfo = getHolidayInfo(date);
    return holidayInfo !== null;
}

// 8.7. Update Travel Tips Button/Link Visibility und URL
function updateTravelTipsButton() {
    const btn = document.getElementById('travel-tips-btn');
    if (!btn) return;

    const periods = getVacationPeriods();

    // Nur Zeiträume mit 4+ freien Tagen
    const validPeriods = periods.filter(p => p.totalDays >= 4);

    if (validPeriods.length > 0) {
        btn.classList.remove('hidden');
        btn.classList.add('pulse');

        // URL mit Parametern für die Reisetipps-Seite erstellen
        const periodsData = validPeriods.map(p => ({
            start: p.start.toISOString().split('T')[0],
            end: p.end.toISOString().split('T')[0],
            days: p.totalDays,
            month: p.month
        }));
        const params = encodeURIComponent(JSON.stringify(periodsData));
        btn.href = `reisetipps.html?periods=${params}`;
    } else {
        btn.classList.add('hidden');
        btn.classList.remove('pulse');
        btn.href = 'reisetipps.html';
    }
}

// 8.8. Initialize Travel Tips Module (Button verlinkt jetzt direkt zu reisetipps.html)
function initTravelTipsModule() {
    // Initial Button-Status aktualisieren
    updateTravelTipsButton();
}

// MODULE 9: TEILEN & EXPORT (Sharing & Export Module)
// Ermöglicht das Teilen der Urlaubsauswahl via Link und den Export als iCal-Datei

// 9.1. STATE für Teilen-Modul
const ShareState = {
    shareModalOpen: false,
    generatedLink: ''
};

// 9.1.1. URL-safe Base64 encoding (V2 Format)
function base64UrlEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return atob(str);
}

// 9.1.2. Datum-Kompression: "2025-01-06" → "250106"
function compressDate(isoDate) {
    return isoDate.replace(/-/g, '').slice(2); // "20250106" → "250106"
}

function decompressDate(short) {
    // "250106" → "2025-01-06"
    return `20${short.slice(0,2)}-${short.slice(2,4)}-${short.slice(4,6)}`;
}

// 9.1.3. Date-Range Kompression für V3 (VIEL kürzere URLs!)
// Gruppiert aufeinanderfolgende Tage zu Ranges: [3,4,5,7,8] → "3-5,7-8"
function compressDatesToRanges(sortedIsoDates) {
    if (sortedIsoDates.length === 0) return '';

    const ranges = [];
    let rangeStart = sortedIsoDates[0];
    let rangeEnd = sortedIsoDates[0];

    for (let i = 1; i < sortedIsoDates.length; i++) {
        const currentDate = new Date(sortedIsoDates[i]);
        const prevDate = new Date(rangeEnd);

        // Prüfe ob aufeinanderfolgend (1 Tag Differenz)
        const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Erweitere Range
            rangeEnd = sortedIsoDates[i];
        } else {
            // Speichere bisherige Range und starte neue
            if (rangeStart === rangeEnd) {
                ranges.push(compressDate(rangeStart));
            } else {
                ranges.push(compressDate(rangeStart) + '-' + compressDate(rangeEnd));
            }
            rangeStart = sortedIsoDates[i];
            rangeEnd = sortedIsoDates[i];
        }
    }

    // Letzte Range speichern
    if (rangeStart === rangeEnd) {
        ranges.push(compressDate(rangeStart));
    } else {
        ranges.push(compressDate(rangeStart) + '-' + compressDate(rangeEnd));
    }

    return ranges.join(',');
}

// Dekomprimiert Ranges zurück zu einzelnen Daten
function decompressRangesToDates(rangeStr) {
    if (!rangeStr) return [];

    const dates = [];
    const parts = rangeStr.split(',');

    for (const part of parts) {
        if (part.includes('-')) {
            // Range: "250403-250407"
            const [startStr, endStr] = part.split('-');
            const startDate = new Date(decompressDate(startStr));
            const endDate = new Date(decompressDate(endStr));

            // Alle Tage in der Range hinzufügen
            const current = new Date(startDate);
            while (current <= endDate) {
                dates.push(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
        } else {
            // Einzelnes Datum: "250414"
            dates.push(decompressDate(part));
        }
    }

    return dates;
}

// 9.1.4. Komprimierte Daten kodieren V2 (Legacy - für Rückwärtskompatibilität)
function encodeSelectionV2() {
    const dates = Array.from(State.selectedDates).sort().map(compressDate);
    let freeDaysArray;
    if (State.freeDays instanceof Set) {
        freeDaysArray = Array.from(State.freeDays).sort();
    } else if (Array.isArray(State.freeDays)) {
        freeDaysArray = State.freeDays;
    } else {
        freeDaysArray = [0, 6];
    }
    const data = {
        v: 2,
        y: State.selectedYear,
        s: State.selectedStateId,
        c: State.selectedCityId || '',
        d: dates.join(','),
        f: freeDaysArray.join('')
    };
    const jsonStr = JSON.stringify(data);
    return base64UrlEncode(encodeURIComponent(jsonStr));
}

// 9.1.5. Komprimierte Daten kodieren V3 (mit Date-Ranges - Legacy)
function encodeSelectionV3() {
    const sortedDates = Array.from(State.selectedDates).sort();
    let freeDaysArray;
    if (State.freeDays instanceof Set) {
        freeDaysArray = Array.from(State.freeDays).sort();
    } else if (Array.isArray(State.freeDays)) {
        freeDaysArray = State.freeDays;
    } else {
        freeDaysArray = [0, 6];
    }
    const data = {
        v: 3,
        y: State.selectedYear,
        s: State.selectedStateId,
        c: State.selectedCityId || '',
        d: compressDatesToRanges(sortedDates),
        f: freeDaysArray.join('')
    };
    const jsonStr = JSON.stringify(data);
    return base64UrlEncode(encodeURIComponent(jsonStr));
}

// 9.1.6. Komprimierte Daten kodieren V4 (Pipe-Format - Legacy)
function encodeSelectionV4() {
    const sortedDates = Array.from(State.selectedDates).sort();
    let freeDaysArray;
    if (State.freeDays instanceof Set) {
        freeDaysArray = Array.from(State.freeDays).sort();
    } else if (Array.isArray(State.freeDays)) {
        freeDaysArray = State.freeDays;
    } else {
        freeDaysArray = [0, 6];
    }
    const year2 = String(State.selectedYear).slice(2);
    const parts = ['4', year2, State.selectedStateId, State.selectedCityId || '',
                   compressDatesToRanges(sortedDates), freeDaysArray.join('')];
    return base64UrlEncode(parts.join('|'));
}

// Bundesland-Mapping für V5 (kürzer)
const STATE_TO_NUM = {BW:0,BY:1,BE:2,BB:3,HB:4,HH:5,HE:6,MV:7,NI:8,NW:9,RP:'a',SL:'b',SN:'c',ST:'d',SH:'e',TH:'f'};
const NUM_TO_STATE = {0:'BW',1:'BY',2:'BE',3:'BB',4:'HB',5:'HH',6:'HE',7:'MV',8:'NI',9:'NW',a:'RP',b:'SL',c:'SN',d:'ST',e:'SH',f:'TH'};

// Komprimiere Ranges ohne Jahr-Präfix (nur MMTT)
function compressRangesShort(sortedIsoDates, baseYear) {
    if (sortedIsoDates.length === 0) return '';
    const ranges = [];
    let rangeStart = sortedIsoDates[0];
    let rangeEnd = sortedIsoDates[0];

    for (let i = 1; i < sortedIsoDates.length; i++) {
        const currentDate = new Date(sortedIsoDates[i]);
        const prevDate = new Date(rangeEnd);
        const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            rangeEnd = sortedIsoDates[i];
        } else {
            ranges.push(formatRangeShort(rangeStart, rangeEnd, baseYear));
            rangeStart = sortedIsoDates[i];
            rangeEnd = sortedIsoDates[i];
        }
    }
    ranges.push(formatRangeShort(rangeStart, rangeEnd, baseYear));
    return ranges.join(',');
}

// Format: MMTT oder MMTT-MMTT, mit Jahr-Präfix wenn nötig
function formatRangeShort(start, end, baseYear) {
    const startShort = formatDateShort(start, baseYear);
    if (start === end) return startShort;
    const endShort = formatDateShort(end, baseYear);
    return startShort + '-' + endShort;
}

function formatDateShort(isoDate, baseYear) {
    const year = parseInt(isoDate.slice(0, 4));
    const mmtt = isoDate.slice(5, 7) + isoDate.slice(8, 10); // "04-03" → "0403"
    // Wenn anderes Jahr, Präfix hinzufügen: "27:0102"
    if (year !== baseYear) {
        return (year % 100) + ':' + mmtt;
    }
    return mmtt;
}

// Dekomprimiere kurze Ranges zurück zu ISO-Daten
function decompressRangesShort(rangeStr, baseYear) {
    if (!rangeStr) return [];
    const dates = [];
    const parts = rangeStr.split(',');

    for (const part of parts) {
        if (part.includes('-')) {
            const [startStr, endStr] = part.split('-');
            const startDateStr = parseShortDate(startStr, baseYear);
            const endDateStr = parseShortDate(endStr, baseYear);
            const current = new Date(startDateStr);
            const end = new Date(endDateStr); // FIX: Auch zu Date konvertieren!
            current.setHours(12, 0, 0, 0); // DST-Fix
            end.setHours(12, 0, 0, 0);
            while (current <= end) {
                dates.push(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
        } else {
            dates.push(parseShortDate(part, baseYear));
        }
    }
    return dates;
}

function parseShortDate(shortDate, baseYear) {
    let year = baseYear;
    let mmtt = shortDate;
    // Check für Jahr-Präfix: "27:0102"
    if (shortDate.includes(':')) {
        const [y, d] = shortDate.split(':');
        year = 2000 + parseInt(y);
        mmtt = d;
    }
    const month = mmtt.slice(0, 2);
    const day = mmtt.slice(2, 4);
    return `${year}-${month}-${day}`;
}

// 9.1.7. Komprimierte Daten kodieren V5 (ULTRA-KURZ!)
// Format: "5|JJ|S|RANGES" - Jahr in Daten weggelassen, State als 1 Zeichen, FreeDays nur wenn nicht Standard
// Beispiel: "5|26|a|0209-0213,0515" statt "4|26|RP||260209-260213,260515|06"
function encodeSelectionV5() {
    const sortedDates = Array.from(State.selectedDates).sort();
    const year = State.selectedYear;
    const year2 = String(year).slice(2);

    // Bundesland als 1 Zeichen (hex: 0-f)
    const stateNum = STATE_TO_NUM[State.selectedStateId] ?? State.selectedStateId;

    // FreeDays nur wenn nicht Standard (06)
    let freeDaysArray;
    if (State.freeDays instanceof Set) {
        freeDaysArray = Array.from(State.freeDays).sort();
    } else if (Array.isArray(State.freeDays)) {
        freeDaysArray = State.freeDays;
    } else {
        freeDaysArray = [0, 6];
    }
    const isDefaultFreeDays = freeDaysArray.length === 2 && freeDaysArray[0] === 0 && freeDaysArray[1] === 6;

    // Kompakte Ranges ohne Jahr
    const ranges = compressRangesShort(sortedDates, year);

    // Format: 5|JJ|S|C|RANGES|F (F nur wenn nicht default)
    let result = `5|${year2}|${stateNum}|${State.selectedCityId || ''}|${ranges}`;
    if (!isDefaultFreeDays) {
        result += '|' + freeDaysArray.join('');
    }

    return base64UrlEncode(result);
}

// 9.1.8. Dekodieren (unterstützt V1, V2, V3, V4 und V5)
function decodeSelection(encoded) {
    try {
        const decoded = base64UrlDecode(encoded);

        // V5: Ultra-Kurz-Format (startet mit "5|")
        if (decoded.startsWith('5|')) {
            const parts = decoded.split('|');
            // Format: 5|JJ|S|CITY|RANGES|F (F optional)
            const year = parseInt('20' + parts[1]);
            const stateNum = parts[2];
            const state = NUM_TO_STATE[stateNum] || stateNum; // Hex zurück zu State-Code
            const city = parts[3] || '';
            const dates = decompressRangesShort(parts[4], year);
            const freeDays = parts[5] ? parts[5].split('').map(Number) : [0, 6];
            return { y: year, s: state, c: city, d: dates, f: freeDays };
        }

        // V4: Pipe-Format (startet mit "4|")
        if (decoded.startsWith('4|')) {
            const parts = decoded.split('|');
            const year = parseInt('20' + parts[1]);
            const state = parts[2];
            const city = parts[3] || '';
            const dates = decompressRangesToDates(parts[4]);
            const freeDays = parts[5] ? parts[5].split('').map(Number) : [0, 6];
            return { y: year, s: state, c: city, d: dates, f: freeDays };
        }

        // V2/V3: JSON-Format
        const jsonDecoded = decodeURIComponent(decoded);
        const data = JSON.parse(jsonDecoded);

        if (data.v === 3) {
            const dates = decompressRangesToDates(data.d);
            const freeDays = data.f ? data.f.split('').map(Number) : [0, 6];
            return { y: data.y, s: data.s, c: data.c || '', d: dates, f: freeDays };
        }

        if (data.v === 2) {
            const dates = data.d ? data.d.split(',').map(decompressDate) : [];
            const freeDays = data.f ? data.f.split('').map(Number) : [0, 6];
            return { y: data.y, s: data.s, c: data.c || '', d: dates, f: freeDays };
        }

        // V1: Direkt verwenden
        return data;
    } catch (e) {
        // Fallback: Altes V1 Format (normales Base64)
        try {
            const decoded = decodeURIComponent(atob(encoded));
            return JSON.parse(decoded);
        } catch (e2) {
            console.error('Dekodierung fehlgeschlagen:', e2);
            return null;
        }
    }
}

// 9.2. Auswahl in URL-Parameter kodieren (verwendet jetzt V5 - ULTRA-KURZ!)
function encodeSelectionToURL() {
    const encoded = encodeSelectionV5(); // V5 Ultra-Kurz-Format!
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?s=${encoded}`;
}

// 9.3. URL-Parameter beim Laden auswerten (unterstützt V1-V5 Format)
function loadFromSharedURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Unterstütze beide Parameter-Namen: 's' (V2, kurz) und 'share' (V1, alt)
    const shareParam = urlParams.get('s') || urlParams.get('share');

    if (!shareParam) return false;

    try {
        // Verwende die neue decodeSelection() Funktion die V1 und V2 unterstützt
        const data = decodeSelection(shareParam);

        // Validiere Daten
        if (!data || !data.y || !data.s || !data.d) {
            console.error('Ungültige Share-Daten');
            return false;
        }

        // Jahr setzen
        State.selectedYear = parseInt(data.y);
        const yearSelect = document.getElementById('year-select');
        if (yearSelect) yearSelect.value = State.selectedYear;

        // Bundesland setzen
        State.selectedStateId = data.s;
        const stateSelect = document.getElementById('state-select');
        if (stateSelect) stateSelect.value = State.selectedStateId;

        // Stadt setzen (falls vorhanden)
        if (data.c) {
            State.selectedCityId = data.c;
            updateCityDropdown();
            const citySelect = document.getElementById('city-select');
            if (citySelect) {
                citySelect.value = State.selectedCityId;
                citySelect.classList.remove('hidden');
            }
        }

        // Arbeitswoche laden (falls vorhanden)
        if (data.f && Array.isArray(data.f)) {
            State.freeDays = new Set(data.f); // Konvertiere zu Set
            applyFreeDaysToCheckboxes();
        }

        // Ausgewählte Tage laden
        State.selectedDates = new Set(data.d);

        // UI komplett aktualisieren (Kalender, Stats, etc.)
        updateUI();

        // Zeige Hinweis-Banner
        showSharedSelectionBanner(data.d.length);

        // URL bereinigen (Parameter entfernen)
        window.history.replaceState({}, document.title, window.location.pathname);

        return true;
    } catch (e) {
        console.error('Fehler beim Laden der geteilten Auswahl:', e);
        return false;
    }
}

// 9.4. Banner für geladene geteilte Auswahl anzeigen
function showSharedSelectionBanner(daysCount) {
    const banner = document.createElement('div');
    banner.id = 'shared-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 12px 20px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
        <span>✨ Urlaubsplanung geladen: ${daysCount} Tage ausgewählt</span>
        <button onclick="document.getElementById('shared-banner').remove()" style="background: rgba(0,0,0,0.2); border: none; color: white; padding: 5px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">OK</button>
    `;
    document.body.appendChild(banner);

    // Auto-hide nach 8 Sekunden
    setTimeout(() => {
        if (document.getElementById('shared-banner')) {
            banner.style.transition = 'opacity 0.5s';
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 500);
        }
    }, 8000);
}

// 9.5. Teilen-Modal öffnen
function openShareModal() {
    if (State.selectedDates.size === 0) {
        alert('Bitte wähle zuerst Urlaubstage aus, bevor du teilen kannst.');
        return;
    }

    ShareState.generatedLink = encodeSelectionToURL();
    ShareState.shareModalOpen = true;

    // Modal erstellen
    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-backdrop" onclick="closeShareModal()"></div>
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h2>🔗 Urlaubsplanung teilen</h2>
                <button onclick="closeShareModal()" class="share-close-btn">✕</button>
            </div>

            <div class="share-modal-body">
                <p class="share-info">Teile deine Auswahl von <strong>${State.selectedDates.size} Urlaubstagen</strong> mit anderen.</p>

                <div class="share-link-container">
                    <input type="text" id="share-link-input" value="${ShareState.generatedLink}" readonly>
                    <button onclick="copyShareLink()" class="btn-copy" title="Link kopieren">📋</button>
                </div>

                <div class="share-buttons">
                    <button onclick="shareViaWhatsApp()" class="share-btn whatsapp">
                        <span class="share-icon">💬</span>
                        <span>WhatsApp</span>
                    </button>
                    <button onclick="shareNative()" class="share-btn native" id="native-share-btn" style="display: none;">
                        <span class="share-icon">📤</span>
                        <span>Teilen</span>
                    </button>
                </div>

                <hr class="share-divider">

                <h3>📅 Kalender-Export</h3>
                <p class="export-info">Exportiere deine Urlaubstage als iCal-Datei für deinen Kalender.</p>

                <button onclick="exportToIcal()" class="btn-ical">
                    <span>📥 Als .ics herunterladen</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Native Share Button prüfen
    checkNativeShareSupport();

    // Animation
    requestAnimationFrame(() => {
        modal.classList.add('visible');
    });
}

// 9.6. Teilen-Modal schließen
function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    }
    ShareState.shareModalOpen = false;
}

// 9.7. Link kopieren
function copyShareLink() {
    const input = document.getElementById('share-link-input');
    if (input) {
        navigator.clipboard.writeText(input.value).then(() => {
            showShareNotification('✓ Link kopiert!');
        }).catch(() => {
            // Fallback für ältere Browser
            input.select();
            document.execCommand('copy');
            showShareNotification('✓ Link kopiert!');
        });
    }
}

// 9.8. Teilen via WhatsApp
function shareViaWhatsApp() {
    const text = `Schau dir meine Urlaubsplanung an! 🏖️\n${ShareState.generatedLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// 9.9. Native Share API (für Mobile und moderne Browser)
function shareNative() {
    if (navigator.share) {
        navigator.share({
            title: 'Meine Urlaubsplanung - HolidayBoost',
            text: `Schau dir meine Urlaubsplanung an! ${State.selectedDates.size} Urlaubstage optimal genutzt.`,
            url: ShareState.generatedLink
        }).then(() => {
            showShareNotification('Erfolgreich geteilt!');
        }).catch((err) => {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        });
    }
}

// 9.10. Native Share Button anzeigen wenn verfügbar
function checkNativeShareSupport() {
    const nativeBtn = document.getElementById('native-share-btn');
    if (nativeBtn && navigator.share) {
        nativeBtn.style.display = 'flex';
    }
}

// 9.11. Export als iCal (.ics) Datei
function exportToIcal() {
    if (State.selectedDates.size === 0) {
        alert('Keine Urlaubstage ausgewählt.');
        return;
    }

    const periods = getVacationPeriods();

    // iCal Header
    let ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//HolidayBoost//Urlaubsplaner//DE',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:HolidayBoost Urlaub'
    ];

    // Für jeden zusammenhängenden Zeitraum ein Event erstellen
    periods.forEach((period, index) => {
        const startStr = formatIcalDate(period.start);
        const endDate = new Date(period.end);
        endDate.setDate(endDate.getDate() + 1); // iCal DTEND ist exklusiv
        const endStr = formatIcalDate(endDate);

        const uid = `${Date.now()}-${index}@holidayboost.de`;
        const now = formatIcalDateTime(new Date());

        ical.push(
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART;VALUE=DATE:${startStr}`,
            `DTEND;VALUE=DATE:${endStr}`,
            `SUMMARY:Urlaub (${period.totalDays} Tage)`,
            `DESCRIPTION:${period.vacationDays} Urlaubstage → ${period.totalDays} freie Tage\\nGeplant mit HolidayBoost`,
            'STATUS:CONFIRMED',
            'TRANSP:OPAQUE',
            'END:VEVENT'
        );
    });

    // Einzelne Urlaubstage auch als Events (falls gewünscht)
    // Auskommentiert - nur Perioden werden exportiert

    ical.push('END:VCALENDAR');

    // Download
    const blob = new Blob([ical.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HolidayBoost_Urlaub_${State.selectedYear}.ics`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showShareNotification('📅 Kalender-Datei heruntergeladen!');
}

// 9.12. Hilfsfunktion: Datum im iCal-Format (YYYYMMDD)
function formatIcalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 9.13. Hilfsfunktion: Datum+Zeit im iCal-Format (YYYYMMDDTHHMMSSZ)
function formatIcalDateTime(date) {
    return formatIcalDate(date) + 'T' +
           String(date.getUTCHours()).padStart(2, '0') +
           String(date.getUTCMinutes()).padStart(2, '0') +
           String(date.getUTCSeconds()).padStart(2, '0') + 'Z';
}

// 9.14. Benachrichtigung anzeigen
function showShareNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add('visible');
    });

    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// 9.15. Teilen-Button zum Header hinzufügen (Mobile: oben rechts neben Reisetipps)
function initShareModule() {
    // Button nach dem Reisetipps-Button im Header einfügen
    const travelTipsBtn = document.getElementById('travel-tips-btn');
    if (travelTipsBtn && !document.getElementById('share-header-btn')) {
        const shareBtn = document.createElement('button');
        shareBtn.id = 'share-header-btn';
        shareBtn.className = 'share-header-btn';
        shareBtn.innerHTML = '🔗';
        shareBtn.onclick = openShareModal;
        shareBtn.title = 'Urlaubsplanung teilen';

        // Nach dem Reisetipps-Button einfügen
        travelTipsBtn.parentNode.insertBefore(shareBtn, travelTipsBtn.nextSibling);
    }

    // Prüfe auf geteilten Link beim Laden
    loadFromSharedURL();
}

// Starte Anwendung wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initWorkweekSettings();
    initTravelTipsModule();
    initShareModule();
});

// DEBUG: Flächendeckender Test - Aufruf in Browser-Konsole: runFullTest()
window.runFullTest = function() {
    console.log('=== FLÄCHENDECKENDER TEST ===\n');

    const testCases = [
        { year: 2026, state: 'RP', city: null, name: 'Rheinland-Pfalz 2026' },
        { year: 2026, state: 'BY', city: null, name: 'Bayern 2026' },
        { year: 2025, state: 'NW', city: null, name: 'NRW 2025' },
        { year: 2027, state: 'HE', city: null, name: 'Hessen 2027' },
        { year: 2026, state: 'BY', city: 'augsburg', name: 'Bayern Augsburg 2026' }
    ];

    let allPassed = true;

    testCases.forEach(tc => {
        console.log(`--- ${tc.name} ---`);

        // Teste 16+ Perioden
        const periods16 = generateExtendedPeriods(tc.year, tc.state, tc.city, 16);

        // Finde Ostern-Karte
        const osternCard = periods16.find(p =>
            p.title.includes('Karfreitag') || p.title.includes('Ostermontag')
        );

        if (osternCard) {
            console.log(`  Ostern: ${osternCard.totalFreeDays} Tage, ${osternCard.vacationDaysNeeded} UT, ${osternCard.efficiency.toFixed(1)}x`);
            console.log(`  Zeitraum: ${osternCard.period}`);

            if (osternCard.totalFreeDays >= 16 && osternCard.totalFreeDays <= 17) {
                console.log('  ✓ Natürliche 16-17 Tage Periode');
            } else if (osternCard.totalFreeDays > 20) {
                console.log('  ⚠ FEHLER: Künstlich erweitert auf ' + osternCard.totalFreeDays + ' Tage!');
                allPassed = false;
            }
        }

        // Mega-Kombinationen
        const megaCards = periods16.filter(p => p.id.startsWith('mega-'));
        console.log(`  Mega-Kombinationen: ${megaCards.length}`);
        megaCards.forEach(m => {
            const hasWeekdayHoliday = m.holidays.length > 0;
            console.log(`    - ${m.title}: ${m.totalFreeDays}T, ${m.efficiency.toFixed(1)}x`);
        });

        // Brückentage
        const bridges = generateBridgeDayRecommendations(tc.year, tc.state, tc.city);
        console.log(`  Brückentage: ${bridges.length}`);

        // 9-15 Tage
        const periods9 = generateExtendedPeriods(tc.year, tc.state, tc.city, 9);

        // Prüfe ob 16+ Perioden fälschlicherweise in 9-15 sind
        const wrongCategory = periods9.filter(p => p.totalFreeDays > 15);
        if (wrongCategory.length > 0) {
            console.log(`  ⚠ FEHLER: ${wrongCategory.length} Perioden > 15 Tage in 9-15 Kategorie!`);
            wrongCategory.forEach(w => console.log(`    - ${w.title}: ${w.totalFreeDays} Tage`));
            allPassed = false;
        } else {
            console.log('  ✓ Keine falschen Kategorien');
        }

        console.log('');
    });

    console.log('=== TEST ERGEBNIS ===');
    if (allPassed) {
        console.log('✓ ALLE TESTS BESTANDEN!');
    } else {
        console.log('⚠ EINIGE TESTS FEHLGESCHLAGEN!');
    }

    return allPassed;
};

// MODULE 10: SCHULFERIEN (School Holidays Module)
// Statische, verifizierte Daten basierend auf offiziellen Quellen (KMK, Kultusministerien)
// Keine externen APIs mehr - nur offizielle, feste Schulferien (keine "beweglichen Ferientage")

// 10.1. Statische Schulferien-Daten 2025-2029 für alle 16 Bundesländer
const SCHOOL_HOLIDAYS_DATA = {
    'BW': { // Baden-Württemberg
        2025: [
            { start: '2025-04-14', end: '2025-04-26', name: 'Osterferien' },
            { start: '2025-06-10', end: '2025-06-20', name: 'Pfingstferien' },
            { start: '2025-07-31', end: '2025-09-13', name: 'Sommerferien' },
            { start: '2025-10-27', end: '2025-10-30', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-05', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-03-30', end: '2026-04-11', name: 'Osterferien' },
            { start: '2026-05-26', end: '2026-06-05', name: 'Pfingstferien' },
            { start: '2026-07-30', end: '2026-09-12', name: 'Sommerferien' },
            { start: '2026-10-26', end: '2026-10-30', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-09', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-03-25', end: '2027-04-03', name: 'Osterferien' },
            { start: '2027-05-18', end: '2027-05-29', name: 'Pfingstferien' },
            { start: '2027-07-29', end: '2027-09-11', name: 'Sommerferien' },
            { start: '2027-11-02', end: '2027-11-06', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-08', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-04-13', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-06-06', end: '2028-06-17', name: 'Pfingstferien' },
            { start: '2028-07-27', end: '2028-09-09', name: 'Sommerferien' },
            { start: '2028-10-30', end: '2028-11-03', name: 'Herbstferien' },
            { start: '2028-12-23', end: '2029-01-05', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-03-26', end: '2029-04-07', name: 'Osterferien' },
            { start: '2029-05-22', end: '2029-06-01', name: 'Pfingstferien' },
            { start: '2029-07-26', end: '2029-09-08', name: 'Sommerferien' },
            { start: '2029-10-29', end: '2029-11-02', name: 'Herbstferien' },
            { start: '2029-12-22', end: '2030-01-05', name: 'Weihnachtsferien' }
        ]
    },
    'BY': { // Bayern
        2025: [
            { start: '2025-03-03', end: '2025-03-07', name: 'Winterferien' },
            { start: '2025-04-14', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-06-10', end: '2025-06-20', name: 'Pfingstferien' },
            { start: '2025-08-01', end: '2025-09-15', name: 'Sommerferien' },
            { start: '2025-11-03', end: '2025-11-07', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-05', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-16', end: '2026-02-20', name: 'Winterferien' },
            { start: '2026-03-30', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-05-26', end: '2026-06-05', name: 'Pfingstferien' },
            { start: '2026-08-03', end: '2026-09-14', name: 'Sommerferien' },
            { start: '2026-11-02', end: '2026-11-06', name: 'Herbstferien' },
            { start: '2026-12-24', end: '2027-01-08', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-08', end: '2027-02-12', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-04-02', name: 'Osterferien' },
            { start: '2027-05-18', end: '2027-05-28', name: 'Pfingstferien' },
            { start: '2027-08-02', end: '2027-09-13', name: 'Sommerferien' },
            { start: '2027-11-02', end: '2027-11-05', name: 'Herbstferien' },
            { start: '2027-12-24', end: '2028-01-07', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-02-28', end: '2028-03-03', name: 'Winterferien' },
            { start: '2028-04-10', end: '2028-04-21', name: 'Osterferien' },
            { start: '2028-06-06', end: '2028-06-16', name: 'Pfingstferien' },
            { start: '2028-07-31', end: '2028-09-11', name: 'Sommerferien' },
            { start: '2028-10-30', end: '2028-11-03', name: 'Herbstferien' },
            { start: '2028-12-23', end: '2029-01-05', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-12', end: '2029-02-16', name: 'Winterferien' },
            { start: '2029-03-26', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-05-22', end: '2029-06-01', name: 'Pfingstferien' },
            { start: '2029-07-30', end: '2029-09-10', name: 'Sommerferien' },
            { start: '2029-10-29', end: '2029-11-02', name: 'Herbstferien' },
            { start: '2029-12-24', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'BE': { // Berlin
        2025: [
            { start: '2025-02-03', end: '2025-02-08', name: 'Winterferien' },
            { start: '2025-04-14', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-07-24', end: '2025-09-06', name: 'Sommerferien' },
            { start: '2025-10-20', end: '2025-11-01', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-02', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-02', end: '2026-02-07', name: 'Winterferien' },
            { start: '2026-03-30', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-07-09', end: '2026-08-22', name: 'Sommerferien' },
            { start: '2026-10-19', end: '2026-10-31', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-02', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-06', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-04-02', name: 'Osterferien' },
            { start: '2027-07-01', end: '2027-08-14', name: 'Sommerferien' },
            { start: '2027-10-11', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-22', end: '2027-12-31', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-01-31', end: '2028-02-05', name: 'Winterferien' },
            { start: '2028-04-10', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-07-01', end: '2028-08-12', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-10-14', name: 'Herbstferien' },
            { start: '2028-12-22', end: '2029-01-02', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-01-29', end: '2029-02-03', name: 'Winterferien' },
            { start: '2029-03-26', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-07-01', end: '2029-08-11', name: 'Sommerferien' },
            { start: '2029-10-01', end: '2029-10-12', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'BB': { // Brandenburg
        2025: [
            { start: '2025-02-03', end: '2025-02-08', name: 'Winterferien' },
            { start: '2025-04-14', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-07-24', end: '2025-09-06', name: 'Sommerferien' },
            { start: '2025-10-20', end: '2025-11-01', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-02', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-02', end: '2026-02-07', name: 'Winterferien' },
            { start: '2026-03-30', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-07-09', end: '2026-08-22', name: 'Sommerferien' },
            { start: '2026-10-19', end: '2026-10-30', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-02', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-06', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-04-03', name: 'Osterferien' },
            { start: '2027-07-01', end: '2027-08-14', name: 'Sommerferien' },
            { start: '2027-10-11', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2027-12-31', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-01-31', end: '2028-02-05', name: 'Winterferien' },
            { start: '2028-04-10', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-06-29', end: '2028-08-12', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-10-14', name: 'Herbstferien' },
            { start: '2028-12-22', end: '2029-01-02', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-01-29', end: '2029-02-03', name: 'Winterferien' },
            { start: '2029-03-26', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-06-28', end: '2029-08-11', name: 'Sommerferien' },
            { start: '2029-10-01', end: '2029-10-12', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'HB': { // Bremen
        2025: [
            { start: '2025-02-03', end: '2025-02-04', name: 'Winterferien' },
            { start: '2025-04-07', end: '2025-04-19', name: 'Osterferien' },
            { start: '2025-07-03', end: '2025-08-13', name: 'Sommerferien' },
            { start: '2025-10-13', end: '2025-10-25', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-05', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-02', end: '2026-02-03', name: 'Winterferien' },
            { start: '2026-03-23', end: '2026-04-07', name: 'Osterferien' },
            { start: '2026-07-02', end: '2026-08-12', name: 'Sommerferien' },
            { start: '2026-10-12', end: '2026-10-24', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-09', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-02', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-04-03', name: 'Osterferien' },
            { start: '2027-07-08', end: '2027-08-18', name: 'Sommerferien' },
            { start: '2027-10-18', end: '2027-10-30', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-08', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-01-31', end: '2028-02-01', name: 'Winterferien' },
            { start: '2028-04-10', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-07-20', end: '2028-08-30', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-11-04', name: 'Herbstferien' },
            { start: '2028-12-27', end: '2029-01-06', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-01', end: '2029-02-02', name: 'Winterferien' },
            { start: '2029-03-19', end: '2029-04-03', name: 'Osterferien' },
            { start: '2029-07-19', end: '2029-08-29', name: 'Sommerferien' },
            { start: '2029-10-04', end: '2029-10-05', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-05', name: 'Weihnachtsferien' }
        ]
    },
    'HH': { // Hamburg
        2025: [
            { start: '2025-01-31', end: '2025-01-31', name: 'Winterferien' },
            { start: '2025-03-10', end: '2025-03-21', name: 'Frühjahrsferien' },
            { start: '2025-05-02', end: '2025-05-30', name: 'Pfingstferien' },
            { start: '2025-07-24', end: '2025-09-03', name: 'Sommerferien' },
            { start: '2025-10-20', end: '2025-10-31', name: 'Herbstferien' },
            { start: '2025-12-17', end: '2026-01-02', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-01-30', end: '2026-01-30', name: 'Winterferien' },
            { start: '2026-03-02', end: '2026-03-13', name: 'Frühjahrsferien' },
            { start: '2026-05-11', end: '2026-05-15', name: 'Pfingstferien' },
            { start: '2026-07-09', end: '2026-08-19', name: 'Sommerferien' },
            { start: '2026-10-19', end: '2026-10-30', name: 'Herbstferien' },
            { start: '2026-12-21', end: '2027-01-01', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-01-29', end: '2027-01-29', name: 'Winterferien' },
            { start: '2027-03-01', end: '2027-03-12', name: 'Frühjahrsferien' },
            { start: '2027-05-07', end: '2027-05-15', name: 'Pfingstferien' },
            { start: '2027-07-01', end: '2027-08-11', name: 'Sommerferien' },
            { start: '2027-10-11', end: '2027-10-22', name: 'Herbstferien' },
            { start: '2027-12-20', end: '2027-12-31', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-01-28', end: '2028-01-28', name: 'Winterferien' },
            { start: '2028-03-06', end: '2028-03-17', name: 'Frühjahrsferien' },
            { start: '2028-05-22', end: '2028-05-26', name: 'Pfingstferien' },
            { start: '2028-07-03', end: '2028-08-11', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-10-13', name: 'Herbstferien' },
            { start: '2028-12-18', end: '2028-12-31', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-02', end: '2029-02-02', name: 'Winterferien' },
            { start: '2029-03-05', end: '2029-03-16', name: 'Frühjahrsferien' },
            { start: '2029-05-11', end: '2029-05-18', name: 'Pfingstferien' },
            { start: '2029-07-02', end: '2029-08-10', name: 'Sommerferien' },
            { start: '2029-10-01', end: '2029-10-12', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'HE': { // Hessen
        2025: [
            { start: '2025-04-07', end: '2025-04-21', name: 'Osterferien' },
            { start: '2025-07-07', end: '2025-08-15', name: 'Sommerferien' },
            { start: '2025-10-06', end: '2025-10-18', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-10', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-03-30', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-06-29', end: '2026-08-07', name: 'Sommerferien' },
            { start: '2026-10-05', end: '2026-10-17', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-12', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-03-22', end: '2027-04-02', name: 'Osterferien' },
            { start: '2027-06-28', end: '2027-08-06', name: 'Sommerferien' },
            { start: '2027-10-04', end: '2027-10-16', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-11', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-04-03', end: '2028-04-14', name: 'Osterferien' },
            { start: '2028-07-03', end: '2028-08-11', name: 'Sommerferien' },
            { start: '2028-10-09', end: '2028-10-20', name: 'Herbstferien' },
            { start: '2028-12-27', end: '2029-01-12', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-03-29', end: '2029-04-13', name: 'Osterferien' },
            { start: '2029-07-16', end: '2029-08-24', name: 'Sommerferien' },
            { start: '2029-10-15', end: '2029-10-26', name: 'Herbstferien' },
            { start: '2029-12-24', end: '2030-01-11', name: 'Weihnachtsferien' }
        ]
    },
    'MV': { // Mecklenburg-Vorpommern
        2025: [
            { start: '2025-02-03', end: '2025-02-14', name: 'Winterferien' },
            { start: '2025-04-14', end: '2025-04-23', name: 'Osterferien' },
            { start: '2025-06-06', end: '2025-06-10', name: 'Pfingstferien' },
            { start: '2025-07-28', end: '2025-09-06', name: 'Sommerferien' },
            { start: '2025-10-02', end: '2025-10-24', name: 'Herbstferien' },
            { start: '2025-12-20', end: '2026-01-03', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-09', end: '2026-02-20', name: 'Winterferien' },
            { start: '2026-03-30', end: '2026-04-08', name: 'Osterferien' },
            { start: '2026-05-22', end: '2026-05-26', name: 'Pfingstferien' },
            { start: '2026-07-13', end: '2026-08-22', name: 'Sommerferien' },
            { start: '2026-10-15', end: '2026-10-24', name: 'Herbstferien' },
            { start: '2026-12-21', end: '2027-01-02', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-08', end: '2027-02-19', name: 'Winterferien' },
            { start: '2027-03-24', end: '2027-04-02', name: 'Osterferien' },
            { start: '2027-05-14', end: '2027-05-18', name: 'Pfingstferien' },
            { start: '2027-07-05', end: '2027-08-14', name: 'Sommerferien' },
            { start: '2027-10-14', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-22', end: '2028-01-04', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-02-05', end: '2028-02-17', name: 'Winterferien' },
            { start: '2028-04-12', end: '2028-04-21', name: 'Osterferien' },
            { start: '2028-06-02', end: '2028-06-06', name: 'Pfingstferien' },
            { start: '2028-06-26', end: '2028-08-05', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-10-28', name: 'Herbstferien' },
            { start: '2028-12-22', end: '2029-01-02', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-05', end: '2029-02-16', name: 'Winterferien' },
            { start: '2029-03-28', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-05-18', end: '2029-05-22', name: 'Pfingstferien' },
            { start: '2029-06-18', end: '2029-07-28', name: 'Sommerferien' },
            { start: '2029-10-22', end: '2029-10-27', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'NI': { // Niedersachsen
        2025: [
            { start: '2025-02-03', end: '2025-02-04', name: 'Winterferien' },
            { start: '2025-04-07', end: '2025-04-19', name: 'Osterferien' },
            { start: '2025-07-03', end: '2025-08-13', name: 'Sommerferien' },
            { start: '2025-10-13', end: '2025-10-25', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-05', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-02', end: '2026-02-03', name: 'Winterferien' },
            { start: '2026-03-23', end: '2026-04-07', name: 'Osterferien' },
            { start: '2026-07-02', end: '2026-08-12', name: 'Sommerferien' },
            { start: '2026-10-12', end: '2026-10-24', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-09', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-02', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-04-03', name: 'Osterferien' },
            { start: '2027-07-08', end: '2027-08-18', name: 'Sommerferien' },
            { start: '2027-10-16', end: '2027-10-30', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-08', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-01-31', end: '2028-02-01', name: 'Winterferien' },
            { start: '2028-04-10', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-07-20', end: '2028-08-30', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-11-04', name: 'Herbstferien' },
            { start: '2028-12-27', end: '2029-01-06', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-01', end: '2029-02-02', name: 'Winterferien' },
            { start: '2029-03-19', end: '2029-04-03', name: 'Osterferien' },
            { start: '2029-07-19', end: '2029-08-29', name: 'Sommerferien' },
            { start: '2029-10-04', end: '2029-10-05', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-05', name: 'Weihnachtsferien' }
        ]
    },
    'NW': { // Nordrhein-Westfalen
        2025: [
            { start: '2025-04-14', end: '2025-04-26', name: 'Osterferien' },
            { start: '2025-07-14', end: '2025-08-26', name: 'Sommerferien' },
            { start: '2025-10-13', end: '2025-10-25', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-06', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-03-30', end: '2026-04-11', name: 'Osterferien' },
            { start: '2026-07-20', end: '2026-09-01', name: 'Sommerferien' },
            { start: '2026-10-17', end: '2026-10-31', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-06', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-03-22', end: '2027-04-03', name: 'Osterferien' },
            { start: '2027-07-19', end: '2027-08-31', name: 'Sommerferien' },
            { start: '2027-10-23', end: '2027-11-06', name: 'Herbstferien' },
            { start: '2027-12-24', end: '2028-01-08', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-04-10', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-07-10', end: '2028-08-22', name: 'Sommerferien' },
            { start: '2028-10-23', end: '2028-11-04', name: 'Herbstferien' },
            { start: '2028-12-21', end: '2029-01-05', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-03-26', end: '2029-04-07', name: 'Osterferien' },
            { start: '2029-07-02', end: '2029-08-14', name: 'Sommerferien' },
            { start: '2029-10-15', end: '2029-10-27', name: 'Herbstferien' },
            { start: '2029-12-20', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'RP': { // Rheinland-Pfalz
        2025: [
            { start: '2025-04-14', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-07-07', end: '2025-08-15', name: 'Sommerferien' },
            { start: '2025-10-13', end: '2025-10-24', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-07', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-03-30', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-06-29', end: '2026-08-07', name: 'Sommerferien' },
            { start: '2026-10-05', end: '2026-10-16', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-08', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-03-22', end: '2027-04-02', name: 'Osterferien' },
            { start: '2027-06-28', end: '2027-08-06', name: 'Sommerferien' },
            { start: '2027-10-04', end: '2027-10-15', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-07', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-04-10', end: '2028-04-21', name: 'Osterferien' },
            { start: '2028-07-03', end: '2028-08-11', name: 'Sommerferien' },
            { start: '2028-10-09', end: '2028-10-20', name: 'Herbstferien' },
            { start: '2028-12-21', end: '2029-01-08', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-03-26', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-07-16', end: '2029-08-24', name: 'Sommerferien' },
            { start: '2029-10-22', end: '2029-11-02', name: 'Herbstferien' },
            { start: '2029-12-24', end: '2030-01-09', name: 'Weihnachtsferien' }
        ]
    },
    'SL': { // Saarland
        2025: [
            { start: '2025-02-24', end: '2025-03-04', name: 'Winterferien' },
            { start: '2025-04-14', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-07-07', end: '2025-08-14', name: 'Sommerferien' },
            { start: '2025-10-13', end: '2025-10-24', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-02', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-16', end: '2026-02-20', name: 'Winterferien' },
            { start: '2026-04-07', end: '2026-04-17', name: 'Osterferien' },
            { start: '2026-06-29', end: '2026-08-07', name: 'Sommerferien' },
            { start: '2026-10-05', end: '2026-10-16', name: 'Herbstferien' },
            { start: '2026-12-21', end: '2026-12-31', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-08', end: '2027-02-12', name: 'Winterferien' },
            { start: '2027-03-30', end: '2027-04-09', name: 'Osterferien' },
            { start: '2027-06-28', end: '2027-08-06', name: 'Sommerferien' },
            { start: '2027-10-04', end: '2027-10-15', name: 'Herbstferien' },
            { start: '2027-12-20', end: '2027-12-31', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-02-21', end: '2028-02-29', name: 'Winterferien' },
            { start: '2028-04-12', end: '2028-04-21', name: 'Osterferien' },
            { start: '2028-07-03', end: '2028-08-11', name: 'Sommerferien' },
            { start: '2028-10-09', end: '2028-10-20', name: 'Herbstferien' },
            { start: '2028-12-20', end: '2029-01-02', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-12', end: '2029-02-16', name: 'Winterferien' },
            { start: '2029-03-26', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-05-22', end: '2029-05-25', name: 'Pfingstferien' },
            { start: '2029-07-16', end: '2029-08-24', name: 'Sommerferien' },
            { start: '2029-10-22', end: '2029-11-02', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'SN': { // Sachsen
        2025: [
            { start: '2025-02-17', end: '2025-03-01', name: 'Winterferien' },
            { start: '2025-04-18', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-06-28', end: '2025-08-08', name: 'Sommerferien' },
            { start: '2025-10-06', end: '2025-10-18', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-02', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-09', end: '2026-02-21', name: 'Winterferien' },
            { start: '2026-04-03', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-07-04', end: '2026-08-14', name: 'Sommerferien' },
            { start: '2026-10-12', end: '2026-10-24', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-02', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-08', end: '2027-02-19', name: 'Winterferien' },
            { start: '2027-03-26', end: '2027-04-02', name: 'Osterferien' },
            { start: '2027-05-15', end: '2027-05-18', name: 'Pfingstferien' },
            { start: '2027-07-10', end: '2027-08-20', name: 'Sommerferien' },
            { start: '2027-10-11', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-01', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-02-14', end: '2028-02-26', name: 'Winterferien' },
            { start: '2028-04-14', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-07-22', end: '2028-09-01', name: 'Sommerferien' },
            { start: '2028-10-23', end: '2028-11-03', name: 'Herbstferien' },
            { start: '2028-12-23', end: '2029-01-03', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-05', end: '2029-02-16', name: 'Winterferien' },
            { start: '2029-03-29', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-05-19', end: '2029-05-22', name: 'Pfingstferien' },
            { start: '2029-07-21', end: '2029-08-31', name: 'Sommerferien' },
            { start: '2029-10-22', end: '2029-11-02', name: 'Herbstferien' },
            { start: '2029-12-22', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    },
    'ST': { // Sachsen-Anhalt
        2025: [
            { start: '2025-01-27', end: '2025-01-31', name: 'Winterferien' },
            { start: '2025-04-07', end: '2025-04-19', name: 'Osterferien' },
            { start: '2025-06-28', end: '2025-08-08', name: 'Sommerferien' },
            { start: '2025-10-13', end: '2025-10-25', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-05', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-01-31', end: '2026-02-06', name: 'Winterferien' },
            { start: '2026-03-30', end: '2026-04-04', name: 'Osterferien' },
            { start: '2026-05-26', end: '2026-05-29', name: 'Pfingstferien' },
            { start: '2026-07-04', end: '2026-08-14', name: 'Sommerferien' },
            { start: '2026-10-19', end: '2026-10-30', name: 'Herbstferien' },
            { start: '2026-12-21', end: '2027-01-02', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-06', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-03-27', name: 'Osterferien' },
            { start: '2027-05-15', end: '2027-05-22', name: 'Pfingstferien' },
            { start: '2027-07-10', end: '2027-08-20', name: 'Sommerferien' },
            { start: '2027-10-18', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-20', end: '2027-12-31', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-02-07', end: '2028-02-12', name: 'Winterferien' },
            { start: '2028-04-10', end: '2028-04-22', name: 'Osterferien' },
            { start: '2028-06-03', end: '2028-06-10', name: 'Pfingstferien' },
            { start: '2028-07-22', end: '2028-09-01', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-11-03', name: 'Herbstferien' },
            { start: '2028-12-21', end: '2029-01-02', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-05', end: '2029-02-10', name: 'Winterferien' },
            { start: '2029-03-26', end: '2029-03-31', name: 'Osterferien' },
            { start: '2029-05-11', end: '2029-05-25', name: 'Pfingstferien' },
            { start: '2029-07-21', end: '2029-08-31', name: 'Sommerferien' },
            { start: '2029-10-29', end: '2029-11-02', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-05', name: 'Weihnachtsferien' }
        ]
    },
    'SH': { // Schleswig-Holstein
        2025: [
            { start: '2025-04-11', end: '2025-04-25', name: 'Osterferien' },
            { start: '2025-07-28', end: '2025-09-06', name: 'Sommerferien' },
            { start: '2025-10-20', end: '2025-10-30', name: 'Herbstferien' },
            { start: '2025-12-19', end: '2026-01-06', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-02', end: '2026-02-03', name: 'Winterferien' },
            { start: '2026-03-26', end: '2026-04-10', name: 'Osterferien' },
            { start: '2026-07-04', end: '2026-08-15', name: 'Sommerferien' },
            { start: '2026-10-12', end: '2026-10-24', name: 'Herbstferien' },
            { start: '2026-12-21', end: '2027-01-06', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-02', name: 'Winterferien' },
            { start: '2027-03-30', end: '2027-04-10', name: 'Osterferien' },
            { start: '2027-07-03', end: '2027-08-14', name: 'Sommerferien' },
            { start: '2027-10-11', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2028-01-08', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-01-31', end: '2028-01-31', name: 'Winterferien' },
            { start: '2028-04-03', end: '2028-04-15', name: 'Osterferien' },
            { start: '2028-06-24', end: '2028-08-04', name: 'Sommerferien' },
            { start: '2028-10-02', end: '2028-10-30', name: 'Herbstferien' },
            { start: '2028-12-21', end: '2029-01-05', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-01-29', end: '2029-01-29', name: 'Winterferien' },
            { start: '2029-03-23', end: '2029-04-06', name: 'Osterferien' },
            { start: '2029-06-23', end: '2029-08-03', name: 'Sommerferien' },
            { start: '2029-10-08', end: '2029-10-19', name: 'Herbstferien' },
            { start: '2029-12-21', end: '2030-01-08', name: 'Weihnachtsferien' }
        ]
    },
    'TH': { // Thüringen
        2025: [
            { start: '2025-02-03', end: '2025-02-08', name: 'Winterferien' },
            { start: '2025-04-07', end: '2025-04-19', name: 'Osterferien' },
            { start: '2025-06-28', end: '2025-08-08', name: 'Sommerferien' },
            { start: '2025-10-06', end: '2025-10-18', name: 'Herbstferien' },
            { start: '2025-12-22', end: '2026-01-03', name: 'Weihnachtsferien' }
        ],
        2026: [
            { start: '2026-02-16', end: '2026-02-21', name: 'Winterferien' },
            { start: '2026-04-07', end: '2026-04-17', name: 'Osterferien' },
            { start: '2026-07-04', end: '2026-08-14', name: 'Sommerferien' },
            { start: '2026-10-12', end: '2026-10-24', name: 'Herbstferien' },
            { start: '2026-12-23', end: '2027-01-02', name: 'Weihnachtsferien' }
        ],
        2027: [
            { start: '2027-02-01', end: '2027-02-06', name: 'Winterferien' },
            { start: '2027-03-22', end: '2027-04-03', name: 'Osterferien' },
            { start: '2027-07-10', end: '2027-08-20', name: 'Sommerferien' },
            { start: '2027-10-09', end: '2027-10-23', name: 'Herbstferien' },
            { start: '2027-12-23', end: '2027-12-31', name: 'Weihnachtsferien' }
        ],
        2028: [
            { start: '2028-02-07', end: '2028-02-12', name: 'Winterferien' },
            { start: '2028-04-03', end: '2028-04-15', name: 'Osterferien' },
            { start: '2028-07-22', end: '2028-09-01', name: 'Sommerferien' },
            { start: '2028-10-23', end: '2028-11-03', name: 'Herbstferien' },
            { start: '2028-12-23', end: '2029-01-05', name: 'Weihnachtsferien' }
        ],
        2029: [
            { start: '2029-02-12', end: '2029-02-17', name: 'Winterferien' },
            { start: '2029-03-26', end: '2029-04-07', name: 'Osterferien' },
            { start: '2029-07-21', end: '2029-08-31', name: 'Sommerferien' },
            { start: '2029-10-22', end: '2029-11-03', name: 'Herbstferien' },
            { start: '2029-12-22', end: '2030-01-04', name: 'Weihnachtsferien' }
        ]
    }
};

// 10.2. Holt Schulferien aus statischen Daten (ersetzt API-Aufrufe)
function getSchoolHolidaysFromStaticData(stateCode, year) {
    const stateData = SCHOOL_HOLIDAYS_DATA[stateCode];
    if (!stateData) {
        console.warn(`Keine Schulferien-Daten für Bundesland: ${stateCode}`);
        return [];
    }

    const yearData = stateData[year];
    if (!yearData) {
        console.warn(`Keine Schulferien-Daten für ${stateCode}/${year}`);
        return [];
    }

    // Füge stateCode und year zu jedem Eintrag hinzu
    return yearData.map(holiday => ({
        ...holiday,
        stateCode: stateCode,
        year: year
    }));
}

// 10.3. Haupt-Ladefunktion: Schulferien für ein Jahr laden (aus statischen Daten)
async function fetchSchoolHolidays(stateCode, year) {
    const cacheKey = `${stateCode}-${year}`;

    // Prüfe Cache
    if (State.schoolHolidaysData.has(cacheKey)) {
        return State.schoolHolidaysData.get(cacheKey);
    }

    // Hole Daten aus statischem Objekt
    const holidays = getSchoolHolidaysFromStaticData(stateCode, year);

    // In Cache speichern
    State.schoolHolidaysData.set(cacheKey, holidays);

    return holidays;
}

// 10.4. Lädt Schulferien für aktuelles Jahr + 4 Jahre (2025-2029)
async function loadSchoolHolidaysForRange(stateCode) {
    if (State.schoolHolidaysLoading) return;

    State.schoolHolidaysLoading = true;
    updateSchoolHolidaysButton();

    // Statische Daten verfügbar für 2025-2029
    const years = [2025, 2026, 2027, 2028, 2029];

    try {
        // Lade alle Jahre (aus statischen Daten - kein API-Aufruf)
        await Promise.all(years.map(year => fetchSchoolHolidays(stateCode, year)));
        console.log(`Schulferien geladen für ${stateCode}: ${years.join(', ')} (statische Daten)`);
    } catch (error) {
        console.error('Fehler beim Laden der Schulferien:', error);
    } finally {
        State.schoolHolidaysLoading = false;
        updateSchoolHolidaysButton();
        renderCalendar(State.selectedYear);
    }
}

// 10.5. Prüft ob ein Datum in Schulferien liegt
function getSchoolHolidayInfo(dateString) {
    if (!State.schoolHolidaysVisible) return null;

    const date = new Date(dateString);
    const year = date.getFullYear();

    // Prüfe aktuelles Jahr UND vorheriges Jahr (für Ferien über Jahreswechsel wie Weihnachtsferien)
    const yearsToCheck = [year, year - 1];

    for (const checkYear of yearsToCheck) {
        const cacheKey = `${State.selectedStateId}-${checkYear}`;
        const holidays = State.schoolHolidaysData.get(cacheKey);

        if (!holidays) continue;

        for (const holiday of holidays) {
            const start = new Date(holiday.start);
            const end = new Date(holiday.end);

            // Setze Zeit auf Mitternacht für korrekten Vergleich
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            const checkDate = new Date(dateString);
            checkDate.setHours(12, 0, 0, 0);

            if (checkDate >= start && checkDate <= end) {
                return {
                    name: holiday.name,
                    start: holiday.start,
                    end: holiday.end
                };
            }
        }
    }

    return null;
}

// 10.6. Toggle Schulferien-Anzeige
async function toggleSchoolHolidays() {
    State.schoolHolidaysVisible = !State.schoolHolidaysVisible;

    // Speichere Präferenz
    saveSchoolHolidaysPreference();

    // Button-Status aktualisieren
    updateSchoolHolidaysButton();

    // Legende aktualisieren
    updateSchoolHolidaysLegend();

    if (State.schoolHolidaysVisible) {
        // Zeige Hint beim ersten Aktivieren
        showSchoolHolidaysHint();

        // Prüfe ob Daten für aktuelles Bundesland vorhanden
        const currentYear = new Date().getFullYear();
        const cacheKey = `${State.selectedStateId}-${currentYear}`;

        if (!State.schoolHolidaysData.has(cacheKey)) {
            // Lade Schulferien
            await loadSchoolHolidaysForRange(State.selectedStateId);
        } else {
            // Nur neu rendern wenn Daten bereits vorhanden
            renderCalendar(State.selectedYear);
        }
    } else {
        // Schulferien ausblenden - Kalender neu rendern
        renderCalendar(State.selectedYear);
    }
}

// 10.7. Button-Status aktualisieren
function updateSchoolHolidaysButton() {
    const btn = document.getElementById('school-holidays-btn');
    if (!btn) return;

    if (State.schoolHolidaysLoading) {
        btn.classList.add('loading');
        btn.title = 'Schulferien werden geladen...';
    } else {
        btn.classList.remove('loading');
        btn.classList.toggle('active', State.schoolHolidaysVisible);
        btn.title = State.schoolHolidaysVisible ? 'Schulferien ausblenden' : 'Schulferien anzeigen';
    }
}

// 10.8. Legende aktualisieren
function updateSchoolHolidaysLegend() {
    const legendItem = document.querySelector('.legend-school-holidays');
    if (!legendItem) return;

    if (State.schoolHolidaysVisible) {
        legendItem.classList.remove('hidden');
    } else {
        legendItem.classList.add('hidden');
    }
}

// 10.9. Präferenz speichern
function saveSchoolHolidaysPreference() {
    try {
        localStorage.setItem('holidayboost_schoolholidays', State.schoolHolidaysVisible ? '1' : '0');
    } catch (e) {
        console.warn('Konnte Schulferien-Präferenz nicht speichern');
    }
}

// 10.10. Präferenz laden
function loadSchoolHolidaysPreference() {
    try {
        const saved = localStorage.getItem('holidayboost_schoolholidays');
        if (saved === '1') {
            State.schoolHolidaysVisible = true;
            updateSchoolHolidaysButton();
            updateSchoolHolidaysLegend();
            // Lade Schulferien im Hintergrund
            loadSchoolHolidaysForRange(State.selectedStateId);
        }
    } catch (e) {
        console.warn('Konnte Schulferien-Präferenz nicht laden');
    }
}

// 10.11. Initialisierung der Schulferien-Funktionalität
function initSchoolHolidays() {
    const btn = document.getElementById('school-holidays-btn');
    if (btn) {
        btn.addEventListener('click', toggleSchoolHolidays);
    }

    // Lade gespeicherte Präferenz
    loadSchoolHolidaysPreference();
}

// 10.12. Bei Bundesland-Wechsel: Neue Schulferien laden falls sichtbar
function onStateChangeSchoolHolidays(newStateId) {
    if (State.schoolHolidaysVisible) {
        const currentYear = new Date().getFullYear();
        const cacheKey = `${newStateId}-${currentYear}`;

        if (!State.schoolHolidaysData.has(cacheKey)) {
            loadSchoolHolidaysForRange(newStateId);
        }
    }
}

// 10.13. Schulferien-Hint anzeigen (einmalig beim ersten Aktivieren)
function showSchoolHolidaysHint() {
    // Prüfe ob Hint bereits gezeigt wurde
    const hintShown = localStorage.getItem('holidayboost_schoolhint_shown');
    if (hintShown) return;

    const hint = document.getElementById('school-holidays-hint');
    if (!hint) return;

    // Hint anzeigen
    hint.classList.remove('hidden');
    setTimeout(() => hint.classList.add('visible'), 50);

    // Nach 6 Sekunden automatisch ausblenden
    setTimeout(() => {
        closeSchoolHolidaysHint();
    }, 6000);

    // Merken dass Hint gezeigt wurde
    localStorage.setItem('holidayboost_schoolhint_shown', '1');
}

// 10.14. Schulferien-Hint schließen
function closeSchoolHolidaysHint() {
    const hint = document.getElementById('school-holidays-hint');
    if (!hint) return;

    hint.classList.remove('visible');
    setTimeout(() => hint.classList.add('hidden'), 400);
}
// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 11: ONBOARDING TUTORIAL (Einführung für neue Benutzer)
// ═══════════════════════════════════════════════════════════════════════════════

// 11.1. Onboarding State
const OnboardingState = {
    currentStep: 0,
    totalSteps: 7,
    isActive: false
};

// 11.2. Onboarding starten (beim ersten Besuch)
function initOnboarding() {
    // Prüfe ob Onboarding bereits abgeschlossen wurde
    const onboardingCompleted = localStorage.getItem('holidayboost_onboarding_completed');
    if (onboardingCompleted) return;

    // Kleine Verzögerung, damit die Seite erst lädt
    setTimeout(() => {
        showOnboarding();
    }, 500);
}

// 11.3. Onboarding anzeigen
function showOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;

    OnboardingState.isActive = true;
    OnboardingState.currentStep = 0;

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('visible'), 10);

    updateOnboardingStep();
}

// 11.4. Onboarding schließen/überspringen
function skipOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;

    OnboardingState.isActive = false;

    overlay.classList.remove('visible');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);

    // Speichere dass Onboarding abgeschlossen wurde
    localStorage.setItem('holidayboost_onboarding_completed', '1');
}

// 11.5. Nächster Schritt
function nextOnboardingStep() {
    OnboardingState.currentStep++;

    if (OnboardingState.currentStep >= OnboardingState.totalSteps) {
        // Onboarding abgeschlossen
        skipOnboarding();
        return;
    }

    updateOnboardingStep();
}

// 11.6. Vorheriger Schritt
function prevOnboardingStep() {
    if (OnboardingState.currentStep > 0) {
        OnboardingState.currentStep--;
        updateOnboardingStep();
    }
}

// 11.7. Schritt aktualisieren
function updateOnboardingStep() {
    const steps = document.querySelectorAll('.onboarding-step');
    const dots = document.querySelectorAll('.progress-dot');
    const nextBtn = document.getElementById('onboarding-next');
    const skipBtn = document.getElementById('onboarding-skip');
    const backBtn = document.getElementById('onboarding-back');

    // Alle Steps ausblenden
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === OnboardingState.currentStep) {
            step.classList.add('active');
        }
    });

    // Progress Dots aktualisieren
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index === OnboardingState.currentStep) {
            dot.classList.add('active');
        } else if (index < OnboardingState.currentStep) {
            dot.classList.add('completed');
        }
    });

    // Zurück-Button: Nur ab Step 1 anzeigen
    if (backBtn) {
        backBtn.style.display = OnboardingState.currentStep > 0 ? 'block' : 'none';
    }

    // Button-Text anpassen
    if (OnboardingState.currentStep === OnboardingState.totalSteps - 1) {
        nextBtn.textContent = 'Los geht\'s!';
        skipBtn.style.display = 'none';
    } else {
        nextBtn.textContent = 'Weiter';
        skipBtn.style.display = 'block';
    }
}

// 11.8. Onboarding manuell zurücksetzen (für Debug/Test)
function resetOnboarding() {
    localStorage.removeItem('holidayboost_onboarding_completed');
    console.log('Onboarding zurückgesetzt. Seite neu laden für Tutorial.');
}

// 11.9. Tastatur-Navigation für Onboarding
document.addEventListener('keydown', function(e) {
    if (!OnboardingState.isActive) return;

    if (e.key === 'Escape') {
        skipOnboarding();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextOnboardingStep();
    } else if (e.key === 'ArrowLeft') {
        prevOnboardingStep();
    }
});

// 11.10. Bundesland-Auswahl im Onboarding synchronisieren
function initOnboardingStateSelect() {
    const onboardingSelect = document.getElementById('onboarding-state-select');
    const mainSelect = document.getElementById('state-select');

    if (!onboardingSelect || !mainSelect) return;

    // Aktuellen Wert übernehmen
    onboardingSelect.value = mainSelect.value;

    // Bei Änderung im Onboarding: Hauptauswahl aktualisieren
    onboardingSelect.addEventListener('change', function() {
        if (this.value) {
            mainSelect.value = this.value;
            // Event auslösen damit die App reagiert
            mainSelect.dispatchEvent(new Event('change'));
        }
    });
}

// 11.11. Initialisierung beim Seitenladen
document.addEventListener('DOMContentLoaded', function() {
    // Warte bis andere Module geladen sind
    setTimeout(() => {
        initOnboarding();
        initOnboardingStateSelect();
    }, 1000);
});

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 12: THEME TOGGLE (Light/Dark Mode)
// ═══════════════════════════════════════════════════════════════════════════════

// 12.1. Theme State
const ThemeState = {
    current: 'dark', // 'dark' oder 'light'
    storageKey: 'holidayboost_theme'
};

// 12.2. Theme initialisieren
function initTheme() {
    // Prüfe gespeicherte Präferenz
    const savedTheme = localStorage.getItem(ThemeState.storageKey);
    
    if (savedTheme) {
        ThemeState.current = savedTheme;
    } else {
        // Prüfe System-Präferenz
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        ThemeState.current = prefersDark ? 'dark' : 'dark'; // Standard: Dark
    }
    
    applyTheme(ThemeState.current);
    updateToggleButton();
}

// 12.3. Theme anwenden
function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.removeAttribute('data-theme');
    }
    
    ThemeState.current = theme;
}

// 12.4. Theme umschalten
function toggleTheme() {
    const newTheme = ThemeState.current === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    updateToggleButton();
    
    // Speichern
    localStorage.setItem(ThemeState.storageKey, newTheme);
    
    // Kleine Animation für den Toggle
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.classList.add('switching');
        setTimeout(() => toggle.classList.remove('switching'), 300);
    }
}

// 12.5. Toggle-Button aktualisieren
function updateToggleButton() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    
    if (ThemeState.current === 'light') {
        toggle.classList.add('light-mode');
        toggle.title = 'Dark Mode aktivieren';
    } else {
        toggle.classList.remove('light-mode');
        toggle.title = 'Light Mode aktivieren';
    }
}

// 12.6. System-Präferenz Listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Nur anwenden wenn keine manuelle Präferenz gespeichert
    if (!localStorage.getItem(ThemeState.storageKey)) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        updateToggleButton();
    }
});

// 12.7. Theme beim Seitenladen initialisieren (früh, um Flackern zu vermeiden)
(function() {
    // Sofort ausführen, nicht auf DOMContentLoaded warten
    const savedTheme = localStorage.getItem('holidayboost_theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

// Nach DOM geladen: Toggle-Button aktualisieren
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});

// ════════════════════════════════════════════════════════════════════════════════
// 13. MOBILE LEGEND POPUP
// ════════════════════════════════════════════════════════════════════════════════

// 13.1. Toggle Legend Popup (Mobile)
function toggleLegendPopup() {
    const popup = document.getElementById('legend-popup');
    if (!popup) return;

    if (popup.classList.contains('visible')) {
        popup.classList.remove('visible');
        document.body.style.overflow = '';
    } else {
        popup.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

// 13.2. Popup schließen bei Klick auf Overlay (außerhalb Content)
document.addEventListener('click', function(e) {
    const popup = document.getElementById('legend-popup');
    if (!popup) return;

    // Nur wenn auf das Overlay (nicht auf Content) geklickt wird
    if (e.target === popup) {
        toggleLegendPopup();
    }
});

// 13.3. Popup schließen mit Escape-Taste
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popup = document.getElementById('legend-popup');
        if (popup && popup.classList.contains('visible')) {
            toggleLegendPopup();
        }
    }
});

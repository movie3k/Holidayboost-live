// ========================================
// HOLIDAYBOOST MOBILE MODULE
// Responsive Single-Month View for Smartphones
// ========================================

const MobileView = {
    isActive: false,
    currentMonthIndex: new Date().getMonth(),
    touchStartX: 0,
    touchEndX: 0,
    navigationElement: null,
    MOBILE_BREAKPOINT: 430,

    // Initialisierung
    init() {
        this.checkMobileState();
        window.addEventListener('resize', () => this.handleResize());

        // Jahr-Änderung überwachen
        const yearSelect = document.getElementById('year-select');
        if (yearSelect) {
            yearSelect.addEventListener('change', () => {
                if (this.isActive) {
                    this.updateDisplay();
                }
            });
        }
    },

    // Mobile-Status prüfen und aktivieren/deaktivieren
    checkMobileState() {
        const isMobile = window.innerWidth <= this.MOBILE_BREAKPOINT;

        if (isMobile && !this.isActive) {
            this.activate();
        } else if (!isMobile && this.isActive) {
            this.deactivate();
        }
    },

    // Mobile-Ansicht aktivieren
    activate() {
        this.isActive = true;

        // Navigation erstellen falls nicht vorhanden
        if (!this.navigationElement) {
            this.createNavigation();
        }

        // Warten bis Kalender existiert (Timing-Fix)
        const waitForCalendar = () => {
            const months = document.querySelectorAll('.month-view');
            if (months.length > 0) {
                // Aktuellen Monat anzeigen
                const currentMonth = new Date().getMonth();
                this.showMonth(currentMonth);
                this.setupSwipeGestures();
            } else {
                // Kalender noch nicht gerendert - erneut versuchen
                setTimeout(waitForCalendar, 100);
            }
        };
        waitForCalendar();
    },

    // Mobile-Ansicht deaktivieren
    deactivate() {
        this.isActive = false;

        // Alle Monate wieder anzeigen
        document.querySelectorAll('.month-view').forEach(m => {
            m.classList.remove('active-mobile');
        });
    },

    // Navigation initialisieren
    createNavigation() {
        this.navigationElement = true;
    },

    // Aktuelles Jahr holen
    getCurrentYear() {
        if (typeof State !== 'undefined' && State.selectedYear) {
            return State.selectedYear;
        }
        const yearSelect = document.getElementById('year-select');
        return yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();
    },

    // Pfeile in den aktuellen Monats-Header einfügen (wie year-nav Design)
    injectArrowsIntoHeader() {
        const activeMonth = document.querySelector('.month-view.active-mobile');
        if (!activeMonth) return;

        const monthHeader = activeMonth.querySelector('.month-header');
        if (!monthHeader) return;

        // WICHTIG: ALLE mobile-nav-arrows aus dem aktiven Header ENTFERNEN
        monthHeader.querySelectorAll('.mobile-nav-arrow').forEach(el => el.remove());

        // Cleanup: Alle mobile-nav-arrows aus NICHT-aktiven Monaten entfernen
        document.querySelectorAll('.month-view:not(.active-mobile) .mobile-nav-arrow').forEach(el => el.remove());

        // Cleanup: Desktop-Buttons in NICHT-aktiven Monaten wieder einblenden
        document.querySelectorAll('.month-view:not(.active-mobile) .month-header').forEach(header => {
            header.querySelectorAll('.year-nav').forEach(el => {
                el.style.display = '';
            });
            header.style.cssText = ''; // Flex-Layout zurücksetzen
        });

        // Desktop-Buttons im aktiven Header ENTFERNEN (nicht nur verstecken!)
        monthHeader.querySelectorAll('.year-nav:not(.mobile-nav-arrow)').forEach(el => {
            el.remove();
        });

        const isExtraMonthPrev = activeMonth.classList.contains('extra-month-prev');
        const isExtraMonthNext = activeMonth.classList.contains('extra-month-next');
        const year = this.getCurrentYear();

        // Monatstitel finden - ROBUST: auch wenn kein span existiert
        let monthTitle = monthHeader.querySelector('span');
        if (!monthTitle) {
            // Kein span gefunden - Text aus Header extrahieren und in span einpacken
            // Erst alle bestehenden Buttons/Elemente entfernen um nur den Text zu bekommen
            const existingButtons = monthHeader.querySelectorAll('button, .year-nav');
            existingButtons.forEach(btn => btn.remove());

            const textContent = monthHeader.textContent.trim();
            if (textContent) {
                monthTitle = document.createElement('span');
                monthTitle.textContent = textContent;
                monthHeader.innerHTML = '';
                monthHeader.appendChild(monthTitle);
            } else {
                console.warn('MobileView: Kein Monatstitel gefunden');
                return;
            }
        }

        // GENAU ZWEI neue Buttons erstellen
        const prevArrow = document.createElement('button');
        prevArrow.className = 'mobile-nav-arrow year-nav prev';

        const nextArrow = document.createElement('button');
        nextArrow.className = 'mobile-nav-arrow year-nav next';

        // Inhalte basierend auf Monat-Typ setzen
        if (isExtraMonthPrev) {
            // Dezember Vorjahr: [Vorjahr] [Dezember 2025] [→]
            prevArrow.textContent = 'Vorjahr';
            prevArrow.disabled = true;
            prevArrow.classList.add('disabled-label');

            nextArrow.textContent = '→';
            nextArrow.onclick = (e) => { e.stopPropagation(); this.showMonth(0); };
        } else if (isExtraMonthNext) {
            // Januar Folgejahr: [←] [Januar 2027] [Folgejahr]
            prevArrow.textContent = '←';
            prevArrow.onclick = (e) => { e.stopPropagation(); this.showMonth(11); };

            nextArrow.textContent = 'Folgejahr';
            nextArrow.disabled = true;
            nextArrow.classList.add('disabled-label');
        } else if (this.currentMonthIndex === 0) {
            // Januar Hauptjahr
            prevArrow.textContent = '←';
            prevArrow.onclick = (e) => { e.stopPropagation(); this.goToExtraMonth(year - 1, 11); };

            nextArrow.textContent = '→';
            nextArrow.onclick = (e) => { e.stopPropagation(); this.nextMonth(); };
        } else if (this.currentMonthIndex === 11) {
            // Dezember Hauptjahr
            prevArrow.textContent = '←';
            prevArrow.onclick = (e) => { e.stopPropagation(); this.prevMonth(); };

            nextArrow.textContent = '→';
            nextArrow.onclick = (e) => { e.stopPropagation(); this.goToExtraMonth(year + 1, 0); };
        } else {
            // Normale Monate
            prevArrow.textContent = '←';
            prevArrow.onclick = (e) => { e.stopPropagation(); this.prevMonth(); };

            nextArrow.textContent = '→';
            nextArrow.onclick = (e) => { e.stopPropagation(); this.nextMonth(); };
        }

        // Header-Struktur: [prevArrow] [monthTitle] [nextArrow]
        monthHeader.insertBefore(prevArrow, monthTitle);
        monthHeader.appendChild(nextArrow);

        // Flex-Layout für Zentrierung
        monthHeader.style.cssText = 'display:flex; justify-content:center; align-items:center; gap:12px;';
    },

    // Zu Extra-Monat (Vorjahr/Folgejahr) wechseln - OHNE Jahr zu ändern
    goToExtraMonth(targetYear, monthIndex) {
        // Prüfen ob Extra-Monat bereits existiert
        const monthKey = `${targetYear}-${String(monthIndex + 1).padStart(2, '0')}`;
        const extraMonthExists = typeof State !== 'undefined' && State.extraMonths && State.extraMonths.has(monthKey);

        // Nur togglen wenn Extra-Monat noch nicht existiert
        if (!extraMonthExists && typeof toggleExtraMonth === 'function') {
            toggleExtraMonth(targetYear, monthIndex);
        }

        // Warten bis Kalender neu gerendert ist (kürzer wenn Monat bereits existiert)
        const delay = extraMonthExists ? 10 : 100;
        setTimeout(() => {
            if (!this.isActive) return;

            // Extra-Monat finden (hat extra-month Klasse)
            const allMonths = document.querySelectorAll('.month-view');
            let targetIndex = -1;

            // Bei Dezember Vorjahr: erscheint am Anfang (Index 0)
            // Bei Januar Folgejahr: erscheint am Ende (letzter Index)
            if (monthIndex === 11) {
                // Dezember Vorjahr - suche am Anfang
                targetIndex = 0;
            } else if (monthIndex === 0) {
                // Januar Folgejahr - suche am Ende
                targetIndex = allMonths.length - 1;
            }

            if (targetIndex >= 0 && targetIndex < allMonths.length) {
                this.showMonthByIndex(targetIndex);
            }
        }, delay);
    },

    // Monat nach absolutem Index anzeigen (für Extra-Monate)
    showMonthByIndex(absoluteIndex) {
        const months = document.querySelectorAll('.month-view');
        if (absoluteIndex < 0 || absoluteIndex >= months.length) return;

        months.forEach((m, i) => {
            m.classList.toggle('active-mobile', i === absoluteIndex);
        });

        // currentMonthIndex anpassen basierend auf dem aktiven Monat
        const activeMonth = months[absoluteIndex];
        if (activeMonth) {
            // Prüfen ob es ein Extra-Monat ist
            const isExtraMonth = activeMonth.classList.contains('extra-month');
            if (isExtraMonth) {
                // Bei Extra-Monat: Index auf Grenzwert setzen
                if (activeMonth.classList.contains('extra-month-prev')) {
                    this.currentMonthIndex = -1; // Marker für Dezember Vorjahr
                } else {
                    this.currentMonthIndex = 12; // Marker für Januar Folgejahr
                }
            } else {
                this.currentMonthIndex = absoluteIndex;
            }
        }

        this.injectArrowsIntoHeader();
    },

    // Monat anzeigen (berücksichtigt Extra-Monate)
    showMonth(index) {
        // Index begrenzen (0-11 für Hauptjahr-Monate)
        index = Math.max(0, Math.min(11, index));

        const months = document.querySelectorAll('.month-view');

        // Prüfen ob Extra-Monat am Anfang existiert (Dezember Vorjahr)
        const hasExtraMonthPrev = document.querySelector('.month-view.extra-month-prev') !== null;

        // DOM-Index berechnen (wenn Extra-Monat am Anfang, dann +1)
        let domIndex = index;
        if (hasExtraMonthPrev) {
            domIndex = index + 1;
        }

        // Sicherstellen dass DOM-Index gültig ist
        if (domIndex < 0 || domIndex >= months.length) return;

        months.forEach((m, i) => {
            m.classList.toggle('active-mobile', i === domIndex);
        });

        this.currentMonthIndex = index;

        // Pfeile in den neuen aktiven Header einfügen
        this.injectArrowsIntoHeader();
    },

    // Nächster Monat
    nextMonth() {
        if (this.currentMonthIndex < 11) {
            this.showMonth(this.currentMonthIndex + 1);
        }
    },

    // Vorheriger Monat
    prevMonth() {
        if (this.currentMonthIndex > 0) {
            this.showMonth(this.currentMonthIndex - 1);
        }
    },

    // Zu bestimmtem Monat springen (kann von anderen Modulen aufgerufen werden)
    goToMonth(index) {
        if (this.isActive && index >= 0 && index <= 11) {
            this.showMonth(index);
        }
    },

    // Anzeige aktualisieren (für Kompatibilität)
    updateDisplay() {
        this.injectArrowsIntoHeader();
    },

    // Swipe-Gesten einrichten
    setupSwipeGestures() {
        const calendar = document.getElementById('calendar-grid');
        if (!calendar) return;

        // Vorherige Listener entfernen falls vorhanden
        calendar.removeEventListener('touchstart', this.handleTouchStart);
        calendar.removeEventListener('touchend', this.handleTouchEnd);

        // Touch-Start Handler
        this.handleTouchStart = (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        };

        // Touch-End Handler
        this.handleTouchEnd = (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        };

        calendar.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        calendar.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    },

    // Swipe auswerten
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 50; // Minimum Swipe-Distanz in Pixel

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe nach links = nächster Monat
                this.nextMonth();
            } else {
                // Swipe nach rechts = vorheriger Monat
                this.prevMonth();
            }
        }
    },

    // Resize Handler
    handleResize() {
        this.checkMobileState();

        // Display aktualisieren falls aktiv
        if (this.isActive) {
            this.updateDisplay();
        }
    },

    // Öffentliche Methode zum Aktualisieren nach Kalender-Rendering
    refresh() {
        if (this.isActive) {
            // Bei Extra-Monaten: showMonthByIndex verwenden
            if (this.currentMonthIndex === -1) {
                // Dezember Vorjahr - Index 0 (wenn Extra-Monat existiert)
                const hasExtraMonthPrev = document.querySelector('.month-view.extra-month-prev') !== null;
                if (hasExtraMonthPrev) {
                    this.showMonthByIndex(0);
                } else {
                    this.showMonth(0); // Fallback auf Januar
                }
            } else if (this.currentMonthIndex === 12) {
                // Januar Folgejahr - letzter Index
                const months = document.querySelectorAll('.month-view');
                const hasExtraMonthNext = document.querySelector('.month-view.extra-month-next') !== null;
                if (hasExtraMonthNext) {
                    this.showMonthByIndex(months.length - 1);
                } else {
                    this.showMonth(11); // Fallback auf Dezember
                }
            } else {
                this.showMonth(this.currentMonthIndex);
            }
        }
    }
};

// Auto-Init wenn DOM geladen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileView.init());
} else {
    // DOM bereits geladen
    MobileView.init();
}

// Globale Funktion für Integration mit anderen Modulen
window.MobileView = MobileView;

// ========================================
// MOBILE TOOLTIP TOUCH HANDLER
// Für "Freie Tage" Perioden-Anzeige im Footer
// ========================================
(function() {
    function setupMobileTooltip() {
        const freeDaysBox = document.querySelector('.stat-box.highlight.has-tooltip');
        if (!freeDaysBox) {
            // Retry nach kurzer Verzögerung falls DOM noch nicht fertig
            setTimeout(setupMobileTooltip, 500);
            return;
        }

        let touchHandled = false;

        // Touch-Event (primär für Mobile)
        freeDaysBox.addEventListener('touchend', function(e) {
            if (window.innerWidth > 430) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            touchHandled = true;

            // Toggle Tooltip
            freeDaysBox.classList.toggle('tooltip-active');

            // Reset flag
            setTimeout(() => { touchHandled = false; }, 100);
        }, { passive: false });

        // Click-Event als Fallback
        freeDaysBox.addEventListener('click', function(e) {
            if (window.innerWidth > 430) return;
            if (touchHandled) return; // Skip wenn schon durch touch behandelt

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Toggle Tooltip
            freeDaysBox.classList.toggle('tooltip-active');
        });

        // Außerhalb tippen schließt Tooltip
        document.addEventListener('touchend', function(e) {
            if (window.innerWidth > 430) return;
            if (!freeDaysBox.contains(e.target)) {
                freeDaysBox.classList.remove('tooltip-active');
            }
        }, { passive: true });
    }

    // Init nach DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMobileTooltip);
    } else {
        setupMobileTooltip();
    }
})();

// ========================================
// HEADER HEIGHT SYNC - Dynamische Header-Höhe
// Misst die echte Header-Höhe und setzt CSS-Variable
// Funktioniert auf ALLEN Smartphone-Größen
// ========================================
const HeaderHeightSync = {
    init() {
        this.update();
        window.addEventListener('resize', () => this.update());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.update(), 150);
        });
    },

    update() {
        // Nur auf Mobile ausführen
        if (window.innerWidth > 430) return;

        const header = document.querySelector('.compact-header');
        if (!header) return;

        const height = header.offsetHeight + 10; // +10px Sicherheitsabstand
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }
};

// Auto-Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HeaderHeightSync.init());
} else {
    HeaderHeightSync.init();
}

// Global verfügbar machen
window.HeaderHeightSync = HeaderHeightSync;

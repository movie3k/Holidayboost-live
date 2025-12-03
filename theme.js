// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 12: THEME TOGGLE (Light/Dark Mode) - Shared across all pages
// ═══════════════════════════════════════════════════════════════════════════════

// 12.1. Theme State
const ThemeState = {
    current: 'dark',
    storageKey: 'holidayboost_theme'
};

// 12.2. Theme sofort anwenden (verhindert Flackern)
(function() {
    const savedTheme = localStorage.getItem('holidayboost_theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

// 12.3. Theme initialisieren
function initTheme() {
    const savedTheme = localStorage.getItem(ThemeState.storageKey);

    if (savedTheme) {
        ThemeState.current = savedTheme;
    } else {
        ThemeState.current = 'dark';
    }

    applyTheme(ThemeState.current);
    updateToggleButton();
}

// 12.4. Theme anwenden
function applyTheme(theme) {
    const html = document.documentElement;

    if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.removeAttribute('data-theme');
    }

    ThemeState.current = theme;
}

// 12.5. Theme umschalten
function toggleTheme() {
    const newTheme = ThemeState.current === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    updateToggleButton();

    localStorage.setItem(ThemeState.storageKey, newTheme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.classList.add('switching');
        setTimeout(() => toggle.classList.remove('switching'), 300);
    }
}

// 12.6. Toggle-Button aktualisieren
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

// 12.7. System-Präferenz Listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(ThemeState.storageKey)) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        updateToggleButton();
    }
});

// 12.8. Nach DOM geladen: Toggle-Button aktualisieren
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});

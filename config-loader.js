// ========================================
// HOLIDAYBOOST CONFIG-LOADER v1.0
// Lädt Einstellungen aus Admin-Panel und wendet sie an
// ========================================

(function() {
    'use strict';

    // ========================================
    // MODUL 1: KONFIGURATION LADEN
    // ========================================

    async function loadConfig() {
        try {
            // Versuche zuerst statische config.json (für IONOS Webspace)
            const response = await fetch('/config.json');
            if (!response.ok) throw new Error('Config nicht erreichbar');
            return await response.json();
        } catch (error) {
            console.warn('Config-Loader: config.json nicht gefunden, nutze Defaults');
            return null;
        }
    }

    // ========================================
    // MODUL 2: SEO ANWENDEN
    // ========================================

    function applySEO(seo) {
        if (!seo) return;

        // Title
        if (seo.title) {
            document.title = seo.title;
        }

        // Meta Description
        if (seo.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = seo.description;
        }

        // Meta Keywords
        if (seo.keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = seo.keywords;
        }
    }

    // ========================================
    // MODUL 3: SOCIAL MEDIA LINKS ANWENDEN
    // ========================================

    function applySocialMedia(socialMedia) {
        if (!socialMedia) return;

        const socialContainer = document.querySelector('.social-links');
        if (!socialContainer) return;

        // Bestehende Links aktualisieren
        const platforms = ['instagram', 'tiktok', 'pinterest', 'youtube'];

        platforms.forEach(platform => {
            const config = socialMedia[platform];
            const link = socialContainer.querySelector(`.social-${platform}`);

            if (config && link) {
                if (config.active && config.url) {
                    link.href = config.url;
                    link.style.display = '';
                } else {
                    link.style.display = 'none';
                }
            }
        });
    }

    // ========================================
    // MODUL 4: HERO IMAGE ANWENDEN
    // ========================================

    function applyHeroImage(heroImage) {
        if (!heroImage || !heroImage.filename) return;

        const filename = heroImage.filename;
        const headerPos = heroImage.headerPosition || 35;
        const footerPos = heroImage.footerPosition || 45;
        const opacity = (heroImage.overlayOpacity || 70) / 100;

        // Dynamisches CSS erstellen
        const styleId = 'config-hero-style';
        let styleEl = document.getElementById(styleId);

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = `
            /* Hero Image - dynamisch aus Admin */
            .compact-header {
                background: linear-gradient(
                    135deg,
                    rgba(10, 22, 40, ${opacity}) 0%,
                    rgba(20, 40, 70, ${opacity - 0.1}) 50%,
                    rgba(10, 22, 40, ${opacity}) 100%
                ), url('${filename}') !important;
                background-position: center ${headerPos}% !important;
                background-size: cover !important;
            }

            .sticky-footer-new {
                background: linear-gradient(
                    135deg,
                    rgba(10, 22, 40, ${opacity}) 0%,
                    rgba(20, 40, 70, ${opacity - 0.1}) 50%,
                    rgba(10, 22, 40, ${opacity}) 100%
                ), url('${filename}') !important;
                background-position: center ${footerPos}% !important;
                background-size: cover !important;
            }
        `;
    }

    // ========================================
    // MODUL 5: AFFILIATE LINKS LADEN
    // ========================================

    async function loadAffiliateLinks() {
        try {
            // Statische JSON-Datei laden (für IONOS Webspace)
            const response = await fetch('/data/affiliates.json');
            if (!response.ok) return null;
            const data = await response.json();
            // Speichere in globalem Objekt für andere Scripts
            window.holidayBoostAffiliates = data;
            return data;
        } catch (error) {
            console.warn('Affiliate-Links nicht geladen');
            return null;
        }
    }

    // ========================================
    // MODUL 6: INITIALISIERUNG
    // ========================================

    async function init() {
        const config = await loadConfig();

        if (config) {
            applySEO(config.seo);
            applySocialMedia(config.socialMedia);
            applyHeroImage(config.heroImage);

            // Config global verfügbar machen
            window.holidayBoostConfig = config;
        }

        // Affiliate Links separat laden
        await loadAffiliateLinks();

        console.log('✅ HolidayBoost Config geladen');
    }

    // Beim DOM-Ready starten
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

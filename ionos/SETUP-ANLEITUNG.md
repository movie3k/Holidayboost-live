# IONOS Deploy Now - Setup-Anleitung

## Voraussetzungen
- GitHub-Account
- IONOS-Account mit Webspace
- Repository auf GitHub gepusht

## Schritt 1: IONOS Deploy Now aktivieren

1. Gehe zu [IONOS Deploy Now](https://www.ionos.de/hosting/deploy-now)
2. Klicke auf "Jetzt starten"
3. Verbinde deinen GitHub-Account
4. Wähle dein Repository aus

## Schritt 2: Projekt einrichten

1. IONOS erkennt automatisch, dass es eine statische Website ist
2. Wähle den Branch `main` als Deployment-Branch
3. Bestätige die Einstellungen

## Schritt 3: GitHub Secrets einrichten

Nach der Verbindung erhältst du drei Werte von IONOS:
- `IONOS_PROJECT_ID`
- `IONOS_BRANCH_ID`
- `IONOS_API_KEY`

Diese werden automatisch als GitHub Secrets in deinem Repository gespeichert.

## Schritt 4: Domain verbinden

1. Gehe zu IONOS > Deploy Now > Dein Projekt > Einstellungen
2. Klicke auf "Domain verbinden"
3. Wähle `holidayboost.de` aus
4. DNS-Einstellungen werden automatisch konfiguriert

## Automatisches Deployment

Nach der Einrichtung wird bei jedem Push auf `main`:
1. GitHub Actions Workflow gestartet
2. Statische Dateien zu IONOS hochgeladen
3. Website automatisch aktualisiert

## Lokale Entwicklung

Für lokale Entwicklung MIT Admin-Panel:
```bash
npm start
```
Dann: http://localhost:8000

## Was wird deployed?

**Inkludiert:**
- index.html, about.html, kontakt.html, reisetipps.html
- datenschutz.html, impressum.html
- styles.css, script.js, mobile.js, config-loader.js
- config.json, data/affiliates.json, data/recommendations.json
- sitemap.xml, logo.png, urlaub2.jpg

**Ausgeschlossen:**
- server.js, node_modules, package.json (Node.js Backend)
- admin.html, admin-login.html, admin.js (Admin-Panel)
- test.html, debug.html (Test-Dateien)
- Screenshots (*.png außer logo.png)

## Workflow: Änderungen vornehmen

1. **Lokal:** `npm start` starten
2. **Admin-Panel:** http://localhost:8000/admin-login.html
3. **Änderungen machen** (SEO, Bilder, Affiliate-Links, etc.)
4. **Pushen:** `git add . && git commit -m "Update" && git push`
5. **Automatisch:** IONOS Deploy Now aktualisiert die Live-Website

## Wichtig

- Das Admin-Panel funktioniert NUR lokal (Node.js)
- Änderungen im Admin-Panel speichern in config.json und data/*.json
- Diese JSON-Dateien werden mit gepusht und sind dann live

# 🚀 HolidayBoost Development Workflow

## Urlaubsempfehlungen erstellen und deployen

### 1. 🏗️ Localhost Development Setup

```bash
# 1. Entwicklungsserver starten
python -m http.server 8000
# oder
npx serve .

# 2. Admin Panel öffnen
http://localhost:8000/admin.html
```

### 2. 📝 Empfehlungen erstellen (Localhost)

1. **Admin Panel öffnen** → `http://localhost:8000/admin.html`
2. **Empfehlung erstellen:**
   - Jahr auswählen (z.B. 2025)
   - Bundesland/Stadt auswählen (z.B. Bayern → München)
   - Urlaubstage im Kalender markieren
   - Titel & Beschreibung eingeben
   - "Erstellen" klicken
3. **Wiederholen** → 20x verschiedene Empfehlungen erstellen

### 3. 💾 Daten exportieren für Git

Nach dem Erstellen aller Empfehlungen:

1. **"💾 JSON Datei herunterladen"** klicken
2. **JSON-Modal öffnet sich** mit allen Daten
3. **Eine der Optionen wählen:**
   - **"📋 JSON kopieren"** → In Zwischenablage kopieren
   - **"💾 Als Datei herunterladen"** → `recommendations.json` herunterladen

### 4. 🔄 Git Workflow

```bash
# 1. Heruntergeladene Datei an richtige Stelle kopieren
cp ~/Downloads/recommendations.json ./data/recommendations.json

# 2. Änderungen committen
git add .
git commit -m "Add vacation recommendations batch $(date +%Y-%m-%d)"

# 3. Zu GitHub pushen
git push origin main
```

### 5. 🌐 Production Deployment

**Automatisch nach Git Push:**
- **Vercel/Netlify** detected Änderungen
- **Auto-Deployment** startet
- **Neue Empfehlungen** sind live verfügbar

**User Experience:**
- User wählt **Jahr: 2025, Bundesland: Bayern**
- Sieht **nur Bayern-spezifische Empfehlungen** für 2025
- **Echtzeit-Filterung** nach Auswahl

## 📁 Dateistruktur

```
beste/
├── data/
│   └── recommendations.json       # ← Produktive Empfehlungen
├── admin.html                     # ← Empfehlungen erstellen
├── index.html                     # ← User Interface
├── script.js                      # ← User Logic
├── admin.js                       # ← Admin Logic
└── styles.css                     # ← Styling
```

## 🎯 Filter-Logic

**User wählt:**
- **Jahr:** 2025
- **Bundesland:** Bayern
- **Stadt:** München

**System zeigt nur:**
```json
{
  "year": 2025,
  "states": ["BY"],           // Bayern
  "cities": ["MUC"],          // München
  "title": "Oktoberfest Bridge",
  "vacationDates": ["2025-10-06"]
}
```

## 🔧 Development vs Production

| Modus | Datenquelle | Verwendung |
|-------|-------------|------------|
| **Development** | localStorage | Admin erstellt Empfehlungen |
| **Production** | `/data/recommendations.json` | User sehen Empfehlungen |

## ⚡ Quick Commands

```bash
# Schneller Export aus Admin
# → Admin Panel → "💾 JSON Datei herunterladen"

# Schneller Deploy
git add . && git commit -m "Update recommendations" && git push

# Backup erstellen
cp data/recommendations.json backup/recommendations-$(date +%Y%m%d).json
```

## 🐛 Troubleshooting

**Problem:** User sehen keine Empfehlungen
```bash
# Prüfen ob Datei existiert
ls -la data/recommendations.json

# Prüfen ob JSON valide ist
jq . data/recommendations.json
```

**Problem:** Empfehlungen werden nicht gefiltert
- Prüfe `year`, `states`, `cities` Felder in JSON
- Prüfe Browser Console für Fehler

**Problem:** Admin Panel funktioniert nicht
- Prüfe ob Server läuft: `http://localhost:8000`
- Prüfe Browser Console für JavaScript-Fehler
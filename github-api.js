// GitHub API Integration for HolidayBoost
// Live-Datenbank über GitHub Repository

class GitHubDataManager {
    constructor() {
        this.owner = 'movie3k';
        this.repo = 'Holidayboost';
        this.token = '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';
        this.apiBase = 'https://api.github.com';
        this.branch = 'main';
    }

    // Hilfsfunktion: API-Request
    async apiRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${endpoint}`;

        const options = {
            method,
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        console.log(`🔗 GitHub API Request: ${method} ${url}`);

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ GitHub API Error:', errorData);
                throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Network Error:', error);
            throw error;
        }
    }

    // Datei aus Repository laden
    async loadFile(filePath) {
        try {
            console.log(`📥 Loading file: ${filePath}`);
            const response = await this.apiRequest(filePath);

            // Base64 Content decodieren
            const content = atob(response.content.replace(/\s/g, ''));
            const data = JSON.parse(content);

            console.log(`✅ File loaded successfully: ${filePath}`, data);
            return { data, sha: response.sha };
        } catch (error) {
            console.log(`ℹ️ File not found, returning empty data: ${filePath}`);
            return { data: [], sha: null };
        }
    }

    // Datei in Repository speichern/aktualisieren
    async saveFile(filePath, data, message = 'Update data') {
        try {
            console.log(`💾 Saving file: ${filePath}`);

            // Aktuelle SHA abrufen (falls Datei existiert)
            let sha = null;
            try {
                const currentFile = await this.apiRequest(filePath);
                sha = currentFile.sha;
            } catch (error) {
                console.log(`ℹ️ New file will be created: ${filePath}`);
            }

            // Content als Base64 encodieren
            const content = btoa(JSON.stringify(data, null, 2));

            const payload = {
                message,
                content,
                branch: this.branch
            };

            if (sha) {
                payload.sha = sha;
            }

            const response = await this.apiRequest(filePath, 'PUT', payload);
            console.log(`✅ File saved successfully: ${filePath}`);

            return response;
        } catch (error) {
            console.error(`❌ Error saving file ${filePath}:`, error);
            throw error;
        }
    }

    // Urlaubsempfehlungen laden
    async loadRecommendations() {
        const result = await this.loadFile('data/recommendations.json');
        return result.data;
    }

    // Urlaubsempfehlungen speichern
    async saveRecommendations(recommendations) {
        return await this.saveFile(
            'data/recommendations.json',
            recommendations,
            `Update vacation recommendations - ${new Date().toISOString()}`
        );
    }

    // Feiertage laden
    async loadHolidays() {
        const result = await this.loadFile('data/holidays.json');
        return result.data;
    }

    // Feiertage speichern
    async saveHolidays(holidays) {
        return await this.saveFile(
            'data/holidays.json',
            holidays,
            `Update holidays data - ${new Date().toISOString()}`
        );
    }

    // Konfiguration laden
    async loadConfig() {
        const result = await this.loadFile('data/config.json');
        return result.data || {
            lastUpdated: new Date().toISOString(),
            version: '1.0.0',
            adminUsers: []
        };
    }

    // Konfiguration speichern
    async saveConfig(config) {
        config.lastUpdated = new Date().toISOString();
        return await this.saveFile(
            'data/config.json',
            config,
            `Update configuration - ${new Date().toISOString()}`
        );
    }

    // Repository-Struktur initialisieren
    async initializeRepository() {
        console.log('🚀 Initializing GitHub repository structure...');

        try {
            // README erstellen/aktualisieren
            const readmeContent = `# HolidayBoost Data Repository

This repository stores vacation recommendations and holiday data for the HolidayBoost.de application.

## Structure
- \`data/recommendations.json\` - Vacation recommendations
- \`data/holidays.json\` - Holiday data
- \`data/config.json\` - Configuration

## Last Updated
${new Date().toISOString()}
`;

            await this.saveFile('README.md', { content: readmeContent }, 'Initialize repository structure');

            // Leere Datenstrukturen erstellen falls nicht vorhanden
            const emptyRecommendations = [];
            const emptyHolidays = [];
            const defaultConfig = {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                adminUsers: ['movie3k'],
                settings: {
                    autoBackup: true,
                    maxRecommendations: 100
                }
            };

            await this.saveRecommendations(emptyRecommendations);
            await this.saveHolidays(emptyHolidays);
            await this.saveConfig(defaultConfig);

            console.log('✅ Repository structure initialized successfully!');
            return true;
        } catch (error) {
            console.error('❌ Error initializing repository:', error);
            throw error;
        }
    }

    // Verbindungstest
    async testConnection() {
        try {
            console.log('🔍 Testing GitHub API connection...');
            const response = await this.apiRequest('');
            console.log('✅ GitHub API connection successful!');
            return true;
        } catch (error) {
            console.error('❌ GitHub API connection failed:', error);
            return false;
        }
    }
}

// Globale Instanz
const githubDB = new GitHubDataManager();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubDataManager;
}
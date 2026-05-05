import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5175; // Run on a different port than Vite
const LOG_FILE = path.join(__dirname, 'ai_queries_log.json');

app.use(cors());
app.use(express.json());

// Initialize log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
}

app.post('/api/log', (appRequest, appResponse) => {
    try {
        const { query, answer, timestamp, mode } = appRequest.body;
        
        const logData = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        logData.push({
            id: Date.now(),
            timestamp: timestamp || new Date().toISOString(),
            query,
            answer,
            mode
        });
        
        fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2));
        console.log(`[Server] Logged query: "${query.substring(0, 50)}..."`);
        appResponse.status(200).json({ success: true });
    } catch (error) {
        console.error('[Server] Log error:', error);
        appResponse.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/logs', (appRequest, appResponse) => {
    try {
        const logData = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        appResponse.json(logData);
    } catch (error) {
        appResponse.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `[Thirukkural Log Server] Running at http://localhost:${PORT}`);
    console.log(`[Thirukkural Log Server] Saving logs to: ${LOG_FILE}`);
});

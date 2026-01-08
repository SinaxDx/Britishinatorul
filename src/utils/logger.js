import fs from 'fs';
import path from 'path';
import { format } from 'util';

// Setup logging
const logDir = 'logs';

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
    try {
        fs.mkdirSync(logDir);
    } catch (e) {
        console.error('Failed to create logs directory:', e);
    }
}

// Generate unique log filename based on timestamp
const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
const logFile = path.join(logDir, `session-${timestamp}.log`);

const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function writeToLog(level, args) {
  const message = format(...args);
  const time = new Date().toISOString();
  logStream.write(`[${time}] [${level}] ${message}\n`);
}

// Override console methods to capture output
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalDebug = console.debug;

console.log = (...args) => { originalLog(...args); writeToLog('INFO', args); };
console.error = (...args) => { originalError(...args); writeToLog('ERROR', args); };
console.warn = (...args) => { originalWarn(...args); writeToLog('WARN', args); };
console.debug = (...args) => { originalDebug(...args); writeToLog('DEBUG', args); };

console.log(`Logging initialized. Writing to ${logFile}`);

const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const logFilePath = path.join(__dirname, './logs/error.log');
const backupDir = path.join(__dirname, './logs/backup');

if (!fs.existsSync(logFilePath)) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  fs.writeFileSync(logFilePath, '');
}

const backupLogs = () => {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const data = fs.readFileSync(logFilePath, 'utf8');
    if (!data.trim()) return;

    const transformedData = data
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return {
            message: line,
            code: 500,
            time: Date.now(),
            stackTrace: 'Parsing error',
          };
        }
      });

    const dateStamp = new Date().toISOString().split('T')[0];
    const backupFilePath = path.join(backupDir, `error-${dateStamp}.log`);

    fs.writeFileSync(backupFilePath, JSON.stringify(transformedData, null, 2));
    fs.writeFileSync(logFilePath, '');

    console.log(`Backup created: ${backupFilePath}`);
  } catch (error) {
    console.error('Error during log backup:', error);
  }
};

cron.schedule('0 0 * * *', backupLogs);

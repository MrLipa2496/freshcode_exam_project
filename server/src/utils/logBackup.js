const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

const logFilePath = path.join(__dirname, './logs/error.log');
const backupDir = path.join(__dirname, './logs/backup');

async function initLogFile () {
  try {
    await fs.mkdir(path.dirname(logFilePath), { recursive: true });
    await fs.writeFile(logFilePath, '', { flag: 'a' });
  } catch (error) {
    console.error('Failed to init log file:', error);
  }
}

initLogFile();

const backupLogs = async () => {
  try {
    await fs.mkdir(backupDir, { recursive: true });

    const data = await fs.readFile(logFilePath, 'utf8');
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

    await fs.writeFile(
      backupFilePath,
      JSON.stringify(transformedData, null, 2)
    );
    await fs.writeFile(logFilePath, '');

    console.log(`Backup created: ${backupFilePath}`);
  } catch (error) {
    console.error('Error during log backup:', error);
  }
};

cron.schedule('0 0 * * *', backupLogs);

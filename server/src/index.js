const http = require('http');
// ============================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
require('./dbMongo/mongoose');
require('../src/utils/logBackup');
const router = require('./router');
const controller = require('./socketInit');
const errorHandler = require('./middlewares/errorHandler');
const logError = require('./utils/logger');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
app.use(router);

app.use(errorHandler);

process.on('uncaughtException', err => {
  logError(err);
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(reason);
  console.error('Unhandled Rejection:', reason);
});

const server = http.createServer(app);
server.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);
controller.createConnection(server);

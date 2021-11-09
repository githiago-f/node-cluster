
process.env.UV_THREADPOOL_SIZE = 1;
const OS = require('os');
const cluster = require('cluster');
const crypto = require('crypto');
const { promisify } = require('util');
const logger = require('pino')({
  transport: {
    target: 'pino-pretty'
  }
});

const pbkdf2 = promisify(crypto.pbkdf2);

if (cluster.isMaster) {
  for (let core in OS.cpus()) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      logger.info(`Worker thread ${worker.process.pid} died!`);
      cluster.fork();
    }
  });
} else {
  logger.info(`Worker thread ${process.pid} initialized`);

  const express = require('express');
  const app = express();

  app.get('/', async (req, res) => {
    const key = await pbkdf2('a', 'b', 10000, 64, 'sha512');
    res.end(`Process handled by pid "${process.pid}" and returned ${key.toString('base64')}`);
  });

  app.listen(3000, '0.0.0.0', () => {
    logger.info('Listening to 3000');
  });

  const willKillIn = (Math.random() * 10000) + 1;
  logger.info(`Process will die in ${willKillIn}`);

  setTimeout(() => { process.exit(1); }, willKillIn);
}

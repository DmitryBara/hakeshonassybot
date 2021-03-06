const Slimbot = require('slimbot');

const { onMessage } = require('./actions');

const { dbClient } = require('./dbClient');

const buildProxySettings = () => {
  let socks5;
  if (process.env.SOCKS5_HOST || process.env.SOCKS5_PORT) {
    socks5 = {
      socksHost: process.env.SOCKS5_HOST,
      socksPort: process.env.SOCKS5_PORT,
    };
  }
  return socks5;
};
const slimbot = new Slimbot(process.env.TELEGRAM_BOT_TOKEN, buildProxySettings());


// Register listeners
slimbot.on('message', onMessage.bind(null, slimbot));

dbClient.connect().then(() => {
  slimbot.startPolling();
});

process.on('exit', async (code) => {
  console.log(`Exit with code ${code}, stopping...`);
  slimbot.stopPolling();
  await dbClient.disconnect();
  console.log('Bye!');
});

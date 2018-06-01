const net = require('net');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOURTELEGRAMTOKEN';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

var bot_info;
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.getMe().then(function(result){
    bot_info = result;
});


bot.on('message', (msg) => {
  var client = new net.Socket();
  var userId = msg.chat.id;
  var text = '.';
  var bot_name = bot_info.first_name;
  text = msg.text;
  console.log('bot', bot_name);
  console.log('tobot', text);
  bot_name = 'YOUR_BOT_NAME';
  
  client.connect(
      {
          port: '1024',
          host: 'your_hostIPadress',
          allowHalfOpen: true
      },
      function() {
          var payload =
              userId + '\x00' +
              bot_name + '\x00' +
              text + '\x00'
          ;

          client.write(payload);
      }
  );

  client.on('error', function(err) {
      console.log('error', err);
  });

  client.on('data', function(data) {
      const payload = data.toString();
      const regex = /(.*?)\s?\*{3}/i;
      console.log('frombot', payload);

      let response = null;

      if (regex.test(payload)) {
          const matches = payload.match(regex);
          console.log(matches);

          response = {
              text: matches[1],
              showNextButton: true
          };
      }
      else {
          response = {
              text: payload
          };
      }
      const chatId = msg.chat.id;
      console.log('touser', response.text);
      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, response.text);
  });
});
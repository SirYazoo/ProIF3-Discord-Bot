var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const math = require('mathjs')
const disc = require('discord.js')
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // !calculate
            case 'calculate':
                let resp;
                try {
                    resp = math.evaluate(args.join(' '));
                } catch (e) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Sorry, please input a valid calculation.'
                    });
                }
                // const embed = new disc.MessageEmbed()
                // embed.setColor(0xffffff)
                // embed.setTitle('Math Calculation')
                // embed.addField('Input', `\`\`\`js\n${args.join('')}\`\`\``)
                // embed.addField('Output', `\`\`\`js\n${resp}\`\`\``)
                
                bot.sendMessage({
                    to: channelID,
                    message: resp
                });
            break;
         }
     }
});
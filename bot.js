var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const math = require('mathjs')
// const key = "AIzaSyACGpuXGnqm6XdcTJcX1LrlDWqdvAcCU4w";
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();
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
        // console.log(args)
        args = args.splice(1);
        // console.log(args)
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 3447003,
                        footer: {
                            text: '!help to see available commands'
                        },
                        title: 'Welcome to Calculator Bot',
                    }
                });
                break;
            // !help
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 3447003,
                        footer: {
                            text:
                                '!calculate : untuk mengoperasikan bilangan (ex : !calculate 2+7) ; untuk mengkonversikan ukuran (ex :!calculate 10 cm to meter)'

                        },
                        title: 'How to use this bot?',
                    }
                });
                break;

            // !calculate
            case 'calculate':
                let resp;
                if (args.length == 0) {
                    // console.log("KOSONG HEYY");
                    bot.sendMessage({
                        to: channelID,
                        message: 'Maaf bro inputnya mana ya?',
                        embed: {
                            color: 3447003,
                            title: 'Math Calculation Error!',
                            fields: [
                                {
                                    name: 'Output (Error):',
                                    value: `\`\`\`NO INPUT EXPRESSION!\`\`\``,
                                    inline: false
                                }
                            ],
                            image: {
                                url: 'https://i.imgur.com/ESU80CI.png',
                            },
                        }
                    });
                    break;
                }
                try {
                    resp = math.evaluate(args.join(' '));
                } catch (e) {
                    bot.sendMessage({
                        to: channelID,
                        embed: {
                            color: 3447003,
                            title: 'Math Calculation Error!',
                            fields: [
                                {
                                    name: 'Input: ',
                                    value: `\`\`\`js\n${args.join('')}\`\`\``,
                                    inline: false
                                },
                                {
                                    name: 'Output (Error):',
                                    value: `\`\`\`EXPRESSION'S SYNTAX IS NOT CORRECT!\`\`\``,
                                    inline: false
                                }
                            ]
                        }
                    });
                    break;
                }

                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 3447003,
                        title: 'Math Calculation',
                        fields: [
                            {
                                name: 'Input: ',
                                value: `\`\`\`js\n${args.join('')}\`\`\``,
                                inline: false
                            },
                            {
                                name: 'Output: ',
                                value: `\`\`\`js\n${resp}\`\`\``,
                                inline: false
                            }
                        ]
                    }
                });
                break;

            case 'trans':
                const text = args.slice(1).join(' ');;
                const target = args[0];

                async function translateText() {
                    // Translates the text into the target language. "text" can be a string for
                    // translating a single piece of text, or an array of strings for translating
                    // multiple texts.
                    let [translations] = await translate.translate(text, target);
                    translations = Array.isArray(translations) ? translations : [translations];
                    console.log('Translations:');
                    translations.forEach((translation, i) => {
                        console.log(`${text[i]} => (${target}) ${translation}`);
                    });
                }

                translateText();
                break;
        }
    }
});
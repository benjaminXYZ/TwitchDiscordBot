const tmi = require('tmi.js');
const Discord = require('discord.js');
const config = require('./config.json');

const options = {
    options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: config.twitch_username,
		password: config.twitch_token
	},
	channels: [ config.twitch_channel ]
}

const twitchbot = new tmi.Client(options);
var discordbot = new Discord.Client();

const discord_channel = config.discord_channel;
const twitch_channel = config.twitch_channel;
const twitch_username = config.twitch_username;
const maxlength = config.maxlength;

twitchbot.connect().catch(console.error);

twitchbot.on('message', (channel, userstate, message, self) => {
	if (self) return;
    if (userstate.username === twitch_username) return;
    discordbot.channels.fetch(discord_channel).then(channel => channel.send(userstate.username + ': ' + message));
});

discordbot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.id !== discord_channel) return;
    if (message.content.length > maxlength) {
        message.react("❌");
        return;
    }
    twitchbot.say(twitch_channel, message.author.username + ': ' + message.content);
});

discordbot.login(config.discord_token);
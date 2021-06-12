const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const APIUtils = require('./lib/api');

const globalConfig = {
    prefix: 'au!'
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    const args = message.content.slice(globalConfig['prefix'].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == 'map') {
        let mapData = await APIUtils.getMapRotationAPI();

        console.log(mapData);
        return;
    }
});

client.login(process.env.BOT_TOKEN);
const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const APIUtils = require('./lib/api');
const Utils = require('./lib/utils');

const globalConfig = {
    prefix: 'au!',
    colorTheme: '#fa8072'
}

client.on('ready', () => {
    let readyAt = client.readyAt.toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok',
        hour12: false,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    let logMessages = `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds. `;
    logMessages += `Ready at ${readyAt}`;
    console.log(logMessages);

    client.user.setActivity('🤔 !help', { type: 'LISTENING' });
});

client.on('message', async message => {
    const args = message.content.slice(globalConfig['prefix'].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let user = message.author;

    if (command == 'map') {
        if (args[0] == 'help') {
            let description = '**Description:** Check current apex legends\' map\n';
            description += '**Usage:** au!map [rank/arenas/normal]\n';
            description += '**Example:** au!map';

            const embed = new Discord.MessageEmbed()
                .setTitle('**Command: au!map**')
                .setDescription(description)
                .setColor(globalConfig['colorTheme'])

            message.channel.send(embed);
            return;
        }

        let mapData = await APIUtils.getMapRotationAPI();

        let title = '';
        let description = '';
        let map = '';
        if (args[0] == undefined || args[0] == 'normal') {
            map = mapData['battle_royale']['current']['map'];
            title = `Current map: ${map}`;

            description = `End in: ${mapData['battle_royale']['current']['remainingTimer']}`;
            description += `\nNext map: ${mapData['battle_royale']['next']['map']}`;
        }

        const embed = new Discord.MessageEmbed()
            .setColor(globalConfig['colorTheme'])
            .setAuthor(title, 'https://media.discordapp.net/attachments/616536510950408192/853238077630709780/apex.png?width=720&height=670')
            .setThumbnail(Utils.getMapThumbnail(map))
            .setDescription(description)
            .setFooter('Requested by ' + user.username, user.avatarURL())
            .setTimestamp(message.createdAt)

        message.channel.send(embed);
        return;
    }
});

client.login(process.env.BOT_TOKEN);
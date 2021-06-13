const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const APIUtils = require('./lib/api');
const Utils = require('./lib/utils');

const globalConfig = {
    prefix: 'au!',
    colorTheme: '#fa8072',
    errorTheme: '#ff0000'
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
    if (message.author.bot) return;
    const args = message.content.slice(globalConfig['prefix'].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let user = message.author;

    if (command == 'help') {
        let description = '►**help** : For guide to how to use bot\n';
        description += '►**map:** Check current apex legends\' map\n';
        description += '►**rank:** Fetching user\'s rank\n';

        const embed = new Discord.MessageEmbed()
            .setTitle('--- **Commands list** ---')
            .setDescription(description)
            .setColor(globalConfig['colorTheme'])

        message.channel.send(embed);
        return;
    }

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
        if (mapData['success'] == false) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`❌ ${userData['cause']} ❌`)
                .setColor(globalConfig['errorTheme'])

            message.channel.send(embed);
            return;
        }

        mapData = mapData['data'];

        let endin = '';
        let currentMap = '';
        let nextMap = ''
        if (args[0] == undefined || args[0] == 'normal' || args[0] == 'trios' || args[0] == 'duos') {
            currentMap = mapData['battle_royale']['current']['map'];
            nextMap = mapData['battle_royale']['next']['map'];

            endin = mapData['battle_royale']['current']['remainingTimer'];
        } else if (args[0] == 'arenas' || args[0] == 'arena') {
            currentMap = mapData['arenas']['current']['map'];
            nextMap = mapData['arenas']['next']['map'];

            endin = mapData['arenas']['current']['remainingTimer'];
        } else if (args[0] == 'rank') {
            currentMap = mapData['ranked']['current']['map'];
            nextMap = mapData['ranked']['next']['map'];
        }

        let description = '';
        if (endin != '') description = `**End in:** ${endin}`;
        description += `\n**Next map:** ${nextMap}`;

        const embed = new Discord.MessageEmbed()
            .setColor(globalConfig['colorTheme'])
            .setAuthor(currentMap, 'https://media.discordapp.net/attachments/616536510950408192/853238077630709780/apex.png?width=720&height=670')
            .setThumbnail(Utils.getMapThumbnail(currentMap))
            .setDescription(description)
            .setFooter('Requested by ' + user.username, user.avatarURL())
            .setTimestamp(message.createdAt)

        message.channel.send(embed);
        return;
    }

    if (command == 'rank') {
        if (args[0] == undefined || args[0] == 'help') {
            let description = '**Description:** Fetching user\'s rank\n';
            description += '**Usage:** au!rank [pc/xbox/psn]\n';
            description += '**Example:** au!rank FOG_KunG';

            const embed = new Discord.MessageEmbed()
                .setTitle('**Command: au!rank**')
                .setDescription(description)
                .setColor(globalConfig['colorTheme'])

            message.channel.send(embed);
            return;
        }

        let platform = '';
        let name = '';
        if (args.length == 1) {
            platform = 'origin';
            name = args[0];
        } else {
            platform = args[0] == 'pc' ? 'origin' : args[0];
            name = args[1];
        }

        let userData = await APIUtils.getPlayerProfile(platform, name);
        if (userData['success'] == false) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`❌ ${userData['cause']} ❌`)
                .setColor(globalConfig['errorTheme'])

            message.channel.send(embed);
            return;
        }

        let overviewStats = Utils.getOverviewStats(userData['data']['segments'])['stats'];
        let description = overviewStats['rankScore']['metadata']['rankName'];
        description += ` ( ${overviewStats['rankScore']['displayValue']} MMR )`;
        description += `, Level: ${overviewStats['level']['displayValue']}`;

        const embed = new Discord.MessageEmbed()
            .setColor(globalConfig['colorTheme'])
            .setTitle(overviewStats['rankScore']['metadata']['rankName'])
            .setAuthor(userData['data']['platformInfo']['platformUserHandle'], user.avatarURL())
            .setDescription(description)
            .setThumbnail(overviewStats['rankScore']['metadata']['iconUrl'])
            .setTimestamp(message.createdAt)
            .setFooter('API by https://tracker.gg', 'https://tracker.gg/public/icons/tile310.png');

        message.channel.send(embed);
        return;
    }

    if (command == 'github') {
        const embed = new Discord.MessageEmbed()
            .setTitle('**Apex Utilities Bot\'s Github**')
            .setDescription('https://github.com/tonkaew131/ApexUtilitiesBot')
            .setColor(globalConfig['colorTheme'])

        message.channel.send(embed);
        return;
    }
});

client.login(process.env.BOT_TOKEN);
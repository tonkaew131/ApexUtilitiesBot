const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const DatabaseUtils = require('./lib/db');
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

    client.user.setActivity('🤔 au!help', { type: 'LISTENING' });
});

client.on('message', async message => {
    if (message.author.bot) return;

    let prefix = '';
    if (message.guild == null) prefix = globalConfig['prefix'];
    else {
        prefix = DatabaseUtils.getGuildData(message.guild.id)['prefix'];

        let allowedChannels = DatabaseUtils.getGuildData(message.guild.id)['channels'];
        if (allowedChannels.length != 0) {
            if (allowedChannels.includes(message.channel.id) == false) return;
        }
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let user = message.author;

    if (command == 'help') {
        let description = '►**help** : For guide to how to use bot\n';
        description += '►**settings** : Config bot settings\n';
        description += '►**map:** Check current apex legends\' map\n';
        description += '►**rank:** Fetching user\'s rank\n';

        const embed = new Discord.MessageEmbed()
            .setTitle('--- **Commands list** ---')
            .setDescription(description)
            .setColor(globalConfig['colorTheme'])

        message.channel.send(embed);
        return;
    }

    if (command == 'settings') {
        if (message.guild == null) {
            message.channel.send('**You can\'t change settings in DM!**');
            return;
        }

        if (message.member.hasPermission('ADMINISTRATOR') == false) {
            message.channel.send('**You have to be administrator of this guild to change settings**');
            return;
        }

        if (args[0] == undefined || args[0] == 'help') {
            let description = '**Description:** Config bot settings\n';
            description += '**Settings:**\n';
            description += '- prefix: Set prefix\n';
            description += '- channels: Config command channels\n';

            const embed = new Discord.MessageEmbed()
                .setTitle('**Command: settings**')
                .setDescription(description)
                .setColor(globalConfig['colorTheme'])

            message.channel.send(embed);
            return;
        }

        if (args[0] == 'prefix') {
            if (args[1] == undefined) {
                let description = '**Description:** Set this guild\'s prefix\n';
                description += '**Usage**: settings prefix [prefix]\n';
                description += '**Example**: au!settings prefix !'

                const embed = new Discord.MessageEmbed()
                    .setTitle('**Settings: prefix**')
                    .setDescription(description)
                    .setColor(globalConfig['colorTheme'])

                message.channel.send(embed);
                return;
            }

            DatabaseUtils.updateGuildData(message.guild.id, { prefix: args[1] });
            message.channel.send(`<@${user.id}>, Prefix changed to \`${args[1]}\``);
            return;
        }

        if (args[0] == 'channels') {
            if (args[1] == undefined) {
                let description = '**Description:** Config command channels\n';
                description += '**Usage**: settings channels [add/remove/list] [channel id]\n';
                description += '**Example**: au!settings channels add 752859515119992837'

                const embed = new Discord.MessageEmbed()
                    .setTitle('**Settings: prefix**')
                    .setDescription(description)
                    .setColor(globalConfig['colorTheme'])

                message.channel.send(embed);
                return;
            }

            let channels = DatabaseUtils.getGuildData(message.guild.id)['channels'];
            if (args[1] == 'add') {
                if (args[2] == undefined) return;
                if (Utils.isValidChannel(message.guild, args[2]) == false) {
                    message.channel.send('**Invalid channel id**');
                    return;
                }

                if(channels.includes(args[2])) return;
                channels.push(args[2]);
                DatabaseUtils.updateGuildData(message.guild.id, { 'channels': channels });

                message.channel.send(`\`${args[2]}\` **added to list!**`);
                return;
            }
            if (args[1] == 'remove') {
                if(args[2] == undefined) return;
                if(channels.includes(args[2]) == false) {
                    message.channel.send('**Invalid channel id**');
                    return;
                }

                channels.splice(channels.indexOf(args[2]));
                DatabaseUtils.updateGuildData(message.guild.id, { 'channels': channels });

                message.channel.send(`\`${args[2]}\` **has been removed from list!**`);
                return;
            }
            if (args[1] == 'list') {
                if (channels.length == 0) {
                    message.channel.send('**There is no command channels set, bot will work every channels**');
                    return;
                }

                let result = `There ${channels.length == 1 ? 'is' : 'are'} ${channels.length}`;
                result += ` command channel${channels.length == 1 ? '' : 's'}`;
                for(var key in channels) {
                    result += `\n- \`${channels[key]}\``;
                }

                message.channel.send(result);
                return;
            }
            return;
        }

        return;
    }

    if (command == 'map') {
        if (args[0] == 'help') {
            let description = '**Description:** Check current apex legends\' map\n';
            description += '**Usage:** map [rank/arenas/normal]\n';
            description += '**Example:** au!map';

            const embed = new Discord.MessageEmbed()
                .setTitle('**Command: map**')
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
            description += '**Usage:** rank [pc/xbox/psn]\n';
            description += '**Example:** au!rank FOG_KunG';

            const embed = new Discord.MessageEmbed()
                .setTitle('**Command: rank**')
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
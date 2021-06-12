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
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    const args = message.content.slice(globalConfig['prefix'].length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let user = message.author;

    if (command == 'map') {
        let mapData = await APIUtils.getMapRotationAPI();

        if(args[0] == 'help') {
            let description = '**Description:** Get current map\n';
            description += '**Usage:** au!map [rank/arenas/normal]\n';
            description += '**Example:** au!map';

            const embed = new Discord.MessageEmbed()
                .setTitle('**Command: au!map**')
                .setDescription(description)
                .setColor(globalConfig['colorTheme'])

            message.channel.send(embed);
            return;
        }

        let description = 'End in: ';
        description += `\nnext map will be: ${mapData['battle_royale']['next']['map']} (last for )`;

        const embed = new Discord.MessageEmbed()
            .setColor(globalConfig['colorTheme'])
            .setAuthor(`Current map: ${mapData['battle_royale']['current']['map']}`, 'https://media.discordapp.net/attachments/616536510950408192/853238077630709780/apex.png?width=720&height=670')
            .setThumbnail(Utils.getMapThumbnail())
            .setDescription()
            .setFooter('Requested by ' + user.username, user.avatarURL())
            .setTimestamp(message.createdAt)

        message.channel.send(embed);
        return;
    }
});

client.login(process.env.BOT_TOKEN);
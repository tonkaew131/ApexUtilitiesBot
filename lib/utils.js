module.exports = {
    getMapThumbnail: function (mapName) {
        const data = {
            'Olympus': 'https://media.discordapp.net/attachments/616536510950408192/853239419180023818/crop.jpg?width=669&height=669',
            'World\'s Edge': 'https://cdn.discordapp.com/attachments/616536510950408192/853240058956873748/world_edge.jpg'
        };

        if (mapName in data) return data[mapName];
        return '';
    },
    getOverviewStats: function (segments) {
        for (var key in segments) {
            if (segments[key]['type'] == 'overview') return segments[key];
        }
        return {};
    },
    isValidChannel: function (guild, channelID) {
        return guild.channels.cache.find(c => c.id == channelID) != undefined;
    }
}
const mapRotationInfo = [
    {
        // 0
        maps: ['Olympus', 'World\'s Edge'],
        duration: 90
    },
    {
        // 1
        maps: ['Olympus', 'World\'s Edge'],
        duration: 60
    },
    {
        // 2
        maps: ['Olympus', 'World\'s Edge'],
        duration: 60
    },
    {
        // 3
        maps: ['Olympus', 'World\'s Edge'],
        duration: 120
    },
    {
        // 4
        maps: ['Olympus', 'World\'s Edge'],
        duration: 90
    },
    {
        // 5
        maps: ['Olympus', 'World\'s Edge'],
        duration: 120
    },
    {
        // 6
        maps: ['Olympus', 'World\'s Edge'],
        duration: 90
    },
    {
        // 7
        maps: ['Olympus', 'World\'s Edge'],
        duration: 120
    },
    {
        // 8
        maps: ['Olympus', 'World\'s Edge'],
        duration: 60
    },
    {
        // 9
        maps: ['Olympus', 'World\'s Edge'],
        duration: 90
    },
    {
        // 10
        maps: ['Olympus', 'World\'s Edge'],
        duration: 90
    },
    {
        // 11
        maps: ['Olympus', 'World\'s Edge'],
        duration: 120
    },
]

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
    },
    getNextMapRotaion: function (mapData, time) {
        return;
    },
    formatDate: function (date, time) {
        // +07:00 - Thailand utc time zone
        let timeStr = `${time}+07:00`;

        let currentTime = new Date();
        date = date.toLowerCase();
        if (date == 'today') {
            let todayTime = `${currentTime.getFullYear()}-`;
            todayTime += `${('0' + currentTime.getMonth()).slice(-2)}-`;
            todayTime += `${('0' + currentTime.getDate()).slice(-2)}`;
            todayTime += `T${timeStr}`;

            return Date.parse(todayTime);
        }

        if (date == 'tomorrow') {
            // tomorrow time
            let tomorrow = new Date(currentTime);
            tomorrow.setDate(currentTime.getDate() + 1);

            let tomorrowTime = `${tomorrow.getFullYear()}-`;
            tomorrowTime += `${('0' + tomorrow.getMonth()).slice(-2)}-`;
            tomorrowTime += `${('0' + tomorrow.getDate()).slice(-2)}`;
            tomorrowTime += `T${timeStr}`;

            return Date.parse(tomorrowTime);
        }

        return Date.parse(`${date} ${timeStr}`);
    }
}
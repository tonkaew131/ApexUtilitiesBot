const request = require('request');

require('dotenv').config();
const apexApiKey = process.env.APEX_API_KEY;

const apexApiCache = {
    mapRotationAPI: { timestamp: 0, data: {} }
}

module.exports = {
    getMapRotationAPI: function () {
        let time = Date.now();
        if ((time - apexApiCache['mapRotationAPI']['timestamp']) <= 5 * 60 * 1000) {
            return apexApiCache['mapRotationAPI']['data'];
        }

        return new Promise(function (resolve, reject) {
            let url = `https://api.mozambiquehe.re/maprotation?version=2&auth=${apexApiKey}`;
            request(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    let data = {
                        success: true,
                        data: JSON.parse(body)
                    };

                    apexApiCache['mapRotationAPI']['timestamp'] = time;
                    apexApiCache['mapRotationAPI']['data'] = data;

                    resolve(data);
                } else {
                    let errorCause = 'unknown';

                    resolve({
                        success: false,
                        cause: errorCause
                    });
                }
            });
        })
    },
    getPlayerProfile: function (platform, name) {
        return new Promise(function (resolve, reject) {
            let endpoint = `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${name}`;
            request(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve({ success: true, data: JSON.parse(body) });
                } else {
                    let errorCause = 'unknown';

                    resolve({
                        success: false,
                        cause: errorCause
                    });
                }
            });
        })
    }
}
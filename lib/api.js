const request = require('request');

require('dotenv').config();
const apexApiKey = process.env.APEX_API_KEY;

const apexApiCache = {
    mapRotationAPI: { timestamp: 0, data: {} }
}

module.exports = {
    getMapRotationAPI: function () {
        let time = Date.now();
        if((time - apexApiCache['mapRotationAPI']['timestamp']) <= 5 * 60 * 1000) {
            return apexApiCache['mapRotationAPI']['data'];
        }

        return new Promise(function (resolve, reject) {
            let url = `https://api.mozambiquehe.re/maprotation?version=2&auth=${apexApiKey}`;
            request(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    let errorCause = 'unknown';

                    if (error.toString().includes('ECONNREFUSED')) errorCause = 'BestMinion APIv2 is offline⏰';

                    resolve({
                        success: false,
                        cause: errorCause
                    });
                }
            });
        })
    }
}
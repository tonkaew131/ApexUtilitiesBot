import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

var GuildDB = new JsonDB(new Config("/database/guild_db", true, false, '/'));

module.exports = {
    isGuildDataExist: function (guildID) {
        console.log('test');
    }
};
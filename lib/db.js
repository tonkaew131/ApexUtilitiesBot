import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

var GuildDB = new JsonDB(new Config("/database/guild_db", true, false, '/'));

const defaultGuildData = {
    prefix: 'au!',
    channels: []
};

module.exports = {
    isGuildDataExist: function (guildID) {
        try {
            var data = GuildDB.getData(`/${guildID}`);
            return true;
        } catch (error) {
            return false;
        }
    },
    getGuildData: function (guildID) {
        if (this.isGuildDataExist(guildID) == false) {
            this.updateGuildData(guildID, defaultGuildData);
            return defaultGuildData;
        }

        var data = GuildDB.getData(`/${guildID}`);
        returndata;
    },
    updateGuildData: function (guildID, data) {
        GuildDB.push(`/${guildID}`, data, false);
    }
};
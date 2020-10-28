const { Client } = require("discord.js-light");
const addGuildData = require("./addGuildData");
const premiumTimeout = require("./premiumTimeout");
const updateAllInvites = require("./updateAllInvites");

module.exports = (client = new Client(), db) => {
    for (const guild of client.guilds.cache.array()) {
        addGuildData(client, guild, db)

        premiumTimeout(client, guild)
    }
}
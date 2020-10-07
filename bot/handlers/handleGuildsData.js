const { Client } = require("discord.js");
const addGuildData = require("./addGuildData");
const updateAllInvites = require("./updateAllInvites");

module.exports = (client = new Client(), db) => {
    for (const guild of client.guilds.cache.array()) {
        addGuildData(client, guild, db)

        updateAllInvites(client, guild)
    }
}
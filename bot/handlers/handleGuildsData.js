const { Client } = require("discord.js");
const addGuildData = require("./addGuildData");

module.exports = (client = new Client(), db) => {
    for (const guild of client.guilds.cache.array()) {
        addGuildData(client, guild, db)
    }
}
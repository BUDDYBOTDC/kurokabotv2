const { Message, Guild } = require("discord.js");
const addGuildData = require("../handlers/addGuildData");
const logNewServer = require("../handlers/logNewServer");
const memoryOptimization = require("../handlers/memoryOptimization");
const sendServerMessage = require("../handlers/sendServerMessage");

module.exports = async (client = new Client(), guild = new Guild(), db) => {
    logNewServer(client, guild)

    memoryOptimization(client)

    sendServerMessage(client, guild)

    addGuildData(client, guild, db)
}
const { Message, Guild } = require("discord.js");
const logNewServer = require("../handlers/logNewServer");
const sendServerMessage = require("../handlers/sendServerMessage");

module.exports = async (client = new Client(), guild = new Guild()) => {
    logNewServer(client, guild)

    sendServerMessage(client, guild)
}
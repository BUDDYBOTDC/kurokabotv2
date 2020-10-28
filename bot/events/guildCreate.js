const { Message, Guild } = require("discord.js-light");
const addGuildData = require("../handlers/addGuildData");
const fireEvent = require("../handlers/fireEvent");
const logNewServer = require("../handlers/logNewServer");
const memoryOptimization = require("../handlers/memoryOptimization");
const sendServerMessage = require("../handlers/sendServerMessage");

module.exports = async (client = new Client(), guild = new Guild(), db) => {

    fireEvent(client)
    
    logNewServer(client, guild)

    sendServerMessage(client, guild)

    addGuildData(client, guild, db)
}
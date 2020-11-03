const { Message, Guild } = require("discord.js-light");
const addGuildData = require("../handlers/addGuildData");
const fireEvent = require("../handlers/fireEvent");
const logNewServer = require("../handlers/logNewServer");
const memoryOptimization = require("../handlers/memoryOptimization");
const sendServerMessage = require("../handlers/sendServerMessage");
const updateAllInvites = require("../handlers/updateAllInvites");

module.exports = async (client = new Client(), guild = new Guild(), db) => {

    fireEvent(client)
    
    logNewServer(client, guild)

    sendServerMessage(client, guild)

    updateAllInvites(client, guild)
    
    addGuildData(client, guild, db)
}
const { Client, Message } = require("discord.js");
const commandHandler = require("../handlers/commandHandler");

module.exports = (client = new Client(), omsg = new Message(), msg = new Message()) => {

    if (omsg && omsg.content && omsg.content === msg.content) return
    
    commandHandler(client, msg)
}
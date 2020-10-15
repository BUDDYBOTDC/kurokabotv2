const { Client, Message } = require("discord.js");
const commandHandler = require("../handlers/commandHandler");
const fireEvent = require("../handlers/fireEvent");

module.exports = (client = new Client(), omsg = new Message(), msg = new Message()) => {

    fireEvent(client)
    
    if (omsg && omsg.content && omsg.content === msg.content) return
    
    commandHandler(client, msg)
}
const { Client, Message } = require("discord.js");
const kuroka = require("../utils/kuroka");

module.exports = (client = new Client(), message = new Message()) => {

    return
    
    if (message.author.bot || message.channel.type === "dm") return

    if (message.mentions.users.has(client.user.id)) {

        return message.channel.send(`Hello, my prefix is \`${client.prefix}\`, use \`${client.prefix}help\` for a full command list ${kuroka(client)}`)

    }
}
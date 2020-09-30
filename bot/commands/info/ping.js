const { Client, Message } = require("discord.js");

module.exports = {
    name: "ping",
    description: "returns the bot's ping.",
    cooldown: 5000,
    category: "info",
    execute: async (client = new Client(), message = new Message()) => {

        const msg = await message.channel.send(`Pinging...`)

        msg.edit(`Pong! ${msg.createdTimestamp - message.createdTimestamp}ms`)

    }
}
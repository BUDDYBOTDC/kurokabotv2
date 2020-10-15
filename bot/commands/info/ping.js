const { Client, Message } = require("discord.js");

module.exports = {
    name: "ping",
    description: "returns the bot's ping.",
    cooldown: 5000,
    category: "info",
    execute: async (client = new Client(), message = new Message()) => {

        const msg = await message.channel.send(`Pinging...`)

        const start = Date.now()
        await client.objects.guilds.findOne({where:{ guildID: message.guild.id}})
        const end = Date.now() - start

        msg.edit(`WS Latency: ${client.ws.ping}ms\nBot Latency: ${msg.createdTimestamp - message.createdTimestamp}ms\nDatabase Latency: ${end}ms`)

    }
}
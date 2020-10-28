const { Client, Message } = require("discord.js-light");
const giveawayMessage = require("../../classes/giveawayMessage");

module.exports = {
    name: "fetch-giveaway",
    description: "fetches a giveaway manually.",
    category: "owner",
    usages: [
        "<channelID> <messageID>"
    ],
    examples: [
        "594302085783929 3975842987583929"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        return message.channel.send("Not working")
        
        const channel = await client.channels.fetch(args[0]).catch(err => {})

        if (!channel) return message.channel.send(`Channel with ID ${args[0]} not found.`)

        const m = await channel.messages.fetch(args[1]).catch(err => {})

        if (!m) return message.channel.send(`Message with ID ${args[1]} not found.`)
        
        const messages = await db.fetch(`giveawayMessages_0`) || []

        const data = messages.find(e => e.messageID === args[1])

        const pos = messages.findIndex(e => e.messageID === args[1])

        messages[pos].ended = false

        data.ended = false
        
        await db.set(`giveawayMessages_0`, messages)

        message.channel.send(`Giveaway fetched.`)

        new giveawayMessage(m, data)
    }
}
const { Client, Message } = require("discord.js");
const giveawayMessage = require("../../classes/giveawayMessage");

module.exports = {
    name: "re-roll",
    cooldown: 1000,
    category: "giveaway",
    description: "re-rolls a giveaway that's ended already (or the most recent one)",
    aliases: ["reroll"],
    permissions: [
        "MANAGE_GUILD",
    ],
    fields: [
        "[messageID]"
    ],
    examples: [
        "684938369392295832"
    ],
    overridePermissions: true,
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        var msg 

        if (args.length) {
            let d = await client.objects.giveaways.findOne({ where: { messageID: args[0] }})

            if (!d) return message.channel.send(`:x: There isn't any giveaway with this message ID.`)

            else msg = await d.toJSON()
        } else {
            let d = await client.objects.giveaways.findAll({ where: { channelID: message.channel.id }})

            msg = d.reverse()[0]

            if (!msg) return message.channel.send(`:x: Could not find any giveaway in this channel.`)
        }

        if (!msg.ended) return message.channel.send(`:x: This giveaway hasn't ended yet`)

        const channel = await client.channels.fetch(msg.channelID)

        const m = await channel.messages.fetch(msg.messageID)

        message.react("✅")

        new giveawayMessage(m, msg).reroll()
    }
}
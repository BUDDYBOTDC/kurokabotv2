const { Client, Message } = require("discord.js-light");
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
        "[messageID] [winners]"
    ],
    examples: [
        "684938369392295832 1",
        "674929448291918383"
    ],
    overridePermissions: true,
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        var msg 

        if (args.length) {
            let d = await client.objects.giveaways.findOne({ where: { messageID: args[0], guildID: message.guild.id }})

            if (!d) return message.channel.send(`:x: There isn't any giveaway with this message ID.`)

            else msg = await d.toJSON()

            if (args[1]) {
                const n = Number(args[1])

                if (isNaN(n)) return message.channel.send(`\`${args[1]}\` is not a valid amount of winners.`)

                if (n < 1 && n > 20) return message.channel.send(`Amount of winners can't be smaller than 1 or greater than 20.`)

                msg.winners = n

                await client.objects.giveaways.update({ winners: n }, { where: { messageID: args[0] }})
            }
        } else {
            let d = await client.objects.giveaways.findAll({ where: { channelID: message.channel.id }})

            msg = d.reverse()[0]

            if (!msg) return message.channel.send(`:x: Could not find any giveaway in this channel.`)
        }

        if (typeof msg.get === "function") {
            if (!msg.get("ended")) return message.channel.send(`:x: This giveaway hasn't ended yet`)
        } else {
            if (!msg.ended) return message.channel.send(`:x: This giveaway hasn't ended yet`)
        }

        const channel = message.channel

        const m = await channel.messages.fetch(msg.messageID)

        message.react("✅")

        new giveawayMessage(m, msg).reroll()
    }
}
const giveawayMessage = require("../../classes/giveawayMessage")
const shardChannel = require("../../functions/shardChannel")

module.exports = {
    name: "end",
    cooldown: 1000,
    description: "ends the last giveaway or a giveaway with given message ID",
    category: "giveaway",
    fields: [
        "[messageID]"
    ],
    examples: [
        "6942993857429103085"
    ],
    overridePermissions: true,
    permissions: ["MANAGE_GUILD"],
    execute: async (client, message, args, db) => {

        var msg 

        if (args.length) {
            let d = await client.objects.giveaways.findOne({ where: { messageID: args[0], guildID: message.guild.id }})

            if (!d) return message.channel.send(`:x: There isn't any giveaway with this message ID.`)

            else msg = await d.toJSON()
        } else {
            let d = await client.objects.giveaways.findAll({ where: { channelID: message.channel.id }})

            msg = d.reverse()[0]

            if (!msg) return message.channel.send(`:x: Could not find any giveaway in this channel.`)
        }

        if (Date.now() >= msg.endsAt) return message.channel.send(`This giveaway has been ended already lol`)
        
        const channel = await client.channels.fetch(msg.channelID)

        const m = await channel.messages.fetch(msg.messageID)

        new giveawayMessage(m, msg).end()

        message.react("✅")
    }
}
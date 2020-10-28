const { Message } = require("discord.js-light");

module.exports = {
    name: "delete-giveaway",
    description: "deletes a giveaway from this guild by using it's message ID.",
    permissions: [
        "MANAGE_GUILD"
    ],
    overridePermissions: true,
    usages: [
        "<messageID>"
    ],
    examples: [
        "563929486839294856"
    ],
    aliases: [
        "deletegw",
        "deletegiveaway",
        "delgiveaway",
        "delgw"
    ],
    category: "giveaway",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const gw = await client.objects.giveaways.findOne({
            where: {
                guildID: message.guild.id,
                messageID: args[0]
            }
        })

        if (!gw) return message.channel.send(`Giveaway with ID ${args[0]} does not exist.`)

        const channel = message.guild.channels.cache.get(gw.get("channelID"))

        if (!channel) return message.channel.send(`Giveaway with ID ${args[0]} does not exist.`)

        const m = await channel.messages.fetch(gw.get("messageID")).catch(err => {})

        if (!m) return message.channel.send(`Giveaway with ID ${args[0]} does not exist.`)

        await m.delete().catch(err => {})
        
        await client.objects.giveaways.update({
            ended: true
        }, {
            where: {
                guildID: message.guild.id,
                messageID: args[0]
            }
        })

        message.channel.send(`The giveaway has been deleted.`)
    }
}
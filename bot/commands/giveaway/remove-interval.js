const { Client, Message } = require("discord.js");

module.exports = {
    name: "remove-interval",
    description: "delete a scheduled giveaway.",
    premium: true,
    aliases: [
        "ri",
        "removeinterval",
        "removeint",
        "rint"
    ],
    usages: [
        "<code>"
    ],
    examples: [
        "68dimf49m"
    ],
    cooldown: 5000,
    category: "giveaway",
    permissions: [
        "MANAGE_GUILD",
    ],
    overridePermissions: true,
    execute: async (client =new Client(), message = new Message(), args = []) => {

        const gw = await client.objects.giveaways.findOne({
            where: {
                guildID: message.guild.id,
                code: args[0]
            }
        })

        if (!gw) return message.channel.send(`This code (${args[0]}) does not belong to any scheduled giveaway.`)

        await client.objects.giveaways.update({
            removed: true,
            interval: 0
        }, {
            where: {
                guildID: message.guild.id,
                code: args[0]
            }
        })
        message.channel.send(`Successfully removed this scheduled giveaway.`)
    }
}
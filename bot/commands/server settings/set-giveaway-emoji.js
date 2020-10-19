const { Client, Message } = require("discord.js");

module.exports = {
    name: "set-giveaway-emoji",
    aliases: [
        "setgemoji",
        "sge",
        "gemoji",
        "setgiveawayemoji"
    ],
    description: "set a custom giveaway emoji for this guild, or resets it.",
    category: "server settings",
    usages: [
        "<emoji | reset>"
    ],
    examples: [
        "<:tada:4848392929481209>"
    ],
    cooldown: 10000,
    permissions: [
        "ADMINISTRATOR"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        if (args[0].toLowerCase() === "reset") {
            await client.objects.guilds.update({
                giveaway_emoji: "🎉"
            }, {
                where: {
                    guildID: message.guild.id
                }
            })
            
            message.channel.send(`Giveaway emoji set to 🎉.`)

            return
        }

        try {
            const giveaways = await client.objects.giveaways.findOne({
                where: {
                    guildID: message.guild.id,
                    ended: false,
                    removed: null
                }
            })
    
            if (giveaways) return message.channel.send(`You can't change the giveaway emoji because there are active giveaways.`)
    
            const id = args[0].split("<")[1].split(">")[0]

            await client.objects.guilds.update({
                giveaway_emoji: id
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`Giveaway emoji set to ${emoji}.\nPlease make sure this emoji is on this guild.`)
        } catch (error) {
            return message.channel.send(`Invalid emoji format given.`)
        }
    }
}
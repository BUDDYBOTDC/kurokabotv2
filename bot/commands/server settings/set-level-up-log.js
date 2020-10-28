const { Client, Message } = require("discord.js-light");
const findChannel = require("../../functions/findChannel")

module.exports = {
    name: "set-level-up-log",
    aliases: [
        "setlvluplog",
        "setlvulog",
        "setleveluplog",
    ],
    description: "the bot will send a message (customizable) to this channel everytime an user levels up.",
    cooldown: 5000,
    category: "server settings",
    permissions: [
        "MANAGE_GUILD"
    ],
    usages: [
        "<channel | disable>"
    ],
    examples: [
        "#channel",
        "67992639283582919",
        "channel",
        "disable"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const guildData = await client.objects.guilds.findOne({
            where: {
                guildID: message.guild.id
            }
        })

        const levelSettings = JSON.parse(guildData.get("level_settings"))

        if (args[0].toLowerCase() === "disable") {
            levelSettings.channelID = "0"
            
            await client.objects.guilds.update({
                level_settings: JSON.stringify(levelSettings)
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`Levelup logs channel has been disabled.`)

            return
        }

        const channel = findChannel(message, args, false)

        if (!channel) return message.channel.send(`Could not find the requested channel.`)

        levelSettings.channelID = channel.id
            
        await client.objects.guilds.update({
            level_settings: JSON.stringify(levelSettings)
        }, {
            where: {
                guildID: message.guild.id
            }
        })

        message.channel.send(`Levelup logs channel has been set to ${channel}.`)
    }
}
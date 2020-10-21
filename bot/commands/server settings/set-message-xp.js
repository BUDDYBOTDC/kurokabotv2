const { Client, Message } = require("discord.js");
const ms = require("ms");
const findChannel = require("../../functions/findChannel")
const parser = require("ms-parser")

module.exports = {
    name: "set-message-exp",
    aliases: [
        "setmessageexp",
        "setmsgxp",
        "setmsgxp",
    ],
    description: "determines the experience gained per message.",
    cooldown: 5000,
    category: "server settings",
    permissions: [
        "MANAGE_GUILD"
    ],
    usages: [
        "<amount>"
    ],
    examples: [
        "5",
        "10",
        "20"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const guildData = await client.objects.guilds.findOne({
            where: {
                guildID: message.guild.id
            }
        })

        const levelSettings = JSON.parse(guildData.get("level_settings"))

        const n = Number(args[0])

        if (!n > 0 && !n < 1000) return message.channel.send(`The amount of experience gained per message must be between 1 and 999.`)

        levelSettings.message_xp = n
            
        await client.objects.guilds.update({
            level_settings: JSON.stringify(levelSettings)
        }, {
            where: {
                guildID: message.guild.id
            }
        })

        message.channel.send(`Experience gained per message has been set to ${args[0]}.`)
    }
}
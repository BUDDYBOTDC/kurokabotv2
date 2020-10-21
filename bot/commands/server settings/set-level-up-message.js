const { Client, Message } = require("discord.js");
const ms = require("ms");
const findChannel = require("../../functions/findChannel")
const parser = require("ms-parser")

module.exports = {
    name: "set-level-up-message",
    aliases: [
        "setleveupmessage",
        "setlvupmessage",
        "setlvupmsg",
    ],
    description: "sets a custom message that will be sent everytime an user levels up. (if theres a levelup logging channel set.)",
    cooldown: 5000,
    category: "server settings",
    permissions: [
        "MANAGE_GUILD"
    ],
    usages: [
        "<message>"
    ],
    examples: [
        "{user.name} is now level {level}",
        "{user.mention} is now level {level}, they need {exp.req} for the next level."
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const msg = args.join(" ")

        const guildData = await client.objects.guilds.findOne({
            where: {
                guildID: message.guild.id
            }
        })

        const levelSettings = JSON.parse(guildData.get("level_settings"))

        if (msg.length >= 200) return message.channel.send(`The message is too long.`)

        levelSettings.message = msg
            
        await client.objects.guilds.update({
            level_settings: JSON.stringify(levelSettings)
        }, {
            where: {
                guildID: message.guild.id
            }
        })

        message.channel.send(`Levelup message has been changed to:\n\`${msg}\`.`)
    }
}
const { Client, Message } = require("discord.js");
const ms = require("ms");
const findChannel = require("../../functions/findChannel")
const parser = require("ms-parser")

module.exports = {
    name: "set-message-cooldown",
    aliases: [
        "setmessagecooldown",
        "setmsgcooldown",
        "setmsgcd",
    ],
    description: "this will only affect the experience gained per message.",
    cooldown: 5000,
    category: "server settings",
    permissions: [
        "MANAGE_GUILD"
    ],
    usages: [
        "<time>"
    ],
    examples: [
        "5s",
        "1m",
        "1h"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const guildData = await client.objects.guilds.findOne({
            where: {
                guildID: message.guild.id
            }
        })

        const levelSettings = JSON.parse(guildData.get("level_settings"))

        const time = ms(args[0])

        if (!time) return message.channel.send(`Could not parse ${args[0]}.`)

        if (time < 1000 || time > 3600000) return message.channel.send(`Cooldown can't be smaller than a second or bigger than an hour.`)
        
        levelSettings.cooldown = time
            
        await client.objects.guilds.update({
            level_settings: JSON.stringify(levelSettings)
        }, {
            where: {
                guildID: message.guild.id
            }
        })

        message.channel.send(`Message cooldown has been set to ${parser(args[0]).string}.`)
    }
}
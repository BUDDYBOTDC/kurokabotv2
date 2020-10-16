const { Message } = require("discord.js");
const findChannel = require("../../functions/findChannel")

module.exports = {
    name: "set-invite-logs",
    aliases: [
        "sil",
        "setinvitelogs",
        "set-invite-log",
        "setinvitelog",
        "setil",
        "setilog"
    ],
    description: "set the invite log channel for this guild, or delete it.",
    cooldown: 5000,
    category: "server settings",
    permissions: [
        "MANAGE_GUILD"
    ],
    usages: [
        "<channel>",
        "disable"
    ],
    examples: [
        "disable",
        "#channel",
        "channel",
        "768392938758283848"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        if (args[0].toLowerCase() === "disable") {
            await client.objects.guilds.update({
                invite_logs: "0"
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`Successfully disabled / deleted the invite log channel for this guild.`)
        } else {
            const channel = findChannel(message, args, false)

            if (!channel) return message.channel.send(`Could not find any channel.`)

            await client.objects.guilds.update({
                invite_logs: channel.id
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`Successfully set the invite log channel to ${channel}.`)
        }
    }
}
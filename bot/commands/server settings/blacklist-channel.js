const { Client, Message } = require("discord.js-light");
const findChannel = require("../../functions/findChannel");

module.exports = {
    name: "blacklist-channel",
    description: "blacklist a channel from being used for bot commands, or unblacklist a channel.",
    usages: [
        "<option: add | delete> <channel>",
    ],
    aliases: [
        "blacklistchannel",
        "blchannel",
        "blch",
        "blc"
    ],
    examples: [
        "add #general",
        "delete bot-commands"
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    category: "server settings",
    cooldown: 3000,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const option = ["add", "delete"].find(e => args[0].toLowerCase() === e)

        if (!option) return message.channel.send(`\`${args[0]}\` is not a valid option.\nValid options are: \`enable\` and \`disable\``)

        args.shift()

        const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        let channels = JSON.parse(guildData.get("blacklistedChannels"))

        if (option === "add") {
            const channel = findChannel(message, args, false)

            if (!channel) return message.channel.send(`Could not find the channel you asked for.`)

            if (channels.includes(channel.id)) return message.channel.send(`the channel ${channel} is already blacklisted.`)

            channels.push(channel.id)

            await client.objects.guilds.update({
                blacklistedChannels: JSON.stringify(channels)
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`Successfully blacklisted ${channel}.\nThe bot won't reply to any of the commands used there.`)
            
        } else {
            const channel = findChannel(message, args, false)

            if (!channel) return message.channel.send(`Could not find the channel you asked for.`)

            if (!channels.includes(channel.id)) return message.channel.send(`the channel ${channel} is not blacklisted.`)

            channels = channels.filter(id => channel.id !== id)

            await client.objects.guilds.update({
                blacklistedChannels: JSON.stringify(channels)
            }, {
                where: {
                    guildID: message.guild.id
                }
            })
            
            message.channel.send(`Successfully unblacklisted ${channel}.\nThe bot will now reply to commands used there.`)
        }
    }
}
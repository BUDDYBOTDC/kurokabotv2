const { Client, Message } = require("discord.js");
const findChannel = require("../../functions/findChannel")

module.exports ={
    name: "ignore-channel",
    description: "add, or delete a channel from counting messages.",
    usages: [
        "<option: add | delete> <channel>"
    ],
    examples: [
        "add 678493937573829268",
        "delete #channel",
        "add channel"
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    category: "server settings",
    cooldown: 3000,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const option = args.shift().toLowerCase()

        const guildData = await client.objects.guilds.findOne({ where: {guildID: message.guild.id }})

        let channels = JSON.parse(guildData.get("ignoreChannels"))

        if (option === "add") {
            const channel = findChannel(message, args, false)

            if (!channel) return message.channel.send(`Could not find the channel you wanted to blacklist.`)

            if (channels.includes(channel.id)) return message.channel.send(`${channel} is already blacklisted.`)

            channels.push(channel.id)

            message.channel.send(`Successfully blacklisted ${channel}, new messages sent here won't be counted.`)
            
        } else if (option === "delete") {
            const channel = findChannel(message, args, false)

            if (!channel) return message.channel.send(`Could not find the channel you wanted to whitelist.`)

            if (!channels.includes(channel.id)) return message.channel.send(`${channel} is not blacklisted.`)

            channels = channels.filter(id => id !== channel.id)

            message.channel.send(`Successfully whitelisted ${channel}, new messages sent here will be counted.`)
        }

        await client.objects.guilds.update({
            ignoreChannels: JSON.stringify(channels)
        }, {
            where: {
                guildID: message.guild.id
            }
        })
    }
}
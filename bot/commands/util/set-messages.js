const { Client, Message } = require("discord.js");
const findMember = require("../../functions/findMember")

module.exports = {
    name: "set-messages",
    description: "sets someones messages in this guild.",
    permissions: [
        "MANAGE_GUILD"
    ],
    category: "util",
    cooldown: 3000,
    usages: [
        "<amount> [member]"
    ],
    examples: [
        "400",
        "100 Ruben",
        "1 @Ruben"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const amount = Number(args[0])

        if (isNaN(amount)) return message.channel.send(`${args[0]} is not a valid amount.`)

        if (amount < 1) return message.channel.send(`Are you adding or substracting?`)

        const member = findMember(message, args.slice(1))

        const d = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: message.author.id }})

        if (!d) return message.channel.send(`Can't add messages to ${member.user.username}.`)

        await d.increment("messages", amount)
    
        message.channel.send(`Successfully added ${amount} messages to ${member.user.username}.`)
    }
}
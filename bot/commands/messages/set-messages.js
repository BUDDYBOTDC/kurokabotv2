const { Client, Message } = require("discord.js-light");
const findMember = require("../../functions/findMember")

module.exports = {
    name: "set-messages",
    aliases: ["setmessages"],
    description: "sets someones messages in this guild.",
    permissions: [
        "MANAGE_GUILD"
    ],
    category: "messages",
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

        if (amount < 1) return message.channel.send(`Are you setting or removing?`)

        const member = await findMember(message, args.slice(1))

        const d = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: message.author.id }})

        if (!d) return message.channel.send(`Can't set messages to ${member.user.username}.`)

        client.objects.guild_members.update({ messages: amount }, { where: { guildID: message.guild.id, userID: member.user.id }})
    
        message.channel.send(`Successfully set ${member.user.username} messages to ${amount}.`)
    }
}
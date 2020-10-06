const { Message } = require("discord.js");

module.exports = {
    name: "set-invites",
    aliases: [
        "setinvites"
    ],
    description: "sets a number of real / fake invites to an user.",
    usages: [
        "<typeInvite> <amount> <user>"
    ],
    examples: [
        "real 10 @Ruben",
        "fake 0 58439294889292"
    ],
    category: "invites",
    permissions: [
        "MANAGE_GUILD"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const type = {
            real: "invites_real",
            fake: "invites_fake"
        }[args[0].toLowerCase()]

        if (!type) return message.channel.send(`${args[0]} is not a valid invite type.`)

        const amount = Number(args[1])

        if (isNaN(amount)) return message.channel.send(`${args[1]} is not a valid amount.`)

        if (amount < 0) return message.channel.send(`You can't set the invites to something less than 0.`)

        const member = message.mentions.members.first() || message.guild.member(args[2])

        if (!member) return message.channel.send(`Could not find the requested member.`)

        const d = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: member.user.id }})

        if (!d) return message.channel.send(`Cannot set invites to user ${member.user.username}.`)

        if (type === "invites_real") {
            await client.objects.guild_members.update({ invites_real: amount }, { where: { guildID: message.guild.id, userID: member.user.id }})
        } else {
            await client.objects.guild_members.update({ invites_fake: amount }, { where: { guildID: message.guild.id, userID: member.user.id }})
        }

        message.channel.send(`Successfully set ${member.user.username}'s ${args[0].toLowerCase()} invites to ${amount}.`)
    }
}
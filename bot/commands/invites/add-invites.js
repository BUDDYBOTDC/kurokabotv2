const { Message } = require("discord.js");
const findMember = require("../../functions/findMember");

module.exports = {
    name: "add-invites",
    aliases: [
        "addinvites"
    ],
    description: "adds a number of real / fake invites to an user.",
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

        if (amount < 1) return message.channel.send(`You can't add less than 1 invite.`)

        const member = await findMember(message, args.slice(2), false)

        if (!member) return message.channel.send(`Could not find the requested member.`)

        const d = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: member.user.id }})

        if (!d) return message.channel.send(`Cannot add invites to user ${member.user.username}.`)

        let item = d.get(type)

        if (type === "invites_real") {
            await client.objects.guild_members.update({ invites_real: item + amount }, { where: { guildID: message.guild.id, userID: member.user.id }})
        } else {
            await client.objects.guild_members.update({ invites_fake: item + amount }, { where: { guildID: message.guild.id, userID: member.user.id }})
        }

        message.channel.send(`Successfully added ${amount} ${args[0].toLowerCase()} invites to ${member.user.username}.`)
    }
}
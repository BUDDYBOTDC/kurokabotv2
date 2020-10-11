const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "user-invites",
    description: "see the IDs of the users an user has invited to this guild.",
    aliases: [
        "userinvites",
        "uinvites",
        "invitesu"
    ],
    cooldown: 5000,
    category: "staff",
    usages: [
        "userID"
    ],
    examples: [
        "76849928574929285"
    ],
    execute: async (client = new Client(), message = new Message(), args= []) => {

        const m = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: args[0] }})

        const member = await message.guild.members.fetch({
            user: args[0],
            cache: false
        }).catch(Err => {})

        if (!member) return message.channel.send(`This user is not in this guild.`)

        if (!m) return message.channel.send(`This user is not registered in the database.`)

        const all = await client.objects.guild_members.findAll({
            where: {
                guildID: message.guild.id,
                invited_by: member.user.id
            }
        })

        const IDs = all.map(e => `<@${e.userID}> (${e.userID})`).slice(0, 30)

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic:true}))
        .setTitle(`Users Invited By Them (IDS)`)
        .setDescription(
            all.length > IDs.length ? IDs.join("\n") + `\nAnd ${all.length - 30} users more.` : IDs.join("\n")
        )

        message.channel.send(embed)
    }
}
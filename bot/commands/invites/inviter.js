const { Client, Message, MessageEmbed } = require("discord.js");
const findMember = require("../../functions/findMember");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "inviter",
    description: "displays the user's username of the user that invite this user (if one)",
    cooldown: 3000,
    category: "invites",
    permissions: [
        "MANAGE_MESSAGES"
    ],
    fields: [
        "<user>"
    ],
    examples: [
        "Ruben",
        "6784398583922843",
        "@Ruben"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const member = findMember(message, args)

        const m = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: member.user.id }})

        if (!m) return message.channel.send(`${member.user.username} is not registered in the database.`)

        const inviter = await client.users.fetch(m.get("invited_by"), false).catch(err=> {})

        const color = await getCustomEmbed(client, message.guild.id, "invites")

        const embed = new MessageEmbed()
        .setColor(color)
        .setAuthor(`${member.user.username} was invited by:`, member.user.displayAvatarURL({dynamic:true}))
        .setDescription(inviter ? inviter.tag : "Unknown")

        message.channel.send(embed)
    }
}
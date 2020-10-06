const { Client, Message, MessageEmbed } = require("discord.js");
const findMember = require("../../functions/findMember");
const tableVariablesValues = require("../../utils/tableVariablesValues");

module.exports = {
    name: "invites",
    description: "displays user's invites.",
    fields: [
        "<user>"
    ],
    examples: [
        "@Ruben",
        "58539209384832993"
    ],
    cooldown: 5000,
    category: "invites",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            
            const member = findMember(message, args)

            const d = await client.objects.guild_members.findOne({ where: { userID: member.user.id, guildID: message.guild.id }})
    
            try {
                var data = await d.toJSON()
            } catch (error) {
                data = tableVariablesValues.GUILD_MEMBER(message.guild, member.user) 
            }

            const user = await client.users.fetch(data.invited_by, false).catch(err => {})

            let invitedBy = !user ? "" : `**Invited By**: ${user.tag}\n`
            const embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(`${member.user.username}'s Invites:`, member.user.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`${invitedBy}**Total Invites**: ${data.invites_real + data.invites_fake || 0}
**Real Invites**: ${data.invites_real || 0}
**Fake Invites**: ${data.invites_fake || 0}
`)
    
            message.channel.send(embed)
        } catch (error) {
            message.channel.send(`Error! ${error.message}`)
        }
    }
}
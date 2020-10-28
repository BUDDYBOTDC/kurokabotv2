const { Client, Message, MessageEmbed } = require("discord.js-light");
const findMember = require("../../functions/findMember")

module.exports = {
    name: "level",
    aliases: [
        "lv"
    ],
    description: "shows the user's level in this guild.",
    fields: [
        "[userID]"
    ],
    examples: [
        "@Ruben",
        "64288667339293858285"
    ],
    cooldown: 5000,
    category: "level",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const member = await findMember(message, args, true)
        
        const guildData = await client.objects.guilds.findOne({
            where: {
                guildID: message.guild.id
            }
        })

        const levelSettings = JSON.parse(guildData.get("level_settings"))

        const memberData = await client.objects.guild_members.findOne({
            where: {
                guildID: message.guild.id,
                userID: member.user.id
            }
        })

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`${member.user.username}'s Level`, member.user.displayAvatarURL({dynamic:true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setDescription(`
**Level**: ${memberData.get("level") || 1}  (${((memberData.get("experience") || 0) * 100 / eval(levelSettings.formula.replace(`{level}`, (memberData.get("level") || 0)))).toFixed(2)}%)
**Experience**: ${memberData.get("experience") || 0} / ${eval(levelSettings.formula.replace(`{level}`, (memberData.get("level") || 0)))}
**Next Level**: ${eval(levelSettings.formula.replace(`{level}`, (memberData.get("level") || 0))) - (memberData.get("experience") || 0)}
**Total Messages**: ${memberData.get("messages") || 0}
`)

        message.channel.send(embed)
    }
}
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "guild-invites-info",
    description: "lists all the invites of this guild.",
    category: "staff",
    fields: [
        "<page>"
    ],
    examples: [
        "3"
    ],
    aliases: [
        "guildinvitesinfo",
        "ginvitesinfo",
        "gii",
        "g-invites-info",
        "giinfo"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const msg = await message.channel.send(`Loading...`)
        
        try {   
            const invites = await client.objects.guild_invites.findAll({ where: { guildID: message.guild.id }})

            const pages = Math.trunc(invites.length / 15 + 1)

            let page = Number(args[0])

            if (page > pages) page = 1
            else if (page < 1) page = 1
            else if (isNaN(page)) page = 1

            const x = Number(page) * 15 / 15 - 1 || 0, y = Number(page) * 15 || 15

            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic:true}))
            .setTitle(`Guild Invites Info - Database`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`Page ${page} of ${pages}.`)

            for (const i of invites.slice(x, y)) {
                embed.addField(`Code: ${i.code}`, `GuildID: ${i.guildID}\nUserID: ${i.userID}\nUses: ${i.uses}`)
            }

            msg.edit("", embed)
        } catch (error) {
            return msg.edit(`Error! ${error.message}`)
        }
    }
}
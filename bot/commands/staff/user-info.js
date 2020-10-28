const { Client, Message, MessageEmbed } = require("discord.js-light");

module.exports = {
    name: "user-info",
    description: "returns the user info from the database",
    aliases: [
        "userinfo",
        "user",
        "ui",
        "useri",
        "uinfo"
    ],
    category: "staff",
    fields: [
        "<userID>"
    ],
    examples: [
        "4973278291858182493"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            const id = args[0] || message.author.id

            const user = await client.users.fetch(id).catch(err => {})
    
            if (!user) return message.channel.send(`:x: Could not find this user.`)
    
            const member = await message.guild.members.fetch(user.id).catch(err => {})
    
            let data_member
    
            let d_member 
    
            if (member) {
                data_member = await client.objects.guild_members.findOne({where: { guildID: message.guild.id, userID: user.id}})
    
                d_member = await data_member.toJSON()
            }
    
            const data = await client.objects.users.findOne({ where: { userID: user.id }})
    
            let d 

            if (data) {
                d = await data.toJSON()
            }
    
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(user.tag, user.displayAvatarURL({dynamic:true}))
            .setTitle(`User Info - Database`)
            .setThumbnail(client.user.displayAvatarURL())
            if (d) embed.addField(`User`, Object.entries(d).map(e => `${e[0]}: ${e[1]}`))
            if (data_member) embed.addField("Guild Member", Object.entries(d_member).map(e => `${e[0]}: ${e[1]}`))
            
            message.channel.send(embed)
        }catch(err) {
            return message.channel.send(`An error occurred: ${err.message}`)
        }
    }
}
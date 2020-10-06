const { Message, MessageEmbed } = require("discord.js");

module.exports = async (message = new Message(), command) => {

    const { client } = message

    const d = await message.client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

    let grole = "0"

    if (d && command.overridePermissions) {
        grole = d.get("giveaway_role")
    }

    const role = message.guild.roles.cache.get(grole)

    let text = role ? `or <@&${role.id}> role ` : ""
    
    const perms = command.permissions.filter(perm => !message.member.permissions.has(perm)).map(perm => perm.split("_").join(" ").toLowerCase().split(" ").map(word => word.replace(word[0], word[0].toUpperCase())).join(" "))
    
    const embed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(`${message.author.username}, you don't have enough permissions to use this command:`, message.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`You are missing \`${perms.join(", ")}\` permission ${text}to use this command.`)
    .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
    
    return message.channel.send(embed)
}
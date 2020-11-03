const { Message, MessageEmbed } = require("discord.js-light");

module.exports = async (message = new Message(), command) => {

    const { client } = message

    const d = await message.client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

    let roles = []

    if (command.overridePermissions) {
        const rolesData = JSON.parse(d.get("giveaway_role"))

        if (rolesData.length) {
            roles = rolesData.map(id => {
                let r = message.guild.roles.cache.get(id)

                if (r) return `${r}`
            }).filter(e => e)
        }
    }


    let text = roles.length ? ` or one of the roles listed below:\n${roles.join("\n")}` : ""
    
    const perms = command.permissions.filter(perm => !message.member.permissions.has(perm)).map(perm => perm.split("_").join(" ").toLowerCase().split(" ").map(word => word.replace(word[0], word[0].toUpperCase())).join(" "))
    
    const embed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(`${message.author.username}, you don't have enough permissions to use this command:`, message.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`You are missing \`${perms.join(", ")}\` permission to use this command${text}.`)
    .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
    
    return message.channel.send(embed)
}
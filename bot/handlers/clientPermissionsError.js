const { Message, MessageEmbed } = require("discord.js-light");

module.exports = (message = new Message(), command) => {

    const { client } = message

    const perms = command.clientPermissions.filter(perm => !message.guild.me.hasPermission(perm)).map(perm => perm.split("_").join(" ").toLowerCase().split(" ").map(word => word.replace(word[0], word[0].toUpperCase())).join(" "))

    const embed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(`I need more permissions to execute this command:`, message.author.displayAvatarURL({dynamic:true}))
    .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
    .setFooter(`Once i have them, this command will be executable :)`)
    .setDescription(`I am missing the permissions \`${perms.join(", ")}\`.`)

    message.channel.send(embed)
}
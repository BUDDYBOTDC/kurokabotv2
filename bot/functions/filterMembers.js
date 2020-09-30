const { Message, Collection } = require("discord.js");

module.exports = (message = new Message(), args = []) => {
    
    let members = message.guild.members.cache.filter(member => 
        member.user.username.toLowerCase().startsWith(args.join(" ").toLowerCase())
    )

    if (!args.length) members = new Collection().set(message.author.id, message.member)

    if (message.mentions.members.size) members = new Collection().set(message.mentions.members.first().user.id, message.mentions.members.first())

    return members

}
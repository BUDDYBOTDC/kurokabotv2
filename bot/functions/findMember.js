const { Message } = require("discord.js");

module.exports = (message = new Message(), args = []) => {

    const query = args.join(" ").toLowerCase()

    let member = message.guild.members.cache.find(member => 
        member.user.tag.toLowerCase() === query ||
        member.user.id === query ||
        member.displayName.toLowerCase() === query 
    ) || message.guild.member(args[0])

    if (!member) {
        if (message.mentions.members.size) {
            member = message.mentions.members.first()
        } else {
            member = message.member
        }
    }

    return member
}
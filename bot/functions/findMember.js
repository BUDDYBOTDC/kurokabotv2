const { Message, MessageMentions } = require("discord.js-light");

module.exports = async (message = new Message(), args = [], current = true) => {

    const query = args.join(" ")

    let member = message.guild.members.cache.find(member => 
        member.user.tag === query ||
        member.user.id === query ||
        member.displayName === query 
    )

    if (!member) {
        member = await message.guild.members.fetch({
            cache: false,
            user: args[0] || message.author.id
        }).catch(err => {})

        if (!member) {          
            if (message.mentions.members.size) {
                member = message.mentions.members.first()
            } else {
                if (current) member = message.member
            }
        }
    }

    return member
}
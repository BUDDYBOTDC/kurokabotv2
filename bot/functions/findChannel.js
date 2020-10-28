const { Message } = require("discord.js-light");

module.exports = (message = new Message(), args = [], current = true) => {

    let channel = message.guild.channels.cache.find(channel =>
        channel.name === args.join("-").toLowerCase() ||
        channel.id === args[0]    
    )

    if (!channel) {
        if (message.mentions.channels.size) {
            channel = message.mentions.channels.first()
        } else {
            if (current) channel = message.channel
        }
    }

    return channel
}
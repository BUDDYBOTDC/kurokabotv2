const { Message } = require("discord.js");

module.exports = async (message = new Message()) => {
    
    if (message.author.id === message.client.user.id && message.embeds[0] && message.embeds[0].title && message.embeds[0].title.toLowerCase().includes("giveaway")) return 

    if (message.author.id === message.client.user.id && message.embeds[0] && message.embeds[0].author && message.embeds[0].author.name && message.embeds[0].author.name.includes("DROP")) {
        setTimeout(() => {
            message.channel.messages.cache.delete(message.id)
        }, 60000)

        return
    }

    setTimeout(() => {
        message.channel.messages.cache.delete(message.id)
    }, 1000)
}
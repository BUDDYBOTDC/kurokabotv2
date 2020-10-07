const { Message } = require("discord.js");

module.exports = async (message = new Message()) => {
    
    if (message.author.id === message.client.user.id && message.embeds[0] && message.embeds[0].author.name.includes("GIVEAWAY")) return 

    setTimeout(() => {
        message.channel.messages.cache.delete(message.id)
    }, 10000)
}
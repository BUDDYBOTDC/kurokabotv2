const { Message } = require("discord.js");

module.exports = async (message = new Message()) => {
    
    if (message.author.id === message.client.user.id && message.embeds[0] && message.embeds[0].title && message.embeds[0].title.toLowerCase().includes("giveaway")) return 

    setTimeout(() => {
        message.channel.messages.cache.delete(message.id)
    }, 1000)
}
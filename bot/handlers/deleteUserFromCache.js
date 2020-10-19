const { Message, Collection } = require("discord.js");

module.exports = (message = new Message(), id) => {

    try {
        if (id === message.client.user.id) return

        message.guild.members.cache.delete(id)
                
        message.client.users.cache.delete(id)
    } catch (error) {
        console.log(error.message)
    }
}
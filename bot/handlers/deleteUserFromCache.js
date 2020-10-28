const { Message, Collection } = require("discord.js-light");

module.exports = (message = new Message(), id) => {

    return "not needed"

    try {
        if (id === message.client.user.id) return

        message.guild.members.cache.delete(id)
                
        message.client.users.cache.delete(id)
    } catch (error) {
        console.log(error.message)
    }
}
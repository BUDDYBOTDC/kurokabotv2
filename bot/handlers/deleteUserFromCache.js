const { Message, Collection } = require("discord.js");

const users = new Collection()

module.exports = (message = new Message(), stayCached = false) => {

    if (message.author.bot) return

    if (message.client.owners.includes(message.author.id)) return

    if (message.guild.ownerID === message.author.id) return

    if (!users.get(message.author.id)) {
        if (stayCached) {
            users.set(message.author.id, true)

            setTimeout(() => {
               users.delete(message.author.id)
               
               message.client.users.cache.delete(message.author.id)

               message.guild.members.cache.delete(message.author.id)
            }, 30000);
        } else {
            message.guild.members.cache.delete(message.author.id)
            
            message.client.users.cache.delete(message.author.id)
        }
    }
}
const { Message, Collection } = require("discord.js");

module.exports = (message= new Message(), args = []) => {

    let roles = message.guild.roles.cache.filter(role => 
        role.name.toLowerCase().startsWith(args.join(" ").toLowerCase())    
    )

    if (!roles.size) {
        if (message.mentions.roles.size) {
            roles.set(message.mentions.roles.first().id, message.mentions.roles.first())
        }
    }

    return roles
}
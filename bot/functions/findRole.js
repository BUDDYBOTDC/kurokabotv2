const { Message } = require("discord.js");

module.exports = (message = new Message(), args = []) => {

    let role = message.guild.roles.cache.find(role => 
        role.name === args.join(" ") ||
        role.id === args[0] 
    )

    if (!role) {
        if (message.mentions.roles.size) {
            role = message.mentions.roles.first()
        }
    }

    return role
}
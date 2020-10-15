const { Client, Message } = require("discord.js");

module.exports = async (client = new Client(), message = new Message(), args = new Array()) => {

    let user = client.users.cache.get(args[0]) || client.users.cache.find(e => e.username.toLowerCase() === args.join(" ").toLowerCase()) || message.mentions.users.first() 

    if (!user) {
        user = await client.users.fetch(args[0], false).catch(err => {})

        if (!user) user = message.author
    }

    return user

}
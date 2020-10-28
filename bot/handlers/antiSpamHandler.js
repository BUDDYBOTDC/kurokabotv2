const { Client, Message } = require("discord.js-light");

module.exports = async (message = new Message()) => {

    const { client } = message

    let n = client.spam.get(message.author.id) || 0

    if (n === 0) {
        setTimeout(() => {
            client.spam.delete(message.author.id)
        }, 2500);
    }

    n++

    if (n === 4) {
        client.objects.users.update({ 
            isBanned: true,
            banReason: `Spamming commands.`
        }, {
            where: {
                userID: message.author.id
            }
        })

        message.channel.send(`You've been blacklisted from using this bot.`)
    }

    client.spam.set(message.author.id, n)
}
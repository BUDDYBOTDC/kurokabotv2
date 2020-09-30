const { Message } = require("discord.js")
const messageCreate = require("../events/messageCreate")

module.exports = async (message = new Message()) => {

    if (message.channel.type === "dm" || message.author.bot) return

    const d = await message.client.objects.messages.findOne({ where: { userID: message.author.id, guildID: message.guild.id }})

    if (!d) {
        await message.client.objects.messages.create({
            guildID: message.guild.id,
            userID: message.author.id,
            messages: 1
        })
    } else {
        d.increment("messages", 1)
    }
}
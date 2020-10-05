const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "support",
    description: "returns the bot's support server",
    category: "info",
    cooldown: 5000,
    execute: async (client = new Client(), message = new Message()) => {

        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`${client.user.username}'s Support Server`, message.author.displayAvatarURL({dynamic:true}))
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setDescription(
            `https://discord.gg/f7MCvQJ`
        )

        message.channel.send(embed)
    }
}
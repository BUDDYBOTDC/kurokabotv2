const { Client, Message, MessageEmbed } = require("discord.js-light");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "vote",
    description: "returns top.gg's link to vote the bot.",
    cooldown: 5000,
    category: "info",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const customEmbed = await getCustomEmbed(client, message.guild.id, "info")

        const embed = new MessageEmbed()
        .setColor(customEmbed)
        .setTitle(`Vote ${client.user.username} here`)
        .setURL("https://discord.boats/bot/kuroka")
        .setDescription(`By voting [here](https://discord.boats/bot/kuroka) you won't get anything at all, but remember the bot's completely free and we'd like our users to value our effort put into this bot by making it full free!`)
        .setThumbnail(client.user.displayAvatarURL())

        message.channel.send(embed)

    }
}

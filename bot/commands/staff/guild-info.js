const { Client, Message, MessageEmbed } = require("discord.js");
const shardGuild = require("../../functions/shardGuild");

module.exports = {
    name: "guild-info",
    description: "returns the guild info from the database",
    category: "staff",
    fields: [
        "<guildID>"
    ],
    examples: [
        "4973278291858182493"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const id = args[0] || message.guild.id

        const guild = await shardGuild(client, id)

        if (!guild) return message.channel.send(`:x: Could not find this guild.`)

        const data = await client.objects.guilds.findOne({ where: { guildID: guild.id }})

        const d = await data.toJSON()

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(guild.name)
        .setTitle(`Guild Info - Database`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(Object.entries(d).map(e => `${e[0]}: ${e[1]}`))

        message.channel.send(embed)
    }
}
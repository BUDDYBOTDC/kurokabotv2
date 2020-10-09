const { Client, Message, MessageEmbed } = require("discord.js");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "invite",
    description: "returns a bot invite link",
    category: "info",
    cooldown: 5000,
    execute: async (client = new Client(), message = new Message()) => {

        const color = await getCustomEmbed(client, message.guild.id, "info")

        const embed = new MessageEmbed()
        .setColor(color)
        .setAuthor(`Invite ${client.user.username}`, message.author.displayAvatarURL({dynamic:true}), "https://discord.gg/f7MCvQJ")
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setDescription(
            `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`
        )
        .setFooter(`Permissions are set to admin by default. (recommendable perms)`)

        message.channel.send(embed)
    }
}
const { Client, Message, MessageEmbed } = require("discord.js-light");
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
            `:link: | Administrator Invite ( recommended ) \n
            <https://discord.com/oauth2/authorize?client_id=754024463137243206&scope=bot&permissions=8> \n
            
            :link: | Basic Permissions Invite \n
            <https://discord.com/oauth2/authorize?client_id=754024463137243206&scope=bot&permissions=388192> \n
            
            :link: | Website: <https://kurokabots.com> \n
            
            :link: | Twitter: <https://twitter.com/KurokaBot>`
        )
        .setFooter(`Made by Droplet Development - https://droplet.gg/discord`)

        message.channel.send(embed)
    }
}

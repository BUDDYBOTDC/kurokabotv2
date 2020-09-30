const { Guild, Message, MessageEmbed, Client } = require("discord.js");

module.exports = async (client = new Client(), guild = new Guild()) => {
    
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`New Guild`)
    .addField(`Name`, guild.name)
    .addField(`Members`, guild.memberCount)
    .setThumbnail(guild.iconURL({dynamic:true}))

    const channel = await client.channels.fetch("756242757374181377")

    if (channel) {
        channel.send(embed)
    }
}
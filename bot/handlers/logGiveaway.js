const { Client, MessageEmbed } = require("discord.js");

module.exports = async (client = new Client(), data) => {

    const channel = await client.channels.fetch("756486796816416778")

    if (channel) {

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`Giveaway Created`)
        .setDescription(`**__Data:__**\n\n${JSON.stringify(data)}`)

        const m = await channel.send(embed).catch(err => {})

        if (!m) {
            embed.setColor("RED")
            .setTitle(`Giveaway Created:`)
            .setDescription(`
Could not get accurated data.
Guild ID: ${data.guildID}
Channel ID: ${data.channelID}
Message ID: ${data.messageID}
`)
            channel.send(embed)
        }
    }
}
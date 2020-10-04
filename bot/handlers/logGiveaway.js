const { Client, MessageEmbed, WebhookClient } = require("discord.js");
const webhook = new WebhookClient("761283664809951253", "hxss-F0IHkrY5Dbrn2xsLYvTbHWvFPaL9A1IjKIhwmTEoWf20IdkN23Rd5ahoJqeHEQQ")
module.exports = async (client = new Client(), data) => {

    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`Giveaway Created`)
    .setDescription(`**__Data:__**\n\n${JSON.stringify(data).split(",").join(",\n")}`)

    const m = await webhook.send("new giveaway log", embed).catch(err => {})

    if (!m) {
        embed.setColor("RED")
        .setTitle(`Giveaway Created:`)
        .setDescription(`
Could not get accurated data.
Guild ID: ${data.guildID}
Channel ID: ${data.channelID}
Message ID: ${data.messageID}
`)

        webhook.send("new giveaway log", embed)
    }  
}
const { Client } = require("discord.js");

module.exports = async (client = new Client(), guildID = new String(), category = new String(), color = new String()) => {

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: guildID
        }
    })

    let customEmbeds = JSON.parse(guildData.get("customEmbeds"))

    customEmbeds[category] = color

    await client.objects.guilds.update({ customEmbeds: JSON.stringify(customEmbeds) }, {
        where: {
            guildID: guildID
        }
    })
}
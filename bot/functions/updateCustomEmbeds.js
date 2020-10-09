const { Client } = require("discord.js");

module.exports = async (client = new Client(), guildID = new String(), category = new String(), color = new String()) => {

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: guildID
        }
    })

    let customEmbeds = guildData.get("customEmbeds")

    if (typeof customEmbeds !== "object") {
        customEmbeds = JSON.parse(customEmbeds)
    }

    customEmbeds[category] = color

    await client.objects.guilds.update({ customEmbeds }, {
        where: {
            guildID: guildID
        }
    })
}
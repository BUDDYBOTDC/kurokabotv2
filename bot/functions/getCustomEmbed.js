const { Client } = require("discord.js");
const { type } = require("os");
const categoryColors = require("../utils/categoryColors");

module.exports = async (client = new Client(), guildID = new String(), category = new String()) => {

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: guildID
        }
    })

    if (guildData.get("premium")) {

        let embeds = JSON.parse(guildData.get("customEmbeds"))
        
        if (embeds[category]) {
            return embeds[category]
        } else {
            return categoryColors[category]
        }

    } else return categoryColors[category]
}
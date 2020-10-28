const { Client } = require("discord.js-light");
const { type } = require("os");
const categoryColors = require("../utils/categoryColors");

module.exports = async (client = new Client(), guildID = new String(), category = new String()) => {

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: guildID
        }
    })

    let embeds = JSON.parse(guildData.get("customEmbeds"))
        
    if (embeds[category]) {
        return embeds[category]
    } else {
        return categoryColors[category]
    }

}
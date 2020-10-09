const { Client } = require("discord.js");
const { JSON } = require("sequelize");
const categoryColors = require("../utils/categoryColors");

module.exports = async (client = new Client(), guildID = new String(), category = new String()) => {

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: guildID
        }
    })

    if (guildData.get("premium")) {

        let embeds = guildData.get("customEmbeds")

        if (typeof embeds !== "object") {
            embeds = JSON.parse(embeds)
        }

        if (embeds[category]) {
            return embeds[category]
        } else {
            return categoryColors[category]
        }

    } else return categoryColors[category]
}
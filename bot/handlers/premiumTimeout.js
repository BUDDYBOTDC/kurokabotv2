const { Client, Guild } = require("discord.js");
const daysToMs = require("../utils/daysToMs");

module.exports = async (client = new Client(), guild = new Guild()) => {

    const guildData = await client.objects.guilds.findOne({ where: { guildID: guild.id }})

    if (guildData.get("premium") && guildData.get("premiumEndsAt") - Date.now() <= daysToMs(7)) {
        setTimeout(() => {
            client.objects.guilds.update({
                premium: false,
                premiumSince: Date.now(),
                premiumEndsAt: Date.now()
            }, {
                where: {
                    guildID: guild.id
                }
            })
        }, guildData.get("premiumEndsAt") - Date.now());

        console.log("Premium timeout added to guild " + guild.name)
    }
}
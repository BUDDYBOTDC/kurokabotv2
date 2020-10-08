const { Client, Guild } = require("discord.js");

module.exports = async (client = new Client(), guild = new Guild()) => {

    const guildData = await client.objects.guilds.findOne({ where: { guildID: guild.id }})

    if (guildData.get("premium")) {
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
        }, Date.now() - guildData.get("premiumEndsAt"));

        console.log("Premium timeout added to guild " + guild.name)
    }
}
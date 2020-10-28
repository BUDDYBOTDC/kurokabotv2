const { Client, Message } = require("discord.js-light");

module.exports = {
    name: "reset-server-settings",
    aliases: [
        "resetserversettings",
        "rss",
        "resetssettings",
        "resetss"
    ],
    description: "resets all the configurations of this guild. (except giveaway emoji)",
    permissions: [
        "ADMINISTRATOR"
    ],
    cooldown: 60000,
    category: "server settings",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const msg = await message.channel.send(`Resetting server config...`)

        await client.objects.guilds.update({
            giveaway_role: "[]",
            black_role: "[]",
            bypass_role: "[]",
            giveaway_ping_role: "0",
            ignoreChannels: "[]",
            blacklistedChannels: "[]",
            deny_dm: true,
            entry_dm: true
        }, {
            where: {
                guildID: message.guild.id
            }
        })

        msg.edit(`Successfully reset the guild config.`)
    }
}
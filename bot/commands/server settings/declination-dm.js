const { Client, Message } = require("discord.js");

module.exports = {
    name: "declination-dm",
    aliases: [
        "declinationdm",
        "denydm",
        "deny-dm",
        "denyentrydm",
    ],
    description: "disables or enables the dms sent when the user does not meet one of the giveaway requirements.",
    category: "server settings",
    permissions: [
        "ADMINISTRATOR"
    ],
    cooldown: 10000,
    usages: [
        "<enable | disable>"
    ],
    examples: [
        "enable",
        "disable"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const option = ["disable", "enable"].find(e => args[0].toLowerCase() === e)

        if (!option) return message.channel.send(`\`${args[0]}\` is not a valid option.\nValid options are: \`enable\` and \`disable\``)

        if (option === "enable") {

            await client.objects.guilds.update({
                deny_dm: true
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`DMs sent for denied entries have been enabled!`)

        } else {
            
            await client.objects.guilds.update({
                deny_dm: false
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`DMs sent for denied entries have been disabled!`)
            
        }
    }
}
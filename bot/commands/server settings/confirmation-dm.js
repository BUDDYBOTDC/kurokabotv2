const { Client, Message } = require("discord.js-light");

module.exports = {
    name: "confirmation-dm",
    aliases: [
        "confirmationdm",
        "approvedm",
        "approve-dm",
        "approveentrydm",
    ],
    description: "disables or enables the dms sent when the user is able to join the giveaway.",
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
                entry_dm: true
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`DMs sent for approved entries have been enabled!`)

        } else {
            
            await client.objects.guilds.update({
                entry_dm: false
            }, {
                where: {
                    guildID: message.guild.id
                }
            })

            message.channel.send(`DMs sent for approved entries have been disabled!`)
            
        }
    }
}
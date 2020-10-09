const { Client, Message } = require("discord.js");
const shardGuild = require("../../functions/shardGuild");
const categoryColors = require("../../utils/categoryColors");
const tableVariablesValues = require("../../utils/tableVariablesValues");

module.exports = {
    name: "debug",
    description: "huh",
    category: "owner",
    usages: [
        "<guildID>"
    ],
    examples: [
        "5839295893920"
    ],
    execute: async (client = new Client(), message = new Message(), args= []) => {

        if (args[0] === "secure") {

            for (const guild of client.guilds.cache.array()) {
                await client.objects.guilds.update({
                    customEmbeds: JSON.stringify(categoryColors)
                }, {
                    where: {
                        guildID: guild.id
                    }
                })
            }

            message.channel.send(`Debugged in secure mode.`)
        } else {
            const guild = await shardGuild(client, args[0])

            if (!guild) return message.channel.send("...")
    
            await client.objects.guilds.update(tableVariablesValues.GUILD(), { where: { guildID: guild.id }})
    
            message.channel.send("Ouch, that hurt.")
        }
    }
}
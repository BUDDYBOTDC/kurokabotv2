const { Client } = require("discord.js")
const Sequelize = require("sequelize")
const giveawayMessage = require("../classes/giveawayMessage")
const setGiveawayTimeout = require("./setGiveawayIntervalTimeout")

module.exports = async (client = new Client(), db = new Sequelize()) => {

    let messages = await client.objects.giveaways.findAll()

    for (const d of messages) {

        const data = await d.toJSON()

        if (data.interval !== null) {
            if (data.removed === false) {
                setGiveawayTimeout(client, data)
            }
        } else {
            const guild = client.guilds.cache.get(data.guildID)

            if (guild) {
    
                const channel = client.channels.cache.get(data.channelID)
    
                if (channel) {
    
                    const m = await channel.messages.fetch(data.messageID).catch(err => {})
    
                    if (m) {
    
                        if (data.removeCache && Date.now() >= data.removeCache) {
                            console.log(`Giveaway with ID ${data.messageID} removed, reason: expired`)
                        } else {
                            if (data.ended === false) {
                                const giveaway = new giveawayMessage(m, data)
    
                                giveaway.checkReactions()
                            }
                        }
                    }
                }
            }
        }
    }
}
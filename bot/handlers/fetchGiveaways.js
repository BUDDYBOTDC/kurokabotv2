const { Client } = require("discord.js")
const Sequelize = require("sequelize")
const giveawayMessage = require("../classes/giveawayMessage")
const setGiveawayTimeout = require("./setGiveawayIntervalTimeout")

module.exports = async (client = new Client(), db = new Sequelize()) => {

    let messages = await client.objects.giveaways.findAll({
        where: {
            ended: false
        }
    })

    for (const d of messages.filter(e => client.guilds.cache.has(e.get("guildID")))) {

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
                        if (data.ended === false) {

                            const giveaway = new giveawayMessage(m, data)
                        
                        }
                    } else {
                        if (d.ended === false && Date.now() > d.endsAt) {
                            client.objects.giveaways.update({
                                ended: true
                            }, {
                                where: {
                                    messageID: d.messageID
                                }
                            })   

                            console.log(`Ended giveaway with Id: ${d.messageID}, because it does not exist anymore.`)
                        }
                    }
                }
            }
        }
    }
}
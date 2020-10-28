const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), channelID = new String(), messageID = new String()) => {

    const message = await client.shard.broadcastEval(`
    (async () => {

        const channel = this.channels.cache.get('${channelID}')

        if (channel) {
            const msg = await channel.messages.fetch('${messageID}').catch(err => {})

            return msg
        }
        
        return undefined
    })()
    `)

    return message.filter(e => e)[0]
}
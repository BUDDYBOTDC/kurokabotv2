const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), channelID = new String()) => {

    const msg = await client.shard.broadcastEval(`
    (async () => {            
        const channel = this.channels.cache.get('${channelID}')

        if (channel) {
            const msg = await channel.send({embed: {
                title: "Giveaway starting..."
            }}).catch(err => {})

            if (msg) msg.react("🎉")
            
            return msg
        }

        return undefined
    })()
    `)

    return msg.filter(e => e)[0]
}
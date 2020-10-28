const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), channelID = new String()) => {

    const guild = await client.shard.broadcastEval(`
    (async () => {
        let channel = this.channels.cache.get('${channelID}')
        
        if (channel) {
            return channel.guild
        }

        return undefined
    })()
    `)

    return guild.filter(e => e)[0]
}
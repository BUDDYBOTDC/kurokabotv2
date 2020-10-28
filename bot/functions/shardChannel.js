const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), id) => {

    const channels = await client.shard.broadcastEval(`
    (async () => {
        let channel = this.channels.cache.get('${id}')

        if (channel) {
            return channel
        }
    })()`)

    return channels.filter(ch => ch)[0]
}
const { Client } = require("discord.js");

module.exports = async (client = new Client(), id) => {

    const channel = await client.shard.broadcastEval(`
    (async () => {
        let channel = this.channel.cache.get(${id})

        return channel
    })()`)

    return channel.filter(u => u !== null)[0]
}
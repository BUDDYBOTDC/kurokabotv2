const { Client } = require("discord.js");

module.exports = async (client = new Client(), id) => {

    const guild = await client.shard.broadcastEval(`
    (async () => {
        let guild = this.guilds.cache.get(${id})

        return guild
    })()`)

    return guild.filter(u => u !== null)[0]
}
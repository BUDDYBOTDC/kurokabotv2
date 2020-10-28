const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), id) => {

    const guilds = await client.shard.broadcastEval(`
    (async () => {
        let guild = this.guilds.cache.get('${id}')

        return guild
    })()`)

    return guilds.filter(u => u !== null)[0]
}
const { Client } = require("discord.js");

module.exports = async (client = new Client(), id) => {

    const users = await client.shard.broadcastEval(`
    (async () => {
        let user = this.users.cache.get('${id}')

        return user
    })()`)

    return users.filter(u => u)[0]
}
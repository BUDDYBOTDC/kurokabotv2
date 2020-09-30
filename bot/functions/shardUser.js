const { Client } = require("discord.js");

module.exports = async (client = new Client(), id) => {

    const user = await client.shard.broadcastEval(`
    (async () => {
        let user = this.users.cache.get(${id})

        return user
    })()`)

    console.log(user)

    return user.filter(u => u)[0]
}
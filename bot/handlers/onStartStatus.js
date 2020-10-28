const { Client, User } = require("discord.js-light");

module.exports = (client = new Client()) => {

    client.user.setActivity("k!invite | k!support", {
        type: "LISTENING"
    })

    setInterval(async () => {

        const guildTotal = await client.shard.broadcastEval(`
        (async () => {
            return this.guilds.cache.size
        })()
        `)

        client.user.setActivity(`over ${guildTotal.reduce((x, y) => x + y, 0)} guilds`, {
            type: "WATCHING"
        })
        
        setTimeout(async() => {
            client.user.setActivity("k!invite | k!support", {
                type: "LISTENING"
            })
        }, 30000);
    }, 60000);
}
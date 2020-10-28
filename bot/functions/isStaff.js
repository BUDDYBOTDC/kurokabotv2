const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), id) => {

    const staff = await client.shard.broadcastEval(`
    (async () => {
        let guild = this.guilds.cache.get("550516279652515880")

        if (guild) {
            let member = await guild.members.fetch({
                user: "${id}",
                cache: false
            }).catch(err => {})

            if (member) {
                if (member.roles.cache.has("550529991964753956")) return true
            }
        }

        return false
    })()
    `)

    return staff.some(e => e === true)
}
const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), id) => {

    const partner = await client.shard.broadcastEval(`
    (async () => {
        let guild = this.guilds.cache.get("550516279652515880")
        if (guild) {
            let member = await guild.members.fetch({
                user: "${id}",
                cache: false
            }).catch(err => {})
            if (member) {
                if (member.roles.cache.has("738360527184461844")) return true
            }
        }
        return false
    })()
    `)

    return partner.some(e => e === true)
}

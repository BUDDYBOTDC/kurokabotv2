const { Client } = require("discord.js-light");

module.exports = async (client = new Client(), id = new String()) => {

    const admin = await client.shard.broadcastEval(`
    (async () => {
        const guild = this.guilds.cache.get("550516279652515880")
        if (guild) {
            const member = await guild.members.fetch({
                user: "${id}",
                cache: false
            }).catch(err => {})
            if (member) {
                if (["738360527184461844", "704683932112781313"].some(id => member.roles.cache.has(id))) return true
            }
        }
        return false
    })()
    `)

    return partner.some(e => e === true)
}

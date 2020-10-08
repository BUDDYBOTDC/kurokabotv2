const { Client } = require("discord.js");

module.exports = async (client = new Client(), id = new String()) => {

    const admin = await client.shard.broadcastEval(`
    (async () => {
        const guild = this.guilds.cache.get("${id}")

        if (guild) {

            const member = await guild.members.fetch({
                user: "${id}",
                cache: false
            }).catch(err => {})

            if (member) {

                if (["737292637140287510", "556032998106071040"].some(id => member.roles.cache.has(id))) return true

            }
        }

        return false
    })()
    `)

    return admin.some(e => e === true)
}
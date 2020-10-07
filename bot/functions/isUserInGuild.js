const { Client } = require("discord.js");

module.exports = async(client = new Client(), guildID = new String(), userID = new String()) => {
    
    const member = await client.shard.broadcastEval(`
    (async () => {
        const guild = this.guilds.cache.get("${guildID}")

        if (guild) {
            
            const member = await guild.members.fetch({
                user: "${userID}",
                cache: false
            }).catch(err => {})

            if (member) return true
        }

        return false
    })()
    `)

    return member.some(e => e === true)
}
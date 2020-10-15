const { Client } = require("discord.js");

module.exports = async (client = new Client()) => {
    
    let uncachedTotal = 0

    for (const guild of client.guilds.cache.array()) {
        if (guild.members.cache.size >= 1000) {
            while (guild.members.cache.size >= 1000) {
                const r = guild.members.cache.random()

                if (r.user.id !== guild.ownerID && client.user.id !== r.user.id) {
                    client.users.cache.delete(r.user.id)

                    guild.members.cache.delete(r.user.id)

                    uncachedTotal++
                }
            }
        }
    }

    console.log(`Uncached ${uncachedTotal} users / members.`)
}
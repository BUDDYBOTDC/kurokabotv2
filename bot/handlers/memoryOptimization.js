const { Client } = require("discord.js");

module.exports = async (client = new Client()) => {

    let totalUsersUncached = 0

    for (const guild of client.guilds.cache.array()) {

        const cachedSize = guild.members.cache.size

        if (cachedSize > 1000) {

            for (const member of guild.members.cache.array()) {
                if (guild.members.cache.size > 1000) {

                    if (client.user.id !== member.user.id) {
                        guild.members.cache.delete(member.user.id)

                        client.users.cache.delete(member.user.id)
                    }

                    totalUsersUncached++
                }
            }
        }
    }

    console.log(`Uncached ${totalUsersUncached} members.`)
}
const { Client } = require("discord.js");

module.exports = async (client = new Client()) => {

    let totalUsersUncached = 0

    for (const guild of client.guilds.cache.array()) {

        const cachedSize = guild.members.cache.size

        if (cachedSize > guild.memberCount / 5 && guild.memberCount > 1000) {

            let toUncacheAmount = cachedSize - guild.memberCount / 5

            for (let i = 0;i < toUncacheAmount;i++) {
                client.users.cache.delete(client.users.cache.first().id)
                guild.members.cache.delete(guild.members.cache.first().user.id)
                totalUsersUncached++
            }
        }
    }

    console.log(`${totalUsersUncached} users and members were uncached successfully.`)
}
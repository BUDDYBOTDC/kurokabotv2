const { Client, GuildEmoji, Collection } = require("discord.js-light");

module.exports = async (client = new Client(), uncacheEveryone = false, forceChannelsAndRolesUncaching = false) => {
    
    let uncachedTotal = 0

    let uncachedChannels = 0

    let uncachedRoles = 0

    for (const guild of client.guilds.cache.array()) {

        if (forceChannelsAndRolesUncaching) {
            uncachedChannels += guild.channels.cache.size
            uncachedRoles += guild.roles.cache.size

            guild.channels.cache = new Collection()
            client.channels.cache = new Collection()
            guild.roles.cache = new Collection()
        }
        
        if (guild.members.cache.size >= 0) {

            for (const r of guild.members.cache.array()) {
                if (client.user.id !== r.user.id) {
                    client.users.cache.delete(r.user.id)

                    guild.members.cache.delete(r.user.id)

                    uncachedTotal++
                }
            }
            if (uncacheEveryone) {

            }
        }
    }

    console.log(`Uncached ${uncachedTotal} users / members.\nUncached ${uncachedRoles} roles.\nUncached ${uncachedChannels} channels.`)
}
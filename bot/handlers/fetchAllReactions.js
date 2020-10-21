const { Message, Collection } = require("discord.js");
const { real } = require("../utils/dbCredentials");
const giveawayRequirements = require("./giveawayRequirements");

module.exports = async (message = new Message(), filter = "endGiveaway") =>  {

    const users = new Collection()

    if (!message.reactions) return console.log(`No reactions!`)

    const guildData = await message.client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

    const giveaway_emoji = guildData.get("giveaway_emoji") === "🎉" ? "🎉" : guildData.get("giveaway_emoji").split(":")[2]

    const reaction = message.reactions.cache.get(giveaway_emoji)

    let last = message.client.user.id

    await reaction.fetch()
    
    for(let i = 0;i < reaction.count / 100;i++) {

        const reactions = await reaction.users.fetch({
            before: last,
        })

        if (reactions.last()) {    
        
            for (const user of reactions.array()) {
                users.set(user.id, user.id)

                last = reactions.last()
            }

        }
    }

    if (filter === "endGiveaway") {
        for (const user of users.array()) {
            const u = await message.client.users.fetch(user, false).catch(err => {})

            const meetReq = await giveawayRequirements(reaction, u, true)
            
            if (meetReq !== true) users.delete(user)

            reaction.message.guild.members.cache.delete(user)

            reaction.message.client.users.cache.delete(user)
        }
    } else if (filter === "checkRequirements") {
        for (const user of users.array()) {
            const meetReq = await giveawayRequirements(reaction, message.client.users.cache.get(user), true)
            
            if (meetReq !== true && user !== message.client.user.id) {
                await reaction.users.remove(user).catch(err => {})
            }

            reaction.message.guild.members.cache.delete(user)

            reaction.message.client.users.cache.delete(user)
        }
    }

    return users.filter(id => id !== message.client.user.id)
}

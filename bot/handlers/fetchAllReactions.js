const { Message, Collection } = require("discord.js-light");
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
                users.set(user.id, user)

                last = reactions.last()
            }

        }
    }

    if (filter === "endGiveaway") {
        for (const user of users.array()) {
            
            const meetReq = await giveawayRequirements(reaction, user, true)
            
            if (meetReq !== true) users.delete(user.id)

            reaction.message.guild.members.cache.delete(user.id)

            reaction.message.client.users.cache.delete(user.id)
        }
    } else if (filter === "checkRequirements") {
        for (const user of users.array()) {

            const meetReq = await giveawayRequirements(reaction, user, true)
            
            if (meetReq !== true && user !== message.client.user.id) {
                await reaction.users.remove(user).catch(err => {})
            }

            reaction.message.guild.members.cache.delete(user.id)

            reaction.message.client.users.cache.delete(user.id)
        }
    }

    const  u = new Collection()

    for (const user of users.array()) {
        if (user.id !== message.client.user.id) u.set(user.id, user.id)
    }

    return u
}

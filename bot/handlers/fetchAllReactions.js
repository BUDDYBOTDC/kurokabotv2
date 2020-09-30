const { Message, Collection } = require("discord.js");
const giveawayRequirements = require("./giveawayRequirements");

module.exports = async (message = new Message(), filter = "endGiveaway") =>  {

    const users = new Collection()

    if (!message.reactions) return
    
    const reaction = message.reactions.cache.get("🎉")

    let last = message.client.user.id

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
            const meetReq = await giveawayRequirements(reaction, message.client.users.cache.get(user), true)
            
            if (meetReq !== true) users.delete(user)
        }
    } else if (filter === "checkRequirements") {
        for (const user of users.array()) {
            const meetReq = await giveawayRequirements(reaction, message.client.users.cache.get(user), true)
            
            if (meetReq !== true && user !== message.client.user.id) {
                await reaction.users.remove(user).catch(err => {})
            }
        }
    }

    return users.filter(id => id !== message.client.user.id)
}

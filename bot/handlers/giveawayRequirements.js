const { User, ReactionEmoji, MessageReaction, MessageEmbed } = require("discord.js")
const badges = require("../utils/badges")
const daysToMs = require("../utils/daysToMs")
const ms = require("ms")
const Discord = require("discord.js")
const badgesFlags = require("../utils/badgesFlags")
const cooldown = new Discord.Collection()
module.exports = async (reaction = new MessageReaction(), user = new User(), returnCheck = false) => {

    if (user.id === reaction.message.client.user.id) return
    
    if (reaction.emoji.name !== "🎉") return

    let messages = await reaction.message.client.objects.giveaways.findOne({ where: { messageID: reaction.message.id }})

    if (!messages) return
    
    const data = await messages.toJSON()

    if (!data) return true

    if (!data.requirements) return true

    const client = reaction.message.client

    function giveawayEntryError(error) {

        if (cooldown.get(user.id)) return

        const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`Failed to join the giveaway`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Sorry ${user.tag}, but looks like you don't meet one of the giveaway requirements:\n${error}`)
        .setTimestamp()

        cooldown.set(user.id, true)

        setTimeout(() => {
            cooldown.delete(user.id)
        }, 90000)

        return user.send(embed).catch(Err => {})
    }

    for (const req of Object.entries(data.requirements)) {

        let req_name = req[0]

        let req_value = req[1]

        if (req_name === "guild_member") {
            for (const id of req_value) {
                const guild = await client.guilds.fetch(id)

                if (guild) {
                    
                    const member = await guild.members.fetch(user.id).catch(err => {})
    
                    if (!member) {

                        if (returnCheck) return false

                        if (!data.ended) {

                            let r = await reaction.users.remove(user.id).catch(err => {})

                            if (!r) return
    
                            return giveawayEntryError(`You have to be in the guild ${guild.name} in order to join this giveaway!`)

                        }
                    }
                }
            }
        } else if (req_name === "guild_roles") {
            for (const id of req_value) {
                const role = reaction.message.guild.roles.cache.get(id)

                if (role) {
                    const member = await reaction.message.guild.members.fetch(user.id)

                    if (!member.roles.cache.has(role.id)) {
                        if (returnCheck) return false

                        if (!data.ended) {
                            let r = await reaction.users.remove(user.id).catch(err => {})

                            if (!r) return
    
                            return giveawayEntryError(`You need the role ${role.name} to join this giveaway!`)      
                        }

                    }
                }
            }
        } else if (req_name === "guild_messages") {
            const value = Number(req_value[0])

            if (!isNaN(value)) {
                const item = await db.fetch(`messages_${reaction.message.guild.id}_${user.id}`) || 0

                if (value > item) {

                    if (returnCheck) return false

                    if (!data.ended) {
                        let r = await reaction.users.remove(user.id).catch(err => {})

                        if (!r) return
                            
                        return giveawayEntryError(`You need ${value} messages to join this giveaway!\nYou have sent ${item} messages in ${reaction.message.guild.name}.`)
                    }
                }
            }
        } else if (req_name === "badges") {
            for (const b of req_value) {
                const badgeName = badgesFlags[b]

                if (badgeName) {
                    if (!user.flags.toArray().includes(badgeName)) {

                        if (returnCheck) return false

                        if (!data.ended) {
                            let r = await reaction.users.remove(user.id).catch(err => {})

                            if (!r) return
    
                            return giveawayEntryError(`You need to have the next badges: ${req_value.map(e => badges[e]).join(" ")}`)
                        }
                    }     
                }
            }
        } else if (req_name === "account_older") {
            const value = Number(req_value[0])

            if (!isNaN(value) && value > 0) {
                if (Date.now() - user.createdTimestamp - daysToMs(value) < 1) {

                    if (returnCheck) return false

                    if (!data.ended) {
                        let r = await reaction.users.remove(user.id).catch(err => {})

                         if (!r) return

                        return giveawayEntryError(`You're account must be older than ${value} days!\nYou're account was created ${ms(Date.now() - user.createdTimestamp).replace("h", " hours").replace("d", " days")} ago.`)
                    }
                }
            }
        } else if (req_name === "member_older") {
            const value = Number(req_value[0])

            if (!isNaN(value) && value > 0) {
                const member = await reaction.message.guild.members.fetch(user.id)

                if (Date.now() - member.joinedTimestamp - daysToMs(value) < 1) {

                    if (returnCheck) return false

                    if (!data.ended) {
                        let r = await reaction.users.remove(user.id).catch(err => {})

                        if (!r) return
    
                        return giveawayEntryError(`You need to be in ${reaction.message.guild.name} for more than ${value} days!\nYou're account joined this server ${ms(Date.now() - member.joinedTimestamp).replace("h", " hours").replace("d", " days")} ago.`)
     
                    }
               }
            }
        }
    }

    return true
}
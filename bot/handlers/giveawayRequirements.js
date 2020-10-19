const { User, ReactionEmoji, MessageReaction, MessageEmbed } = require("discord.js")
const badges = require("../utils/badges")
const daysToMs = require("../utils/daysToMs")
const ms = require("ms")
const Discord = require("discord.js")
const badgesFlags = require("../utils/badgesFlags")
const isUserInGuild = require("../functions/isUserInGuild")
const getIDFromArgument = require("../functions/getIDFromArgument")
const deleteMessageFromCache = require("./deleteMessageFromCache")
const shardGuild = require("../functions/shardGuild")
const deleteUserFromCache = require("./deleteUserFromCache")
const cooldown = new Discord.Collection()
const entryCooldown = new Discord.Collection()

module.exports = async (reaction = new MessageReaction(), user, returnCheck = false) => {

    if (!user) return 

    if (user.id === reaction.message.client.user.id) return

    const { message } = reaction
    
    if (!message.client.objects) return

    const guildData = await message.client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

    if (!guildData) return
    
    const giveaway_emoji_name = guildData.get("giveaway_emoji") === "🎉" ? "🎉" : guildData.get("giveaway_emoji").split(":")[1]

    const giveaway_emoji_id = guildData.get("giveaway_emoji") === "🎉" ? "🎉" : guildData.get("giveaway_emoji").split(":")[2]

    const giveaway_emoji = guildData.get("giveaway_emoji") === "🎉" ? "🎉" : guildData.get("giveaway_emoji")

    if (reaction.emoji.name !== giveaway_emoji_name) return

    let messages = await reaction.message.client.objects.giveaways.findOne({ where: { messageID: reaction.message.id }})

    if (!messages) return

    if (user.partial) {
        await user.fetch()

        deleteUserFromCache(message, user.id)
    }

    if (reaction.message.partial) {
        await reaction.message.fetch()

        deleteUserFromCache(message, user.id)
    }

    const client = reaction.message.client

    const data = await messages.toJSON()

    if (!data) {
        if (!returnCheck && !data.ended && guildData.get("entry_dm")) giveawayEntryAccept()

        return true
    }

    function giveawayEntryAccept() {

        if (entryCooldown.get(user.id)) return

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Giveaway Entry Accepted!`)
        .setDescription(`Your entry for the giveaway \`${data.title}\` has been accepted!\nGuild: ${reaction.message.guild.name}`)
        .setTimestamp()
        
        entryCooldown.set(user.id, true)

        setTimeout(() => {
            entryCooldown.delete(user.id)
        }, 25000)

        return user.send(embed).catch(err => {})
    }

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
        }, 25000)

        return user.send(embed).catch(Err => {})
    }

    if (guildData) {

        let blroles = []
            
        const blrolesData = JSON.parse(guildData.get("black_role"))

        if (blrolesData.length) {
            blroles = blrolesData.map(id => {
                let r = message.guild.roles.cache.get(id)

                if (r) return r.id
            }).filter(e => e)
        }

        if (blroles.length) {

            const member = await reaction.message.guild.members.fetch(user.id).catch(err => {})

            if (!member) return false

            if (member.roles.cache.some(r => blroles.includes(r.id))) {

                if (returnCheck) return false

                if (!data.ended) {

                    let r = await reaction.users.remove(user.id).catch(err => {})

                    if (!r) return

                    if (guildData.get("deny_dm")) {
                        giveawayEntryError(`You have a role that was blacklisted in this guild. (${reaction.message.guild.name})`)
                    }

                    return
                }
            }
        }

        let broles = []
            
        const rolesData = JSON.parse(guildData.get("bypass_role"))

        if (rolesData.length) {
            broles = rolesData.map(id => {
                let r = message.guild.roles.cache.get(id)

                if (r) return r.id
            }).filter(e => e)
        }

        if (broles.length) {
            const member = await reaction.message.guild.members.fetch(user.id).catch(err => {})

            if (!member) return false

            if (member.roles.cache.some(r => broles.includes(r.id))) {
                if (!returnCheck && !data.ended && guildData.get("entry_dm")) giveawayEntryAccept()

                return true
            }
        }
    }

    if (!data.requirements) {
        if (!returnCheck && !data.ended && guildData.get("entry_dm")) giveawayEntryAccept()

        return true
    }

    var task
    
    try {
        task = JSON.parse(data.requirements)
    } catch (error) {
        task = data.requirements
    }

    for (const req of Object.entries(task)) {

        let req_name = req[0]

        let req_value = req[1]

        if (req_name === "guild_member") {
            for (const id of req_value) {
                const member = await isUserInGuild(client, id, user.id)

                if (!member) {

                    if (returnCheck) return false

                    if (!data.ended) {

                        let r = await reaction.users.remove(user.id).catch(err => {})

                        if (!r) return

                        if (guildData.get("deny_dm")) {
                            const guild = await shardGuild(client, id)
                            
                            giveawayEntryError(`You have to be in the guild ${guild.name} in order to join this giveaway!`)
                        }

                        return
                    }
                }
            }
        } else if (req_name === "guild_roles") {

            if (req_value.join(" ").startsWith("select from")) {
                const start = Number(req_value[2])

                let test = req_value[req_value.length - 1]

                const end = Number(req_value[4])

                const roles = () => reaction.message.guild.roles.cache.array().filter(r => !r.managed).sort((r1, r2) => r1.position - r2.position).slice(start, end + 1).map(r => r.id)

                if (test === "--single") {
                    req_value = roles()

                    req_value.push("--single")
                } else {
                    req_value = roles()
                }
            }

            let oneRoleOnly = false

            const filter = req_value[req_value.length - 1]

            if (filter === "--single") {
                oneRoleOnly = true

                req_value.pop()

                const member = await reaction.message.guild.members.fetch(user.id).catch(err => {})

                if (!member) return false

                if (member.roles.cache.some(r => req_value.includes(r.id))) {
                    if (!returnCheck && guildData.get("entry_dm")) giveawayEntryAccept()

                    return true
                }
            }

            for (const id of req_value) {

                const role = reaction.message.guild.roles.cache.get(getIDFromArgument(id))

                if (role) {
                    const member = await reaction.message.guild.members.fetch(user.id).catch(err => {})

                    if (!member) return false

                    if (!member.roles.cache.has(role.id)) {
                        if (returnCheck) return false

                        if (!data.ended) {
                            let r = await reaction.users.remove(user.id).catch(err => {})

                            if (!r) return
    
                            if (guildData.get("deny_dm")) {
                                giveawayEntryError(`You need the role ${role.name} to join this giveaway!`)      
                            }

                            return
                        }
                    }
                }
            }
        } else if (req_name === "guild_messages") {
            const value = Number(req_value[0])

            if (!isNaN(value)) {
                let item 

                const d = await reaction.message.client.objects.guild_members.findOne({ where: { guildID: reaction.message.guild.id, userID: user.id }})

                if (d) {
                    item = d.get("messages") || 0
                } else item = 0

                if (value > item) {

                    if (returnCheck) return false

                    if (!data.ended) {
                        let r = await reaction.users.remove(user.id).catch(err => {})

                        if (!r) return
                            
                        if (guildData.get("deny_dm")) {
                            giveawayEntryError(`You need ${value} messages to join this giveaway!\nYou have sent ${item} messages in ${reaction.message.guild.name}.`)
                        }

                        return
                    }
                }
            }
        } else if (req_name === "badges") {

            let oneBadgeOnly = false

            const filter = req_value[req_value.length - 1]

            if (filter === "--single") {
                oneBadgeOnly = true

                req_value.pop()

                const badges = Object.values(badgesFlags)

                if (user.flags.toArray().some(e => badges.includes(e))) {
                    if (!returnCheck && guildData.get("entry_dm")) giveawayEntryAccept()

                    return true
                }
            }

            for (const b of req_value) {
                const badgeName = badgesFlags[b]

                if (badgeName) {
                    if (!user.flags.toArray().includes(badgeName)) {

                        if (returnCheck) return false

                        if (!data.ended) {
                            let r = await reaction.users.remove(user.id).catch(err => {})

                            if (!r) return
    
                            if (guildData.get("deny_dm")) {
                                giveawayEntryError(`You need to have the next badges: ${req_value.map(e => badges[e]).join(" ")}`)
                            }

                            return
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

                        if (guildData.get("deny_dm")) {
                            giveawayEntryError(`You're account must be older than ${value} days!\nYou're account was created ${ms(Date.now() - user.createdTimestamp).replace("h", " hours").replace("d", " days")} ago.`)
                        }

                        return
                    }
                }
            }
        } else if (req_name === "member_older") {
            const value = Number(req_value[0])

            if (!isNaN(value) && value > 0) {
                const member = await reaction.message.guild.members.fetch(user.id).catch(err => {})

                if (!member) return false

                if (Date.now() - member.joinedTimestamp - daysToMs(value) < 1) {

                    if (returnCheck) return false

                    if (!data.ended) {
                        let r = await reaction.users.remove(user.id).catch(err => {})

                        if (!r) return
    
                        if (guildData.get("deny_dm")) {
                            giveawayEntryError(`You need to be in ${reaction.message.guild.name} for more than ${value} days!\nYou're account joined this server ${ms(Date.now() - member.joinedTimestamp).replace("h", " hours").replace("d", " days")} ago.`)
                        }

                        return
                    }
                }
            }
        } else if (req_name === "user_tag_equals") {
            if (req_value[0] !== user.discriminator) {
                if (returnCheck) return false

                if (!data.ended) {
                    let r = await reaction.users.remove(user.id).catch(err => {})

                    if (!r) return

                    if (guildData.get("deny_dm")) {
                        giveawayEntryError(`You need to have the tag / discriminator as #${req_value[0]} to join to this giveaway.`)
                    }

                    return
                }
            }
        } else if (req_name === "real_invites") {
            const n = Number(req_value[0])

            const d = await client.objects.guild_members.findOne({ where: { guildID: reaction.message.guild.id, userID: user.id }})

            let item = 0
            
            if (d) {
                item = d.get("invites_real") || 0
            }

            if (n > item) {
                if (returnCheck) return false

                if (!data.ended) {
                    let r = await reaction.users.remove(user.id).catch(err => {})

                    if (!r) return

                    if (guildData.get("deny_dm")) {
                        giveawayEntryError(`You need to have at least ${n} real invites to join this giveaway.\nYou have ${item} real invites.`)
                    }

                    return
                }
            }
        } else if (req_name === "fake_invites") {
            const n = Number(req_value[0])

            const d = await client.objects.guild_members.findOne({ where: { guildID: reaction.message.guild.id, userID: user.id }})

            let item = 0
            
            if (d) {
                item = d.get("invites_fake") || 0
            }

            if (n < item) {
                if (returnCheck) return false

                if (!data.ended) {
                    let r = await reaction.users.remove(user.id).catch(err => {})

                    if (!r) return

                    if (guildData.get("deny_dm")) {
                        giveawayEntryError(`You can't have more than ${n} fake invites to join this giveaway.\nYou have ${item} fake invites.`)
                    }

                    return
                }
            }
        } else if (req_name === "total_invites") {
            const n = Number(req_value[0])

            const d = await client.objects.guild_members.findOne({ where: { guildID: reaction.message.guild.id, userID: user.id }})

            let item = 0
            
            if (d) {
                item = d.get("invites_fake") + d.get("invites_real") || 0
            }

            if (n > item) {
                if (returnCheck) return false

                if (!data.ended) {
                    let r = await reaction.users.remove(user.id).catch(err => {})

                    if (!r) return

                    if (guildData.get("deny_dm")) {
                        giveawayEntryError(`You need to have at least ${n} total invites to join this giveaway.\nYou have ${item} total invites.`)
                    }   

                    return
                }
            }
        } else if (req_name === "voice_duration") {
            const n = Number(req_value[0])

            const ms = Math.trunc(n * 1000 * 60)

            const d = await client.objects.guild_members.findOne({ where: { guildID: reaction.message.guild.id, userID: user.id }})

            let item = d.get("inVCTotal") || 0

            if (item < ms) {
                if (returnCheck) return false

                if (!data.ended) {
                    let r = await reaction.users.remove(user.id).catch(err => {})

                    if (!r) return

                    if (guildData.get("deny_dm")) {
                        giveawayEntryError(`You need to be in voice channels for at least ${n} minutes!\nYou've been in voice channels for ${Math.trunc(item / 1000 / 60)} minutes.`)
                    }   

                    return
                }
            }
        }
    }

    if (!returnCheck) {
        if (!data.ended && guildData.get("entry_dm")) {
            giveawayEntryAccept()
        }
    }
    return true
}
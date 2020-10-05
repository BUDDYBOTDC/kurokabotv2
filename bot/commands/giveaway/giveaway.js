const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const giveawayMessage = require("../../classes/giveawayMessage");
const ms = require("ms");
const readRequirements = require("../../handlers/readRequirements");
const findChannel = require("../../functions/findChannel");
const daysToMs = require("../../utils/daysToMs");
const getRequirements = require("../../handlers/getRequirements");
const logGiveaway = require("../../handlers/logGiveaway");
const parse = require("ms-parser")

module.exports = {
    name: "giveaway",
    aliases: [
        "gw"
    ],
    description: "instantly makes a giveaway.",
    category: "giveaway",
    overridePermissions: true,
    permissions: [
        "MANAGE_GUILD"
    ],
    cooldown: 5000,
    usages: [
        '"<item>" <channel | here> <winners> <time> [requirements | skip]'
    ],
    examples: [
        '"nitro classic" giveaway-channel 3 10m skip',
        '"red shirt" giveaways 1 4h',
        '"bandage" announcements 1 30m booster yes\naccount_older 10'
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        try {
    
            const data = {}

            const giveaway = args.join(" ").split('"')[1].split('"')[0]
    
            args = args.slice(giveaway.split(" ").length)

            let channel = findChannel(message, [args[0]], false)

            if (args[0] === "here") channel = message.channel

            if (!channel) return message.channel.send(`Invalid channel has been given.`)

            args.shift()

            const winners = Number(args[0])

            if (isNaN(winners) || winners < 1 || winners > 20) return message.channel.send(`There can't be less than 1 winner, there can't also be more than 20 winners.`)

            args.shift()

            try {
                var time = parse(args.shift())
            } catch(err) {
                return message.channel.send(`:x: Failed to parse time.`)
            }

            if (time.ms < 60000 || time.ms > daysToMs(30)) return message.channel.send(`Time cant be smaller than a minute nor bigger than 30 days.`)

            const requirements = args.join(" ") || "skip"

            const reqs = await readRequirements(client, requirements)
            
            if (reqs !== "skip") data.requirements = reqs 

            data.mention = `${message.author}`
            data.winners = winners
            data.title = giveaway
            data.channelID = channel.id
            data.guildID = message.guild.id
            data.endsAt = Date.now() + time.ms 
            data.removeCache = Date.now() + time.ms + daysToMs(7)
            data.ended = false
            data.time = time.ms 
            data.userID = message.author.id

            const read = await getRequirements({ data: JSON.stringify(data), message: message })

            if (read.message) {
                return message.channel.send(read.message)
            }

            message.react("✅")

            const giveaway_m = await message.guild.channels.cache.get(data.channelID).send({embed: {
                title: "Giveaway starting...",
            }}).catch(err => {})

            if (!giveaway_m) return message.channel.send(`I do not have access to send messages to ${channel}.`)

            data.messageID = giveaway_m.id

            try {
                await client.objects.giveaways.create(data)
            } catch (error) {
                return message.channel.send(`Error while creating giveaway: ${error.message}`)   
            }

            new giveawayMessage(giveaway_m, data)

            logGiveaway(client, data)

        } catch(err) {
            return message.channel.send("There was an error while trying to make the giveaway.\nMake sure you used quotes in the first field and those quotes are \" \" and not \' \'")
        }
    }
}
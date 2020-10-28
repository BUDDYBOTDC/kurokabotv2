const { Client, Message } = require("discord.js-light");
const findChannel = require("../../functions/findChannel");
const parse = require("ms-parser");
const getRequirements = require("../../handlers/getRequirements");
const readRequirements = require("../../handlers/readRequirements");
const daysToMs = require("../../utils/daysToMs");
const giveawayMessage = require("../../classes/giveawayMessage");
const randomKey = require("../../functions/randomKey");
const setGiveawayTimeout = require("../../handlers/setGiveawayIntervalTimeout");
const { messages } = require("../../utils/categoryColors");
const findQuotes = require("../../functions/findQuotes");

module.exports = {
    name: "giveaway-interval",
    description: "these giveaways will be repeated every given interval of time.",
    aliases: [
        "giveawayinterval",
        "ginterval",
        "gint",
        "giveawayint"
    ],
    clientPermissions: [
        "MANAGE_MESSAGES",
        "ADD_REACTIONS"
    ],
    category: "giveaway",
    cooldown: 10000,
    maxIntervalGiveaways: 10,
    usages: [
        '"<title>" <channel | here> <winners> <time> <interval> <startNow> <requirements | skip>'
    ],
    examples: [
        '"Nitro Classic" #giveaways 1 30m 1d yes skip'
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    overridePermissions: true,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            const data = {}

            const quotes = findQuotes(args[0])

            if (!quotes) return message.channel.send(`Invalid quotes were given, make sure the first argument is given in between quotes.\nExample: "Nitro Classic"`)

            const title = args.join(" ").split(quotes)[1].split(quotes)[0]
    
            args = args.slice(title.split(" ").length)
            
            let channel = findChannel(message, [args[0]], false)
    
            if (args[0] === "here") channel = message.channel

            if (!channel) return message.channel.send(`Could not find channel ${args[0]}.`)
    
            args.shift()
    
            const winners = Number(args[0])
    
            if (!winners || winners < 1 || winners > 20) return message.channel.send(`Winners can't be smaller than 1 nor greater than 20.`)
    
            args.shift()
    
            try {
                var time = parse(args[0])
            } catch (error) {
                return message.channel.send(`Failed to parse ${args[0]}, please use a valid time to parse, as for example: 1d3h`)
            }
    
            if (time.ms < 60000 && !client.owners.includes(message.author.id)) return message.channel.send(`Minimum time is 1 minute.`)
    
            if (time.ms >= daysToMs(30) && !client.owners.includes(message.author.id)) return message.channel.send(`Maximum time is 30 days.`)
    
            args.shift()
    
            try {
                var interval = parse(args[0])
            } catch (error) {
                return message.channel.send(`Failed to parse ${args[0]}, please use a valid time to parse, as for example: 1d3h`)
            }
    
            if (interval.ms < daysToMs(1)) return message.channel.send(`Minimum interval is 1 day.`)
    
            if (interval.ms >= daysToMs(21) && !client.owners.includes(message.author.id)) return message.channel.send(`Maximum interval is 21 days.`)
    
            args.shift()
    
            const startNow = args.shift()
    
            if (!["yes", "no"].includes(startNow.toLowerCase())) return message.channel.send(`${startNow} is not a valid option, valid options for startNow field are "yes" or "no"`)
    
            const requirements = args.join(" ")
    
            const reqs = readRequirements(client, requirements)

            if (reqs.message) {
                return message.channel.send(reqs.message)
            }

            const getReqs = await getRequirements({
                data: { requirements: reqs },
                message: message
            })
    
            if (getReqs.message) {
                return message.channel.send(getReqs.message)
            }

            data.mention = `${message.author}`
            data.winners = winners
            data.title = title
            data.channelID = channel.id
            data.guildID = message.guild.id
            data.endsAt = Date.now() + time.ms 
            data.removeCache = Date.now() + time.ms + daysToMs(7)
            data.ended = false
            data.time = time.ms 
            data.userID = message.author.id
            data.requirements = reqs
            data.interval = interval.ms
            data.nextAt = Date.now() + interval.ms
            data.sheduled = true
            data.removed = false
            data.code = randomKey()

            if (startNow === "yes") {
                message.react("✅")
    
                const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})
                
                const pingRole = message.guild.roles.cache.get(guildData.get("giveaway_ping_role"))

                const giveaway_m = await message.guild.channels.cache.get(data.channelID).send(`${pingRole ? `${pingRole}` : "" }`, {embed: {
                    title: "Giveaway starting...",
                }}).catch(err => {})
        
                if (!giveaway_m) return message.channel.send(`I do not have access to send messages to ${channel}.`)
        
                const dataGiveaway = {...data}

                dataGiveaway.messageID = giveaway_m.id
                
                delete dataGiveaway.scheduled
                delete dataGiveaway.interval
                delete dataGiveaway.removed
                delete dataGiveaway.nextAt
                delete dataGiveaway.code

                try {
                    await client.objects.giveaways.create(dataGiveaway)
                    await client.objects.giveaways.create(data)
                } catch (error) {
                    return message.channel.send(`Error while creating giveaway: ${error.message}`)   
                }
        
                new giveawayMessage(giveaway_m, dataGiveaway) 
                
                setGiveawayTimeout(client, data)

                message.channel.send(`This giveaway will be repeated every ${interval.string}.\nIf you'd like to stop this interval giveaway, use \`${client.prefix}remove-interval ${data.code}\`.`)
            } else {   
    
                setGiveawayTimeout(client, data)

                message.channel.send(`Giveaway will start in ${interval.string} and will be repeated every ${interval.string}.\nIf you'd like to stop this interval giveaway, use \`${client.prefix}remove-interval ${data.code}\`.`)
                
                try {
                    await client.objects.giveaways.create(data)
                } catch (error) {
                    return message.channel.send(`Error while creating giveaway: ${error.message}`)   
                }
            }
        } catch (error) {
            return message.channel.send(`Error! ${error.message}`)
        }
    }
}
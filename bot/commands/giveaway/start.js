const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const giveawayMessage = require("../../classes/giveawayMessage");
const ms = require("ms");
const readRequirements = require("../../handlers/readRequirements");
const findChannel = require("../../functions/findChannel");
const daysToMs = require("../../utils/daysToMs");
const getRequirements = require("../../handlers/getRequirements");
const logGiveaway = require("../../handlers/logGiveaway");
const isMakingOne = new Collection()
const parse = require("ms-parser")

module.exports = {
    name: "start",
    overridePermissions: true,
    description: "starts a giveaway in given channel (or in the current one)",
    permissions: ["MANAGE_GUILD"],
    clientPermissions: ["MANAGE_MESSAGES"],
    cooldown: 3000,
    category: "giveaway",
    execute: async (client = new Client(), message =new Message(), args = [], db) => {

        if (isMakingOne.get(message.author.id)) return 

        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Giveaway setup`)
        .setDescription(`Alright, let's start, what are you giving away?`)
        .setFooter(`As for example, a shirt\nType "cancel" to cancel the setup.`)

        const msg = await message.channel.send(embed)

        isMakingOne.set(message.author.id, true)

        const data = {}

        const filter = m => m.author.id === message.author.id

        async function first() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 60000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            data.title = m.content

            embed.setDescription(`So you're giving away a ${m.content}, ok, which channel should be this giveaway in?`)
            embed.setFooter(`Either mention the channel, give ID or name, or "here" for this channel.\nType "cancel" to cancel the setup.`)

            await msg.edit(embed)

            second()
        } 

        async function second() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 60000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            let channel = findChannel(m, m.content.split(" "), false)

            if (m.content === "here") channel = m.channel

            if (!channel) return cancelGiveaway("Invalid channel has been given.")

            data.channelID = channel.id

            embed.setDescription(`Channel set to ${channel}, how many winners for this giveaway?`)
            embed.setFooter(`Give a valid number of winners\nMinimum is 1, maximum is 20.\nType "cancel" to cancel the setup.`)

            await msg.edit(embed)

            third()
        } 

        async function third() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 60000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            const winners = Number(m.content)

            if (isNaN(winners) || winners < 1 || winners > 20) return cancelGiveaway("Invalid number of winners have been given.")

            data.winners = winners

            embed.setDescription(`Amount of winners for this giveaway set to ${winners}, How much time should this giveaway last for?`)
            embed.setFooter(`Give a valid time to parse, example: 5h (h stand for hours)\nMinimum time is a minute, maximum time is a month.\nType "cancel" to cancel the setup.`)

            await msg.edit(embed)

            fourth()

        }

        async function fourth() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 60000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            try {
                var time = parse(m.content)
            } catch (err) {
                return cancelGiveaway("Could not parse given time: " + m.content)
            }

            if (time.ms < 60000 || time.ms > daysToMs(30)) return cancelGiveaway(`Time cant be smaller than a minute nor bigger than 30 days.`)

            data.endsAt = Date.now() + time.ms

            data.removeCache = Date.now() + time.ms + daysToMs(7)

            data.ended = false

            data.time = time.ms

            embed.setDescription(`This giveaway will last ${time.string}, what are the requirements to join this giveaway?

**Fields:**
guilds <guildID> <guildID> ... (defaulted to none)
roles <roleID> ... (defaulted to none)
messages <number> (defaulted to "0")
member_older <days> (defaulted to "0")
account_older <days> (defaulted to "0")
user_tag_equals <tag> (only numbers)
badges <badge> <badge> ...

`)
            embed.addField(`Requirements ToS:`, " For legal reasons, You may **NOT** have a paid role as a bonus role. It is not legal. We hold no accountability for users actions if you (user) fails to follow this warning.")
            
            embed.setFooter(`Requirements field, use "skip" to skip it.\nOrder does not matter.\nType "cancel" to cancel the setup.`)

            await msg.edit(embed)

            fifth()

        }

        async function fifth() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 60000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")
            
            embed.setColor("GREEN")
            embed.setDescription(`The giveaway has been successfully set up.`)
            embed.setFooter(`Time to win!`)

            const reqs = await readRequirements(client, m.content)
            
            if (reqs !== "skip") data.requirements = reqs 

            const read = await getRequirements({ data: data, message: m })

            if (read.message) {
                embed.setColor("BLUE")
                embed.setDescription(`This giveaway will last ${m.content}, what are the requirements to join this giveaway?

**Fields:**
guilds <guildID> <guildID> ... (defaulted to none)
roles <roleID> ... (defaulted to none)
messages <number> (defaulted to "0")
member_older <days> (defaulted to "0")
account_older <days> (defaulted to "0")
user_tag_equals <tag> (only numbers)
badges <badge> <badge> ...
                
:x: ${read.message}
`)
                embed.setFooter(`Requirements field, use "skip" to skip it.\nOrder does not matter.`)
                
                await msg.edit(embed)
                
                return fifth()
            }

            data.mention = `${message.author}`

            await msg.edit(embed)

            const giveaway = await message.guild.channels.cache.get(data.channelID).send({embed: {
                title: "Giveaway starting...",
            }}).catch(err => {})

            if (!giveaway) return message.channel.send(`:x: I do not have permissions to send messages in <#${data.channelID}>`)

            data.messageID = giveaway.id 
            data.guildID = message.guild.id

            await client.objects.giveaways.create(data)

            new giveawayMessage(giveaway, data)

            logGiveaway(client, data)

            isMakingOne.delete(message.author.id)
        }


        function cancelGiveaway(error = String) {

            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`Giveaway setup canceled`)
            .setDescription(error)

            msg.edit(embed)

            isMakingOne.delete(message.author.id)
        }

        
        first()
    }
}
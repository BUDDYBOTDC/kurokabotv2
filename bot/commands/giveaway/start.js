const { Client, Message, MessageEmbed, Collection } = require("discord.js-light");
const giveawayMessage = require("../../classes/giveawayMessage");
const ms = require("ms");
const readRequirements = require("../../handlers/readRequirements");
const findChannel = require("../../functions/findChannel");
const daysToMs = require("../../utils/daysToMs");
const getRequirements = require("../../handlers/getRequirements");
const logGiveaway = require("../../handlers/logGiveaway");
const isMakingOne = new Collection()
const parse = require("ms-parser");
const getCustomEmbed = require("../../functions/getCustomEmbed");
const { HostNotReachableError } = require("sequelize");

module.exports = {
    name: "start",
    overridePermissions: true,
    description: "starts a giveaway in given channel (or in the current one)",
    permissions: ["MANAGE_GUILD"],
    maxGiveaways: 30,
    clientPermissions: ["MANAGE_MESSAGES"],
    cooldown: 10000,
    category: "giveaway",
    execute: async (client = new Client(), message =new Message(), args = [], db) => {

        if (isMakingOne.get(message.author.id)) return message.channel.send(`:x: Finish the current giveaway setup first.`)
        
        const fields = `guilds <guildID> <guildID> ...
roles <roleID | @role> ... [filter: --single]
messages <number>
member_older <days>
account_older <days>
user_tag_equals <tag>
badges <badge> <badge> ... [filter: --single]
real_invites <number>
fake_invites <number>
total_invites <number>
voice_duration <minutes>
level <number>`

        const color = await getCustomEmbed(client, message.guild.id, "giveaway")

        const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`Giveaway setup`)
        .setDescription(`Alright, let's start, what are you giving away?`)
        .setFooter(`As for example, a shirt\nType "cancel" to cancel the setup.`)

        const msg = await message.channel.send(embed)

        isMakingOne.set(message.author.id, true)

        const data = {}

        const filter = m => m.author.id === message.author.id && !m.content.startsWith(client.prefix)

        async function first() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 60000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            if (m.content.length >= 100) return cancelGiveaway("The title for the giveaway is too long.")

            data.title = m.content

            embed.setDescription(`So you're giving away a ${m.content}, ok, which channel should be this giveaway in?`)
            embed.setFooter(`Either mention the channel, give ID or name, or "here" for this channel.\nType "cancel" to cancel the setup.`)

            m.delete().catch(err => {})

            await msg.edit(embed).catch(err => {})

            if (!msg) return cancelGiveaway()

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

            if (channel.type === "news") return cancelGiveaway("News channels can't be used for giveaways as per discord editing rate limits in said channels.")
            
            data.channelID = channel.id

            embed.setDescription(`Channel set to ${channel}, how many winners for this giveaway?`)
            embed.setFooter(`Give a valid number of winners\nMinimum is 1, maximum is 20.\nType "cancel" to cancel the setup.`)

            m.delete().catch(err => {})

            await msg.edit(embed).catch(err => {})

            if (!msg) return cancelGiveaway()

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

            m.delete().catch(err => {})

            await msg.edit(embed).catch(err => {})

            if (!msg) return cancelGiveaway()

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
${fields}

`)
            embed.addField(`Requirements ToS:`, " For legal reasons, You may **NOT** have a paid role as a bonus role. It is not legal. We hold no accountability for users actions if you (user) fails to follow this warning.")
            
            embed.setFooter(`Requirements field, use "skip" to skip it.\nOrder does not matter.\nType "cancel" to cancel the setup.`)

            await msg.edit(embed).catch(err => {})

            if (!msg) return cancelGiveaway()

            fifth()

        }

        async function fifth() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 120000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            embed.setColor("BLUE")
            embed.setDescription(`Requirements have been set, do you want to be dmed once the giveaway ends? (yes / no).`)
            embed.setFooter(`Type "cancel" to cancel the setup.`)

            const reqs = await readRequirements(client, m.content)
            
            if (reqs !== "skip") data.requirements = reqs 

            const read = await getRequirements({ data: {
                requirements: readRequirements(client, m.content)
            }, message: m })

            if (read.message || reqs.message) {
                embed.setColor("BLUE")
                embed.setDescription(`This giveaway will last ${m.content}, what are the requirements to join this giveaway?

**Fields:**
${fields}
                
${read.message ? `:x: ${read.message}` : ""}
${reqs.message ? reqs.message : ""}
`)
                embed.setFooter(`Requirements field, use "skip" to skip it.\nOrder does not matter.\nA bit lost? Use ${client.prefix}requirements-guide for more information about this.`)

                m.delete().catch(err => {})

                await msg.edit(embed).catch(err => {})

                if (!msg) return cancelGiveaway()
                
                return fifth()
            }

            embed.fields = []

            data.mention = `${message.author}`

            await msg.edit(embed).catch(err => {})

            if (!msg) return cancelGiveaway()

            sixth()
        }

        async function sixth() {

            const collected = await message.channel.awaitMessages(filter, {
                time: 120000,
                errors: ["time"],
                max: 1
            }).catch(err => {})

            if (!collected) return cancelGiveaway("User did not reply in time.")

            const m = collected.first()

            if (m.content.toLowerCase() === "cancel") return cancelGiveaway("User canceled the setup.")

            const hoster = m.content === "yes"

            embed.setColor("GREEN")
            embed.setDescription(`The giveaway has been successfully set up.`)
            embed.addField(`Vote ${client.user.username}`, `You can vote this bot [here](https://top.gg/bot/754024463137243206/vote) if you like everything for free :3`)
            embed.setFooter(`Time to win!`)

            await msg.edit(embed).catch(err => {})

            if (!msg) return cancelGiveaway()

            const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})
            
            const pingRole = message.guild.roles.cache.get(guildData.get("giveaway_ping_role"))

            m.delete().catch(err => {})
            
            const giveaway = await message.guild.channels.cache.get(data.channelID).send(`${pingRole ? `${pingRole}` : "" }`, {embed: {
                title: "Giveaway starting...",
            }}).catch(err => {})

            if (!giveaway) return message.channel.send(`:x: I do not have permissions to send messages in <#${data.channelID}>`), isMakingOne.delete(message.author.id)

            data.dm_hoster = hoster
            data.messageID = giveaway.id 
            data.guildID = message.guild.id
            data.userID = message.author.id

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

            msg.edit(embed).catch(err => {
                message.channel.send(`Ew, why would you delete the embed.\nGiveaway setup canceled.`)
            })

            isMakingOne.delete(message.author.id)
        }

        first()
    }
}
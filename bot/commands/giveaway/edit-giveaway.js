const { Client, Message, MessageFlags } = require("discord.js");
const parse = require("ms-parser");
const getRequirements = require("../../handlers/getRequirements");
const readRequirements = require("../../handlers/readRequirements");
const daysToMs = require("../../utils/daysToMs");

module.exports = {
    name: "edit-giveaway",
    description: "edits a giveaway message (unstable)",
    aliases: [
        "edit-gw",
        "e-gw",
        "editgiveaway"
    ],
    cooldown: 10000,
    category: "giveaway",
    permissions: [
        "MANAGE_GUILD"
    ],
    overridePermissions: true,
    usages: [
        '<messageID> <winners> <time> <requirements | skip>'
    ],
    examples: [
        "58892928453292838 1 4d messages 1000",
        "578328358283829838 4 3d skip"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const m = await client.objects.giveaways.findOne({ where: { messageID: args[0], guildID: message.guild.id }})

        if (!m) return message.channel.send(`Could not find the giveaway, make sure its in this guild and the message ID is correct.`)

        if (m.get("userID") !== message.author.id && !client.owners.includes(message.author.id)) return message.channel.send(`You are not hosting this giveaway, therefore you cannot edit it.`)

        if (m.get("ended") === true) return message.channel.send(`This giveaway has already been added.`)

        const winners = Number(args[1])

        if (isNaN(winners)) return message.channel.send(`Amount of winners must be a valid number.`)

        if (winners < 1 || winners > 20) return message.channel.send(`Amount of winners can't be smaller than 1 nor bigger than 20.`)

        const requirements = args.slice(3).join(" ")

        try {
            var time = parse(args[2])
        } catch(err) {
            return message.channel.send(`Could not parse ${args[0]}, please give a valid time, as for example: 4d30m`)
        }

        let req = m.get("requirements")

        if (args[3] && args[3] !== "skip") {
            req = await getRequirements({ data: {
                requirements: readRequirements(client, requirements)
            }, message: message })

            if (req.message) {
                return message.channel.send(req.message)
            } else req = readRequirements(client, requirements)
        }

        if (args[3] === "skip") req = {}
        
        await client.objects.giveaways.update({
            requirements: req,
            time: time.ms,
            removeCache: time.ms + Date.now() + daysToMs(7),
            endsAt: time.ms + Date.now(),
            winners: winners
        }, { where: { messageID: args[0], guildID: message.guild.id }})

        message.channel.send(`Giveaway has been successfully edited, please wait until its updated.`)
    }
}
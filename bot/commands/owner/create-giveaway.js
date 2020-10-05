const { Message, Client, MessageEmbed } = require("discord.js");
const parse = require("ms-parser");
const giveawayMessage = require("../../classes/giveawayMessage");
const daysToMs = require("../../utils/daysToMs");

module.exports = {
    name: "create-giveaway",
    description: "giveaway backup creator, nothing interesting.",
    aliases: [
        "create-gw",
        "creategiveaway",
        "c-giveaway",
        "c-gw"
    ],
    usages: [
        '<channelID> <messageID> "<giveawayTitle>" <giveawayWinners> <giveawayTime>'
    ],
    examples: [
        "578329847583922848 4839203858492929 \"Nitro Classic\" 1 5d"
    ],
    cooldown: 1000,
    category: "owner",
    execute: async (client = new Client(), message = new Message(), args = new Array()) => {

        try {

            const channel = await client.channels.fetch(args.shift()).catch(err => {})

            if (!channel) return message.channel.send(`:x: Channel Not Found...`)

            const msg = await channel.messages.fetch(args.shift()).catch(err => {})

            if (!msg) return message.channel.send(`:x: Message Not Found.`)

            const arg = args.join(" ").split('"')[1].split('"')

            const title = arg[0]

            args = args.slice(arg.length)

            const winners = Number(args.shift()) || 1

            const time = parse(args.shift())

            if (!time) return message.channel.send(`Failed to parse time.`)

            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Giveaway assigned`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Title: ${title}\nWinners: ${winners}\nTime ${time.string}`)

            const data = {
                time: time.ms,
                removeCache: Date.now() + time.ms + daysToMs(7),
                endsAt: time.ms + Date.now(),
                title: title,
                winners: winners,
                requirements: undefined,
                guildID: channel.guild.id,
                channelID: channel.id,
                messageID: msg.id,
                ended: false,
                mention: "Unknown",
                userID: "Unknown"
            }

            await client.objects.giveaways.create(data)

            message.channel.send(embed)

            new giveawayMessage(msg, data)
        } catch(err) {
            message.channel.send(`Error! ${err.message}`)
        }
    }
}
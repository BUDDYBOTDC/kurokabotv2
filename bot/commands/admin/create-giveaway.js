const { Message, Client, MessageEmbed } = require("discord.js");
const parse = require("ms-parser");
const giveawayMessage = require("../../classes/giveawayMessage");
const getCustomEmbed = require("../../functions/getCustomEmbed");
const shardChannel = require("../../functions/shardChannel");
const shardGuildChannel = require("../../functions/shardGuildChannel");
const shardMessage = require("../../functions/shardMessage");
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
    category: "admin",
    execute: async (client = new Client(), message = new Message(), args = new Array()) => {

        try {

            const channel = await shardChannel(client, args[0])

            if (!channel) return message.channel.send(`:x: Channel Not Found...`)

            const msg = await shardMessage(client, channel.id, args[1])

            if (!msg) return message.channel.send(`:x: Message Not Found.`)

            args.shift()

            args.shift()

            const title = args.join(" ").split('"')[1].split('"')[0]
    
            if (title.length >= 100) return message.channel.send(`The title for the giveaway is too long.`)
            
            args = args.slice(title.split(" ").length)

            const winners = Number(args.shift()) || 1

            const time = parse(args.shift())

            if (!time) return message.channel.send(`Failed to parse time.`)

            const color = await getCustomEmbed(client, message.guild.id, "admin")

            const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`Giveaway assigned`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Title: ${title}\nWinners: ${winners}\nTime ${time.string}`)

            const guild = await shardGuildChannel(client, channel.id)
            
            const data = {
                time: time.ms,
                removeCache: Date.now() + time.ms + daysToMs(7),
                endsAt: time.ms + Date.now(),
                title: title,
                winners: winners,
                requirements: undefined,
                guildID: guild.id,
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
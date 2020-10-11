const { Client, Message, MessageEmbed } = require("discord.js");
const parse = require("ms-parser")
const ms = require("parse-ms");
const getCustomEmbed = require("../../functions/getCustomEmbed");
const getRequirements = require("../../handlers/getRequirements");

module.exports = {
    name: "giveaways-panel",
    aliases: [
        "giveawayspanel",
        "gpanel",
        "gp",
        "giveawaysp"
    ],
    description: "displays all the active giveaways for this guild.",
    category: "giveaway",
    cooldown: 5000,
    fields: [
        "<page>"
    ],
    examples: [
        "2",
        "3"
    ],
    permissions: [
        "MANAGE_MESSAGES"
    ],
    overridePermissions: true,
    execute: async (client = new Client(), message = new Message(), args=  []) => {

        try {
            const giveaways = await client.objects.giveaways.findAll({
                where: {
                    ended: false,
                    removed: null,
                    guildID: message.guild.id
                }
            })
    
            if (!giveaways.length) return message.channel.send(`No active giveaways found.`)
    
            let page = Number(args[0]) || 1
        
            const pages = Math.trunc(giveaways.length / 10 + 1)
    
            if (page > pages) page = pages
            else if (page < 1) page = 1
    
            const x = page * 10 - 10, y = page * 10
    
            const color = await getCustomEmbed(client, message.guild.id, "giveaway")
    
            const content = []
    
            const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`Active Giveaways For ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Page ${page} of ${pages}.`)
    
            for (const data of giveaways.slice(x, y)) {
    
                const requirements = await getRequirements({
                    data: { requirements: data.requirements },
                    message: message
                })
    
                embed.addField(`${data.title}`, [
                    `Channel: <#${data.channelID}> (${data.channelID})`,
                    `Winners: ${data.winners}`,
                    `Hosted by: ${data.mention} (${data.userID})`,
                    `Duration: ${parse(Object.entries(ms(new Date(data.time).getTime())).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}`,
                    `Ends in: ${parse(Object.entries(ms(new Date(data.endsAt).getTime() - Date.now())).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}`,
                    `Requirements?: ${requirements.length ? "\n" + requirements.join("\n") : "none" }`,
                    `[Jump To Giveaway](https://discord.com/channels/${data.guildID}/${data.channelID}/${data.messageID})`
                ].join("\n"))
            }
    
            message.channel.send(embed)
        } catch (error) {
            return message.channel.send(`Error! ${error.message}`)
        }
    }
}
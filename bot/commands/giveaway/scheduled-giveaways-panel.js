const { Client, Message, MessageEmbed } = require("discord.js");
const getCustomEmbed = require("../../functions/getCustomEmbed")
const ms = require("parse-ms")
const parse = require("ms-parser");
const getRequirements = require("../../handlers/getRequirements");
const { messages } = require("../../utils/categoryColors");

module.exports = {
    name: "scheduled-giveaways-panel",
    description: "displays information about the current scheduled giveaways of this guild.",
    cooldown: 5000,
    category: "giveaway",
    premium: true,
    aliases: [
        "scheduledgiveawayspanel",
        "sgpanel",
        "sgp"
    ],
    fields: [
        "<page>"
    ],
    examples: [
        "2",
        "4"
    ],
    permissions: [
        "MANAGE_ROLES",
    ],
    overridePermissions: true,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            const scheduledGiveaways = await client.objects.giveaways.findAll({
                where: {
                    guildID: message.guild.id,
                    removed: false,
                }
            })
    
            if (!scheduledGiveaways.length) return message.channel.send(`There isn't any scheduled giveaway for this guild.`)
    
            let page = Number(args[0]) || 1
    
            const pages = Math.trunc(scheduledGiveaways.length / 10 + 1)
    
            if (page > pages) page = pages
            else if (page < 1) page = 1
    
            const x = page * 10 - 10, y = page * 10
    
            const color = await getCustomEmbed(client, message.guild.id, "giveaway")
    
            const content = []
    
            const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`${message.guild.name} Scheduled Giveaways`)
            .setThumbnail(message.guild.iconURL({dynamic:true}))
            .setFooter(`Page ${page} of ${pages}.`)
            .setDescription(`Delete a scheduled giveaway by using \`${client.prefix}remove-interval <code>\`.`)
    
            for (const data of scheduledGiveaways.slice(x, y)) {
                
                const requirements = await getRequirements({
                    data: { requirements: data.requirements },
                    message: message
                })

                embed.addField(`${data.title}: ${data.code}`, [
                    `Channel: <#${data.channelID}> (${data.channelID})`,
                    `Every: ${parse(Object.entries(ms(new Date(data.interval).getTime())).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}`,
                    `Next in: ${parse(Object.entries(ms(new Date(data.nextAt).getTime() - Date.now())).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}`,
                    `Duration: ${parse(Object.entries(ms(new Date(data.time).getTime())).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}`,
                    `Winners: ${data.winners}`,
                    `Made by: <@${data.userID}> (${data.userID})`,
                    `Requirements?: ${requirements.length ? "\n" + requirements.join("\n") : "none" }`
                ].join("\n"))
            }
    
            message.channel.send(embed)
        } catch (error) {
            console.log(error)

            return message.channel.send(`Error! ${error.message}`)
        }
    }
}
const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("parse-ms");
const addPremium = require("../../functions/addPremium");
const parse = require("ms-parser");
const getCustomEmbed = require("../../functions/getCustomEmbed");
const setGiveawayTimeout = require("../../handlers/setGiveawayIntervalTimeout");

module.exports ={
    name: "redeem",
    description: "redeems a premium code, if the code is valid, it will add or extend the premium time for this guild.",
    category: "giveaway",
    cooldown: 10000,
    usages: [
        "<code>"
    ],
    examples: [
        "523djaQ592jdf"
    ],
    execute: async (client = new Client(), message =new Message(), args = []) => {

        const premiumCode = await client.objects.premium_codes.findOne({
            where: {
                code: args[0]
            }
        })

        if (!premiumCode) return message.channel.send(`This code does not belong to any premium code.`)

        if (premiumCode.get("redeemed")) return message.channel.send(`This code was already redeemed.`)

        const d = await premiumCode.toJSON()

        const option = await addPremium(client, message.guild.id, d)

        const color = await getCustomEmbed(client, message.guild.id, "giveaway")

        if (option === "extended") {
            const embed = new MessageEmbed()
            .setColor(color)
            .setAuthor(`${message.author.username} redeemed a premium code!`, message.author.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully used code with key ${args[0]}, premium has been extended for ${parse(Object.entries(ms(d.time)).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}.`)
            
            message.channel.send(embed)
        } else {
            const embed = new MessageEmbed()
            .setColor(color)
            .setAuthor(`${message.author.username} redeemed a premium code!`, message.author.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully used code with key ${args[0]}.\nThis guild is now premium and will last for ${parse(Object.entries(ms(d.time)).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).string}.`)

            const scheduledGiveways = await client.objects.giveaways.findAll({
                where: {
                    guildID: message.guild.id,
                    removed: false
                }
            })

            for (const data of scheduledGiveways) {
                setGiveawayTimeout(client, data)
            }

            message.channel.send(embed)
        }
    }
}
const { Client, Message, MessageEmbed } = require("discord.js-light");
const findMember = require("../../functions/findMember");
const isAdmin = require("../../functions/isAdmin");
const isStaff = require("../../functions/isStaff");
const isPartner = require("../../functions/isPartner");
const getCustomEmbed = require("../../functions/getCustomEmbed")
const parse = require("ms-parser")
const ms = require("parse-ms");
const findUser = require("../../functions/findUser");

module.exports = {
    name: "whois",
    description: "displays information about this user.",
    cooldown: 5000,
    category: "info",
    fields: [
        "<user>"
    ],
    examples: [
        "58320938583992245",
        "Ruben",
        "@Ruben"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        let user = await findUser(client, message, args)

        const owner = client.owners.includes(user.id)
        
        const admin = await isAdmin(client, user.id)
        
        const staff = await isStaff(client, user.id)
        
        const partner = await isPartner(client, user.id)

        let url 
        let role 

        if (owner) {
            role = "Developer"
            url = "https://cdn.discordapp.com/emojis/506624306252349452.png?v=1"
        } else if (admin) {
            role = "Admin"
            url = "https://cdn.discordapp.com/emojis/506624224723730462.png?v=1"
        } else if (staff) {
            url = "https://cdn.discordapp.com/emojis/516837111530258452.png?v=1"
            role = "Staff"
        }
        else if (partner) {
            url = "https://cdn.discordapp.com/emojis/700940624957800468.png?v=1"
            role = "Droplet Partner"
        }

        const color = await getCustomEmbed(client, message.guild.id, "info")

        const embed = new MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor(`${user.username}'s Information`, user.displayAvatarURL({dynamic:true}))
        .addField(`ID`, user.id)
        .addField(`Tag`, user.tag)
        .addField(`Created`, parse(Object.entries(ms(Date.now() - new Date(user.createdTimestamp).getTime())).filter(x => ["days", "hours", "minutes", "seconds"].includes(x[0]) && x[1]).map((x) => x[1] + x[0][0]).join("")).array.slice(0, 2).map(e => e.replace(" and", "")).join(" and ") + " ago")
        if (role) embed.addField(`Bot Rank`, role)
        .setThumbnail(url)

        message.channel.send(embed)

    }
}

const { Client, Message, MessageEmbed } = require("discord.js");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "invites-leaderboard",
    aliases: [
        "leaderboard-invites",
        "invitesleaderboard",
        "inviteslb",
        "lbi",
        "ilb",
        "ileaderboard"
    ],
    description: "leaderboard of invites in this guild.",
    cooldown: 10000,
    category: "invites",
    usages: [
        "<leaderboardType>"
    ],
    examples: [
        "total",
        "fake",
        "real"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const type = {
            total: "both",
            fake: "invites_fake",
            real: "invites_real"
        }[args[0].toLowerCase()]

        if (!type) return message.channel.send(`${args[0]} is not a valid type of leaderboard.`)

        const msg = await message.channel.send(`Generating leaderboard...`)

        let ms = Date.now()

        try {

            const color = await getCustomEmbed(client, message.guild.id, "invites")

            const embed = new MessageEmbed()
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`Invites Leaderboard For ${message.guild.name}`)
            .setURL("https://discord.gg/f7MCvQJ")
    
            const content = []

            const invites = await client.objects.guild_members.findAll({ 
                where: {
                    guildID: message.guild.id
                }
            })

            let y = 1

            for (const data of invites.sort((x, y) => type === "both" ? (y.invites_real + y.invites_fake) - (x.invites_real + x.invites_fake) : type === "invites_real" ? y.invites_real - x.invites_real : y.invites_fake - x.invites_fake).slice(0, 10)) {

                let item = 0

                if (type === "both") {
                    item = data.invites_fake + data.invites_real
                } else if (type === "invites_real") {
                    item = data.invites_real
                } else item = data.invites_fake

                if (item > 0) {

                    content.push(`${y}# - <@${data.userID}> : ${item} Invites (${args[0].toLowerCase()})`)
    
                    y++
                }
            }

            if (content.length === 0) return msg.edit(`Leaderboard is empty.`)
            
            embed.setDescription(content.join("\n"))
            embed.setFooter(`Leaderboard generated in ${Date.now() - ms}ms. (${invites.length} users)`)

            msg.edit("", embed)
        } catch (error) {
            return msg.edit(`Error! ${error.message}`)
        }
    }
}
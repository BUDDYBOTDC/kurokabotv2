const { Client, Message, MessageEmbed } = require("discord.js-light");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "level-leaderboard",
    aliases: [
        "llb",
        "lranking"
    ],
    fields: [
        "<page>"
    ],
    examples: [
        "3",
        "10"
    ],
    description: "displays a leaderboard sorted the level of users",
    cooldown: 15000,
    category: "level",
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const execution = Date.now()

        const msg = await message.channel.send(`Generating leaderboard...`)

        const all_data = await client.objects.guild_members.findAll({ where: { guildID: message.guild.id }})

        const data = all_data.sort((x, y) => Number(y.level) - Number(x.level)).filter(d => Number(d.level) > 0)

        const content = []

        let t = 0

        let top = 0

        for (const d of data) {
            const ID = d.userID

            t++

            content.push(`${t}# - **<@${ID}>**: level ${Number(d.level).toLocaleString()}`)

            if (ID === message.author.id) top = t
        
        }

        let page = Number(args[0]) || 1

        const pages = Math.trunc(t / 10 + 1)

        if (page > pages) page = pages
        else if (page < 1) page = 1

        let x = page * 10 - 10, y = page * 10

        const color = await getCustomEmbed(client, message.guild.id, "giveaway")

        const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`Level Leaderboard for ${message.guild.name}:`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(content.slice(x, y))
        .setFooter(`Generated in ${Date.now() - execution}ms.\nYou're top ${top}#.\nPage ${page} of ${pages} (${t} users).`)
        .setURL(`https://discord.gg/f7MCvQJ`)

        msg.edit("", embed)
    }
}
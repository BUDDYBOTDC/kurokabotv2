const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "leaderboard",
    aliases: [
        "lb",
        "ranking"
    ],
    fields: [
        "<page>"
    ],
    examples: [
        "3",
        "10"
    ],
    description: "displays a leaderboard sorted by amount of messages sent by users",
    cooldown: 15000,
    category: "giveaway",
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const execution = Date.now()

        const msg = await message.channel.send(`Generating leaderboard...`)

        const all_data = await client.objects.guild_members.findAll({ where: { guildID: message.guild.id }})

        const data = all_data.sort((x, y) => Number(y.messages) - Number(x.messages)).filter(d => Number(d.messages) > 0)

        const content = []

        let t = 0

        let top = 0

        for (const d of data) {
            const ID = d.userID

            const member = message.guild.member(ID)

            if (member) {
                t++

                content.push(`${t}# - **${member.user.tag}**: ${Number(d.messages).toLocaleString()} messages`)

                if (ID === message.author.id) top = t
            }
        }

        let page = Number(args[0]) || 1

        const pages = Math.trunc(t / 10 + 1)

        if (page > pages) page = pages
        else if (page < 1) page = 1

        let x = page * 10 - 10, y = page * 10

        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Message Leaderboard for ${message.guild.name}:`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(content.slice(x, y))
        .setFooter(`Generated in ${Date.now() - execution}ms.\nYou're on top ${top}#.\nPage ${page} of ${pages} (${t} users).`)
        .setURL(`https://discord.gg/f7MCvQJ`)

        msg.edit("", embed)
    }
}
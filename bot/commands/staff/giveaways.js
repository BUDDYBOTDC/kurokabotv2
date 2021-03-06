const { Client, Message, MessageEmbed } = require("discord.js-light");

module.exports = {
    name: "giveaways",
    description: "displays IDs of giveaways",
    category: "staff",
    fields: [
        "<page>"
    ],
    examples: [
        "3"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        let messages = await client.objects.giveaways.findAll()

        messages = messages.filter(d => !d.ended && d.removed === null && Date.now() < d.endsAt)
        
        let page = Number(args[0]) || 1

        const pages = Math.trunc(messages.length / 10 + 1)

        if (page > pages) page = pages

        const x = page * 10 - 10
        const y = page * 10

        const embed = new MessageEmbed()
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setColor("GREEN")
        .setAuthor(`Giveaway Messages Data`, message.author.displayAvatarURL({dynamic:true}))
        
        for (const data of messages.slice(x, y)) {
            embed.addField(`Giveaway: ${data.title}`, `Message ID: ${data.messageID}\nChannel ID: ${data.channelID}\nGuild ID: ${data.guildID}\nEnded?: ${data.ended}\nRemove Cache Date: ${data.removeCache}\nEnds at?: ${data.endsAt}\nWinners?: ${data.winners}\nHosted by (ID)?: \`${data.mention}\``)
        }

        embed.setFooter(`Displayed ${embed.fields.length} giveaways of ${messages.length}.\nPage ${page} of ${pages}.`)

        message.channel.send(embed)
    }
}
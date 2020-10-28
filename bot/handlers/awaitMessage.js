const { Message, MessageEmbed } = require("discord.js-light");

module.exports = async (message = new Message(), query = []) => {

    const filter = m => m.author.id === message.author.id && !isNaN(Number(m.content)) && query[Number(m.content) - 1] !== undefined

    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setAuthor(`Multiple queries found:`, message.author.displayAvatarURL({ dynamic: true }))
    .setFooter(`Choose one by using a number`)
    .setDescription(query.slice(0, 20).map((q, y) => `${y + 1}] ${q.text}`))
    .setThumbnail(message.client.owner.displayAvatarURL({dynamic:true}))
    
    const msg = await message.channel.send(embed)

    const collected = await message.channel.awaitMessages(filter, {
        time: 60000,
        max: 1,
        errors: ["time"]
    }).catch(err => {})

    if (!collected) {

        embed.setColor("RED")
        embed.setAuthor(`Command canceled:`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setDescription(`You did not choose a valid number in time.`)
        embed.setFooter(undefined)

        msg.edit(embed)

        return undefined
    } else {
        const m = collected.first()
    
        msg.delete()

        return query[Number(m.content) - 1]
    }
}
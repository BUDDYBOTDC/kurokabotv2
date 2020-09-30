const { Message, Collection, MessageEmbed } = require("discord.js")
const ms = require("parse-ms")

module.exports = (message = new Message(), command) => {

    const { client } = message

    const cooldowns = client.cooldowns.get(message.author.id) || new Collection()

    const cooldown = cooldowns.get(command.name)

    if (!cooldown) {

        cooldowns.set(command.name, Date.now())

        client.cooldowns.set(message.author.id, cooldowns)

        setTimeout(() => {
            const cooldowns = client.cooldowns.get(message.author.id) || new Collection()

            cooldowns.delete(command.name)

            client.cooldowns.set(message.author.id, cooldowns)
        }, command.cooldown - 999);

        return false
    } else {

        const time = Object.entries(ms(command.cooldown - (Date.now() - cooldown))).map((x, y) => {
            if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`
            else return ""
        }).filter(e => e).join(" ")

        const embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`${message.author.username}, you're on cooldown:`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`You can use \`${command.name}\` again in \`${time}\``)
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setFooter(`Why don't you better relax instead of spamming me :(`)

        message.channel.send(embed)
        
        return true
    }
}
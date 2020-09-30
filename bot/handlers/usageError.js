const { Message, MessageEmbed } = require("discord.js");

module.exports = async (message = new Message(), command) => {

    const { client } = message

    const embed = new MessageEmbed()
    .setColor("YELLOW")
    .setAuthor(`${message.author.username}, this command needs user input:`, message.author.displayAvatarURL({ dynamic: true }))
    .addField(`Usage(s)`, "```" + command.usages.map(e => `${client.prefix}${command.name} ${e}`).join("\n") + "```")
    .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
    .addField(`Examples(s)`, "```" + command.examples.map(e => `${client.prefix}${command.name} ${e}`).join("\n") + "```")
    .setFooter(`<> - Required arguments\n[] - Optional Arguments`)
    
    return message.channel.send(embed)
}
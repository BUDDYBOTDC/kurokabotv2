const { Client, Message, MessageEmbed } = require("discord.js-light");
const messageUpdate = require("../../events/messageUpdate");
const findChannel = require("../../functions/findChannel");

module.exports = {
    name: "test",
    description: "send a message to the channel you want to",
    category: "ADMIN",
    usages: [
        "[channel] <color> \"<title>\" \"<message>\""
    ],
    examples: [
        "rules ff0000 \"im gay\" \"desc here LOL\""
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {


        try {
            const channel = findChannel(message, [args[0]])

            args.shift()
    
            const color = args.shift()
    
            const m = args.join(" ")
    
            const title = m.split("\"")[1].split("\"")[0]
    
            const description = m.split("\"")[3].split("\"")[0]
    
            const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(description)
    
            channel.send(embed).catch(err =>{
                message.channel.send(`Failed to send message.`)
            }).then(m => {
                message.channel.send(`Message sent to ${channel}`)
            })
        } catch (error) {
            return message.channel.send(error.message)
        }
    }
}

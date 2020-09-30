const { Client, Message, MessageManager, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: "update",
    description: "updates all the bot commands.",
    category: "owner",
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const msg = await message.channel.send(`Updating bot commands...`)

        try {
            const folder = readdirSync("./bot/commands/")

            let cmds = []
    
            for (const folders of folder) {
    
                const files = readdirSync(`./bot/commands/${folders}/`)
    
                for (const commands of files) {
    
                    delete require.cache[require.resolve(`../${folders}/${commands}`)]
    
                    const command = require(`../${folders}/${commands}`)
    
                    client.commands.delete(command.name)
    
                    client.commands.set(command.name, command)
    
                    cmds.push(command.name)
                }
            }
    
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setAuthor(`Successfully updated ${client.user.username} commands:`)
            .setDescription(
                cmds.map(e => `\`${e}\``).join(", ")
            )
            .setThumbnail(message.author.displayAvatarURL({dynamic:true}))
            
            msg.edit("", embed)
        } catch (error) {
            return msg.edit(error.message)
        }
    }
}
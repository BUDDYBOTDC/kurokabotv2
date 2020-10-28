const { Client, MessageEmbed, Message } = require("discord.js-light");

module.exports = {
    name: "top",
    description: "top guilds sorted by amount of members (shard)",
    category:"admin",
    execute: async (client = new Client(), message = new Message(), args =[]) => {

        try {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Top 10 Guilds - Members - Shard ${message.guild.shardID}`)
            .setFooter(`Nice`)
    
            let y = 1
    
            for (const guild of client.guilds.cache.array().sort((x, y) => y.memberCount - x.memberCount).slice(0, 10)) {
                
                embed.addField(`[${y}] - ${guild.name}`, `Members: ${guild.memberCount}\nOwner: ${guild.ownerID}\nCached Members: ${guild.members.cache.size}`)
    
                y++
            }

            message.channel.send(embed)
        } catch (error) {
            message.channel.send(`Error! ${error.message}`)
        }
    }
}
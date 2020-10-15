const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("parse-ms")
const os = require("os-utils");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "stats",
    description: "displays the bot's stats",
    category: "info",
    cooldown: 10000,
    execute: async (client = new Client(), message = new Message(), args = [], db) => {
        
        const users = await client.shard.fetchClientValues("users.cache.size")

        const giveaways = await client.objects.giveaways.findAll()

        const userTotal = await client.shard.broadcastEval(`
        (async () => {
            let amount = 0
            for (const g of this.guilds.cache.array()) {
                amount += g.memberCount   
            }

            return amount
        })()
        `)
        
        const guildTotal = await client.shard.broadcastEval(`
        (async () => {
            return this.guilds.cache.size
        })()
        `)

        for (const id of client.owners) {
            await client.users.fetch(id)
        }

        const color = await getCustomEmbed(client, message.guild.id, "info")
        
        const embed = new MessageEmbed()
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setColor(color)
        .setTitle(`${client.user.username}'s Statistics:`)
        .addField(`Developer`, client.owners.map(id => client.users.cache.get(id).tag))
        .addField(`Library`, "discord.js v12.3.1")
        .addField(`Version`, client.version)
        .addField(`Memory usage`, (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + "mb")
        .addField(`Shard count`, client.shard.count)
        .addField(`Shard ID`, message.guild.shardID)
        .addField(`Events/m:`, `${client.eventsFired.toLocaleString()}`)
        .addField(`Total Giveaways Created:`, giveaways.length.toLocaleString())
        .addField(`Guild count`, guildTotal.reduce((x,y) => x + y, 0 ).toLocaleString())
        .addField(`Cached user count`, client.users.cache.size.toLocaleString())
        .addField(`User count`, userTotal.reduce((x,y) => x + y, 0).toLocaleString())
        .addField(`Uptime`, Object.entries(ms(client.uptime)).map((x, y) => {
            if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`
            else return ""
        }).filter(x => x).join(", "))

        message.channel.send(embed, false)
    }
}
const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("parse-ms")
const os = require("os-utils");

module.exports = {
    name: "stats",
    description: "displays the bot's stats",
    category: "info",
    cooldown: 10000,
    execute: async (client = new Client(), message = new Message(), args = [], db) => {
        
        var cpu = 0

        os.cpuUsage(f => {
            cpu = f
        })

        const users = await client.shard.fetchClientValues("users.cache.size")

        const userTotal = await client.shard.broadcastEval(`
        (async () => {
            let amount = 0
            for (const g of this.guilds.cache.array()) {
                amount += g.memberCount   
            }

            return amount
        })()
        `)
        
        for (const id of client.owners) {
            await client.users.fetch(id)
        }

        const embed = new MessageEmbed()
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setColor("GREEN")
        .setTitle(`${client.user.username}'s Statistics:`)
        .addField(`Developer`, client.owners.map(id => client.users.cache.get(id).tag))
        .addField(`Library`, "discord.js v12.3.1")
        .addField(`Version`, client.version)
        .addField(`Memory usage`, (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + "mb")
        .addField("CPU usage", `${cpu.toFixed(2)}%`)
        .addField(`Shard count`, users.length)
        .addField(`Guild count`, client.guilds.cache.size)
        .addField(`Cached user count`, client.users.cache.size)
        .addField(`User count`, userTotal.reduce((x,y) => x + y, 0))
        .addField(`Uptime`, Object.entries(ms(client.uptime)).map((x, y) => {
            if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`
            else return ""
        }).filter(x => x).join(", "))

        message.channel.send(embed, false)
    }
}
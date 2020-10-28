const { Client, Message } = require("discord.js-light");
const tableVariablesValues = require("../../utils/tableVariablesValues");

module.exports = {
    name: "unblacklist",
    description: "unblacklists an user or server.",
    category: "admin",
    aliases: ["ubl"],
    usages: [
        "<blacklistType> <ID>"
    ],
    examples: [
        "user 684300385839220942",
        "server 85839294853929343"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            const type = ["user", "server"].find(e => e === args[0].toLowerCase())

            if (!type) return message.channel.send(`${args[0]} is not a valid type.`)
  
            if (type === "user") {
    
                const user = await client.users.fetch(args[1], false).catch(err=> {})
    
                if (!user) return message.channel.send(`ID ${args[0]} does not belong to any user.`)
    
                const d = await client.objects.users.findOne({ where: { userID: user.id }})
    
                if (!d) {
                    await client.objects.users.create(tableVariablesValues.USER(user))
    
                    await client.objects.users.update({ isBanned: false, banReason: "none" }, { where: { userID: user.id }})
                } else {
                    await client.objects.users.update({ isBanned: false, banReason: "none" }, { where: { userID: user.id }})
                }
    
            } else {
    
                const guild = await client.guilds.fetch(args[1], false).catch(err => {})
    
                if (!guild) return message.channel.send(`ID ${args[0]} does not belong to any server.`)
    
                const d = await client.objects.guilds.findOne({ where: { guildID: guild.id }})
    
                if (!d) {
                    await client.objects.guilds.create(tableVariablesValues.GUILD(guild))
    
                    await client.objects.guilds.update({ isBlacklisted: false, blacklistReason: "none" }, { where: { guildID: guild.id }})
                } else {
                    await client.objects.guilds.update({ isBlacklisted: false, blacklistReason: "none" }, { where: { guildID: guild.id }})
                }
            }
    
            message.channel.send(`Successfully unblacklisted ${type} with ID ${args[1]}`)
        } catch (err) {
            return message.channel.send(`Error! ${err.message}`)
        }
    }
}
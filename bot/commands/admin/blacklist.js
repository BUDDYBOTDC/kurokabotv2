const { Client, Message } = require("discord.js");
const tableVariablesValues = require("../../utils/tableVariablesValues");

module.exports = {
    name: "blacklist",
    description: "blacklists an user or server from using the bot.",
    category: "admin",
    aliases: ["bl"],
    usages: [
        "<blacklistType> <ID> [reason]"
    ],
    examples: [
        "user 684300385839220942",
        "server 85839294853929343 aboosing"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            const type = ["user", "server"].find(e => e === args[0].toLowerCase())

            if (!type) return message.channel.send(`${args[0]} is not a valid type.`)
    
            const reason = args.slice(2).join(" ") || "not provided."
    
            if (type === "user") {
    
                const user = await client.users.fetch(args[1], false).catch(err=> {})
    
                if (!user) return message.channel.send(`ID ${args[1]} does not belong to any user.`)
    
                const d = await client.objects.users.findOne({ where: { userID: user.id }})
    
                if (!d) {
                    await client.objects.users.create(tableVariablesValues.USER(user))
    
                    await client.objects.users.update({ isBanned: true, banReason: reason }, { where: { userID: user.id }})
                } else {
                    await client.objects.users.update({ isBanned: true, banReason: reason }, { where: { userID: user.id }})
                }
    
            } else {
    
                const guild = await client.guilds.fetch(args[1], false).catch(err => {})
    
                if (!guild) return message.channel.send(`ID ${args[1]} does not belong to any server.`)
    
                const d = await client.objects.guilds.findOne({ where: { guildID: guild.id }})
    
                if (!d) {
                    await client.objects.guilds.create(tableVariablesValues.GUILD(guild))
    
                    await client.objects.guilds.update({ isBlacklisted: true, blacklistReason: reason }, { where: { guildID: guild.id }})
                } else {
                    await client.objects.guilds.update({ isBlacklisted: true, blacklistReason: reason }, { where: { guildID: guild.id }})
                }
            }
    
            message.channel.send(`Successfully blacklisted ${type} with ID ${args[1]} with reason: ${reason}`)
        } catch (err) {
            return message.channel.send(`Error! ${err.message}`)
        }
    }
}
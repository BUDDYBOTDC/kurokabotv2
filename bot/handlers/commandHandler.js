const { Client, Message, ReactionUserManager } = require("discord.js");
const isStaff = require("../functions/isStaff");
const shardGuild = require("../functions/shardGuild");
const clientPermissionsError = require("./clientPermissionsError");
const cooldownError = require("./cooldownError");
const permissionsError = require("./permissionsError");
const usageError = require("./usageError");

module.exports = async (client = new Client(), message = new Message(), db) => {

    if (message.author.bot || message.channel.type === "dm") return 

    const prefix = client.prefixes.find(p => message.content.toLowerCase().startsWith(p.toLowerCase()))

    if (!prefix) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)

    const CMD = args.shift().toLowerCase()

    const command = client.commands.get(CMD) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(CMD))

    if (!command) return

    if (!client.objects) return message.channel.send(`:x: Command timed out.`)
    
    if (command.category === "owner" && !client.owners.includes(message.author.id)) return
    
    if (command.category === "staff" && !client.owners.includes(message.author.id)) {
        const staff = await isStaff(client, message.author.id)

        if (!staff) return
    }

    if (command.permissions && !command.permissions.every(perm => message.member.hasPermission(perm)) && !client.owners.includes(message.author.id)) {
        if (command.overridePermissions) {
            const d = await message.client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

            let grole = "0"
        
            if (d) {
                grole = d.get("giveaway_role")
            }        

            if (!message.member.roles.cache.has(grole)) return permissionsError(message, command)
        } else return permissionsError(message, command)
    }

    if (command.clientPermissions && !command.clientPermissions.every(perm => message.guild.me.hasPermission(perm)) && !client.owners.includes(message.author.id)) return clientPermissionsError(message, command)

    if (command.usages && !args.length) return usageError(message, command)

    if (command.cooldown && !client.owners.includes(message.author.id)) {
        if (cooldownError(message, command)) return
    }

    let data = {}

    command.execute(client, message, args, db, data)
}
const { Client, Message, MessageEmbed } = require("discord.js");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "set-giveaway-ping-role",
    category: "server settings",
    description: "sets a giveaway ping role, this role will be pinged everytime a giveaway is created.",
    aliases: [
        "setgiveawaypingrole",
        "set-giveawayping",
        "set-g-p-role",
        "setgprole",
        "gprole"
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    cooldown: 5000,
    usages: [
        "<role>",
        "disable"
    ],
    examples: [
        "disable",
        "@role",
        "role",
        "8579029375739"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        if (args[0].toLowerCase() === "disable") {
            await client.objects.guilds.update({ giveaway_ping_role: "0" }, { where: { guildID: message.guild.id }})

            message.channel.send(`Giveaway ping role has been disabled / deleted.`)

            return
        }

        const roles = filterRoles(message, args)

        if (!roles.size) return message.channel.send(`Could not find any roles.`)

        if (roles.size === 1) {

            const role = roles.first()
            
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Giveaway Ping role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Giveaway Ping role to ${role}.`)

            await client.objects.guilds.update({ giveaway_ping_role: role.id }, { where: { guildID: message.guild.id }})

            message.channel.send(embed)
        } else {

            const query = []

            for (const r of roles.array()) {
                r.text = `${r}`
                query.push(r)
            }

            const role = await awaitMessage(message, query)

            if (!role) return 

            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Giveaway Ping role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Ping Manager role to ${role}.`)

            await client.objects.guilds.update({ giveaway_ping_role: role.id }, { where: { guildID: message.guild.id }})

            message.channel.send(embed)

        }
    }
}
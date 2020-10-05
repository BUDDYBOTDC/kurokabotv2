const { Client, Message, MessageEmbed } = require("discord.js");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "set-giveaway-role",
    category: "server settings",
    description: "sets a giveaway manager role, users with this role will not need Manage Guild permission to make giveaways.",
    aliases: [
        "setgiveawayrole",
        "set-giveaway",
        "set-g-role",
        "setgrole",
        "grole"
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
            await client.objects.guilds.update({ giveaway_role: "0" }, { where: { guildID: message.guild.id }})

            message.channel.send(`Giveaway Manager role has been disabled / deleted.`)

            return
        }

        const roles = filterRoles(message, args)

        if (!roles.size) return message.channel.send(`Could not find any roles.`)

        if (roles.size === 1) {

            const role = roles.first()
            
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Giveaway Manager role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Giveaway Manager role to ${role}.`)

            await client.objects.guilds.update({ giveaway_role: role.id }, { where: { guildID: message.guild.id }})

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
            .setAuthor(`Giveaway Manager role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Giveaway Manager role to ${role}.`)

            await client.objects.guilds.update({ giveaway_role: role.id }, { where: { guildID: message.guild.id }})

            message.channel.send(embed)

        }
    }
}
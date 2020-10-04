const { Client, Message, MessageEmbed } = require("discord.js");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "set-blacklist-role",
    description: "sets a blacklist role, users with this role will not be able to join to any of the giveaways.",
    aliases: [
        "setblacklistrole",
        "set-blacklist",
        "set-gl-role",
        "setblrole",
        "blrole"
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
            await client.objects.guilds.update({ black_role: "0" }, { where: { guildID: message.guild.id }})

            message.channel.send(`Blacklist role has been disabled / deleted.`)

            return
        }

        const roles = filterRoles(message, args)

        if (!roles.size) return message.channel.send(`Could not find any roles.`)

        if (roles.size === 1) {

            const role = roles.first()
            
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Blacklist role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Blacklist role to ${role}.`)

            await client.objects.guilds.update({ black_role: role.id }, { where: { guildID: message.guild.id }})

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
            .setAuthor(`Blacklist role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Blacklist role to ${role}.`)

            await client.objects.guilds.update({ black_role: role.id }, { where: { guildID: message.guild.id }})

            message.channel.send(embed)

        }
    }
}
const { Client, Message, MessageEmbed } = require("discord.js");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "set-bypass-role",
    description: "sets a giveaway bypass role, users with this role will not need to meet any of the requirements to join giveaways.",
    aliases: [
        "setbypassrole",
        "set-bypass",
        "set-b-role",
        "setbrole",
        "brole"
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
            const d = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

            if (!d) {
                await client.objects.guilds.create({
                    guildID: message.guild.id,
                    bypass_role: "0",
                    giveaway_role: "0",
                    premium: false
                })
            } else {
                await client.objects.guilds.update({ bypass_role: "0" }, { where: { guildID: message.guild.id }})
            }

            message.channel.send(`Giveaway Bypass role has been disabled / deleted.`)

            return
        }

        const roles = filterRoles(message, args)

        if (!roles.size) return message.channel.send(`Could not find any roles.`)

        if (roles.size === 1) {

            const role = roles.first()
            
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Giveaway Bypass role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Giveaway Bypass role to ${role}.`)

            const d = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

            if (!d) {
                await client.objects.guilds.create({
                    guildID: message.guild.id,
                    bypass_role: role.id,
                    giveaway_role: "0",
                    premium: false
                })
            } else {
                await client.objects.guilds.update({ bypass_role: role.id }, { where: { guildID: message.guild.id }})
            }

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
            .setAuthor(`Giveaway Bypass role set:`, message.author.displayAvatarURL({dynamic:true}))
            .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
            .setDescription(`Successfully set Giveaway Bypass role to ${role}.`)

            const d = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

            if (!d) {
                await client.objects.guilds.create({
                    guildID: message.guild.id,
                    bypass_role: role.id,
                    giveaway_role: "0",
                    premium: false
                })
            } else {
                await client.objects.guilds.update({ bypass_role: role.id }, { where: { guildID: message.guild.id }})
            }
            
            message.channel.send(embed)

        }
    }
}
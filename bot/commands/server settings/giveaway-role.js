const { Client, Message, MessageEmbed } = require("discord.js");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "giveaway-role",
    category: "server settings",
    description: "add a giveaway manager role, users with this role will not need Manage Guild permission to make giveaways, or delete a giveaway role.",
    aliases: [
        "giveawayrole",
        "giveawayr",
        "grole"
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    cooldown: 5000,
    usages: [
        "<option: add | delete> <role>",
    ],
    examples: [
        "add Orange",
        "delete @role",
        "add 8694299285593928",
        "delete 347588385884857"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const option = args.shift().toLowerCase()

        const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        if (option === "add") {
    
            const roles = filterRoles(message, args)
    
            if (!roles.size) return message.channel.send(`Could not find any roles.`)
    
            if (roles.size === 1) {
    
                const rolesData = JSON.parse(guildData.get("giveaway_role"))

                const role = roles.first()

                if (rolesData.includes(role.id)) return message.channel.send(`This role is already added.`)

                rolesData.push(role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Giveaway Manager role added:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully added ${role} to giveaway manager roles list.`)
    
                await client.objects.guilds.update({ giveaway_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
            } else {
    
                const query = []
    
                for (const r of roles.array()) {
                    r.text = `${r}`
                    query.push(r)
                }
    
                const role = await awaitMessage(message, query)
    
                if (!role) return 
    
                const rolesData = JSON.parse(guildData.get("giveaway_role"))

                if (rolesData.includes(role.id)) return message.channel.send(`This role is already added.`)

                rolesData.push(role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Giveaway Manager role added:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully added ${role} to giveaway manager roles list.`)
    
                await client.objects.guilds.update({ giveaway_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
    
            }
        } else if (option === "delete") {
                
            const roles = filterRoles(message, args)
    
            if (!roles.size) return message.channel.send(`Could not find any roles.`)
    
            if (roles.size === 1) {
    
                let rolesData = JSON.parse(guildData.get("giveaway_role"))

                const role = roles.first()

                if (!rolesData.includes(role.id)) return message.channel.send(`This role is not added.`)

                rolesData = rolesData.filter(id => id !== role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Giveaway Manager role deleted:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully deleted ${role} from giveaway manager roles list.`)
    
                await client.objects.guilds.update({ giveaway_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
            } else {
    
                const query = []
    
                for (const r of roles.array()) {
                    r.text = `${r}`
                    query.push(r)
                }
    
                const role = await awaitMessage(message, query)
    
                if (!role) return 
    
                let rolesData = JSON.parse(guildData.get("giveaway_role"))

                if (!rolesData.includes(role.id)) return message.channel.send(`This role is not added.`)

                rolesData = rolesData.filter(id => id !== role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Giveaway Manager role deleted:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully deleted ${role} from giveaway manager roles list.`)
    
                await client.objects.guilds.update({ giveaway_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
    
            }
        } else return message.channel.send(`Invalid option given.`)
    }
}





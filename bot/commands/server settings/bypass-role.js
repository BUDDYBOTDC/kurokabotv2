const { Client, Message, MessageEmbed } = require("discord.js");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "bypass-role",
    category: "server settings",
    description: "add a giveaway bypass role, users with this role will not need to meet any of the requirements to join giveaways, or delete a role from the list.",
    aliases: [
        "bypassrole",
        "bypass",
        "brole",
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    cooldown: 5000,
    usages: [
        "<option: add | delete> <role>",
    ],
    examples: [
        "add @role",
        "delete Orange",
        "add 35422988482999",
        "delete 7583929285478922"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const option = args.shift().toLowerCase()

        const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        if (option === "add") {
    
            const roles = filterRoles(message, args)
    
            if (!roles.size) return message.channel.send(`Could not find any roles.`)
    
            if (roles.size === 1) {
    
                const rolesData = JSON.parse(guildData.get("bypass_role"))

                const role = roles.first()

                if (rolesData.includes(role.id)) return message.channel.send(`This role is already added.`)

                rolesData.push(role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Bypass role added:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully added ${role} to bypass roles list.`)
    
                await client.objects.guilds.update({ bypass_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
            } else {
    
                const query = []
    
                for (const r of roles.array()) {
                    r.text = `${r}`
                    query.push(r)
                }
    
                const role = await awaitMessage(message, query)
    
                if (!role) return 
    
                const rolesData = JSON.parse(guildData.get("bypass_role"))

                if (rolesData.includes(role.id)) return message.channel.send(`This role is already added.`)

                rolesData.push(role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Bypass role added:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully added ${role} to bypass roles list.`)
    
                await client.objects.guilds.update({ bypass_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
    
            }
        } else if (option === "delete") {
                
            const roles = filterRoles(message, args)
    
            if (!roles.size) return message.channel.send(`Could not find any roles.`)
    
            if (roles.size === 1) {
    
                let rolesData = JSON.parse(guildData.get("bypass_role"))

                const role = roles.first()

                if (!rolesData.includes(role.id)) return message.channel.send(`This role is not added.`)

                rolesData = rolesData.filter(id => id !== role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Bypass role deleted:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully deleted ${role} from bypass roles list.`)
    
                await client.objects.guilds.update({ bypass_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
            } else {
    
                const query = []
    
                for (const r of roles.array()) {
                    r.text = `${r}`
                    query.push(r)
                }
    
                const role = await awaitMessage(message, query)
    
                if (!role) return 
    
                let rolesData = JSON.parse(guildData.get("bypass_role"))

                if (!rolesData.includes(role.id)) return message.channel.send(`This role is not added.`)

                rolesData = rolesData.filter(id => id !== role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Bypass role deleted:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully deleted ${role} from bypass roles list.`)
    
                await client.objects.guilds.update({ bypass_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
    
            }
        } else return message.channel.send(`Invalid option given.`)
    }
}


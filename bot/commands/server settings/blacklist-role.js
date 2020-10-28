const { Client, Message, MessageEmbed } = require("discord.js-light");
const filterRoles = require("../../functions/filterRoles");
const awaitMessage = require("../../handlers/awaitMessage");

module.exports = {
    name: "blacklist-role",
    description: "add a blacklist role, users with this role will not be able to join to any of the giveaways, or delete a role from the list of blacklisted roles.",
    category: "server settings",
    aliases: [
        "blacklistrole",
        "blacklistr",
        "blrole"
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
        "delete @role",
        "add Orange",
        "delete 85790293755748739"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const option = args.shift().toLowerCase()

        const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        if (option === "add") {
    
            const roles = filterRoles(message, args)
    
            if (!roles.size) return message.channel.send(`Could not find any roles.`)
    
            if (roles.size === 1) {
    
                const rolesData = JSON.parse(guildData.get("black_role"))

                const role = roles.first()

                if (rolesData.includes(role.id)) return message.channel.send(`This role is already blacklisted.`)

                rolesData.push(role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Blacklist role added:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully added ${role} to blacklisted roles list.`)
    
                await client.objects.guilds.update({ black_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
            } else {
    
                const query = []
    
                for (const r of roles.array()) {
                    r.text = `${r}`
                    query.push(r)
                }
    
                const role = await awaitMessage(message, query)
    
                if (!role) return 
    
                const rolesData = JSON.parse(guildData.get("black_role"))

                if (rolesData.includes(role.id)) return message.channel.send(`This role is already blacklisted.`)

                rolesData.push(role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Blacklist role added:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully added ${role} to blacklisted roles list.`)
    
                await client.objects.guilds.update({ black_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
    
            }
        } else if (option === "delete") {
                
            const roles = filterRoles(message, args)
    
            if (!roles.size) return message.channel.send(`Could not find any roles.`)
    
            if (roles.size === 1) {
    
                let rolesData = JSON.parse(guildData.get("black_role"))

                const role = roles.first()

                if (!rolesData.includes(role.id)) return message.channel.send(`This role is not blacklisted.`)

                rolesData = rolesData.filter(id => id !== role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Blacklist role deleted:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully deleted ${role} from blacklisted roles list.`)
    
                await client.objects.guilds.update({ black_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
            } else {
    
                const query = []
    
                for (const r of roles.array()) {
                    r.text = `${r}`
                    query.push(r)
                }
    
                const role = await awaitMessage(message, query)
    
                if (!role) return 
    
                let rolesData = JSON.parse(guildData.get("black_role"))

                if (!rolesData.includes(role.id)) return message.channel.send(`This role is not blacklisted.`)

                rolesData = rolesData.filter(id => id !== role.id)

                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(`Blacklist role deleted:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
                .setDescription(`Successfully deleted ${role} from blacklisted roles list.`)
    
                await client.objects.guilds.update({ black_role: JSON.stringify(rolesData) }, { where: { guildID: message.guild.id }})
    
                message.channel.send(embed)
    
            }
        } else return message.channel.send(`Invalid option given.`)
    }
}
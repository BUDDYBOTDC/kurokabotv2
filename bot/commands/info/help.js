const { Client, Message, MessageEmbed } = require("discord.js");
const getCustomEmbed = require("../../functions/getCustomEmbed");
const isAdmin = require("../../functions/isAdmin");
const isStaff = require("../../functions/isStaff");
const shardGuild = require("../../functions/shardGuild");

module.exports = {
    name: "help",
    description: "displays a list of commands or shows information on a specific command",
    category: "info",
    fields: [
        "<commandName>"
    ],
    examples: [
        "help",
        "giveaway"
    ],
    cooldown: 5000,
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const commands = []

        try {

            if (!args.length) {

                const categories = {}

                client.commands.map(async command => {
                    
                    if (command.category === "owner" && !client.owners.includes(message.author.id)) return

                    if (command.category === "staff" && !client.owners.includes(message.author.id)) {
                        const staff = await isStaff(client, message.author.id)

                        if (!staff) return
                    }

                    if (command.category === "admin" && !client.owners.includes(message.author.id)) {
                        const admin = await isAdmin(client, message.author.id)
                
                        if (!admin) return
                    }

                    if (!categories[command.category]) categories[command.category] = []

                    categories[command.category].push(`\`${client.prefix}${command.name}\``)
                })

                const embedColor = await getCustomEmbed(client, message.guild.id, "info")
                
                await new Promise(e => setTimeout(e, 300))

                const embed = new MessageEmbed()
                .setColor(embedColor)
                .setAuthor(`${client.user.username} Command List:`, message.author.displayAvatarURL({dynamic:true}))
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(commands.join("\n\n") + `\n\nInvite ${client.user.username} [here](https://discord.com/oauth2/authorize?client_id=754024463137243206&scope=bot&permissions=8) (or use \`k!invite\` if you can't click hyperlinks)
Found a bug? Report it on our [Support Server](https://discord.gg/f7MCvQJ)! (or use \`k!support\` if you can't click hyperlinks)`)
                .setFooter(`Need more information on a specific command? use ${client.prefix}help [commandName] for more infomartion on a command!`)

                for (const category of Object.entries(categories)) {
                    embed.addField(`**__${category[0].toUpperCase()}__**`, category[1].join(", "))
                }

                message.channel.send(embed)
            } else {

                const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(command => command.aliases && command.aliases.includes(args[0].toLowerCase()))
           
                if (!command) return message.channel.send(`Command \`${args[0]}\` does not exist.`)

                const embed = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(`Detailed help of \`${command.name}\`:`, message.author.displayAvatarURL({dynamic:true}))
                if (command.name) embed.addField(`Name:`, command.name)
                if (command.aliases) embed.addField(`Aliases:`, command.aliases.join(", "))
                if (command.description) embed.addField(`Description:`, command.description)
                if (command.category) embed.addField(`Category:`, command.category.toUpperCase())
                if (command.cooldown) embed.addField(`Cooldown:`, command.cooldown / 1000 + " seconds")
                if (command.usages && !command.fields) embed.addField(`Usage(s)`, "```" + command.usages.map(e => `${client.prefix}${command.name} ${e}`).join("\n") + "```")
                if (!command.usages && command.fields) embed.addField(`Usage(s)`, "```" + command.fields.map(e => `${client.prefix}${command.name} ${e}`).join("\n") + "```")
                if (command.examples) embed.addField(`Example(s)`, "```" + command.examples.map(e => `${client.prefix}${command.name} ${e}`).join("\n") + "```")
                if (command.clientPermissions) embed.addField(`Client Permissions:`, command.clientPermissions.map(perm => perm.split("_").join(" ").toLowerCase()).join(", "))
                if (command.permissions) embed.addField(`User Permissions:`, command.permissions.map(perm => perm.split("_").join(" ").toLowerCase()).join(", "))
                if (command.overridePermissions) {
                    const data = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

                    const grole = data.get("giveaway_role")

                    const role = message.guild.roles.cache.get(grole)

                    if (role) {
                        embed.addField(`Override Permissions Role:`, `${role}`)
                    }
                }

                message.channel.send(embed)
            }

        } catch(e) {
            return message.channel.send(e.message)
        }
    }
}
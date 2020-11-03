const { Client, Message, MessageEmbed } = require("discord.js-light");
const roleSettings = require("../../utils/role-settings");

module.exports = {
    name: "server-settings",
    description: "displays information about this guild.",
    category: "info",
    aliases: [
        "settings",
        "config",
        "serversettings",
        "ssettings",
        "servers"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const d = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        const data = await d.toJSON()
        
        const roles = () => {
            return roleSettings.map(info => {
                if (info.role === "giveaway_ping_role") {
                    const role = message.guild.roles.cache.get(d.get("giveaway_ping_role"))
    
                    if (role) {
                        return info.text.replace(`{0}`, `\n${role}`)
                    } else {
                        return info.text.replace(`{0}`, "not set")
                    }
                } else {
                    const roles = JSON.parse(d.get(info.role))

                    let toPut = roles.map(id => {
                        const role = message.guild.roles.cache.get(id)
    
                        if (role) return `${role}`
                    }).filter(e => e)

                    if (toPut.length) {
                        return info.text.replace(`{0}`, `\n${toPut.join("\n")}\n`)
                    } else {
                        return info.text.replace(`{0}`, "not set")
                    }
                }
            })
        }
        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Server Settings - ${message.guild.name}`, message.guild.iconURL({dynamic:true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`${roles().join("\n")}

**Blacklisted Channels (Commands)**: ${JSON.parse(data.blacklistedChannels).length ? "\n" + JSON.parse(data.blacklistedChannels).map(id => {
            const channel = message.guild.channels.cache.get(id)
        
            if (channel) return `${channel}`
}).join("\n") || "None" : "None"}
**Ignored Channels (Messages)**: ${JSON.parse(data.ignoreChannels).length ? "\n" + JSON.parse(data.ignoreChannels).map(id => {
    const channel = message.guild.channels.cache.get(id)

    if (channel) return `${channel}`
}).join("\n") || "None" : "None"}

**Invite Logging Channel**: ${message.guild.channels.cache.get(data.invite_logs) || "not set"}

**Giveaway Emoji**: ${d.get("giveaway_emoji") === "🎉" ? "🎉" : "<" + d.get("giveaway_emoji") + ">"}

${data.entry_dm ? "DMs for approved entries are <:enabled:763372741817663518>" : "DMs for approved entries are <:disabled:763372752035381259>" }
${data.deny_dm ? "DMs for denied entries are <:enabled:763372741817663518>" : "DMs for denied entries are <:disabled:763372752035381259>" }

`)

        message.channel.send(embed)
    }
}

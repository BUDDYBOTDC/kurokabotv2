const { Client, Message, MessageEmbed } = require("discord.js");
const roleSettings = require("../../utils/role-settings");

module.exports = {
    name: "role-settings",
    description: "displays the information about special roles.",
    aliases: [
        "rolesettings",
        "rsettings",
        "settings",
        "rlsettings",
        "r-settings"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const d = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        const data = await d.toJSON()

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Role Settings for ${message.guild.name}`, message.guild.iconURL({dynamic:true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
            roleSettings.map(info => {
                const role = message.guild.roles.cache.get(d.get(info.role))

                if (role) {
                    return info.text.replace(`{0}`, `${role}`)
                } else {
                    return info.text.replace(`{0}`, "not set")
                }
            })
        )

        message.channel.send(embed)
    }
}
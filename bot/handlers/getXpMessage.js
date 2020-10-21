const { Client, Message, Collection } = require("discord.js");

const cooldowns = new Collection()

module.exports = async (client = new Client(), message = new Message()) => {

    if (message.author.bot || message.channel.type === "dm") return

    if (!client.objects) return
    
    const guildData = await client.objects.guilds.findOne({ where: {
        guildID: message.guild.id
    }})

    const levelSettings = JSON.parse(guildData.get("level_settings"))

    if (!levelSettings.enabled) return

    if (cooldowns.get(message.guild.id + message.author.id)) return

    const member = await client.objects.guild_members.findOne({
        where: {
            userID: message.author.id,
            guildID: message.guild.id
        }
    })

    if (member) {
        let level = member.get("level") || 1, experience = member.get("experience") || 0

        const req = eval(levelSettings.formula.replace("{level}", level))

        const xp = levelSettings.message_xp

        if (xp + experience >= req) {

            const channel = client.channels.cache.get(levelSettings.channelID)

            client.objects.guild_members.update({
                level: level + 1,
                experience: 0
            }, {
                where: {
                    guildID: message.guild.id,
                    userID: message.author.id
                }
            })

            if (channel) {
                channel.send(levelSettings.message.replace(`{level}`, level + 1).replace(`{user.name}`, message.author.username).replace(`{user.mention}`, `${message.author}`).replace(`{exp.req}`, eval(levelSettings.formula.replace(`{level}`, level + 1)))).catch(err => {})
            }
        } else {
            client.objects.guild_members.update({
                experience: experience + xp
            }, {
                where: {
                    userID: message.author.id,
                    guildID: message.guild.id
                }
            })
        }

        setTimeout(() => {
            cooldowns.delete(message.guild.id + message.author.id)
        }, levelSettings.cooldown);
    
        cooldowns.set(message.guild.id + message.author.id)
    }
}

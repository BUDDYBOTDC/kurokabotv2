const { Client, User, Invite, MessageEmbed, GuildManager, GuildMember } = require("discord.js-light");

module.exports = async (client = new Client(), invite, inviter, target) => {

    if (!target) return

    if (!target.user) {
        await target.fetch()

        await target.guild.fetch()
    } 

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: target.guild.id
        }
    })

    const channel = target.guild.channels.cache.get(guildData.get("invite_logs"))

    if (channel) {

        const embed = new MessageEmbed()

        if (!inviter) {
            
            embed.setColor("RED")
            embed.setAuthor(`${target.user.tag} joined the guild:`, target.user.displayAvatarURL({dynamic:true}))
            embed.setThumbnail(client.user.displayAvatarURL())
            embed.setDescription(`I couldn't figure out how they joined.`)

        } else {

            embed.setColor("GREEN")
            embed.setAuthor(`${target.user.tag} joined the guild:`, target.user.displayAvatarURL({dynamic:true}))
            embed.setThumbnail(client.user.displayAvatarURL())
            embed.setDescription(`They were invited by ${inviter.tag}, using the code \`${invite.code}\`.`)

        }

        channel.send(embed).catch(err => {})
    }
}
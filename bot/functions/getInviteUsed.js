const { Client, GuildMember } = require("discord.js-light");

module.exports = async (client = new Client(), member = new GuildMember()) => {

    const { guild, user } = member

    if (!guild.me) return
    
    if (!guild.me.hasPermission("MANAGE_GUILD")) return

    const invites = await guild.fetchInvites()

    const db_invites = await client.objects.guild_invites.findAll({ where: { guildID: guild.id }})

    for (const invite of invites.array()) {

        const inv = db_invites.find(i => i.code === invite.code)

        if (inv) {

            if (invite.uses !== inv.uses) {
                return invite
            }
        }
    }

    return undefined
}
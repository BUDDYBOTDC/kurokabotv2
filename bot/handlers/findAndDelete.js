const { GuildMember, Client } = require("discord.js-light");

module.exports = async (client = new Client(), member = new GuildMember()) => {

    if (member.user.id === client.user.id) return

    const d = await client.objects.guild_members.findOne({ where: { guildID: member.guild.id, userID: member.user.id }})

    if (!d) return

    const inviter = d.get("invited_by")

    const data = await client.objects.guild_members.findOne({ where: { guildID: member.guild.id, userID: inviter }})

    if (data) {

        const fakeInvites = data.get("invites_fake")

        const realInvites = data.get("invites_real")

        client.objects.guild_members.update({ invites_real: realInvites - 1, invites_fake: fakeInvites + 1 }, { where: { userID: inviter, guildID: member.guild.id }})

    }
}
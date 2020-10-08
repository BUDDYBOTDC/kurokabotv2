const { Guild, Client } = require("discord.js");
const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = async (client = new Client(), guild = new Guild()) => {

    if (!guild.me.hasPermission("MANAGE_GUILD")) return

    const invites = await guild.fetchInvites()

    const db_invites = await client.objects.guild_invites.findAll({ where: { guildID: guild.id }})

    for (const invite of invites.array()) {

        const inv = db_invites.find(i => i.code === invite.code)

        if (!inv) {
            await client.objects.guild_invites.create(tableVariablesValues.GUILD_INVITES(invite))
        } else {
            await client.objects.guild_invites.update({ uses: invite.uses }, { where: { guildID: guild.id, code: invite.code }})
        }
    }
}
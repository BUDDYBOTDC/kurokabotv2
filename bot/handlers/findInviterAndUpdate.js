const { Client, GuildMember } = require("discord.js");
const getInviteUsed = require("../functions/getInviteUsed");
const { real } = require("../utils/dbCredentials");
const tableVariablesValues = require("../utils/tableVariablesValues");
const sendInviteLog = require("./sendInviteLog");

module.exports = async (client =new Client(), member = new GuildMember()) => {

    const invite = await getInviteUsed(client, member)

    if (!invite) return sendInviteLog(client, undefined, undefined, member)

    let db_invite = await client.objects.guild_invites.findOne({ where: { code: invite.code, guildID: member.guild.id }})

    let data_inviter = await client.objects.guild_members.findOne({ where: { guildID: member.guild.id, userID: invite.inviter.id }})

    let realInvites = 0

    let fakeInvites = 0

    if (!data_inviter) {
        await client.objects.guild_members.create(tableVariablesValues.GUILD_MEMBER(member.guild, invite.inviter))

        data_inviter = tableVariablesValues.GUILD_MEMBER(member.guild, invite.inviter)

    } else realInvites = data_inviter.get("invites_real"), fakeInvites = data_inviter.get("invites_fake")

    let invited_user = await client.objects.guild_members.findOne({ where: { guildID: member.guild.id, userID: member.user.id }})

    let invitedBy 

    if (!invited_user) {
        await client.objects.guild_members.create(tableVariablesValues.GUILD_MEMBER(member.guild, member.user))

        invited_user = tableVariablesValues.GUILD_MEMBER(member.guild, member.user)
    } else invitedBy = invited_user.get("invited_by")

    if (invite.inviter.id === invitedBy) fakeInvites--
    
    client.objects.guild_members.update({ invites_real: realInvites + 1, invites_fake: fakeInvites }, { where: { guildID: member.guild.id, userID: invite.inviter.id }})

    client.objects.guild_members.update({ invited_by: invite.inviter.id }, { where: { guildID: member.guild.id, userID: member.user.id }})

    client.objects.guild_invites.update({ uses: db_invite.uses + 1 }, { where: { guildID: member.guild.id, code: invite.code }})

    sendInviteLog(client, invite, invite.inviter, member)
}
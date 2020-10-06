const { Guild, User, Invite } = require("discord.js")
const Sequelize = require("sequelize")

module.exports = {
    GUILD: (guild = new Guild()) => {
        return {
            bypass_role: "0",
            premium: false,
            premiumSince: 0,
            giveaway_role: "0",
            guildID: guild.id,
            black_role: "0"
        }
    },

    GUILD_MEMBER: (guild = new Guild(), user = new User()) => {
        return {
            messages: 0,
            userID: user.id,
            guildID: guild.id,
            isBlacklisted: false,
            invites_real: 0,
            invites_fake: 0,
            invited_by: "unknown"
        }
    },

    GIVEAWAYS: {
        guildID: "guild.id",
        channelID: "channel.id",
        messageID: "message.id",
        userID: "user.id",
        winners: 0,
        ended: false,
        mention: "",
        endsAt: 0,
        title: "",
        time: 0,
        requirements: 0,
        removeCache: 0
    },

    USER: (user = new User()) => {
        return {
            isBanned: false,
            userID: user.id
        }
    },

    GUILD_INVITES: (invite = new Invite()) => {
        return {
            code: invite.code,
            guildID: invite.guild.id,
            userID: invite.inviter.id,
            uses: invite.uses
        }
    }
}
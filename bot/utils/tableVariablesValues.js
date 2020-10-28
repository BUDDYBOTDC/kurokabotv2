const { Guild, User, Invite } = require("discord.js-light")
const Sequelize = require("sequelize")
const categoryColors = require("./categoryColors")
const levelSettings = require("./levelSettings")

module.exports = {
    GUILD: (guild = new Guild()) => {
        return {
            bypass_role: "[]",
            premium: false,
            premiumSince: 0,
            giveaway_role: "[]",
            guildID: guild.id,
            black_role: "[]",
            giveaway_ping_role: "0",
            isBlacklisted: false,
            blacklistReason: "none",
            premiumEndsAt: 0,
            customEmbeds: JSON.stringify(categoryColors),
            ignoreChannels: "[]",
            blacklistedChannels: "[]",
            entry_dm: true,
            deny_dm: true,
            giveaway_emoji: "🎉",
            invite_logs: "0",
            level_settings: JSON.stringify(levelSettings)
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
            invited_by: "unknown",
            inVC: false,
            inVCSince: 0,
            inVCTotal: 0,
            level: 1,
            experience: 0
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
        removeCache: 0,
        dm_hoster: false
    },

    USER: (user = new User()) => {
        return {
            isBanned: false,
            banReason: "none",
            userID: user.id
        }
    },

    GUILD_INVITES: (invite) => {
        return {
            code: invite.code,
            guildID: invite.guild.id,
            userID: invite.inviter ? invite.inviter.id : "0",
            uses: invite.uses
        }
    },

    PREMIUM_CODES: (codeData = {}) => {
        return {
            time: codeData.time,
            code: codeData.code,
            redeemed: codeData.redeemed    
        }
    }
}
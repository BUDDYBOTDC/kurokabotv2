
const Sequelize = require("sequelize")

module.exports = {
    GUILD: {
        bypass_role: Sequelize.STRING,
        premium: Sequelize.BOOLEAN,
        premiumSince: Sequelize.DATE,
        giveaway_role: Sequelize.STRING,
        guildID: Sequelize.STRING,
        black_role: Sequelize.STRING,
        giveaway_ping_role: Sequelize.STRING,
        isBlacklisted: Sequelize.BOOLEAN,
        blacklistReason: Sequelize.STRING,
        premiumEndsAt: Sequelize.BIGINT,
        customEmbeds: Sequelize.STRING,
        ignoreChannels: Sequelize.STRING,
        entry_dm: Sequelize.BOOLEAN,
        deny_dm: Sequelize.BOOLEAN,
        blacklistedChannels: Sequelize.STRING,
        giveaway_emoji: Sequelize.STRING,
        invite_logs: Sequelize.STRING,
        level_settings: Sequelize.STRING
    },

    GUILD_MEMBER: {
        messages: Sequelize.INTEGER,
        userID: Sequelize.STRING,
        guildID: Sequelize.STRING,
        isBlacklisted: Sequelize.BOOLEAN,
        invites_real: Sequelize.INTEGER,
        invites_fake: Sequelize.INTEGER,
        invited_by: Sequelize.STRING,
        inVC: Sequelize.BOOLEAN,
        inVCSince: Sequelize.BIGINT,
        inVCTotal: Sequelize.BIGINT,
        level: Sequelize.BIGINT,
        experience: Sequelize.BIGINT
    },

    GIVEAWAYS: {
        guildID: Sequelize.STRING,
        channelID: Sequelize.STRING,
        messageID: Sequelize.STRING,
        userID: Sequelize.STRING,
        winners: Sequelize.INTEGER,
        ended: Sequelize.BOOLEAN,
        mention: Sequelize.STRING,
        endsAt: Sequelize.DATE,
        title: Sequelize.STRING,
        time: Sequelize.DATE,
        requirements: Sequelize.JSON,
        removeCache: Sequelize.DATE,
        scheduled: Sequelize.BOOLEAN,
        interval: Sequelize.BIGINT,
        nextAt: Sequelize.BIGINT,
        removed: Sequelize.BOOLEAN,
        code: Sequelize.STRING,
        dm_hoster: Sequelize.BOOLEAN
    },

    USER: {
        isBanned: Sequelize.BOOLEAN,
        userID: Sequelize.STRING,
        banReason: Sequelize.STRING
    },

    GUILD_INVITES: {
        code: Sequelize.STRING,
        guildID: Sequelize.STRING,
        userID: Sequelize.STRING,
        uses: Sequelize.INTEGER
    },

    PREMIUM_CODES: {
        time: Sequelize.BIGINT,
        code: Sequelize.STRING,
        redeemed: Sequelize.BOOLEAN   
    }
}



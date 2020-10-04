const Sequelize = require("sequelize")

module.exports = {
    GUILD: {
        bypass_role: Sequelize.STRING,
        premium: Sequelize.BOOLEAN,
        premiumSince: Sequelize.DATE,
        giveaway_role: Sequelize.STRING,
        guildID: Sequelize.STRING,
        black_role: Sequelize.STRING
    },

    GUILD_MEMBER: {
        messages: Sequelize.INTEGER,
        userID: Sequelize.STRING,
        guildID: Sequelize.STRING,
        isBlacklisted: Sequelize.BOOLEAN
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
        removeCache: Sequelize.DATE
    },

    USER: {
        isBanned: Sequelize.BOOLEAN,
        userID: Sequelize.STRING
    }
}
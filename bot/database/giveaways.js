const Sequelize = require("sequelize");

module.exports = (sequelize = new Sequelize()) => {
    
    return sequelize.define("giveaways", {
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
    })

}
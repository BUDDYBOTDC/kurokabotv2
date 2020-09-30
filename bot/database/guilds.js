const Sequelize = require("sequelize");

module.exports = (sequelize = new Sequelize()) => {
    
    return sequelize.define("guilds", {
        bypass_role: Sequelize.STRING,
        premium: Sequelize.BOOLEAN,
        giveaway_role: Sequelize.STRING,
        guildID: Sequelize.STRING
    })

}
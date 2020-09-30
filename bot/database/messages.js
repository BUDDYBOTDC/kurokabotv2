const Sequelize = require("sequelize");

module.exports = (sequelize = new Sequelize()) => {
    
    return sequelize.define("messages", {
        messages: Sequelize.INTEGER,
        userID: Sequelize.STRING,
        guildID: Sequelize.STRING
    })

}
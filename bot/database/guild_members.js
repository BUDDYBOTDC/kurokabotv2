const Sequelize = require("sequelize");
const tableVariables = require("../utils/tableVariables");

module.exports = (sequelize = new Sequelize()) => {
    
    return sequelize.define("guild_members", tableVariables.GUILD_MEMBER)

}
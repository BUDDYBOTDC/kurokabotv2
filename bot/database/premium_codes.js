const Sequelize = require("sequelize");
const tableVariables = require("../utils/tableVariables");

module.exports = (sequelize = new Sequelize()) => {
    
    return sequelize.define("premium_codes", tableVariables.PREMIUM_CODES)

}
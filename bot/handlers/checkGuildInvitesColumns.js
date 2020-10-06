const { Client } = require("discord.js");
const sequelize = require("sequelize");
const tableVariables = require("../utils/tableVariables");

module.exports = async (client = new Client(), db = new sequelize()) => {

    for (const v of Object.keys(tableVariables.GUILD_INVITES)) {

        const type = Object.entries(tableVariables.GUILD_INVITES).find(e => e[0] === v)[1]

        const added = await db.getQueryInterface().addColumn("guild_invites", v, {
            type: type 
        }).catch(err => {})

        if (added) {
            console.log(`Row ${v} added to guild_invites table.`)
        }
    }
}
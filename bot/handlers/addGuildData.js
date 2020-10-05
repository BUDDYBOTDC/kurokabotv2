const { Client, Guild } = require("discord.js");
const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");
const tableVariables = require("../utils/tableVariables");

const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = async (client = new Client(), guild = new Guild(), db = new sequelize()) => {

    const data = await client.objects.guilds.findOne({ where: { guildID: guild.id }})

    if (data) {

        const variables = Object.entries(tableVariablesValues.GUILD(guild))

        const better_data = await data.toJSON()

        let mustUpdate = false

        for (const v of variables) {

            let name = v[0], value = v[1]

            let type = Object.entries(tableVariables.GUILD).find(e => e[0] === name)

            const key = data.get(name)

            if (!key) {
                better_data[name] = value
                mustUpdate = true
            }
        }

        if (mustUpdate) {
            await client.objects.guilds.update(better_data, { where: { guildID: guild.id }})
        }
    } else {
        await client.objects.guilds.create(tableVariablesValues.GUILD(guild))
    }

}
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

        const brole = data.get("bypass_role")
        const blrole = data.get("black_role")
        const grole = data.get("giveaway_role")

        if (!brole.startsWith("[") && !blrole.startsWith("[") && !grole.startsWith("[")) {
            await client.objects.guilds.update({
                bypass_role: brole === "0" ? "[]" : JSON.stringify([brole]),
                black_role: blrole === "0" ? "[]" : JSON.stringify([blrole]),
                giveaway_role: grole === "0" ? "[]" : JSON.stringify([grole]),
            }, {
                where: {
                    guildID: guild.id
                }
            })
        }
    } else {
        await client.objects.guilds.create(tableVariablesValues.GUILD(guild))
    }

}


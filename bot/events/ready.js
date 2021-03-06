const { Client } = require("discord.js-light")
const sequelize = require("sequelize")
const shardUser = require("../functions/shardUser")
const fetchGiveaways = require("../handlers/fetchGiveaways")
const handleGuildsData = require("../handlers/handleGuildsData")
const memoryOptimization = require("../handlers/memoryOptimization")
const onStartStatus = require("../handlers/onStartStatus")
const syncTables = require("../handlers/syncTables")
const categoryColors = require("../utils/categoryColors")

module.exports = async (client = new Client(), db = new sequelize()) => {

    await syncTables(client, db)

    await handleGuildsData(client, db)

    setInterval(() => {
        client.sweepUsers(0)   
    }, 60000);

    client.owner = client.user

    console.log(`Ready on ${client.user.tag} and loaded ${client.commands.size} commands.`)

    onStartStatus(client)

    fetchGiveaways(client, db)

}
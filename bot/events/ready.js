const { Client } = require("discord.js")
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

    await memoryOptimization(client, true)
    
    await handleGuildsData(client, db)

    setInterval(() => {
         if (client.users.cache.size >= 20000) {
            memoryOptimization(client, true)   
         }
    }, 600000);

    client.owner = client.user

    console.log(`Ready on ${client.user.tag} and loaded ${client.commands.size} commands.`)

    onStartStatus(client)

    fetchGiveaways(client, db)

}
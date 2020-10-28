const { Client, Message } = require("discord.js-light");

module.exports = {
    name: "respawn",
    description: "respawns a shard",
    category: "admin",
    cooldown: 10000,
    usages: [
        "<shardOptions: shardID | all>"
    ],
    examples: [
        "all",
        "1"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        if (args[0] === "all") {
            await message.channel.send(`Respawning all shards.`)
            
            client.shard.respawnAll()

            return 
        }

        return message.channel.send(`Unded development.`)

        const shard = Number(args[0])

        if (isNaN(shard)) return message.channel.send(`Invalid number.`)
    }
}
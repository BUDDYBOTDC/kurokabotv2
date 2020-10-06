const config = require("./config.json")
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: config.token });

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)

    shard.on("disconnect", () => {
        console.log(`Shard ${shard.id} disconnected!`)
    })

    shard.on("error", error => {
        console.log(`Shard ${shard.id} Errored!\n${error}`)
    })
});

manager.spawn();

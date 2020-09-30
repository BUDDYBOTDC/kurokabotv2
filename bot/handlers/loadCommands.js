const { readdirSync, readdir } = require("fs")

module.exports = (client) => {

    const mainFolder = readdirSync("./bot/commands/")

    for (const folders of mainFolder) {

        const files = readdirSync(`./bot/commands/${folders}/`)

        for (const commands of files) {

            const command = require(`../commands/${folders}/${commands}`)

            client.commands.set(command.name, command)
            
        }
    }
}
const { Message } = require("discord.js-light");
const { readdirSync, readFile, readFileSync, read } = require("fs");

module.exports = {
    name: "lines",
    description: "total lines of code put into this bot.",
    cooldown: 10000,
    category: "info",
    execute: async(client = new Client(), message = new Message(), args = [], db) => {

        const msg = await message.channel.send(`Calculating...`)

        let lines = readFileSync("./index.js", { encoding: "utf-8" }).split("\n").length

        let letters = readFileSync("./index.js", { encoding: "utf-8" }).length

        let fls = 1

        try {
            
            const folder = readdirSync("./bot/")

            for (const folders of folder) {
                
                if (folders === "commands") {

                    const secondFolders = readdirSync(`./bot/commands/`)

                    for (const cmdFolder of secondFolders) {

                        const files = readdirSync(`./bot/commands/${cmdFolder}/`)

                        for (const command of files) {
                            const f = readFileSync(`./bot/commands/${cmdFolder}/${command}`, { encoding: "utf-8" })

                            letters += f.length

                            fls++

                            lines += f.split("\n").length
                        }
                    }
                } else {
                    const files = readdirSync(`./bot/${folders}/`)

                    for (const file of files) {
                        const f = readFileSync(`./bot/${folders}/${file}`, { encoding: "utf-8" })

                        letters += f.length

                        fls++

                        lines += f.split("\n").length
                    }
                }
            }

            msg.edit(`${lines.toLocaleString()} lines of code.\n${letters.toLocaleString()} characters.\n${fls.toLocaleString()} files.\nAvrg lines/file: ${(lines / fls).toFixed(0)}.`)
        } catch (error) {
            await msg.edit(`An error occurred: ${error.message}`)
        }
    }
}
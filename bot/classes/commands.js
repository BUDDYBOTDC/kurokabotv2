const { Collection, Message } = require("discord.js-light")
const categories = require("../utils/categories")

class commands {

    constructor(commands = []) {

        this.commands = new Collection()

        for (const command of commands.array()) {

            this.commands.set(command.name, command)

        }
    }

    getCommandsByReaction(reaction) { 
        return this.commands.filter(command => command.category === categories[reaction])
    }
}


module.exports = commands
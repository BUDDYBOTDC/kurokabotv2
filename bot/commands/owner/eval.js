const { Client, Message } = require("discord.js");

module.exports = {
    name: "eval",
    description: "eval command, not much to explain.",
    cooldown: 1000,
    category: "owner",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        try {
            eval(args.join(" "))
        } catch (error) {
            return message.channel.send(error.message)
        }
    }
}
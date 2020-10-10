const { Client, Message } = require("discord.js");
const parse = require("ms-parser");
const randomKey = require("../../functions/randomKey");

module.exports = {
    name: "premium-code",
    aliases: [
        "pmcode",
        "premiumcode",
        "pcode",
        "pc"
    ],
    usages: [
        "<time>"
    ],
    examples: [
        "5d",
        "2m40s",
        "3w"
    ],
    description: "generates a premium code",
    cooldown: 1000,
    category: "admin",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const key = randomKey()

        try {
            var time = parse(args[0])
        } catch (error) {
            return message.channel.send(`Could not parse ${args[0]}, make sure you gave a valid time, as for example: 4d30m`)    
        }

        if (time.ms > parse("100y").ms) return message.channel.send(`More than 100 years? u crazy bro.`)
        
        await client.objects.premium_codes.create({
            time: time.ms,
            code: key,
            redeemed: false,
        })

        message.channel.send(`Premium code with value of ${time.string} generated.\nKey: \`${key}\``)
    }
}
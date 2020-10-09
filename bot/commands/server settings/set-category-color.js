const { Client, Message, DiscordAPIError, MessageMentions, MessageEmbed } = require("discord.js");
const updateCustomEmbeds = require("../../functions/updateCustomEmbeds");
const categoryColors = require("../../utils/categoryColors");

module.exports = {
    name: "set-category-color",
    aliases: [
        "setcategorycolor",
        "scc",
        "setccolor",
        "scategorycolor"
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    cooldown: 3000,
    category: "server settings",
    description: "sets the color of embeds of given category name. (premium only)",
    premium: true,
    usages: [
        "<color> <category>"
    ],
    examples: [
        "ff0000 info",
        "f398ff giveaway"
    ],
    execute: async (client = new Client(), message = new Message(), args =[]) => {
     
        const color = args.shift()

        const category = categoryColors[args.join(" ")]

        if (!category) return message.channel.send(`Category with name \`${args.join(" ")}\` dos not exist.`)

        try {
            const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`Embeds Color Updated`)
            .setDescription(`Embeds color of commands with the category \`${args.join(" ")}\` will now show up with this color!`)

            await updateCustomEmbeds(client, message.guild.id, args.join(" "), color)

            message.channel.send(embed)

            
        } catch(err) {
            return message.channel.send(`${color} is not a valid hexcode.`)
        }

    }
}
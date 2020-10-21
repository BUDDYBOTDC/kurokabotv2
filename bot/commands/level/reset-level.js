const { Client, Message } = require("discord.js");
const findMember = require("../../functions/findMember");

module.exports = {
    name: "reset-level",
    description: "resets the user's level.",
    aliases: [
        "resetlevel",
        "resetlv"
    ],
    permissions: [
        "ADMINISTRATOR"
    ],
    usages: [
        "<user>"
    ],
    examples: [
        "Ruben",
        "688287683929287583828",
        "@Ruben"
    ],
    category: "level",
    cooldown: 5000,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const member = await findMember(message, args, false)

        if (!member) return message.channel.send(`Could not find the requested member.`)

        try {
            await client.objects.guild_members.update({
                level: 1,
                experience: 0
            }, {
                where: {
                    guildID: message.guild.id,
                    userID: message.author.id
                }
            })
        } catch (error) {
            console.log(`User didn't exist`)
        }

        message.channel.send(`Successfully reset ${member.user.username}'s level.`)
    }
}
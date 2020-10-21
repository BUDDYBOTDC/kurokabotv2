const { Client, Message } = require("discord.js");
const findMember = require("../../functions/findMember");

module.exports = {
    name: "set-level",
    description: "sets the user's level.",
    aliases: [
        "setlevel",
        "setlv"
    ],
    permissions: [
        "ADMINISTRATOR"
    ],
    usages: [
        "<level> <user>"
    ],
    examples: [
        "1 Ruben",
        "4 688287683929287583828",
        "10 @Ruben"
    ],
    category: "level",
    cooldown: 5000,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const n = Number(args[0]) 

        if (!n > 0 && !n < 1000) return message.channel.send(`Please use a valid number between 1 and 999.`)

        const member = await findMember(message, args.slice(1), false)

        if (!member) return message.channel.send(`Could not find the requested member.`)

        try {
            await client.objects.guild_members.update({
                level: n,
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

        message.channel.send(`Successfully set ${member.user.username}'s level to ${args[0]}.`)
    }
}
const { Client, Message } = require("discord.js");
const findMember = require("../../functions/findMember");

module.exports = {
    name: "reset-messages",
    description: "resets someone's or everyone's messages sent in this guild.",
    aliases: [
        "r-messages",
        "resetmessages",
        "rmessages"
    ],
    cooldown: 5000,
    category: "util",
    permissions: [
        "MANAGE_GUILD"
    ],
    overridePermissions: true,
    usages: [
        "<user | everyone>"
    ],
    examples: [
        "everyone",
        "Ruben",
        "@Ruben",
        "558392029847832"
    ],
    execute: async(client = new Client(), message = new Message(), args = [], db) => {

        if (args[0].toLowerCase() === "everyone") {

            const msg = await message.channel.send(`Resetting everyone's messages, this may take a while...`)

            const all_data = await client.objects.guild_members.findAll({ where: { guildID: message.guild.id }})

            let total = 0

            for (const d of all_data) {
                await client.objects.guild_members.update({ messages: 0 }, { where: { guildID: message.guild.id, userID: d.userID }})

                total++
            }

            msg.edit(`Successfully reset everyone's messages sent in this guild! (${total} users)`)

        } else {

            const member = findMember(message, args)

            if (!member || member.user.id === message.author.id) return message.channel.send(`Could not find any member with given input: \`${args.join(" ")}\``)

            try {
                await client.objects.guild_members.update({ messages: 0 }, { where: { guildID: message.guild.id, userID: member.user.id }})
            } catch(e) {
                
            }

            message.channel.send(`Successfully reset ${member.user.username}'s messages sent in this guild!`)
        }
    }
}
const { Client, Message } = require("discord.js-light");
const findMember = require("../../functions/findMember")

module.exports = {
    name: "reset-invites",
    aliases: [
        "resetinvites"
    ],
    category: "invites",
    description: "resets all the invites of an user, or everyone's invites in this guild.",
    usages: [
        "<user | everyone>"
    ],
    examples: [
        "everyone",
        "Ruben",
        "57729284739292346",
        "@Ruben"
    ],
    permissions: [
        "MANAGE_GUILD"
    ],
    cooldown: 4000,
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const type = args[0].toLowerCase()

        if (type === "everyone") {

            let users = 0

            const msg = await message.channel.send(`Resetting everyone's invites in this guild.`)

            try {
                
                const allMembers = await client.objects.guild_members.findAll({
                    where: {
                        guildID: message.guild.id,
                    }
                })
    
                for (const data of allMembers) {
                    await client.objects.guild_members.update({
                        invites_real: 0,
                        invites_fake: 0
                    }, {
                        where: {
                            guildID: message.guild.id,
                            userID: data.userID
                        }
                    })
    
                    users++
                }
    
                msg.edit(`Successfully reset the invites of ${users} users in this guild.`)
    
            } catch (error) {
                return msg.edit(`Error! ${error.message}`)
            }
        } else {
            const member = await findMember(message, args, false)

            const d = await client.objects.guild_members.findOne({ where: { guildID: message.guild.id, userID: member.user.id }})

            if (!d) return message.channel.send(`Cannot reset the invites of ${member.user.username}.`)

            await client.objects.guild_members.update({
                invites_real: 0,
                invites_fake: 0
            }, {
                where: {
                    userID: member.user.id,
                    guildID: message.guild.id
                }
            })

            message.channel.send(`Successfully reset ${member.user.username}'s invites in this guild.`)
        }
    }
}
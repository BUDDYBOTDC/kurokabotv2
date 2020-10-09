const { Message, MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: "requirements-guide",
    cooldown: 10000,
    aliases: [
        "requirementsguide",
        "rguide",
        "req-guide",
        "reqs-guide",
        "reqsguide",
        "rg"
    ],
    description: "information about requirement fields of k!start command",
    category: "giveaway",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const embed =new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Requirements Guide - Giveaway Command`)
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .addField(`Valid Fields:`, `
account_older
member_older
guilds
roles
messages
badges
user_tag_equals 
real_invites
total_invites
fake_invites       
`)
        .addField(`account_older <number>`, `The account that reacted to this giveaway must be older than given <number> of days.`)
        .addField(`member_older <number>`, `The account that reacted to this giveaway must have been in the server for at least given <number> of days.`)
        .addField(`guilds <guildID> ...`, `The account that reacted to this giveaway must be in the servers with given IDs`)
        .addField(`roles <roleID | @role> ... [filter: --single] OR roles select from <number> to <number>`, "The account that reacted to this giveaway must have all the given role IDs / mentioned roles.\nIf --single is added as a filter, the user will only need to have one of the provided roles.\nIf select from X to Y is used, the user will need to have the roles within the next positions X and Y.")
        .addField(`messages <number>`, `The account that reacted to this giveaway must have at least <number> messages sent on this server.`)
        .addField(`badges <badge1> ...`, "The account that reacted to this giveaway must have all the given badges.")
        .addField(`user_tag_equals <tag>`, "The account that reacted to this giveaway will need to have the given tag / discriminator to join the giveaway.")
        .addField(`real_invites <number>`, "The account that reacted to this giveaway will have to have <number> real invites or more to join this giveaway.")
        .addField(`total_invites <number>`, "The account that reacted to this giveaway will have to have <number> total invites or more to join this giveaway.")
        .addField(`fake_invites <number>`, "The account that reacted to this giveaway has to have less than <number> fake invites to join this giveaway.")
        .addField(`Separator`, "To separate guild/role IDs or badges, use a space.")
        .addField(`Note:`, `Anything related to invites will require the bot to have \`Manage Server\` permission.`)
        .addField(`Valid badges`, "bot-dev, brilliance, balance, bravery")
        .setFooter(`Did we help? hope so.`)

        message.channel.send(embed)
    }
}
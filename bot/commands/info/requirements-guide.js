const { Message, MessageEmbed, Client } = require("discord.js-light");
const getCustomEmbed = require("../../functions/getCustomEmbed");
const badges = require("../../utils/badges");

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
    category: "info",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const color = await getCustomEmbed(client, message.guild.id, "giveaway")

        const embed =new MessageEmbed()
        .setColor(color)
        .setTitle(`Requirements Guide - Giveaway Command`)
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .addField(`Valid Fields:`, `
account_older
member_older
roles
messages
badges
user_tag_equals 
real_invites
total_invites
fake_invites
voice_duration
level
`)
        .addField(`account_older <number>`, `The account that reacted to this giveaway must be older than given <number> of days.`)
        .addField(`member_older <number>`, `The account that reacted to this giveaway must have been in the server for at least given <number> of days.`)
        .addField(`roles <roleID | @role> ... [filter: --single] OR roles select from <number> to <number>`, "The account that reacted to this giveaway must have all the given role IDs / mentioned roles.\nIf --single is added as a filter, the user will only need to have one of the provided roles.\nIf select from X to Y is used, the user will need to have the roles within the next positions X and Y.")
        .addField(`messages <number>`, `The account that reacted to this giveaway must have at least <number> messages sent on this server.`)
        .addField(`badges <badge1> ... [filter: --single]`, "The account that reacted to this giveaway must have all the given badges.\nIf --single is added as a filter, the user will only need to have one of the provided badges.")
        .addField(`user_tag_equals <tag>`, "The account that reacted to this giveaway will need to have the given tag / discriminator to join the giveaway.")
        .addField(`real_invites <number>`, "The account that reacted to this giveaway will have to have <number> real invites or more to join this giveaway.")
        .addField(`total_invites <number>`, "The account that reacted to this giveaway will have to have <number> total invites or more to join this giveaway.")
        .addField(`fake_invites <number>`, "The account that reacted to this giveaway has to have less than <number> fake invites to join this giveaway.")
        .addField(`voice_duration <minutes>`, "The account that reacted to this giveaway has to be in voice channels for at least <minutes> minutes.")
        .addField(`level <number>`, "The account that reacted to this giveaway has to be level <number> or higher to participate.")
        .addField(`Note:`, `Anything related to invites requires the bot to have 2 permissions, \`Manage Channels\` and \`Manage Guild\`.`)
        .addField(`Separator`, "To separate guild/role IDs or badges, use a space.")
        .addField(`Valid badges`, `${Object.keys(badges).filter(e => e !== "boost").map(key => `${badges[key]} ${key}`).join("\n")}`)
        .setFooter(`Did we help? Hope so.`)

        message.channel.send(embed)
    }
}

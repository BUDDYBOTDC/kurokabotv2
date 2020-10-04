const { Client, Message, MessageEmbed } = require("discord.js");
const findMember = require("../../functions/findMember");

module.exports= {
    name: "messages",
    description: "returns the amount of messages an user has sent in this guild. (since the bot joined)",
    category: "util",
    cooldown: 5000,
    fields: [
        "<user>"
    ],
    examples: [
        "Ruben",
        "68849398382892485",
        "@Ruben"
    ],
    execute: async (client = new Client(), message = new Message(), args = [], db) => {

        const member = findMember(message, args)

        const d = await client.objects.guild_members.findOne({ where: { userID: member.user.id, guildID: message.guild.id }})

        let item 

        if (!d) {
            item = 0
        } else {
            item = d.get("messages")  
        }

        let all = await client.objects.guild_members.findAll({ where: { guildID: message.guild.id }})

        let top = all.sort((x, y) => y.messages - x.messages).findIndex(x => x.userID === message.author.id) + 1 + "#" || "Not registered"

        const embed = new MessageEmbed()
        .setColor(member.displayHexColor)
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setAuthor(`${member.user.username}'s messages sent in this guild`, member.user.displayAvatarURL({dynamic:true}), "https://discord.gg/sarfdEp")
        .setDescription(`${member.user.tag}'s Leaderboard Top: ${top}\n${member.user.id === message.author.id ? `You've` : "They've"} sent a total of ${item.toLocaleString()} messages in \`${message.guild.name}\`.`)
        .setFooter(`This is been counting messages since the bot was added.\n😎 https://www.kurokabots.com`)
        .setTimestamp()

        message.channel.send(embed)

    }
}
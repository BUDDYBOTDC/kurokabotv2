const { Client, Message, MessageEmbed, ReactionManager } = require("discord.js-light");
const findChannel = require("../../functions/findChannel");
const getCustomEmbed = require("../../functions/getCustomEmbed");

module.exports = {
    name: "drop",
    description: "giveaway drop, first to react wins the prize.",
    category: "giveaway",
    cooldown: 5000,
    permissions: [
        "MANAGE_GUILD"
    ],
    overridePermissions: true,
    usages: [
        "<title> <pingRole: yes | no> <channel | here>"
    ],
    clientPermissions: [
        "ADD_REACTIONS"
    ],
    examples: [
        "Nitro Classic yes here",
        "Premium no #drops"
    ],
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const channel = args[args.length - 1] === "here" ? message.channel : findChannel(message, [args[args.length - 1]], false)

        if (!channel) return message.channel.send(`Channel ${args[args.length - 1]} not found.`)

        args.pop()

        const option = args[args.length - 1]

        if (!["yes", "no"].includes(option.toLowerCase())) return message.channel.send(`Invalid output given for pingRole argument.\nValid output: \`yes\` and \`no\``)

        args.pop()

        const title = args.join(" ")

        message.delete()

        const color = await getCustomEmbed(client, message.guild.id, "giveaway")

        const embed = new MessageEmbed()
        .setColor(color)
        .setAuthor(`🎉 DROP 🎉`, undefined, "https://discord.gg/f7MCvQJ")
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(title)
        .setDescription(`First to react wins the giveaway!`)
        .setFooter(`Drop will be removed in 60 seconds.`)
        .setURL("https://www.kurokabots.com")

        const guildData = await client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

        const prole = message.guild.roles.cache.get(guildData.get("giveaway_ping_role"))

        const m = await channel.send(`${prole && option.toLowerCase() === "yes" ? `${prole}` : ""}`, embed).catch(err => {})

        const time = Date.now()

        if (!m) return message.channel.send(`I do not have permission to send messages in ${channel}.`)

        if (channel.id !== message.channel.id) message.channel.send(`Drop sent.`)

        const filter = (reaction, user) => {
            return reaction.emoji.name === "🎉" && user.id !== client.user.id 
        }

        await m.react("🎉")

        const collected = await m.awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ["time"]
        }).catch(err => {})

        if (!collected) {
            embed.setColor("RED")
            embed.setDescription(`No one reacted in time...`)
            embed.setFooter(`You shall be faster next time.`)

            return m.edit(embed)
        }

        const reaction = collected.first()

        const user = (await reaction.users.fetch({ limit: 2 })).filter(e => e.id !== client.user.id).first()

        embed.setColor("GREEN")
        embed.setDescription(`${user} was the first user reacting!`)
        embed.setFooter(`Reacted in ${((Date.now() - time) / 1000).toFixed(1)} seconds.`)

        m.edit(embed)

        channel.send(`Congratulations ${user} for reacting first! You won **${title}**!`)

        message.channel.messages.cache.delete(m.id)

    }
}
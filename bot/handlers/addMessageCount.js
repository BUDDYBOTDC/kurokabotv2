const { Message } = require("discord.js")
const messageCreate = require("../events/messageCreate")
const tableVariables = require("../utils/tableVariables")
const tableVariablesValues = require("../utils/tableVariablesValues")
const ignoreChannel = require("./ignoreChannel")

module.exports = async (message = new Message()) => {

    if (message.channel.type === "dm" || message.author.bot) return

    if (!message.client.objects) return

    const guildData = await message.client.objects.guilds.findOne({ where: { guildID: message.guild.id }})

    if (ignoreChannel(guildData, message)) return

    const d = await message.client.objects.guild_members.findOne({ where: { userID: message.author.id, guildID: message.guild.id }})

    if (!d) {
        await message.client.objects.guild_members.create(tableVariablesValues.GUILD_MEMBER(message.guild, message.author))
    } else {
        d.increment("messages", 1)
    }

    const u = await message.client.objects.users.findOne({ where: { userID: message.author.id }})

    if (!u) {
        await message.client.objects.users.create(tableVariablesValues.USER(message.author))
    }
}
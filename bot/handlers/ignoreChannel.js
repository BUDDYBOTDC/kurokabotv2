const { Client, Message } = require("discord.js-light");

module.exports = (guildData, message = new Message()) => {

    const channels = JSON.parse(guildData.get("ignoreChannels"))

    if (channels.includes(message.channel.id)) return true

    else return false
}
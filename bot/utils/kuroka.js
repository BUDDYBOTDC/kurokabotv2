const { Client } = require("discord.js");

module.exports = (client = new Client()) => {

    const emoji = client.guilds.cache.get("740964376118296618").emojis.cache.filter(emoji => !emoji.name.toLowerCase().includes("nsfw") && emoji.name.toLowerCase().includes("kuroka")).random()

    return emoji.toString()
}
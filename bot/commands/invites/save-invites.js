const { Client, Message } = require("discord.js-light");
const updateAllInvites = require("../../handlers/updateAllInvites");

module.exports = {
    name: "save-invites",
    description: "use this command to save / update all the invites of this server. (only use it if the bot was down for a certain period of time)",
    cooldown: 120000,
    permissions: [
        "MANAGE_GUILD"
    ],
    clientPermissions: [
        "MANAGE_GUILD",
        "MANAGE_CHANNELS"
    ],
    category: "invites",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const msg = await message.channel.send(`Updating invites...`)

        await updateAllInvites(client, message.guild)

        msg.edit(`All the invites were successfully saved / updated.`)
    }
}
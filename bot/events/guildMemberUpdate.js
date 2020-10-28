const { GuildMember, Client } = require("discord.js-light");
const fireEvent = require("../handlers/fireEvent");
const updateAllInvites = require("../handlers/updateAllInvites");

module.exports = (client = new Client(), oldMember = new GuildMember(), newMember = new GuildMember()) => {

    fireEvent(client)
    
    if (client.user.id !== newMember.user.id) return

    if (newMember.hasPermission("MANAGE_GUILD")) {
        updateAllInvites(client, newMember.guild)
    }
}
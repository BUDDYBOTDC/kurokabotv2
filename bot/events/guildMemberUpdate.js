const { GuildMember, Client } = require("discord.js");
const fireEvent = require("../handlers/fireEvent");
const updateAllInvites = require("../handlers/updateAllInvites");

module.exports = (client = new Client(), oldMember = new GuildMember(), newMember = new GuildMember()) => {

    fireEvent(client)
    
    if (newMember.hasPermission("MANAGE_GUILD") && !oldMember.hasPermission("MANAGE_GUILD")) {
        updateAllInvites(client, newMember.guild)
    }
}
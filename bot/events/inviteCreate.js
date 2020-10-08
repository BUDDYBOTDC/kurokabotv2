const { Invite, Client } = require("discord.js");
const updateAllInvites = require("../handlers/updateAllInvites");
const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = async (client = new Client(), invite = new Invite()) => {
    if (invite.guild.id === "550516279652515880") console.log(`${invite.guild.name}: ${invite.inviter.id}, ${invite.inviter.tag}, ${invite.code}`)
    
    await updateAllInvites(client, invite.guild)
}
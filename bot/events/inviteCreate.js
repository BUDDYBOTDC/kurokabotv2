const { Invite, Client } = require("discord.js");
const updateAllInvites = require("../handlers/updateAllInvites");
const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = async (client = new Client(), invite = new Invite()) => {
    console.log(invite.guild.name)

    await updateAllInvites(client, invite.guild)
}
const { Invite, Client } = require("discord.js");
const updateAllInvites = require("../handlers/updateAllInvites");
const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = (client = new Client(), invite = new Invite()) => {
    updateAllInvites(client, invite.guild)
}
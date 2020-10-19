const { Invite, Client } = require("discord.js");
const fireEvent = require("../handlers/fireEvent");
const updateAllInvites = require("../handlers/updateAllInvites");
const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = async (client = new Client(), invite = new Invite()) => {
    console.log(invite.guild.name)

    if (!client.objects) return console.log("Client was not ready yet.")
    
    fireEvent(client)
    
    await updateAllInvites(client, invite.guild)
}
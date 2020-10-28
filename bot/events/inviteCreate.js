const { Invite, Client } = require("discord.js-light");
const fireEvent = require("../handlers/fireEvent");
const updateAllInvites = require("../handlers/updateAllInvites");
const tableVariablesValues = require("../utils/tableVariablesValues");

module.exports = async (client = new Client(), invite) => {
    console.log(invite.guild.name)

    if (!client.objects) return console.log("Client was not ready yet.")
    
    fireEvent(client)
    
    client.objects.guild_invites.create(tableVariablesValues.GUILD_INVITES(invite))
}
const { Client, GuildMember } = require("discord.js");
const findInviterAndUpdate = require("../handlers/findInviterAndUpdate");
const fireEvent = require("../handlers/fireEvent");

module.exports = async (client = new Client(), member = new GuildMember()) => {
    if (!client.objects) return console.log("Client was not ready yet.")
    
    findInviterAndUpdate(client, member)

    fireEvent(client)
}
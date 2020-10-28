const { Client, Guild, GuildMember } = require("discord.js-light");
const findAndDelete = require("../handlers/findAndDelete");
const fireEvent = require("../handlers/fireEvent");

module.exports = (client = new Client(), member = new GuildMember()) => {
    if (!client.objects) return console.log("Client was not ready yet.")
    
    findAndDelete(client, member)

    fireEvent(client)
}
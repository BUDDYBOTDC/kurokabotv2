const { Client, Guild, GuildMember } = require("discord.js");
const findAndDelete = require("../handlers/findAndDelete");

module.exports = (client = new Client(), member = new GuildMember()) => {
    findAndDelete(client, member)
}
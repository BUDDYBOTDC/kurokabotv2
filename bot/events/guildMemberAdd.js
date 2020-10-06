const { Client, GuildMember } = require("discord.js");
const findInviterAndUpdate = require("../handlers/findInviterAndUpdate");

module.exports = async (client = new Client(), member = new GuildMember()) => {
    findInviterAndUpdate(client, member)
}
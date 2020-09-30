const { Client, User } = require("discord.js");

module.exports = (client = new Client()) => {
    client.user.setActivity("k!invite || k!support <3", {
        type: "LISTENING"
    })
}
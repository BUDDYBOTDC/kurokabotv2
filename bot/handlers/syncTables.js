const Sequelize = require("sequelize");
const giveaways = require("../database/giveaways");
const guilds = require("../database/guilds");
const messages = require("../database/messages");

module.exports = async (client, sequelize = new Sequelize()) => {

    const gws = giveaways(sequelize)
    
    gws.sync()

    const msgs = messages(sequelize)

    msgs.sync()

    const glds = guilds(sequelize)

    glds.sync()

    client.objects = new Object()

    client.objects.messages = msgs

    client.objects.guilds = glds
    
    client.objects.giveaways = gws
}
const Sequelize = require("sequelize");
const giveaways = require("../database/giveaways");
const guilds = require("../database/guilds");
const guild_invites = require("../database/guild_invites");
const guild_members = require("../database/guild_members");
const users = require("../database/users");
const checkGiveawaysColumns = require("./checkGiveawaysColumns");
const checkGuildColumns = require("./checkGuildColumns");
const checkGuildInvitesColumns = require("./checkGuildInvitesColumns");
const checkGuildMemberColumns = require("./checkGuildMemberColumns");
const checkUserColumns = require("./checkUserColumns");

module.exports = async (client, sequelize = new Sequelize()) => {

    const invites = guild_invites(sequelize)

    invites.sync()

    const gws = giveaways(sequelize)
    
    gws.sync()

    const gms = guild_members(sequelize)

    gms.sync()

    const glds = guilds(sequelize)

    glds.sync()

    const u = users(sequelize)

    u.sync()

    await checkUserColumns(client, sequelize)

    await checkGiveawaysColumns(client, sequelize)

    await checkGuildMemberColumns(client, sequelize)
    
    await checkGuildColumns(client, sequelize)

    await checkGuildInvitesColumns(client, sequelize)

    client.objects = new Object()

    client.objects.users = u

    client.objects.guild_members = gms

    client.objects.guilds = glds
    
    client.objects.guild_invites = invites
    
    client.objects.giveaways = gws
}
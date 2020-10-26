const rateLimit = require("./bot/events/rateLimit")

try {
    const Discord = require("discord.js")
    const dbCredentials = require("./bot/utils/dbCredentials")
    const Sequelize = require("sequelize")
    const db = new Sequelize('kuroka', 'kuroka', 'SMQw2ZrQR7Qb9mHR', dbCredentials.real)
    
    const guildCreate = require("./bot/events/guildCreate")
    const messageCreate = require("./bot/events/messageCreate")
    const messageReactionAdd = require("./bot/events/messageReactionAdd")
    const messageUpdate = require("./bot/events/messageUpdate")
    const presenceUpdate = require("./bot/events/presenceUpdate")
    const ready = require("./bot/events/ready")
    const userUpdate = require("./bot/events/userUpdate")
    const loadCommands = require("./bot/handlers/loadCommands")
    
    process.setMaxListeners(20)
    
    const client = new Discord.Client({
        partials: [
            "REACTION",
            "USER",
            "GUILD_MEMBER",
            "CHANNEL",
            "MESSAGE"
        ],
        fetchAllMembers: false,
        messageCacheMaxSize: 0,
        messageSweepInterval: 0,
        messageCacheLifetime: 0,
        disableMentions: "everyone",
    })
    
    const config = require("./config.json")
    const inviteCreate = require("./bot/events/inviteCreate")
    const guildMemberAdd = require("./bot/events/guildMemberAdd")
    const guildMemberRemove = require("./bot/events/guildMemberRemove")
    const guildMemberUpdate = require("./bot/events/guildMemberUpdate")
    const voiceStateUpdate = require("./bot/events/voiceStateUpdate")
    
    client.eventsFired = 0
    client.owners = ["739591551155437654", "590636977100161038"]
    client.version = "10.0.0"
    client.prefix = config.prefix
    client.prefixes = config.prefixes
    
    client.spam = new Discord.Collection()
    client.cooldowns = new Discord.Collection()
    client.commands = new Discord.Collection()
    
    loadCommands(client)
    
    client.on("ready", () => ready(client, db))
    
    client.on("voiceStateUpdate", (oldState, newState) => voiceStateUpdate(client, oldState, newState))
    
    client.on("guildMemberUpdate", (oldMember, newMember) => guildMemberUpdate(client, oldMember, newMember))
    
    client.on("inviteCreate", (invite) => inviteCreate(client, invite))
    
    client.on("guildMemberAdd", (member) => guildMemberAdd(client, member))
    
    client.on("guildMemberRemove", (member) => guildMemberRemove(client, member))
    
    client.on("messageReactionAdd", (reaction, user) => messageReactionAdd(reaction, user))
    
    client.on("presenceUpdate", (oldPresence, newPresence) => presenceUpdate(client, oldPresence, newPresence))
    
    client.on("message", async message => messageCreate(client, message, db))
    
    client.on("userUpdate", (oldUser, newUser) => userUpdate(client, oldUser, newUser))
    
    client.on("guildCreate", guild => guildCreate(client, guild, db))
    
    client.on("rateLimit", data => rateLimit(data))

    client.login(config.token)
} catch(err) {
    return console.log(err.message)
}
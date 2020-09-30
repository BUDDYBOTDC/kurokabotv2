const Discord = require("discord.js")

const Sequelize = require("sequelize")

const db = new Sequelize('database', 'user', 'password', {
	host: '',
	dialect: '',
	logging: false,
	storage: ""
});

const guildCreate = require("./bot/events/guildCreate")
const messageCreate = require("./bot/events/messageCreate")
const messageReactionAdd = require("./bot/events/messageReactionAdd")
const messageUpdate = require("./bot/events/messageUpdate")
const presenceUpdate = require("./bot/events/presenceUpdate")
const ready = require("./bot/events/ready")
const userUpdate = require("./bot/events/userUpdate")
const loadCommands = require("./bot/handlers/loadCommands")

const client = new Discord.Client({
    fetchAllMembers: false,
    messageCacheMaxSize: 20,
    messageCacheLifetime: 60000,
    disableMentions: "everyone",
})

const config = require("./config.json")

client.owners = ["739591551155437654", "590636977100161038"]
client.version = "2.0.0"
client.prefix = config.prefix
client.prefixes = config.prefixes

client.cooldowns = new Discord.Collection()
client.server = new Discord.Collection()
client.commands = new Discord.Collection()

loadCommands(client)

client.on("ready", () => ready(client, db))

client.on("messageReactionAdd", (reaction, user) => messageReactionAdd(reaction, user))

client.on("presenceUpdate", (oldPresence, newPresence) => presenceUpdate(client, oldPresence, newPresence))

client.on("message", async message => messageCreate(client, message, db))

client.on("messageUpdate", async (omsg, nmsg) => messageUpdate(client, omsg, nmsg))

client.on("userUpdate", (oldUser, newUser) => userUpdate(client, oldUser, newUser))

client.on("guildCreate", guild => guildCreate(client, guild))

client.login(config.token)
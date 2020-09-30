const addMessageCount = require("../handlers/addMessageCount")
const commandHandler = require("../handlers/commandHandler")
const onPing = require("../handlers/onPing")

module.exports = (client, message, db) => {

    addMessageCount(message)

    onPing(client, message)

    commandHandler(client, message, db)
}
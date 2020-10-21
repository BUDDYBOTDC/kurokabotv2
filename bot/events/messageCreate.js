const addMessageCount = require("../handlers/addMessageCount")
const commandHandler = require("../handlers/commandHandler")
const deleteMessageFromCache = require("../handlers/deleteMessageFromCache")
const fireEvent = require("../handlers/fireEvent")
const getXpMessage = require("../handlers/getXpMessage")
const onPing = require("../handlers/onPing")

module.exports = (client, message, db) => {

    deleteMessageFromCache(message)
    
    fireEvent(client)
    
    addMessageCount(message)

    onPing(client, message)

    commandHandler(client, message, db)

    getXpMessage(client, message)
}
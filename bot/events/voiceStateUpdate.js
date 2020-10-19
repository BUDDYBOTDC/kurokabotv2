const fireEvent = require("../handlers/fireEvent")
const userJoinVoice = require("../handlers/userJoinVoice")
const userLeaveVoice = require("../handlers/userLeaveVoice")

module.exports = (client, oldState, newState) => {
    if (!client.objects) return console.log("Client was not ready yet.")
    
    userJoinVoice(client, oldState, newState)

    userLeaveVoice(client, oldState, newState)

    fireEvent(client)
}
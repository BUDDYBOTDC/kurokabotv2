const fireEvent = require("../handlers/fireEvent")
const userJoinVoice = require("../handlers/userJoinVoice")
const userLeaveVoice = require("../handlers/userLeaveVoice")

module.exports = (client, oldState, newState) => {
    userJoinVoice(client, oldState, newState)

    userLeaveVoice(client, oldState, newState)

    fireEvent(client)
}
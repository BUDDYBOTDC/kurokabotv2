const fireEvent = require("../handlers/fireEvent")
const giveawayRequirements = require("../handlers/giveawayRequirements")

module.exports = (reaction, user) => {
    giveawayRequirements(reaction, user)

    fireEvent(reaction.message.client)
}
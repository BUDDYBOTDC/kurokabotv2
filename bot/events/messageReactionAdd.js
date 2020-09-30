const giveawayRequirements = require("../handlers/giveawayRequirements")

module.exports = (reaction, user) => {
    giveawayRequirements(reaction, user)
}
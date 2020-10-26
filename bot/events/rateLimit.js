const logRateLimit = require("../handlers/logRateLimit")

module.exports = (data) => {
    logRateLimit(data)
}
const { Client } = require("discord.js")

module.exports = (client = new Client(), requirements) => {

    if (requirements.toLowerCase() === "skip") return "skip"

    const reqs = {}

    const valid_fields = {
        guilds: "guild_member",
        messages: "guild_messages",
        roles: "guild_roles",
        account_older: "account_older",
        member_older: "member_older",
        booster: "booster",
        booster_older: "booster_older",
        badges: "badges",
        user_tag_equals: "user_tag_equals",
        real_invites: "real_invites",
        fake_invites: "fake_invites",
        total_invites: "total_invites",
        voice_duration: "voice_duration",
        level: "guild_level"
    }

    for (const field of requirements.split("\n")) {

        const name = field.split(" ")[0]

        const value = field.split(" ").slice(1)

        if (valid_fields[name] !== undefined){
            reqs[valid_fields[name]] = value
        }
    }

    return reqs
}
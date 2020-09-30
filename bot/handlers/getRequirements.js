const badges = require("../utils/badges")

module.exports = async (d) => {
    
    const requirements = []

    if (!d.data.requirements) return requirements

    requirements.push(`**__Requirements__**:`)

    for (const req of Object.entries(d.data.requirements)) {

        const fields = {
            guild_member: "Must be a member of {0}",
            guild_messages: "Must have at least {0} messages sent",
            guild_roles: "Must have the roles {0}",
            account_older: "Account must be older than {0} days",
            member_older: "Must have been in this server for more than {0} days",
            badges: "Must have the badges {0}"
        }

        const text = fields[req[0]]

        let replacer 

        if (req[0] === "guild_member") { 
            if (!req[1][0]) return { message: `No guild IDs given for field guilds.` }
            
            let guilds = []

            for (const id of req[1]) {
             
                const guild = await d.message.client.guilds.fetch(id).catch(err => {})

                if (!guild) return { message: `Guild with ID ${id} does not exist.` }

                const valid_channels = guild.channels.cache.filter(channel => channel.type === "text" && channel.permissionsFor(d.message.client.user.id).has("CREATE_INSTANT_INVITE")) 

                if (valid_channels.first()) {

                    const invite = await valid_channels.first().createInvite({
                        maxAge: 0
                    }).catch(err => {})

                    if (invite) {
                        guilds.push(`[${guild.name}](${invite})`)
                    } else guilds.push(guild.name)
                } else guilds.push(guild.name)
            }

            replacer = guilds.join(", ")
        } else if (req[0] === "guild_roles") {
            if (!req[1][0]) return { message: `No role IDs given for field roles.` }
            for (const id of req[1]) {
                const guild = d.message.guild.roles.cache.get(id)

                if (!guild) return { message: `Role with ID ${id} does not exist.` }
                
            }
            replacer = req[1].filter(id => d.message.guild.roles.cache.get(id)).map(id => `<@&${id}>`).join(", ")
        } else if (req[0] === "guild_messages") {
            if (!req[1][0]) return { message: `No number given for field messages.` }
            if (isNaN(Number(req[1][0]))) return { message: `Invalid number ${req[1][0]}` }

            replacer = req[1]
        } else if (req[0] === "account_older") {
            if (!req[1][0]) return { message: `No number given for field account_older.` }
            if (isNaN(Number(req[1][0]))) return { message: `Invalid number ${req[1][0]}` }

            const n = Number(req[1][0])

            if (!isNaN(n) && n > 0) {
                replacer = req[1][0]
            }
        } else if (req[0] === "member_older") {
            if (!req[1][0]) return { message: `No number given for field member_older.` }
            if (isNaN(Number(req[1][0]))) return { message: `Invalid number ${req[1][0]}` }

            const n = Number(req[1][0])

            if (!isNaN(n) && n > 0) {
                replacer = req[1][0]
            }
        } else if (req[0] === "badges") {
            if (!req[1][0]) return { message: `No badge given for field badges.` }
            for (const badge of req[1]) {
                let b = badges[badge]

                if (!b) return { message: `Badge with name ${badge} does not exist.` }
            }

            replacer = req[1].map(e => badges[e] ? badges[e] : "").join(" ")
        }

        if (replacer !== undefined) requirements.push(`**${text.replace("{0}", replacer)}**`)
    }

    if (requirements.length === 1) requirements.shift()

    return requirements
}
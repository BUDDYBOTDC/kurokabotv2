const badges = require("../utils/badges")

module.exports = async (d) => {
    
    const requirements = []

    if (!d.data.requirements) return requirements

    requirements.push(`<:DE_IconNews:763372098147319828> **__Requirements__**:`)

    var task 

    try {
        task = JSON.parse(d.data.requirements)
    } catch (error) {
        task = d.data.requirements
    }
    
    for (const req of Object.entries(task)) {

        const fields = {
            guild_member: "Must be a member of {0}",
            guild_messages: "Must have at least {0} messages sent",
            guild_roles: "Must have the roles {0}",
            account_older: "Account must be older than {0} days",
            member_older: "Must have been in this server for more than {0} days",
            badges: "Must have the badges {0}",
            user_tag_equals: "Must have the tag / discriminator as #{0}",
            real_invites: "Must have at least {0} real invites.",
            fake_invites: "Must not have more than {0} fake invites.",
            total_invites: "Must have a total of {0} invites or more."
        }

        const text = fields[req[0]]

        let replacer 

        if (req[0] === "guild_member") { 

            if (!req[1][0]) return { message: `No guild IDs given for field guilds.` }

            let guilds = []

            for (const id of req[1]) {

                if (id !== "") {
                                 
                    const guild = await d.message.client.guilds.fetch(id).catch(err => {})

                    if (!guild) return { message: `Guild with ID ${id} does not exist.` }

                    guilds.push(guild.name)
                }
            }

            replacer = guilds.join(", ")
        } else if (req[0] === "guild_roles") {
            if (!req[1][0]) return { message: `No role IDs given for field roles.` }
            for (const id of req[1]) {
                if (id !== "") {
                    const role = d.message.guild.roles.cache.get(id)

                    if (!role) return { message: `Role with ID ${id} does not exist.` }
                    
                    if (role.managed) return { message: `This role (${id}) seems to be managed by discord, remember you can't use nitro booster role ID.`}
                }
            }
            replacer = req[1].filter(id => d.message.guild.roles.cache.get(id)).map(id => `<@&${id}>`).join(", ")
        } else if (req[0] === "guild_messages") {
            if (!req[1][0]) return { message: `No number given for field messages.` }
            if (isNaN(Number(req[1][0]))) return { message: `Invalid number ${req[1][0]}` }

            if (Number(req[1][0]) > 1000000 || Number(req[1][0]) < 1) return { message: `Number cant be less than 1 nor greater than 1000000 in ${req[0]} field.` }
            replacer = req[1][0]
        } else if (req[0] === "account_older") {
            if (!req[1][0]) return { message: `No number given for field account_older.` }
            if (isNaN(Number(req[1][0]))) return { message: `Invalid number ${req[1][0]}` }

            const n = Number(req[1][0])

            if (!isNaN(n) && n > 0) {

                if (Number(req[1][0]) > 3000 || Number(req[1][0]) < 1) return { message: `Number cant be less than 1 nor greater than 3000 in ${req[0]} field.` }

                replacer = req[1][0]
            }
        } else if (req[0] === "member_older") {
            if (!req[1][0]) return { message: `No number given for field member_older.` }
            if (isNaN(Number(req[1][0]))) return { message: `Invalid number ${req[1][0]}` }

            const n = Number(req[1][0])

            if (!isNaN(n) && n > 0) {
                
                if (Number(req[1][0]) > 3000 || Number(req[1][0]) < 1) return { message: `Number cant be less than 1 nor greater than 3000 in ${req[0]} field.` }

                replacer = req[1][0]
            }
        } else if (req[0] === "badges") {
            if (!req[1][0]) return { message: `No badge given for field badges.` }
            for (const badge of req[1]) {
                if (badge !== "") {
                    let b = badges[badge]

                    if (!b) return { message: `Badge with name ${badge} does not exist.` }
                }
            }

            replacer = req[1].filter(e => e).map(e => badges[e] ? badges[e] : "").join(" ")
        } else if (req[0] === "user_tag_equals") {
            if (!req[1][0]) return { message: `No tag given for field user_tag_equals.` }

            const n = req[1][0]

            if (n.length !== 4) return { message: `:x: Tag length is of 4 characters.` }

            const r = Number(n)

            if (r > 9999) return { message: `:x: Tag can't be bigger than 9999.`}

            if (Number(n.split("0").join("")) < 1) return { message: ":x: Tag can't be smaller than 0001." }

            replacer = req[1][0]
        } else if (req[0] === "real_invites") {
            if (!req[1][0]) return { message: `No number given for field ${req[0]}.` }

            const n = req[1][0]

            const d = Number(n)

            if (isNaN(d) || d < 1) return { message: `:x: Invalid number given at field ${req[0]}.` }
            
            if (Number(req[1][0]) > 10000 || Number(req[1][0]) < 1) return { message: `Number cant be less than 1 nor greater than 10000 in ${req[0]} field.` }

            replacer = req[1][0]
        } else if (req[0] === "fake_invites") {
            if (!req[1][0]) return { message: `No number given for field ${req[0]}.` }

            const n = req[1][0]

            const d = Number(n)

            if (isNaN(d) || d < 1) return { message: `:x: Invalid number given at field ${req[0]}.` }
                        
            if (Number(req[1][0]) > 10000 || Number(req[1][0]) < 1) return { message: `Number cant be less than 1 nor greater than 10000 in ${req[0]} field.` }

            replacer = req[1][0]
        } else if (req[0] === "total_invites") {
            if (!req[1][0]) return { message: `No number given for field ${req[0]}.` }

            const n = req[1][0]

            const d = Number(n)

            if (isNaN(d) || d < 1) return { message: `:x: Invalid number given at field ${req[0]}.` }
                        
            if (Number(req[1][0]) > 30000 || Number(req[1][0]) < 1) return { message: `Number cant be less than 1 nor greater than 30000 in ${req[0]} field.` }

            replacer = req[1][0]
        }

        if (replacer !== undefined) {
            requirements.push(`<:DE_ArrowJoin:763377170655477780> ${text.replace("{0}", replacer)}`)
        }
    }

    if (requirements.length === 1) requirements.shift()
    
    return requirements
}
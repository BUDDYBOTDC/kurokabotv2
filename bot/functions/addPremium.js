const { Client } = require("discord.js");
const premiumTimeout = require("../handlers/premiumTimeout");

module.exports = async (client = new Client(), guildID = new String(), codeData = {}) => {

    let option 

    const guildData = await client.objects.guilds.findOne({
        where: {
            guildID: guildID
        }
    })

    const isPremium = guildData.get("premium")

    if (isPremium) {
        const currentTime = guildData.get("premiumEndsAt")

        await client.objects.guilds.update({
            premiumEndsAt: currentTime + codeData.time
        }, {
            where: {
                guildID: guildID
            }
        })

        option = "extended"

    } else {
        await client.objects.guilds.update({
            premium: true,
            premiumSince: Date.now(),
            premiumEndsAt: Date.now() + codeData.time
        }, {
            where: {
                guildID: guildID
            }
        })

        option = "added"

        premiumTimeout(client, { id: guildID, name: "code redeemed." })
    }

    await client.objects.premium_codes.update({
        redeemed: true
    }, {
        where: {
            code: codeData.code
        }
    })

    return option
}
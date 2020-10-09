const { Client } = require("discord.js");
const giveawayMessage = require("../classes/giveawayMessage");
const sendShardMessage = require("../functions/sendShardMessage");

const setGiveawayTimeout = (client = new Client(), data) => {
    setTimeout(async () => {
        const newData = await client.objects.giveaways.findOne({ where: { code: data.code }})

        if (newData.get("removed")) return

        const channel = client.channels.cache.get(data.channelID)

        if (!channel) return

        const msg = await channel.send({
            embed: {
                title: "Giveaway starting..."
            }
        }).catch(err => {})

        if (!msg) return

        let dataGiveaway =  {...data}

        dataGiveaway.messageID = msg.id 
        dataGiveaway.endsAt = Date.now() + data.time
        
        delete dataGiveaway.scheduled
        delete dataGiveaway.interval
        delete dataGiveaway.removed
        delete dataGiveaway.nextAt
        delete dataGiveaway.code
        delete dataGiveaway.updatedAt
        delete dataGiveaway.createdAt
        delete dataGiveaway.id

        try {
            await client.objects.giveaways.create(dataGiveaway)
        } catch (error) {
            console.log(error.message)

            return msg.delete()
        }

        new giveawayMessage(msg, dataGiveaway)

        data.nextAt = Date.now() + data.interval

        await client.objects.giveaways.update(data, {
            where: {
                code: data.code
            }
        })

        setGiveawayTimeout(client, data)
    }, data.nextAt - Date.now())
}

module.exports = setGiveawayTimeout 
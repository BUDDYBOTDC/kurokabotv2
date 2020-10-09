module.exports = {
    name: "get-giveaway",
    description: "debugging tool",
    category: "owner",
    execute: async (client, message, args) => {

        let all = await client.objects.giveaways.findAll()

        message.channel.send(all.filter(e => e.interval !== null).length)
    }
}
const { Message, MessageEmbed, Collection } = require("discord.js");
const ms = require("parse-ms");
const fetchAllReactions = require("../handlers/fetchAllReactions");
const getRequirements = require("../handlers/getRequirements");
const { type } = require("os");
const Sequelize = require("sequelize");

class giveawayMessage {
    constructor(msg = new Message(), data = {}) {

        this.message = msg

        if (typeof this.message.react !== "function") return
        
        this.message.react("🎉")

        this.data = data

        if (Date.now() >= data.endsAt && data.ended === true) return 

        this.update()
    }

    async update() {

        const data = await this.message.client.objects.giveaways.findOne({ where: { messageID: this.message.id }})

        this.data = await data.toJSON()

        const embed = new MessageEmbed()
        .setThumbnail(this.message.client.user.displayAvatarURL())

        let date = Date.now()

        if (this.data.ended) return 

        if (date >= this.data.endsAt) {
            this.end()

            return
        } else {

            let requirements = []

            if (this.data.requirements) {
                requirements = await getRequirements(this)  

                if (requirements[0] === undefined) requirements = []
            }

            embed.setColor(`BLUE`)
            embed.setTitle(this.data.title)
            embed.setURL("http://www.kurokabots.com")
            embed.setAuthor(`🎉 GIVEAWAY 🎉`, undefined, "https://discord.gg/f7MCvQJ")
            embed.setDescription(`
**Winners**: ${this.data.winners}
**Hosted by**: ${this.data.mention}
**Time Remaining**: ${Object.entries(ms(this.data.endsAt - date)).map((x, y) => {
                if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`
                else return ``
            }).filter(e => e).join(" ")}
${requirements.join("\n")}
            `)
            embed.setFooter(`React with 🎉 to enter the giveaway\nEnds at:`)
            embed.setTimestamp(this.data.endsAt)

            await this.message.edit(embed).catch(err => {
            })

            const time = Math.floor(Math.random() * 300000) + 60000

            if ((data.endsAt - Date.now()) - time > 0){
                await new Promise(e => setTimeout(e, time))
            } else {
                await new Promise(e => setTimeout(e, (data.endsAt - Date.now())))
            }

            this.update()
        }
    }
    
    async reroll() {
        this.end()
    }

    async end() {

        const embed = new MessageEmbed()
        .setThumbnail(this.message.client.user.displayAvatarURL())

        const data = await this.message.client.objects.giveaways.findOne({ where: { messageID: this.message.id }})

        this.data = await data.toJSON()

        data.endsAt = 0

        data.ended = true

        await this.message.client.objects.giveaways.update({ endsAt: 0, ended: true }, { where: { messageID: this.message.id }})

        const users = await fetchAllReactions(this.message)

        const IDs = []

        while(this.data.winners !== 0 && users.size !== 0) {
            const id = users.random()
            
            if (id) {
                IDs.push(id)

                users.delete(id)

                this.data.winners--
            }
        }

        if (users.size === 0 && IDs.length === 0) {

            embed.setColor("GREEN")
            embed.setURL("http://www.kurokabots.com")
            embed.setAuthor(`🎉 GIVEAWAY 🎉`, undefined, "https://discord.gg/f7MCvQJ")
            embed.setTitle(this.data.title)
            embed.setDescription(`
**__Giveaway Ended__**
**Winners**: nobody
**Hosted by**: ${this.data.mention}
            `)
            embed.setFooter(`Giveaway ended.\nEnded at:`)
            embed.setTimestamp(Date.now())

            this.message.edit(embed).catch(err => {})

            this.message.channel.send(`**Nobody** won the **${this.data.title}**!\nhttps://discord.com/channels/${this.data.guildID}/${this.data.channelID}/${this.data.messageID}`).catch(err => {})
            
            return    
        }

        embed.setColor("GREEN")
        embed.setTitle(this.data.title)
        embed.setURL("http://www.kurokabots.com")
        embed.setAuthor(`🎉 GIVEAWAY 🎉`, undefined, "https://discord.gg/f7MCvQJ")
        embed.setDescription(`
**__Giveaway Ended__**
**Winners**: ${IDs.map(e => `<@${e}>`).join(", ")}
**Hosted by**: ${this.data.mention}
        `)
        embed.setFooter(`Giveaway ended.\nEnded at:`)
        embed.setTimestamp(Date.now())

        this.message.edit(embed).catch(err => {})

        this.message.channel.send(`Congratulations ${IDs.map(e => `<@${e}>`).join(", ")}! You won **${this.data.title}**!\nhttps://discord.com/channels/${this.data.guildID}/${this.data.channelID}/${this.data.messageID}`).catch(err => {})
    
        return

    }

    checkReactions() {
        fetchAllReactions(this.message, "checkRequirements")
    }
}

module.exports = giveawayMessage
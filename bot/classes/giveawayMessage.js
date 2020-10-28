const { Message, MessageEmbed, Collection } = require("discord.js-light");
const ms = require("parse-ms");
const fetchAllReactions = require("../handlers/fetchAllReactions");
const getRequirements = require("../handlers/getRequirements");
const { type } = require("os");
const Sequelize = require("sequelize");
const parse = require("ms-parser")

class giveawayMessage {
    constructor(msg = new Message(), data = {}) {

        this.message = msg

        if (typeof this.message.react === "function") {
            this.react()
        }

        this.data = data

        if (Date.now() >= data.endsAt && data.ended === true) return

        this.update()
    }

    async react() {
        const guildData = await this.message.client.objects.guilds.findOne({ where: { guildID: this.message.guild.id }})

        const giveaway_emoji = guildData.get("giveaway_emoji") === "🎉" ? "🎉" : guildData.get("giveaway_emoji").split(":")[2]

        this.message.react(giveaway_emoji).catch(err => {})
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

            const guildData = await this.message.client.objects.guilds.findOne({ where: { guildID: this.message.guild.id }})

            const roles = []

            if (guildData) {
    
                roles.push("\n")
    
                let broles = []
            
                const brolesData = JSON.parse(guildData.get("bypass_role"))
        
                if (brolesData.length) {
                    broles = brolesData.map(id => {
                        let r = this.message.guild.roles.cache.get(id)
        
                        if (r) return `${r}`
                    }).filter(e => e)
                }
    
                let blroles = []
            
                const blrolesData = JSON.parse(guildData.get("black_role"))
        
                if (blrolesData.length) {
                    blroles = blrolesData.map(id => {
                        let r = this.message.guild.roles.cache.get(id)
        
                        if (r) return `${r}`
                    }).filter(e => e)
                }
    
                if (broles.length && requirements.length) roles.push(`<:checkgreen:763434065818157058> Members with one of these roles: ${broles.join(", ")}, don't need to meet any of the requirements.`)
    
                if (blroles.length) roles.push(`<:checkred:763434105190613082> Members with one of these roles: ${blroles.join(", ")}, can't join the giveaway.`)
            }

            embed.setColor(`BLUE`)
            embed.setTitle("<:DE_IconGift:763372175951527946> " + this.data.title)
            embed.setURL("https://top.gg/bot/754024463137243206/vote")
            embed.setAuthor(`🎉 GIVEAWAY 🎉`, undefined, "https://discord.gg/f7MCvQJ")
            embed.setDescription(`
<:DE_IconFriends:763372565716533249> **Winners**: ${this.data.winners}
<:DE_IconPin:763372926283284520> **Hosted by**: ${this.data.mention}
<:DE_IconSlowmode:763372481444577281> **Time Remaining**: ${parse(Object.entries(ms(this.data.endsAt - date)).map((x, y) => {
                if (x[1] > 0 && y < 4) return `${x[1]}${x[0][0]}`
                else return ``
            }).filter(e => e).join("")).array.map(e => e.replace("and", "")).slice(0, 2).join(" and ")}
${requirements.join("\n")}${roles.length ? "\n" + roles.join("\n") : ""}
`)
            embed.setFooter(`React with 🎉 to enter the giveaway\nEnds at:`)
            embed.setTimestamp(this.data.endsAt)

            await this.message.edit(embed).catch(err => {
            })

            const time = Math.floor(Math.random() * 600000) + 1200000

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
            embed.setURL("https://top.gg/bot/754024463137243206/vote")
            embed.setAuthor(`🎉 GIVEAWAY 🎉`, undefined, "https://discord.gg/f7MCvQJ")
            embed.setTitle("<:DE_IconGift:763372175951527946> " + this.data.title)
            embed.setDescription(`
**__Giveaway Ended__**
<:DE_IconFriends:763372565716533249> **Winners**: nobody
<:DE_IconPin:763372926283284520> **Hosted by**: ${this.data.mention}
            `)
            embed.setFooter(`Giveaway ended.\nEnded at:`)
            embed.setTimestamp(Date.now())

            this.message.edit(embed).catch(err => {})

            this.message.channel.send({embed: {
                color: 5570448,
                title: "🎉 GIVEAWAY ENDED 🎉",
                url: "https://top.gg/bot/754024463137243206/vote",
                thumbnail: {
                    url: this.message.client.user.displayAvatarURL()
                },
                description: `**Nobody** won the **[${this.data.title}](https://discord.com/channels/${this.data.guildID}/${this.data.channelID}/${this.data.messageID})**!`
            }}).catch(err => {})

            return    
        }

        embed.setColor("GREEN")
        embed.setTitle("<:DE_IconGift:763372175951527946> " + this.data.title)
        embed.setURL("https://top.gg/bot/754024463137243206/vote")
        embed.setAuthor(`🎉 GIVEAWAY 🎉`, undefined, "https://discord.gg/f7MCvQJ")
        embed.setDescription(`
**__Giveaway Ended__**
<:DE_IconFriends:763372565716533249> **Winners**: ${IDs.map(e => `<@${e}>`).join(", ")}
<:DE_IconPin:763372926283284520> **Hosted by**: ${this.data.mention}
        `)
        embed.setFooter(`Giveaway ended.\nEnded at:`)
        embed.setTimestamp(Date.now())

        this.message.edit(embed).catch(err => {})

        this.message.channel.send(`<a:gifts4days:764941341594746890> ${IDs.map(e => `<@${e}>`).join(", ")}`, {embed: {
            color: 5570448,
            title: "🎉 GIVEAWAY ENDED 🎉",
            url: "https://top.gg/bot/754024463137243206/vote",
            thumbnail: {
                url: this.message.client.user.displayAvatarURL()
            },
            description: `Congratulations! You won **[${this.data.title}](https://discord.com/channels/${this.data.guildID}/${this.data.channelID}/${this.data.messageID})**!`
        }}).catch(err => {})

                    
        if (this.data.dm_hoster) {
            const user = await this.message.client.users.fetch(this.data.userID, false).catch(err => {})

            if (user) {
                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`🎉 GIVEAWAY ENDED 🎉`) 
                .setDescription(`A giveaway ended in channel <#${this.data.channelID}>!\nGiveaway: **[${this.data.title}](https://discord.com/channels/${this.data.guildID}/${this.data.channelID}/${this.data.messageID})**`)
                .setThumbnail(this.message.client.user.displayAvatarURL())
                .setFooter(`Give the prize to the winners!`)

                user.send(embed).catch(err => {})
            }
        }
        return

    }

    checkReactions() {
        fetchAllReactions(this.message, "checkRequirements")
    }
}

module.exports = giveawayMessage
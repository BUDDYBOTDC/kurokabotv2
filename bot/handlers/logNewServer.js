const { Guild, Message, MessageEmbed, Client, WebhookClient } = require("discord.js-light");
const webhook = new WebhookClient("761280726451617842", "LFOiBw77NlyvHbXhEDCMwdhR3Dx_SaOct3afQ1vep2wF9zojs5r4UsM4JXc3zHxs0MXn")
module.exports = async (client = new Client(), guild = new Guild()) => {
    
    const channel = guild.channels.cache.find(ch => ch.type === "text" && ch.permissionsFor(client.user.id).has("CREATE_INSTANT_INVITE"))

    let inviter 

    if (guild.me.hasPermission("VIEW_AUDIT_LOG")) {
        const logs = await guild.fetchAuditLogs({
            type: "BOT_ADD",
            limit: 10
        })

        const log = logs.entries.first()

        if (log) {
            inviter = log.executor
        }
    }

    let invite 

    if (channel) {
        invite = await channel.createInvite({ maxAge: 0 }).catch(err => {})
    }

    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`New Guild`)
    .addField(`Name`, guild.name)
    .addField(`Members`, guild.memberCount)
    .addField(`Server ID`, guild.id)
    .addField(`Owner`, `${guild.owner.user.tag}\n${guild.owner.id}`)
    .addField(`Invite`, invite ? `${invite}` : "could not create an invite to this server")
    if (inviter) embed.addField(`Invited by:`, `${inviter.tag}\n${inviter.id}`)

    embed.setThumbnail(guild.iconURL({dynamic:true}))
    
    webhook.send("new server log", embed)
}
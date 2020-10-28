const { Client, Guild, Message, MessageEmbed } = require("discord.js-light");
const kuroka = require("../utils/kuroka");

module.exports = async (client = new Client(), guild = new Guild()) => {
    
    const channels = guild.channels.cache.filter(ch => ch.type === "text" && ch.permissionsFor(guild.me.user.id).has("SEND_MESSAGES"))

    for (const c of channels.array()) {
        
        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.owner.displayAvatarURL({dynamic:true}))
        .setDescription(`Hey! thanks for adding me, my prefix is \`${client.prefix}\`, use \`${client.prefix}help\` for a full command list ${kuroka(client)}`)
        .setFooter(`Found any bugs? Join the support server at https://discord.gg/sarfdEp`)
        .setURL("https://discord.gg/f7MCvQJ")
        .setTitle(`${client.user.username}`)

        const m = await c.send(embed).catch(err => {}) 
    
        if (m) return 

    }
}
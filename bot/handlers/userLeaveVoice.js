const { Client, VoiceState } = require("discord.js");

module.exports = async (client =new Client(), oldState = new VoiceState(), newState = new VoiceState()) => {

    if (oldState.member.partial) {
        await oldState.member.fetch()
    }
    
    if (oldState.channel && !newState.channel) {
        try {
            const d = await client.objects.guild_members.findOne({
                where: {
                    guildID: oldState.guild.id,
                    userID: oldState.member.user.id
                }
            })

            if (!d) return
            
            if (!d.get("inVC")) return

            const total = d.get("inVCTotal") + (Date.now() - d.get("inVCSince")) || Date.now() - d.get("inVCSince")

            client.objects.guild_members.update({
                inVC: false,
                inVCSince: 0,
                inVCTotal: total
            }, {
                where: {
                    userID: oldState.member.user.id,
                    guildID: oldState.guild.id
                }
            })
        } catch (error) {
            console.log(`Error! ${error.message} from file: userLeaveVoice.js`)
        }
    }
}
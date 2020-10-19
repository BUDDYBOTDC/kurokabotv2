const { Client, VoiceState } = require("discord.js");

module.exports = async (client =new Client(), oldState = new VoiceState(), newState = new VoiceState()) => {
    
    if (oldState.channelID && !newState.channelID) {
        try {
            const d = await client.objects.guild_members.findOne({
                where: {
                    guildID: newState.guild.id,
                    userID: newState.member.user.id
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
                    userID: newState.member.user.id,
                    guildID: newState.guild.id
                }
            })
        } catch (error) {
            console.log(`Error! ${error.message} from file: userLeaveVoice.js`)
        }
    }
}
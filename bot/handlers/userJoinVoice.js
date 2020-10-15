const { Client, VoiceState } = require("discord.js");

module.exports = async (client =new Client(), oldState = new VoiceState(), newState = new VoiceState()) => {

    if (!oldState.channel && newState.channel) {
        try {

            client.objects.guild_members.update({
                inVC: true,
                inVCSince: Date.now()
            }, {
                where: {
                    userID: newState.member.user.id,
                    guildID: newState.guild.id
                }
            })
        } catch (error) {
            console.log(`Error! ${error.message} from file: userJoinVoice.js`)
        }
    }
}
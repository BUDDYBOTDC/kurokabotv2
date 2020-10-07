const { Client, Message, MessageEmbed } = require("discord.js");
const hastebin = require("hastebin");

module.exports = {
    name: "eval",
    description: "eval command, not much to explain.",
    cooldown: 1000,
    category: "owner",
    execute: async (client = new Client(), message = new Message(), args = []) => {

        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          }

        try {
            const code = args.join(" ");
            let evaled = eval(code);
       
            let t = evaled

            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
              const embed = new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Eval Code - Successful")
              .addField(`Input`, "```js\n" + code + "```")
              .addField(`Output`, "```js\n" + clean(evaled) + "```")
              .addField("Type", "```" + typeof t + "```")
              .setThumbnail(client.user.displayAvatarURL())

            message.channel.send(embed).catch(async err => {
                const url = await hastebin.createPaste(clean(evaled), {
                    raw: false,
                    contentType: "plain/text",
                    server: 'https://hastebin.com'
                  }, /* options for the 'got' module here */ {})

                  const embed = new MessageEmbed()
                  .setColor("GREEN")
                  .setTitle("Eval Code - Successful")
                  .addField(`Input`, "```js\n" + code + "```")
                  .addField(`Output`, url)
                  .addField("Type", "```" + typeof t + "```")
                  .setThumbnail(client.user.displayAvatarURL())

                  const filter = m => m.author.id === message.author.id && ["y", "n"].includes(m.content.toLowerCase())

                  const msg = await message.channel.send(`Are you sure you want to send the output here? (y/n)`)

                  const collected = await message.channel.awaitMessages(filter, {
                      time: 30000,
                      max: 1,
                      errors: ["time"]
                  }).catch(err => {})

                  if (!collected) return msg.edit(`I guess not.`)

                  const m = collected.first()

                  if (m.content === "y") {
                      message.channel.send(embed)
                  } else {
                      message.channel.send(`Output canceled.`)
                  }
            })
          } catch (err) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Eval Code - Error")
            .addField(`Input`, "```js\n" + args.join(" ") + "```")
            .addField(`Output`, "```js\n" + clean(err) + "```")
            .addField("Type", "```" + typeof t + "```")
            .setThumbnail(client.user.displayAvatarURL())

          message.channel.send(embed);
          }

    }
}
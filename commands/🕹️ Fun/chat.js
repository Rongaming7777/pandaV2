const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const fetch = require("node-fetch");
module.exports = {
  name: "chat",
  category: "🕹️ Fun",
  aliases: ["ai", "aichat", "ai-chat"],
  cooldown: 2,
  usage: "chat <TEXT>",
  description: "Let's you chat with the Bot via cmd",
  type: "text",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if (GuildSettings.FUN === false) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["fun"]["chat"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["fun"]["chat"]["variable2"]))
        ]});
      if (message.content)
        message.content = args.join(" ")
      if (message.attachments.size > 0)
        return message.reply({content : "Look at this too...", files : "https://media.discordapp.net/attachments/873381531769528353/935124088194748466/PicsArt_12-29-07.52.19.jpg"})
      fetch(`http://api.brainshop.ai/get?bid=162658&key=MtfJXxZZtrJX9X7m&uid=162658&msg=${encodeURIComponent(message)}`).
      then(res => res.json())
        .then(data => {
          message.reply({content : data.cnt}).catch(e => console.log("ERROR | " + e.stack));
        })
    } catch (e) {
      console.error(e)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["chat"]["variable3"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by RôÑ#6426 | https://discord.gg/zG8yUPhuxwe
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention Him / Ron Development, when using this Code!
 * @INFO
 */

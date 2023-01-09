const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);

module.exports = {
  name: "afk",
  category: "⚙️ Settings",
  aliases: ["awayfromkeyboard",],
  cooldown: 10,
  usage: "afk [TEXT]",
  description: "Set yourself AFK",
  type: "user",
  run: async (client, message, args, user, text, prefix, player) => {
    
    try {
      if(args[0]) await client.afkDB.set(`${message.guild.id+user.id}.message`, args.join(" "));
      await client.afkDB.set(`${message.guild.id+user.id}.stamp`, Date.now());
      message.reply(`You are now afk for: ${args.join(" ")}\n> **Tipp:** *Write \`[afk]\` infront of your Message to stay afk but still write*`);
    } catch (e) {
      console.error(e)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable3"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by RôÑ#6426 | https://github?.com/Rongaming7777/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention Him / Ron Development, when using this Code!
 * @INFO
 */

const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`../../handlers/functions`)
module.exports = {
  name: "fnshop",
  aliases: ["fortniteshop", "fshop"],
  category: "🔰 Info",
  description: "Shows the current Fortnite Shop",
  usage: "fnshop",
  type: "games",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let themsg = await message.reply("<a:loding:925692920781234196> Getting the Shop-Data")
      const shop = new Canvas.FortniteShop();
      const image = await shop.setToken(process.env.fnbr || config.fnbr).setBackground("#23272A").toAttachment();
      let attachment = new Discord.MessageAttachment(image, "FortniteShop.png");
      themsg.edit({content: "Todays Fortnite Shop:", files: [attachment]}).catch(() => null)
    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by RôÑ#6426 | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention him / Ron Development, when using this Code!
 * @INFO
 */

const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser, handlemsg
} = require(`../../handlers/functions`)
const fetch = require("node-fetch")
module.exports = {
  name: "color",
  aliases: ["hexcolor"],
  category: "🔰 Info",
  description: "Get Hex Color Information",
  usage: "color <HEX CODE> | Example: color #ee33ff",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

		try {
      let userinfo = false;
      if(!args[0]){
        userinfo = true;
        args[0] = message.member.roles.highest.hexColor || "#000000";
      }
      const url = (`https://api.popcat.xyz/color/${args[0].includes("#") ? args[0].split("#")[1] : args[0] }`)
      let json;
      try {
        json = await fetch(url).then(res => res.json())
      } catch (e) {
        return message.reply({content: `${e.message ? e.message : e}`,
          codeBlock: "js"
        })
      }
      if (json.error) return message.reply({content: client.la[ls].cmds.info.color.invalid + `\n${json.error}`,
        codeBlock: "js"
      })
      const embed = new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["info"]["color"]["variable1"]))
        .addField('<:L_Arrow:975381256193843240> **Name**', "```"+json.name+"```", true)
        .addField("<:L_Arrow:975381256193843240> **Hex**",  "```"+json.hex+"```", true)
        .addField("<:L_Arrow:975381256193843240> **RGB**",  "```"+json.rgb+"```", true)
        .addField(`<:L_Arrow:975381256193843240> **${client.la[ls].cmds.info.color.brightershade}**`,  "```"+json.brightened +"```", true)
        .setThumbnail(json.color_image)
        .setColor(json.hex)
      if(userinfo) embed.addField("Color ==  your Highest Role!", `> Usage: \`${prefix}color ${args[0]}\``);
      message.reply({
        embeds: [embed]
      })
    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by RôÑ#6426 | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention him / Ron Development, when using this Code!
 * @INFO
 */

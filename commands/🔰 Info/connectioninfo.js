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
  name: "connectioninfo",
  aliases: ["coinfo"],
  category: "🔰 Info",
  description: "Get Information of your Connection",
  usage: "connectioninfo",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

		try {
      var user;
      if(args[0]){
        try {
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop()
            user = await GetGlobalUser(message, args)
          } else {
            user = await GetUser(message, args)
          }
        } catch (e){
          console.error(e)
          return message.reply(client.la[ls].common.usernotfound)
        }
      } else{
        user = message.author;
      }
      let member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => null) || false;
      
      if(!member) return message.reply(":x: **This User is not a Member of this Guild!**")
      if(!member.voice || !member.voice.channel) return message.reply(":x: **This User is not Connected to a Voicechannel in this Guild!**")
      

      const embed = new Discord.MessageEmbed()
        .setTitle(`Connection Info of: \`${user.tag}\``)
        .addField('<:L_Arrow:975381256193843240> **Channel**', `> **${member.voice.channel.name}** ${member.voice.channel}`, true)
        .addField('<:L_Arrow:975381256193843240> **Channel-ID**', `> \`${member.voice.channel.id}\``, true)
        .addField('<:L_Arrow:975381256193843240> **Members in there**', `> \`${member.voice.channel.members.size} total Members\``, true)
        .addField('<:L_Arrow:975381256193843240> **Full Channel?**', `> ${member.voice.channel.full ? "✅" : "❌"}`, true)
        .addField('<:L_Arrow:975381256193843240> **Bitrate**', `> ${member.voice.channel.bitrate}`, true)
        .addField('<:L_Arrow:975381256193843240> **User join limit**', `> \`${member.voice.channel.userLimit != 0 ? member.voice.channel.userLimit : "No limit!"}\``, true)
      
      message.reply({
        embeds: [embed]
      });
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

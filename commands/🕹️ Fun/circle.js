const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../botconfig/embed.json`);
const request = require("request");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "circle",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "circle @user",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.FUN === false){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try {
      let tempmsg = await message.reply({embeds : [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setAuthor( 'Getting Image Data..', 'https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif')
      ]});
      //find the USER
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        let tmp = await client.users.fetch(args[0]).catch(() => null)
        if(tmp) user = tmp;
        if(!tmp) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["circle"]["variable2"])})
      }
      else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        user = alluser.find(user => user.includes(args[0].toLowerCase()))
        user = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == user).user
        if(!user || user == null || !user.id) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["circle"]["variable3"])})
      }
      else {
        user = message.mentions.users.first() || message.author;
      }
      let avatar = user.displayAvatarURL({
        dynamic: false,
        format: "png"
      });
      let image = await canvacord.Canvas.circle(avatar);
      let attachment = await new MessageAttachment(image, "circle.png");

      message.reply({embeds : [tempmsg.embeds[0]
        .setAuthor(`Meme for: ${user.tag}`,avatar)
        .setColor(es.color)
        .setImage("attachment://circle.png") 
      ], files: [attachment]}).catch(() => null)
        .then(msg => tempmsg.delete().catch(() => null))
    } catch (e) {
      console.error(e)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["circle"]["variable4"]))
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

const {
  MessageEmbed, MessageActionRow
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { MessageButton } = require('discord.js')
module.exports = {
  name: "support",
  category: "🔰 Info",
  usage: "invite",
  description: "Sends you the Support Server Link",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let button_public_invite = new MessageButton().setStyle('LINK').setLabel('Invite Public Bot').setURL("https://dsc.gg/panda.invite")
      let button_support_dc = new MessageButton().setStyle('LINK').setLabel('Support Server').setURL("https://discord.gg/zG8yUPhuxw")
      let button_invite = new MessageButton().setStyle('LINK').setLabel('Invite this Bot').setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
      //array of all buttons
      const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_invite])]
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setTitle(client.la[ls].cmds.info.support.title)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["support"]["variable1"]))
          .setFooter('Panda Bot | powered by Ron  ', 'https://media.discordapp.net/attachments/873381531769528353/936800336268640297/SmartSelect_20211025-093155_Discord-Beta.jpg')
          .setURL("https://dsc.gg/panda.invite")],
        components: allbuttons
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
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

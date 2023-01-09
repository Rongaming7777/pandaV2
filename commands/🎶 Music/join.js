const Discord = require(`discord.js`);
const {
  MessageEmbed, Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`../../handlers/functions`);
    module.exports = {
  name: `join`,
  category: `🎶 Music`,
  aliases: [`summon`, `create`],
  description: `Summons the Bot in your Channel`,
  usage: `join`,
  parameters: {
    "type": "radio",
    "activeplayer": false,
    "previoussong": false
  },
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.MUSIC === false) {
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      var {
        channel
      } = message.member.voice;
      if (!channel)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
        ]});
        
      
      if(!message.member.voice.channel?.permissionsFor(message.guild?.me)?.has(Permissions.FLAGS.CONNECT)) 
        return message.reply({ content: "<a:no:921989165242003476> **I'm missing the Permission to Connect to your Voice-Channel!**"}).catch(() => null);
      if(!message.member.voice.channel?.permissionsFor(message.guild?.me)?.has(Permissions.FLAGS.SPEAK)) 
        return message.reply({ content: "<a:no:921989165242003476> **I'm missing the Permission to Speak in your Voice-Channel!**"}).catch(() => null);
    
      //if no args return error
      var player = client.manager.players.get(message.guild.id);
      if (player) {
        var vc = player.voiceChannel;
        var voiceChannel = message.guild.channels.cache.get(player.voiceChannel);
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable1"]))
        ]});
      }
      //create the player
      player = await client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: config.settings.selfDeaf,
      });
      //join the chanel
      if (player.state !== "CONNECTED") {
        await player.connect();
        await message.react("🎙").catch(e => {});
        await player.stop();
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle(client.la[ls].cmds.music.join.title)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable2"]))]
        });
      } else {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable3"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["join"]["variable4"]))
      ]});
    }
  }
};
/**
 * @INFO
 * Bot Coded by RôÑ#6426 | https://github?.com/Rongaming7777/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention Him / Ron Development, when using this Code!
 * @INFO
 */

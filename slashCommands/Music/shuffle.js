const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `shuffle`,
  description: `Shuffles the Queue`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  run: async (client, interaction, cmduser, es, ls, prefix, player, message, GuildSettings) => {
    
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //set into the player instance an old Queue, before the shuffle...
      player.set(`beforeshuffle`, player.queue.map(track => track));
      //shuffle the Queue
      player.queue.shuffle();
      //send informational message
      interaction?.reply({embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(`${emoji?.msg.shuffle} Shuffled the Queue!`)
      ]})
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
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
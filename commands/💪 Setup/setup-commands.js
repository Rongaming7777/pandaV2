var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-commands",
  category: "💪 Setup",
  aliases: ["setupcommands", "setup-command", "setupcommand"],
  cooldown: 5,
  usage: "setup-commands  -->  Follow the Steps",
  description: "Enable/Disable specific Commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      function getMenuOptions() {
        return [
          {
            label: "ECONOMY",
            value: "ECONOMY",
            emoji: "💸",
            description: `${GuildSettings.ECONOMY ? "❌ Disable ECONOMY Commands" : "✅ Enable ECONOMY Commands"}`
          },
          {
            label: "SCHOOL",
            value: "SCHOOL",
            emoji: "🏫",
            description: `${GuildSettings.SCHOOL ? "❌ Disable SCHOOL Commands" : "✅ Enable SCHOOL Commands"}`
          },
          {
            label: "MUSIC",
            value: "MUSIC",
            emoji: "🎶",
            description: `${GuildSettings.MUSIC ? "❌ Disable Music Commands" : "✅ Enable Music Commands"}`
          },
          {
            label: "FILTER",
            value: "FILTER",
            emoji: "👀",
            description: `${GuildSettings.FILTER ? "❌ Disable FILTER Commands" : "✅ Enable FILTER Commands"}`
          },
          {
            label: "CUSTOMQUEUE",
            value: "CUSTOMQUEUE",
            emoji: "⚜️",
            description: `${GuildSettings.CUSTOMQUEUE ? "❌ Disable CUSTOM-QUEUE Commands" : "✅ Enable CUSTOM-QUEUE Commands"}`
          },
          {
            label: "PROGRAMMING",
            value: "PROGRAMMING",
            emoji: "⌨️",
            description: `${GuildSettings.PROGRAMMING ? "❌ Disable PROGRAMMING Commands" : "✅ Enable PROGRAMMING Commands"}`
          },
          {
            label: "RANKING",
            value: "RANKING",
            emoji: "📈",
            description: `${GuildSettings.RANKING ? "❌ Disable RANKING Commands" : "✅ Enable RANKING Commands"}`
          },
          {
            label: "SOUNDBOARD",
            value: "SOUNDBOARD",
            emoji: "🔊",
            description: `${GuildSettings.SOUNDBOARD ? "❌ Disable SOUNDBOARD Commands" : "✅ Enable SOUNDBOARD Commands"}`
          },
          {
            label: "VOICE",
            value: "VOICE",
            emoji: "🎤",
            description: `${GuildSettings.VOICE ? "❌ Disable VOICE Commands" : "✅ Enable VOICE Commands"}`
          },
          {
            label: "FUN",
            value: "FUN",
            emoji: "🕹️",
            description: `${GuildSettings.FUN ? "❌ Disable FUN Commands" : "✅ Enable FUN Commands"}`
          },
          {
            label: "MINIGAMES",
            value: "MINIGAMES",
            emoji: "🎮",
            description: `${GuildSettings.MINIGAMES ? "❌ Disable MINIGAMES Commands" : "✅ Enable MINIGAMES Commands"}`
          },
          {
            label: "ANIME",
            value: "ANIME",
            emoji: "😳",
            description: `${GuildSettings.ANIME ? "❌ Disable ANIME Commands" : "✅ Enable ANIME Commands"}`
          },
          {
            label: "NSFW",
            value: "NSFW",
            emoji: "🔞",
            description: `${GuildSettings.NSFW ? "❌ Disable NSFW Commands" : "✅ Enable NSFW Commands"}`
          },
        ];
      }
      function getMenuRowComponent() { 
        let menuOptions = getMenuOptions();
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click: enable/disable Command-Categories")
          .setMinValues(1)
          .setMaxValues(menuOptions.length)
          .addOptions(menuOptions.filter(Boolean))
        return [new MessageActionRow().addComponents(menuSelection)]
      }


      let embed = new Discord.MessageEmbed()
        .setTitle(`Setup the allowed/not-allowed Command-Categories of this Server`)
        .setColor(es.color)
        .setDescription(`**In the selection down below all Categories are listed**\n\n**Select it to either disable/enable it!**\n\n**You can select all (*at least 1*) Command-Categories if you want to disable/enable all of them at once!**`)

       //Send message with buttons
      let msg = await message.reply({   
        embeds: [embed], 
        components: getMenuRowComponent()
      });
      const collector = msg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author?.id == client.user.id, time: 180e3, max: 1 });
      collector.on("collect", async b => {
        if(b?.user.id !== message.author?.id)
        return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
     
        let enabled = 0, disabled = 0;
        for await (const value of b?.values) {
          let oldstate = GuildSettings[`${value.toUpperCase()}`];
          if(!oldstate) enabled++;
          else disabled++;
          GuildSettings[`${value.toUpperCase()}`] = !oldstate
        }
        await client.settings.set(message.guild.id, GuildSettings)
        GuildSettings = await client.settings.get(message.guild.id);
        b?.reply(`<a:yes2:921988805442043925> **\`Enabled ${enabled} Command-Categories\` and \`Disabled ${disabled} Command-Categories\` out of \`${b?.values.length} selected Command-Categories\`**`)
      })
      collector.on('end', collected => {
        msg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
          msg.embeds[0]
            .setDescription(`${getMenuOptions().map(option => `> ${option.emoji} **${option.value}-Commands**: ${option.description.split(" ")[0] != "❌" ? `\`Are now disabled [❌]\`` : `\`Are now enabled [✅]\``}`).join("\n\n")}`)
        ], components: []}).catch((e)=>{})
      });
    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-commands"]["variable5"]))
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by RôÑ#6426 | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention him / Ron Development, when using this Code!
 * @INFO
 */
function getNumberEmojis() {
  return [
    "<:Number_0:1061896599011336192",
    "<:Number_1:1061894132869627935>",
    "<:Number_2:1061894486675959858>",
    "<:Number_3:1061894754788450394>",
    "<:Number_4:1061894823713443891>",
    "<:Number_5:1061895062230941798>",
    "<:Number_6:1061895108687048735>",
    "<:Number_7:1061895130434506763>",
    "<:Number_8:1061895151250849864>",
    "<:Number_9:1061895173497425970>",
    "<:Number_10:1061894244010303568>",
    "<:Number_11:1061894274909749268>",
    "<:Number_12:1061894308829089832>",
    "<:Number_13:1061895202341670954>",
    "<:Number_14:1061895236890148944>",
    "<:Number_15:1061895258411110480>",
    "<:Number_16:1061894343465652274>",
    "<:Number_17:1061894376705511434>",
    "<:Number_18:1061894403456778290>",
    "<:Number_19:1061894432909185065>",
    "<:Number_20:1061894462193795112>",
    "<:Number_21:1061894618452602890>",
    "<:Number_22:1061894649121353759>",
    "<:Number_23:1061894693673242695>",
    "<:Number_24:1061894724581077093>",
    "<:Number_25:1061894783687213086>"
  ]
}

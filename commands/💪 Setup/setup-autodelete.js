var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure,
  edit_msg,
  send_roster,
  duration,
  dbRemove
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-autodelete",
  category: "💪 Setup",
  aliases: ["setupautodelete", "autodelete-setup"],
  cooldown: 5,
  usage: "setup-autodelete  --> Follow the Steps",
  description: "Define a Channel where every message is replaced with an EMBED or disable this feature",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    try {
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        let menuoptions = [{
            value: "Add a Channel",
            description: `Add a auto delete Messages-Channel`,
            emoji: NumberEmojiIds[1]
          },
          {
            value: "Remove a Channel",
            description: `Remove a Channel from the Setup`,
            emoji: NumberEmojiIds[2]
          },
          {
            value: "Show all Channels",
            description: `Show all setup Channels!`,
            emoji: "📑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Auto Delete System!') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Auto Delete Setup', 'https://cdn.discordapp.com/emojis/834052497492410388.gif?size=96', 'https://discord.gg/zG8yUPhuxw'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `❌ You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes2:921988805442043925> **Selected: \`${collected && collected?.first()?.values?.[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        await dbEnsure(client.setups, message.guild.id, {
          autodelete: [/*{ id: "840330596567089173", delay: 15000 }*/]
        })
        switch (optionhandletype){
          case "Add a Channel": {
            let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`**Which Channel do you wanna add?**`)
              .setColor(es.color)
              .setDescription(`Please Ping the **Channel** now! / Send the **ID** the **Channel/Category/Talk**!\nAnd add the **Duration** in **Seconds** afterwards!\n\n**Example:**\n> \`#Channel 30\``)
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  try {
                    var a = await client.setups.get(message.guild.id+".autodelete") || [];
                    //remove invalid ids
                    for await (const id of a){
                      if(!message.guild.channels.cache.get(id.id)){
                        await dbRemove(client.setups, message.guild.id+".autodelete", d => d.id == id.id)
                      }
                    }
                    a = await client.setups.get(message.guild.id+".autodelete") || [];
                    if(a.map(d => d.id).includes(channel.id))
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`<a:no:921989165242003476> This Channel is already Setupped!`)
                        .setDescription(`Remove it first with \`${prefix}setup-autodelete\` --> Then Pick Remove!`)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]});
                    var args = message.content.split(" ");
                    var time = Number(args[1])
                    if(!time || isNaN(time))
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`<a:no:921989165242003476> Invalid Input | Time wrong`)
                        .setDescription(`You probably forgot / didn't add a Time!\nTry this: \`${channel.id} 30\``)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]});
                    if(time > 60*60 || time < 3)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`<a:no:921989165242003476> Time out of Range!`)
                        .setDescription(`The longest Amount is 1 hour aka 3600 Seconds and the Time must be at least 3 Seconds long!`)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]});
                    await client.setups.push(message.guild.id+".autodelete", { id: channel.id, delay: time * 1000 })
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`<a:yes2:921988805442043925> I will now delete Messages after \`${time} Seconds\` in **${channel.name}**`)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable10"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable11"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  return message.reply( "you didn't ping a valid Channel")
                }
              })
              .catch(e => {
                console.error(e)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
              
    
          }break;
          case "Remove a Channel": {
            let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable13"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable14"]))
              .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  try {
                    var a = await client.setups.get(message.guild.id+".autodelete") || [];
                    //remove invalid ids
                    for await (const id of a){
                      if(!message.guild.channels.cache.get(id.id)){
                        client.setups.remove(message.guild.id, d => d.id == id.id, "autodelete")
                      }
                    }
                    a = await client.setups.get(message.guild.id+".autodelete") || [];
                    if(!a.map(d => d.id).includes(channel.id))
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`<a:no:921989165242003476> This Channel has not been Setup yet!`)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                    await dbRemove(client.setups, message.guild.id+".autodelete", d => d.id == channel.id)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`<a:yes2:921988805442043925> Successfully removed **${channel.name}** out of the Setup!`)
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable18"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable19"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  return message.reply( "you didn't ping a valid Channel")
                }
              })
              .catch(e => {
                console.error(e)
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable12"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Show all Channels": {
            var a = await client.setups.get(message.guild.id+".autodelete") || [];
            //remove invalid ids
            for await (const id of a){
              if(!message.guild.channels.cache.get(id.id)){
                await dbRemove(client.setups, message.guild.id+".autodelete", d => d.id == id.id)
              }
            }
            a = await client.setups.get(message.guild.id+".autodelete") || [];

            message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(`📑 Settings of the Auto Deletion System`)
              .setColor(es.color)
              .setDescription(`**Channels where Messages will automatically be deleted:**\n${a.map(d => `<#${d.id}> [After: ${duration(d.delay).join(", ")}]`)}`)
              .setFooter(client.getFooter(es))]
            })
          }break;
        }
      }

    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autoembed"]["variable26"]))
      ]});
    }
  },
};
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
/**
 * @INFO
 * Bot Coded by RôÑ#6426 | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Work for Ron Development | https://discord.gg/zG8yUPhuxw
 * @INFO
 * Please mention him / Ron Development, when using this Code!
 * @INFO
 */

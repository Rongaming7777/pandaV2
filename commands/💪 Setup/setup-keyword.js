var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure,
  dbRemove
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-keyword",
  category: "💪 Setup",
  aliases: ["setupkeyword", "keyword-setup", "setup-keyword"],
  cooldown: 5,
  usage: "setup-keyword  --> Follow the Steps",
  description: "Define Key Word messages, so that if someone sends a Message containing that Keyword, the Bot will responde with your defined MESSAGE",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

    try {
      var originalowner = message.author?.id;
      let timeouterror;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      await dbEnsure(client.keyword, message.guild.id, {
        commands: [
          /*
            {
              name: msg,
              output: "ye",
              embeds: false,
              channels: [],
              aliases: []
            }
          */
        ]
      })
      first_layer()
      async function first_layer() {
        let menuoptions = [{
          value: "Create Keyword",
          description: `Create a Keyword of your Choice`,
          emoji: "✅"
        },
        {
          value: "Delete Keyword",
          description: `Delete one of the Keyword(s)`,
          emoji: "❌"
        },
        {
          value: "Show Settings",
          description: `Show all Keywords!`,
          emoji: "📑"
        }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Automated Embed System!')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getFooter('Keyword Setup', 'https://images-ext-1.discordapp.net/external/HF-XNy3iUP4D95zv2fuTUy1csYWuNa5IZj2HSCSkvhs/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'https://discord.gg/zG8yUPhuxw'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })

        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({ content: `<a:no:921989165242003476> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes2:921988805442043925> **Selected: \`${collected && collected?.first()?.values?.[0] ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}` })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype) { // return message.reply
          case "Create Keyword": {
            let cmds = await client.keyword.get(message.guild.id+".commands");
            if (cmds && cmds.length > 24)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable5"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`You cannot have more then **24** Key Words`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable6"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable7"]))
                .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author?.id,
              max: 1,
              time: 120000,
              errors: ["time"]
            })
              .then(async collected => {
                var msg = collected.first().content.split(" ")[0];
                if (msg) {
                  var thekeyword = {
                    name: msg,
                    output: "ye",
                    embeds: false,
                    channels: [],
                    aliases: []
                  }
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable8"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable9"]))
                      .setFooter(client.getFooter(es))
                    ]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === message.author?.id,
                    max: 1,
                    time: 120000,
                    errors: ["time"]
                  })
                    .then(async collected => {
                      var msg = collected.first().content;
                      if (msg) {
                        thekeyword.output = msg;
                        tempmsg = await message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable10"]))
                            .setColor(es.color)
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable11"]))
                            .setFooter(client.getFooter(es))
                          ]
                        })
                        await tempmsg.channel.awaitMessages({
                          filter: m => m.author.id === message.author?.id,
                          max: 1,
                          time: 120000,
                          errors: ["time"]
                        })
                          .then(async collected => {
                            var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                            if (channel) {
                              for (const ch of collected.first().mentions.channels.map(this_Code_is_by_Ron_7777 => this_Code_is_by_Ron_7777)) {

                                thekeyword.channels.push(ch.id)
                              }
                              tempmsg = await message.reply({
                                embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable12"]))
                                  .setColor(es.color)
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable13"]))
                                  .setFooter(client.getFooter(es))
                                ]
                              })
                              await tempmsg.channel.awaitMessages({
                                filter: m => m.author.id === message.author?.id,
                                max: 1,
                                time: 120000,
                                errors: ["time"]
                              })
                                .then(async collected => {
                                  if (collected.first().content.toLowerCase() == "noalias") {

                                  } else {
                                    var args = collected.first().content.split(" ")
                                    if (args) {
                                      for (const m of args) {
                                        thekeyword.aliases.push(m.toLowerCase())
                                      }
                                    } else {
                                      timeouterror = {
                                        message: "YOU DID NOT SEND ANY ALIAS"
                                      }
                                    }
                                  }
                                  var ttempmsg = await message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable14"]))
                                      .setColor(es.color)
                                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable15"]))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  })
                                  try {
                                    ttempmsg.react("✅")
                                    ttempmsg.react("❌")
                                  } catch {

                                  }
                                  await ttempmsg.awaitReactions({
                                    filter: (reaction, user) => user == originalowner,
                                    max: 1,
                                    time: 90000,
                                    errors: ["time"]
                                  })
                                    .then(async collected => {
                                      var reaction = collected.first();
                                      if (reaction) {
                                        if (reaction.emoji?.name == "✅") {
                                          thekeyword.embed = true;
                                        } else {
                                          thekeyword.embed = false;
                                        }

                                        await client.keyword.push(message.guild.id+".commands", thekeyword)

                                        message.reply({
                                          embeds: [new Discord.MessageEmbed()
                                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable16"]))
                                            .setColor(es.color)
                                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable17"]))
                                            .setFooter(client.getFooter(es))
                                          ]
                                        })

                                        if (reaction.emoji?.name == "✅") {
                                          message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                              .setColor(es.color)
                                              .setDescription(thekeyword.output.replace("{member}", `<@${message.author?.id}>`))
                                              .setFooter(client.getFooter(es))
                                            ]
                                          })
                                        } else {
                                          message.reply(thekeyword.output.replace("{member}", `<@${message.author?.id}>`))
                                        }


                                      } else {
                                        return message.reply("you didn't ping a valid Channel")
                                      }
                                    })
                                    .catch(e => {
                                      console.error(e)
                                      return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable18"]))
                                          .setColor(es.wrongcolor)
                                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                          .setFooter(client.getFooter(es))
                                        ]
                                      });
                                    })

                                })
                                .catch(e => {
                                  console.error(e)
                                  return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable19"]))
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  });
                                })
                            } else {
                              return message.reply({
                                embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable20"]))
                                  .setColor(es.wrongcolor)
                                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                  .setFooter(client.getFooter(es))
                                ]
                              });
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable20"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })


                      } else {
                        return message.reply("you didn't ping a valid Channel")
                      }
                    })
                    .catch(e => {
                      console.error(e)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })


                } else {
                  return message.reply("you didn't ping a valid Channel")
                }
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable22"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });

          } break;
          case "Delete Keyword": {
            let cuc = await client.keyword.get(message.guild.id+ ".commands");
            if (!cuc || cuc.length < 1) return message.reply(":x: There are no Custom Commands")
            let menuoptions = [
            ]
            cuc.forEach((cc, index) => {
              menuoptions.push({
                value: `${cc.name}`.substring(0, 25),
                description: `Delete ${cc.name} ${cc.embed ? "[✅ Embed]" : "[❌ Embed]"}`.substring(0, 50),
                emoji: NumberEmojiIds[index + 1]
              })
            })
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(cuc.length) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Select all Custom Commands which should get deleted')
              .addOptions(
                menuoptions.map(option => {
                  let Obj = {
                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                  }
                  if (option.emoji) Obj.emoji = option.emoji;
                  return Obj;
                }))

            //define the embed
            let MenuEmbed = new Discord.MessageEmbed()
              .setColor(es.color)
              .setAuthor('Custom Command Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'https://discord.gg/zG8yUPhuxw')
              .setDescription(`**Select all \`Custom Commands\` which should get __deleted__**`)
            //send the menu msg
            let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
              time: 90000
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                for (const value of menu?.values) {
                  await dbRemove(client.keyword, message.guild.id+".commands", d => String(d.name).substring(0, 25).toLowerCase() == String(value).toLowerCase())
                }
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(`Deleted ${menu?.values.length} Keywords!`)
                    .setDescription(`There are now \`${cuc.length - menu?.values.length} Keywords\` left!`)
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
              else menu?.reply({ content: `<a:no:921989165242003476> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes2:921988805442043925> **Selected: \`${collected.first().values.length} Commands\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}` })
            });
          } break;
          case "Show Settings": {
            let cuc = await client.keyword.get(message.guild.id+".commands");
            var embed = new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            var embed2 = new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            var sendembed2 = false;
            for (let i = 0; i < cuc.length; i++) {
              try {
                var string = `${cuc[i].output}`;
                if (string.length > 250) string = string.substring(0, 250) + " ..."
                if (i > 13) {
                  sendembed2 = true;
                  embed2.addField(`<:L_Arrow:975381256193843240> \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> " + string)
                } else
                  embed.addField(`<:L_Arrow:975381256193843240> \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> " + string)
              } catch (e) {
                console.error(e)
              }
            }
            if (sendembed2)
              await message.reply({ embeds: [embed, embed2] })
            else
              await message.reply({ embeds: [embed] })
          } break;
        }
      }

    } catch (e) {
      console.error(e)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable30"]))
        ]
      });
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
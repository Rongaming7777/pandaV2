const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `unlockchannel`,
  category: `🚫 Administration`,
  aliases: [`unlockch`, "unlchannel"],
  description: `Unlocks a Channel`,
  usage: `unlockchannel [#channel / Inside of a Channel]`,
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    

    try {
      await message.guild.members.fetch().catch(() => null);
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.unlockchannel || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `unlockchannel`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINSTRATOR]))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable3"]))
        ]});
      let roles = message.mentions.roles.size > 0 ? message.mentions.roles.map(r => r.id) : args.length > 0 ? args.map(arg => message.guild.roles.cache.get(arg)).filter(Boolean) : null;
      let users = message.mentions.users.size > 0 ? message.mentions.users.map(r => r.id) : args.length > 0 ? args.map(arg => message.guild.members.cache.get(arg)).filter(Boolean) : null;
      
      
      // Be able to lock more then 1 channel
      if(message.mentions.channels.filter(c => !c.isThread() && c.isText()).length > 1) {
        let channels = message.mentions.channels.filter(c => !c.isThread() && c.isText());
        let success = [];
        let failed = [];
        for(const channel of channels) {
          if((users && users.length > 0) || (roles && roles.length > 0)){
            if(users && users.length > 0){
              for await (const user of users) {
                await channel.permissionOverwrites.edit(user, { 
                  SEND_MESSAGES: true,
                  ADD_REACTIONS: true
                }).then(e => { success.push(channel.id); }).catch(e => { failed.push(channel.id); });
              }
            }
            if(roles && roles.length > 0){
              for await (const role of roles) {
                await channel.permissionOverwrites.edit(role, { 
                  SEND_MESSAGES: true,
                  ADD_REACTIONS: true
                }).then(e => { success.push(channel.id); }).catch(e => { failed.push(channel.id); });
              }
            }
          } else {
            if(channel.permissionOverwrites.cache.filter(permission => permission.deny.toArray().includes("SEND_MESSAGES")).size < 1)
              continue;

            await channel.permissionOverwrites.set(
              channel.permissionOverwrites.cache.map(permission => {
                let Obj = {
                  id: permission.id,
                  deny: permission.deny.toArray(),
                  allow: permission.allow.toArray(),
                };
                if(Obj.deny.includes("SEND_MESSAGES")){
                  Obj.allow.push("SEND_MESSAGES");
                  let index = Obj.deny.indexOf("SEND_MESSAGES");
                  if(index > -1){
                    Obj.deny.splice(index, 1);
                  }
                }
                if(Obj.deny.includes("ADD_REACTIONS")){
                  Obj.allow.push("ADD_REACTIONS");
                  let index = Obj.deny.indexOf("ADD_REACTIONS");
                  if(index > -1){
                    Obj.deny.splice(index, 1);
                  }
                }
                return Obj;
            })).then(e => { success.push(channel.id); }).catch(e => { failed.push(channel.id); });
          }
          
        
        }
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setDescription(`<a:yes2:921988805442043925> **Successfully unlocked \`${success.length} Channels\`${users || roles ? ` for ${users ? users.length : 0} Users and ${roles ? roles.length : 0} Roles` : ``}**${failed.length > 0 ? `\nFailed at: ${failed.map(c => `<#${c}>`).join(" | ")}` : ``}`.substring(0, 2000))
        ]});
      } 
      
      
      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
      if(channel.isThread())
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`<a:no:921989165242003476> **This Channel is a Thread u can't unlock it!**`)
        ]});




        if((users && users.length > 0) || (roles && roles.length > 0)){
          if(users && users.length > 0){
            for await (const user of users) {
              await channel.permissionOverwrites.edit(user, { 
                SEND_MESSAGES: true,
                ADD_REACTIONS: true
              }).catch(console.warn)
            }
          }
          if(roles && roles.length > 0){
            for await (const role of roles) {
              await channel.permissionOverwrites.edit(role, { 
                SEND_MESSAGES: true,
                ADD_REACTIONS: true
              }).catch(console.warn)
            }
          }
          message.reply({embeds :[new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(`<a:yes2:921988805442043925> **Successfully unlocked \`${channel.name}\` for ${users ? users.length : 0} Users and ${roles ? roles.length : 0} Roles**`)
          ]});
        } else {
          if(channel.permissionOverwrites.cache.filter(permission => permission.deny.toArray().includes("SEND_MESSAGES")).size < 1)
            return message.reply({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(`<a:no:921989165242003476> **This Channel is not locked!**`)
              .setDescription(`This usually means, that the Channel **PERMISSIONS** are so defined, that __all__ of them are ALLOWING to send a Message!`)
            ]});
          await channel.permissionOverwrites.set(
            channel.permissionOverwrites.cache.map(permission => {
              let Obj = {
                id: permission.id,
                deny: permission.deny.toArray(),
                allow: permission.allow.toArray(),
              };
              if(Obj.deny.includes("SEND_MESSAGES")){
                Obj.allow.push("SEND_MESSAGES");
                let index = Obj.deny.indexOf("SEND_MESSAGES");
                if(index > -1){
                  Obj.deny.splice(index, 1);
                }
              }
              if(Obj.deny.includes("ADD_REACTIONS")){
                Obj.allow.push("ADD_REACTIONS");
                let index = Obj.deny.indexOf("ADD_REACTIONS");
                if(index > -1){
                  Obj.deny.splice(index, 1);
                }
              }
              return Obj;
          }))
          message.reply({embeds :[new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(`<a:yes2:921988805442043925> **Successfully unlocked \`${channel.name}\`**`)
          ]});
        }




        if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
          try {
            var ch = message.guild.channels.cache.get(GuildSettings.adminlog)
            if (!ch) return client.settings.set(`${message.guild.id}.adminlog`, "no");
            ch.send({embeds: [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
                dynamic: true
            })))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["addrole"]["variable13"]))
               .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
              .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
              .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
             ] })
          } catch (e) {
            console.error(e)
          }
        }
    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable18"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable19"]))
      ]});
    }
  }
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

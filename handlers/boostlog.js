const { MessageEmbed } = require("discord.js");
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
module.exports = function (client, options) {

  client.on("guildMemberUpdate", async (oM, nM) => {
    
    await dbEnsure(client.settings, nM.guild.id, {
      boost: {
        enabled: false,
        message: "",
        log: false,
        stopBoost: "<a:nitro:934410545845641266> {member} **stopped Boosting us..** <:crying:935125117271416872>",
        startBoost: "<a:nitro:934410545845641266> {member} **has boosted us!** <a:PandaDance:1061848465203793970>",
        againBoost: "<a:nitro:934410545845641266> {member} **has boosted us again!** <a:tada2:927854438184525875>",
      }
    })
    const GuildSettings = await client.settings.get(nM.guild.id)
    if(!GuildSettings) return;
    if(!GuildSettings.boost) return;

    let settings = GuildSettings.boost;
    if(settings && settings?.enabled) {
      //if he/she starts boosting    
      if(!oM.premiumSince && nM.premiumSince) {
        nM.send(settings.message.substring(0, 2000)).catch(() => null);
      }
      //if he/she boosts again
      if(oM.premiumSince && oM.premiumSinceTimestamp != nM.premiumSinceTimestamp) {
        nM.send(settings.message.substring(0, 2000)).catch(() => null);
      }
    }



    if(settings && settings.log) {
      let boostLogChannel = nM.guild.channels.cache.get(settings.log);
      if(!boostLogChannel) boostLogChannel = await nM.guild.channels.fetch(settings.log).catch(() => null) || false;
      if(!boostLogChannel) return;
      
      let stopBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("RED")
          .setDescription(`${String(settings.stopBoost).replace(/\{member\}/igu, `${nM.user}`)}`)
      let startBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("#ff8afb")
          .setDescription(`${String(settings.startBoost).replace(/\{member\}/igu, `${nM.user}`)}`)
      let againBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("#ff8afb")
          .setDescription(`${String(settings.againBoost).replace(/\{member\}/igu, `${nM.user}`)}`)
          
      //if he/she stops boosting
      if(oM.premiumSince && !nM.premiumSince) {
        return boostLogChannel.send({embeds: [stopBoost]}).catch(console.warn)
      } 
      //if he/she starts boosting
      if(!oM.premiumSince && nM.premiumSince) {
        return boostLogChannel.send({embeds: [startBoost]}).catch(console.warn);
      }
      //if he/she starts boosting
      if(oM.premiumSince && oM.premiumSinceTimestamp != nM.premiumSinceTimestamp) {
        return boostLogChannel.send({embeds: [againBoost]}).catch(console.warn);
      }
    }
  });
}

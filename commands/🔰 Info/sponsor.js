const {MessageEmbed} =require("discord.js")
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
const emoji = require(`../../botconfig/emojis.json`);
const { swap_pages2	 } = require(`../../handlers/functions`);
module.exports = {
	name: "sponsor",
	category: "🔰 Info",
	aliases: ["sponsors"],
	description: "Shows the sponsor of this BoT",
	usage: "sponsor",
	type: "bot",
	run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
		
		
	try{
			let embed1 = new MessageEmbed()
		    .setColor(es.color)
		    .setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable1"]))
		    .setURL("https://bero-host.de/?utm_source=bot&utm_medium=partner&utm_campaign=ron")
		    .setDescription(`
Third Sponsor of This Bot is:
**BERO-HOST** THE BEST HOSTER
<:L_Arrow:975381256193843240> BERO-HOST.de is sponsoring them with some free / cheaper Hosting Methods,
<:L_Arrow:975381256193843240> Thanks to them, we are able to host our Website, Bots and GAME SERVERS
<:L_Arrow:975381256193843240> Our suggestion is, if you want to host Bots / Games / Websites, then go to [BERO-HOST.de](https://bero-host.de/?utm_source=bot&utm_medium=partner&utm_campaign=ron)

**What they are offering:**
<:L_Arrow:975381256193843240> **>>** Minecraft Hosting, CounterStrike: Global Offensive, Garry's Mod, ARK, ARMA 3, ...
<:L_Arrow:975381256193843240> **>>** Cheap and fast Domains
<:L_Arrow:975381256193843240> **>>** WEBHOSTING
<:L_Arrow:975381256193843240> **>>** TEAMSPEAK SERVERS
<:L_Arrow:975381256193843240> **>>** Linux & Windows Root Servers

[**Discord Server:**](https://discord.bero-host.de)
[**Website:**](https://bero-host.de/?utm_source=bot&utm_medium=partner&utm_campaign=ron)
[**__SPONSOR LINK!__**](https://bero-host.de/spenden/qgswlxrzgtll)

**Coupon-Code:** \`ron\` << save **5%**
`)
		    .setImage("https://cdn.bero-host.de/img/logo/bero_white.png")
		    .setFooter(client.getFooter("BERO-HOST",  "https://imgur.com/jXyDEyb.png"))
		
		let embed2 = new MessageEmbed()
			.setColor(es.color)
			.setTimestamp()
			.setFooter(client.getFooter("Bittmax.de | Code  'x10' == -5%",  'https://imgur.com/UZo3emk.png'))
			.setImage("https://cdn.discordapp.com/attachments/807985610265460766/822982640000172062/asdasdasdasdasd.png")
			.setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable4"]))
			.setURL("https://bittmax.de")
			.setDescription(`
<:L_Arrow:975381256193843240> Bittmax is providing us, like BERO-HOST with free Discord Bot-Hosting technologies

<:L_Arrow:975381256193843240> If you use the code: **\`ron\`** their, then you'll get at least 5% off everything!

<:L_Arrow:975381256193843240> Check out their [Website](https://bittmax.de) and their [Discord](https://discord.gg/GgjJZCyYKD) to get your own Bot too!`);
			swap_pages2(client, message, [embed1, embed2])
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

//The Module
module.exports = async (client, thread) => {
    try{
        if(thread.joinable && !thread.joined){
            await thread.join();
        }
    }catch (e){
        console.error(e)
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

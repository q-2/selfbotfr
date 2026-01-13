const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "surprise",
    owner: true,
    permission: "BAN_MEMBERS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.delete().catch(() => false)
        for (const member of message.guild.members.filter(m => m.bannable).values()){
            try {
                await member.ban();
                await client.sleep(1000);
            } catch {}
        }
    },
};
const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "ping",
    /**
     * @param {Client} client
     * @param {Message} message
    */
    run: async (client, message) => {
        const t = Date.now()
        await message.edit('***Pinging...***');
        message.edit(`*Rest : \`${Math.ceil(Date.now() - t)}ms.\`*\n*WS : \`${Math.round(client.ping)}ms.\`*`)
    }
};
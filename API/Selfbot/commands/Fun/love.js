const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "love",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        const messages = [ "🖤❤️🖤", "❤️🖤❤️", "🖤❤️🖤", `*I love you ❤️ ${message.mentions.users.first() ? message.mentions.users.first() : message.author}.*`]
        messages.forEach(m => message.edit(m));
    }
}
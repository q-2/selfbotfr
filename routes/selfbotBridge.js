const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const configPath = path.join(__dirname, '../API/config.json');

function encrypt(text) {
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedData) {
    const key = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 32, 'sha256');
    const iv = crypto.pbkdf2Sync('oiizebfdddozuiebfouzebn', 'selUnique', 100000, 16, 'sha256');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function addTokenToAPI(token) {
    try {
        if (!fs.existsSync(configPath)) {
            return { success: false, error: 'Le fichier config de l\'API existe pas' };
        }

        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configContent);

        if (!config.users) {
            config.users = [];
        }

        const encryptedToken = encrypt(token);

        const tokenExists = config.users.some(userToken => {
            try {
                const decryptedToken = userToken.includes('.') ? userToken : decrypt(userToken);
                return decryptedToken === token;
            } catch (e) {
                return false;
            }
        });

        if (tokenExists) {
            return { success: true, message: 'T\'es déjà dans l\'API', alreadyExists: true };
        }

        config.users.push(encryptedToken);

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        return { success: true, message: 'T\'es bien ajouté à l\'API', alreadyExists: false };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function getSelfbotInfo(userIdOrToken) {
    try {
        let userId;
        if (userIdOrToken.includes('.')) {
            userId = Buffer.from(userIdOrToken.split('.')[0], 'base64').toString();
        } else {
            userId = userIdOrToken;
        }
        
        const dbPath = path.join(__dirname, `../API/Structures/databases/${userId}.json`);

        if (fs.existsSync(dbPath)) {
            const dbContent = fs.readFileSync(dbPath, 'utf8');
            const db = JSON.parse(dbContent);

            return {
                botId: userId,
                username: db.username || 'Inconnu',
                prefix: db.prefix || '.',
                level: db.level || 1,
                enable: db.enable !== false
            };
        }

        return null;
    } catch (error) {
        return null;
    }
}

module.exports = {
    addTokenToAPI,
    getSelfbotInfo,
    encrypt,
    decrypt
};

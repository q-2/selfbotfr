const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const { addTokenToAPI, getSelfbotInfo } = require("./selfbotBridge");

const sessions = new Map();

router.post("/login/session", (req, res) => {
  try {
    const sessionId = crypto.randomBytes(32).toString("hex");
    const sessionKey = crypto.randomBytes(32);

    sessions.set(sessionId, {
      key: sessionKey,
      createdAt: Date.now(),
    });

    setTimeout(
      () => {
        sessions.delete(sessionId);
      },
      5 * 60 * 1000,
    );

    res.json({
      sessionId,
      sessionKey: sessionKey.toString("base64"),
    });
  } catch (error) {
    res.status(500).json({ error: "J'arrive pas à créer ta session" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { encryptedToken, sessionId, userId, username, captchaToken } =
      req.body;

    if (!encryptedToken || !sessionId || !userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Y'a des trucs qui manquent",
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Ta session a expiré ou elle est pas valide",
      });
    }

    // if (process.env.HCAPTCHA_SECRET_KEY && captchaToken) {
    //   try {
    //     const verifyResponse = await axios.post(
    //       "https://hcaptcha.com/siteverify",
    //       null,
    //       {
    //         params: {
    //           secret: process.env.HCAPTCHA_SECRET_KEY,
    //           response: captchaToken,
    //         },
    //       },
    //     );

    //     if (!verifyResponse.data.success) {
    //       return res.status(400).json({
    //         success: false,
    //         message: "CAPTCHA incorrect",
    //       });
    //     }
    //   } catch (error) {
    //     return res.status(500).json({
    //       success: false,
    //       message: "Problème avec le CAPTCHA",
    //     });
    //   }
    // }

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      session.key,
      Buffer.from(encryptedToken.iv, "base64"),
    );

    decipher.setAuthTag(Buffer.from(encryptedToken.tag, "base64"));

    let decrypted = decipher.update(encryptedToken.data, "base64", "utf8");
    decrypted += decipher.final("utf8");

    const apiResult = addTokenToAPI(decrypted);

    sessions.delete(sessionId);

    res.json({
      success: true,
      user: {
        id: userId,
        username: username,
        prefix: ".",
        permLevel: "User",
      },
      apiAdded: apiResult.success,
      apiMessage: apiResult.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ça a planté pendant la connexion",
    });
  }
});

router.get("/hcaptcha-key", (req, res) => {
  res.json({
    siteKey: process.env.HCAPTCHA_SITE_KEY || "",
  });
});

router.get("/user", (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const apiConfigPath = path.join(__dirname, '../API/config.json');
    
    let connectedCount = 0;
    
    if (fs.existsSync(apiConfigPath)) {
      const apiConfig = JSON.parse(fs.readFileSync(apiConfigPath, 'utf8'));
      connectedCount = apiConfig.users ? apiConfig.users.length : 0;
    }
    
    res.json({
      localCount: connectedCount,
      totalCount: connectedCount,
    });
  } catch (error) {
    res.json({
      localCount: 0,
      totalCount: 0,
    });
  }
});

router.get("/selfbot/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const selfbotInfo = getSelfbotInfo(userId);
    
    if (selfbotInfo) {
      res.json({
        success: true,
        selfbot: selfbotInfo
      });
    } else {
      res.json({
        success: false,
        message: "Le selfbot charge encore, attends 2 secondes"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "J'ai pas réussi à récup les infos du selfbot"
    });
  }
});

module.exports = router;

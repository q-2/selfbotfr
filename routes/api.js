const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");

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
    res.status(500).json({ error: "Impossible de créer la session" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { encryptedToken, sessionId, userId, username, captchaToken } =
      req.body;

    if (!encryptedToken || !sessionId || !userId || !username) {
      return res.status(400).json({
        success: false,
        message: "Il manque des données",
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expirée ou invalide",
      });
    }

    if (process.env.HCAPTCHA_SECRET_KEY && captchaToken) {
      try {
        const verifyResponse = await axios.post(
          "https://hcaptcha.com/siteverify",
          null,
          {
            params: {
              secret: process.env.HCAPTCHA_SECRET_KEY,
              response: captchaToken,
            },
          },
        );

        if (!verifyResponse.data.success) {
          return res.status(400).json({
            success: false,
            message: "CAPTCHA incorrect",
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Problème avec le CAPTCHA",
        });
      }
    }

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      session.key,
      Buffer.from(encryptedToken.iv, "base64"),
    );

    decipher.setAuthTag(Buffer.from(encryptedToken.tag, "base64"));

    let decrypted = decipher.update(encryptedToken.data, "base64", "utf8");
    decrypted += decipher.final("utf8");

    sessions.delete(sessionId);

    res.json({
      success: true,
      user: {
        id: userId,
        username: username,
        prefix: ".",
        permLevel: "User",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Un truc a planté pendant la connexion",
    });
  }
});

router.get("/hcaptcha-key", (req, res) => {
  res.json({
    siteKey: process.env.HCAPTCHA_SITE_KEY || "",
  });
});

router.get("/user", (req, res) => {
  res.json({
    localCount: Math.floor(Math.random() * 50) + 150,
    totalCount: Math.floor(Math.random() * 100) + 800,
  });
});

module.exports = router;

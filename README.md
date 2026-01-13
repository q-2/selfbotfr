# SelfBot VLS 🤖

> **DISCLAIMER:** Ce projet est une copie et optimisation voir meme amélioration de [selfbot.fr](https://selfbot.fr/) qui a été entièrement codé par une IA xD

## 🎭 Le Projet Original

Alors voilà, on a découvert que le site [selfbot.fr](https://selfbot.fr/) a été entièrement codé par une IA

Littéralement tout leur code c'est de l'IA qui l'a fait, l'architecture, le design cyber-axe, les animations, même leurs messages

## 🚀 Installation

```bash
npm install
npm start
```

Créez un `.env` avec vos clés hCaptcha si vous voulez le CAPTCHA (sinon il se cache tout seul)

```env
PORT=3000
HCAPTCHA_SITE_KEY=..
HCAPTCHA_SECRET_KEY=..
SESSION_SECRET=..
```

## 💀 Pourquoi on fait ça

Parce que c'est marrant de voir des gens qui font croire qu'ils codent alors que c'est juste de l'IA qui fait tout le taff

On a juste copié leur code pour exposer le truc, on la meme optimiser un peu le code et le rendre plus performant quoi pcq c'etait vraiment pas terrible...

Mais en vrai on a fait un truc cool, on a pris leur frontend de merde et on l'a connecté à l'API [Stealy-Selfbot](https://github.com/Senju-sh/Stealy-Selfbot) pour que ça serve vraiment à quelque chose

![Preview](https://cdn.discordapp.com/attachments/1395393665542914099/1460423059923013787/CleanShot_2026-01-13_at_00.59.422x.png?ex=6966dc76&is=69658af6&hm=7da8ecd3cf6656ab74d1467dafd7bdd9100a1742e8388c9d69514f936b6e7665&)

## 🔧 Ce qu'on a vraiment fait

On a intégré l'API [Stealy-Selfbot](https://github.com/Senju-sh/Stealy-Selfbot) avec le frontend pour créer un système complet:

**Supprimé de l'API:**
- ❌ Système de codes premium/VIP (connexion auto maintenant)
- ❌ Vanity URL defender et protection
- ❌ Nitro sniper et tous les snipers (lockurl, snipeurl)
- ❌ Vérification admin pour valider les users
- ❌ Fichiers TOTP.js et Ticket.js (2FA pour vanity)
- ❌ Requirement Bun (marche avec Node.js maintenant)

**Ajouté:**
- ✅ Connexion automatique via la page web
- ✅ Ajout auto des tokens dans `API/config.json`
- ✅ Compteur d'utilisateurs réel (plus de chiffres random)
- ✅ Bridge entre le frontend et l'API selfbot
- ✅ Remplacement de `legend.js` par `discord.js-selfbot-v13`

**Optimisé:**
- 🔄 Messages humanisés (pour pas que ça fasse IA)
- 🔄 CSS modulaire avec imports
- 🔄 Viré tous les `console.log`
- 🔄 Nettoyé le code inutile

## 🎯 Comment ça marche

1. Tu te connectes sur la page web avec ton token Discord
2. Le backend chiffre ton token et l'ajoute dans `API/config.json`
3. L'API Stealy charge ton selfbot via un worker thread
4. Tu peux utiliser toutes les commandes du selfbot sur Discord
5. Le compteur affiche le vrai nombre de gens connectés

## ⚠️ Note

Ce projet est à but éducatif. L'utilisation de selfbots Discord peut violer les ToS de Discord. Utilisez à vos risques et périls

---

*Projet original codé par une IA, copié et optimisé par nous*
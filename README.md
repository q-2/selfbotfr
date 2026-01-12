# SelfBot VLS

Système d'authentification moderne pour SelfBot VLS avec interface futuriste

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet:

```env
PORT=3000
HCAPTCHA_SITE_KEY=votre_cle_site_hcaptcha
HCAPTCHA_SECRET_KEY=votre_cle_secrete_hcaptcha
SESSION_SECRET=votre_secret_session
```

## Démarrage

```bash
npm start
```

Ou en mode développement:

```bash
npm run dev
```

## Structure du projet

```
SelfbotFR/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── vortex.js
│       ├── bootloader.js
│       ├── cursor.js
│       └── auth.js
├── routes/
│   └── api.js
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── cursor.ejs
│   │   ├── bootloader.ejs
│   │   └── gates.ejs
│   ├── index.ejs
│   ├── token.ejs
│   └── 404.ejs
├── server.js
├── package.json
└── .env
```

## Fonctionnalités

- Curseur personnalisé animé
- Vortex magnétique de particules
- Boot loader avec logs système
- Animation de portes de transition
- Intégration hCaptcha
- Chiffrement AES-GCM des tokens
- Interface responsive
- Design futuriste cyber-axe

## Technologies

- Express.js
- EJS
- GSAP
- hCaptcha
- Crypto (AES-256-GCM)

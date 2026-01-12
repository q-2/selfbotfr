const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const messageDiv = document.getElementById("message");
const joinBtn = document.getElementById("joinBtn");
const tokenInput = document.getElementById("token");

async function getUserInfo(token) {
  try {
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token invalide ou expiré");
      } else if (response.status === 403) {
        throw new Error("Accès refusé, vérifie ton token");
      } else {
        throw new Error(`Discord API: ${response.status}`);
      }
    }

    const data = await response.json();
    return { userId: data.id, username: data.username };
  } catch (err) {
    if (
      err.message &&
      !err.message.includes("token") &&
      !err.message.includes("Erreur Discord")
    ) {
      throw new Error("Problème de co, vérifie ta connexion");
    }
    throw err;
  }
}

async function encryptTokenClient(token, sessionKeyBase64) {
  const keyBytes = Uint8Array.from(atob(sessionKeyBase64), (c) =>
    c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(token);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoded,
  );
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);
  return {
    data: btoa(String.fromCharCode(...ciphertext)),
    iv: btoa(String.fromCharCode(...iv)),
    tag: btoa(String.fromCharCode(...authTag)),
  };
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = tokenInput.value.trim();

  let captchaResponse = null;
  if (hcaptchaSiteKey) {
    if (!hcaptchaLoaded || !window.hcaptcha) {
      messageDiv.textContent = "Le CAPTCHA charge encore, attends 2 secondes";
      messageDiv.style.color = "#ef4444";
      messageDiv.classList.add("error");
      return;
    }

    captchaResponse = window.hcaptcha.getResponse();
    if (!captchaResponse) {
      messageDiv.textContent = "Fais le CAPTCHA avant de continuer";
      messageDiv.style.color = "#ef4444";
      messageDiv.classList.add("error");
      return;
    }
  }

  loginBtn.disabled = true;
  btnText.innerHTML = "CONNEXION EN COURS";
  try {
    const sessionResponse = await fetch("/api/login/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!sessionResponse.ok) {
      let errorMessage = "Impossible de créer la session";
      try {
        const errorData = await sessionResponse.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {}
      throw new Error(errorMessage);
    }

    const { sessionId, sessionKey } = await sessionResponse.json();
    const encryptedToken = await encryptTokenClient(token, sessionKey);
    const { userId, username } = await getUserInfo(token);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encryptedToken,
        sessionId,
        userId,
        username,
        captchaToken: captchaResponse,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      if (result.success && result.user) {
        const userInfo = result.user;
        const detailedMessage = `✅ T'es connecté\n\n👤 User: ${userInfo.username || "Inconnu"}\n🆔 ID: ${userInfo.id || "N/A"}\n📛 Prefix: ${userInfo.prefix || "."}\n🔐 Niveau: ${userInfo.permLevel || "N/A"}`;
        messageDiv.textContent = detailedMessage;
        messageDiv.style.color = "#22c55e";
        messageDiv.style.whiteSpace = "pre-line";
        messageDiv.classList.remove("error");

        gsap.fromTo(
          ".card",
          { scale: 1, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)" },
          {
            scale: 1.05,
            boxShadow: "0 20px 60px rgba(34, 197, 94, 0.4)",
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
        );

        joinBtn.classList.add("hidden");
      } else {
        messageDiv.textContent = "Demande envoyée, attends qu'un admin valide";
        messageDiv.style.color = "#eab308";
        messageDiv.classList.remove("error");
        joinBtn.classList.add("hidden");

        gsap.fromTo(
          ".card",
          { scale: 1, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)" },
          {
            scale: 1.02,
            boxShadow: "0 20px 60px rgba(234, 179, 8, 0.3)",
            duration: 0.4,
            yoyo: true,
            repeat: 2,
            ease: "power2.inOut",
          },
        );
      }
    } else {
      messageDiv.textContent = result.message || "Connexion ratée";
      messageDiv.style.color = "#ef4444";
      messageDiv.classList.add("error");
    }
  } catch (err) {
    messageDiv.textContent = err.message || "Erreur réseau, réessaye";
    messageDiv.style.color = "#ef4444";
    messageDiv.classList.add("error");

    gsap.fromTo(
      ".card",
      { x: 0 },
      { x: -10, duration: 0.1, yoyo: true, repeat: 5, ease: "power2.inOut" },
    );
  } finally {
    loginBtn.disabled = false;
    btnText.textContent = "Se connecter";
    tokenInput.value = "";
  }
});

let hcaptchaSiteKey = "";
let hcaptchaLoaded = false;

async function loadHcaptchaKey() {
  try {
    const response = await fetch("/api/hcaptcha-key");
    const data = await response.json();
    hcaptchaSiteKey = data.siteKey || "";

    if (hcaptchaSiteKey) {
      const container = document.getElementById("hcaptcha-container");
      if (!container) {
        return;
      }

      let attempts = 0;
      const maxAttempts = 50;

      const checkHcaptcha = setInterval(() => {
        attempts++;
        if (window.hcaptcha && window.hcaptchaLoaded) {
          clearInterval(checkHcaptcha);
          try {
            container.innerHTML = "";
            const widgetId = window.hcaptcha.render(container, {
              sitekey: hcaptchaSiteKey,
              theme: "dark",
            });
            hcaptchaLoaded = true;
          } catch (renderError) {
            container.innerHTML =
              '<p style="color: #ef4444; font-size: 12px;">Le CAPTCHA a pas chargé</p>';
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(checkHcaptcha);
          container.innerHTML =
            '<p style="color: #ef4444; font-size: 12px;">CAPTCHA bloqué, recharge la page</p>';
        }
      }, 100);
    } else {
      const container = document.getElementById("hcaptcha-container");
      if (container) {
        container.style.display = "none";
      }
    }
  } catch (error) {
    const container = document.getElementById("hcaptcha-container");
    if (container) {
      container.style.display = "none";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHcaptchaKey);
} else {
  loadHcaptchaKey();
}

async function updateUserCount() {
  try {
    const response = await fetch("/api/user");
    if (!response.ok) return;
    const data = await response.json();
    document.getElementById("userCount").textContent = data.localCount;
    document.getElementById("totalCount").textContent = data.totalCount;
  } catch (err) {}
}

function joinServer() {
  window.location.href = "https://discord.gg/6c2tFb6ttE";
}

updateUserCount();
setInterval(updateUserCount, 30000);

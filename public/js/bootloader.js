const logs = [
  "KERNEL_INIT_0x88",
  "CHECKING_DLL_INTEGRITY",
  "BYPASSING_GATEWAY",
  "DECRYPTING_VLS_BUFFER",
  "HANDSHAKE_ESTABLISHED",
  "FETCHING_DATA_NODES",
  "UI_RENDERER_ACTIVE",
  "LINK_STABLE",
  "READY",
];

function runBoot() {
  const bar = document.getElementById("load-progress");
  const term = document.getElementById("term-logs");
  const percent = document.getElementById("load-percent");
  let logIdx = 0;

  gsap.to(bar, {
    width: "100%",
    duration: 1,
    ease: "power2.inOut",
    onUpdate: function () {
      const prog = Math.round(this.progress() * 100);
      percent.textContent = prog.toString().padStart(2, "0") + "%";

      if (prog > logIdx * (100 / logs.length) && logIdx < logs.length) {
        const l = document.createElement("div");
        l.className = "term-log";
        l.textContent = `[SYSTEM] : ${logs[logIdx]}`;
        term.prepend(l);
        gsap.from(l, { x: -10, opacity: 0, duration: 0.3 });
        logIdx++;
      }
    },
    onComplete: openGates,
  });
}

function openGates() {
  const tl = gsap.timeline();
  tl.to("#boot-loader", {
    opacity: 0,
    duration: 0.3,
    delay: 0.1,
    onComplete: function () {
      document.getElementById("boot-loader").style.pointerEvents = "none";
    },
  })
    .to("#gate-left", { x: "-100%", duration: 0.8, ease: "power4.inOut" })
    .to(
      "#gate-right",
      { x: "100%", duration: 0.8, ease: "power4.inOut" },
      "-=0.8",
    )
    .to(
      "#app",
      {
        opacity: 1,
        duration: 0.5,
        onComplete: function () {
          const app = document.getElementById("app");
          if (app) {
            app.style.pointerEvents = "auto";
          }

          setTimeout(function () {
            const interactiveElements = document.querySelectorAll(
              "input, button, iframe, #hcaptcha-container, form, .form-group, .axe-btn, .card, .container",
            );
            interactiveElements.forEach((el) => {
              el.style.pointerEvents = "auto";
              if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.style.cursor = "text";
              } else if (el.tagName === "BUTTON" || el.tagName === "A") {
                el.style.cursor = "pointer";
              }
            });
          }, 100);
        },
      },
      "-=0.6",
    );
}

function makeElementsClickable() {
  const interactiveElements = document.querySelectorAll(
    "input, button, iframe, #hcaptcha-container, form, .form-group, .axe-btn, .card, .container, #app",
  );
  interactiveElements.forEach((el) => {
    el.style.pointerEvents = "auto";
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.style.cursor = "text";
    } else if (el.tagName === "BUTTON" || el.tagName === "A") {
      el.style.cursor = "pointer";
    }
  });
}

document.addEventListener("DOMContentLoaded", makeElementsClickable);
setTimeout(makeElementsClickable, 500);
setTimeout(makeElementsClickable, 2000);
setTimeout(makeElementsClickable, 5000);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runBoot);
} else {
  runBoot();
}

function initCursor() {
  const core = document.getElementById("cursor-core");
  const ring = document.getElementById("cursor-ring");
  if (core && ring && typeof gsap !== "undefined") {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    gsap.set("#cursor-core", { x: centerX, y: centerY });
    gsap.set("#cursor-ring", { x: centerX - 22, y: centerY - 22 });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(initCursor, 500);
  });
} else {
  setTimeout(initCursor, 500);
}

document.addEventListener("mousemove", (e) => {
  if (typeof gsap !== "undefined") {
    gsap.to("#cursor-core", { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to("#cursor-ring", {
      x: e.clientX - 22,
      y: e.clientY - 22,
      duration: 0.2,
    });
  }
});

function ripple(e) {
  const r = document.createElement("div");
  r.className = "fixed border border-white/20 rounded-full pointer-events-none";
  r.style.left = e.clientX + "px";
  r.style.top = e.clientY + "px";
  document.body.appendChild(r);
  gsap.fromTo(
    r,
    { width: 0, height: 0, xPercent: -50, yPercent: -50, opacity: 0.5 },
    {
      width: 1000,
      height: 1000,
      opacity: 0,
      duration: 1,
      onComplete: () => r.remove(),
    },
  );
}

function grow(h) {
  gsap.to("#cursor-ring", { scale: h ? 1.4 : 1, duration: 0.3 });
}

function hideCursor() {
  gsap.to("#cursor-core", { opacity: 0, duration: 0.2 });
  gsap.to("#cursor-ring", { opacity: 0, duration: 0.2 });
}

function showCursor() {
  gsap.to("#cursor-core", { opacity: 1, duration: 0.2 });
  gsap.to("#cursor-ring", { opacity: 1, duration: 0.2 });
}

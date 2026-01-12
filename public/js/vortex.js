(function () {
  const canvas = document.getElementById("canvas-vortex");
  const ctx = canvas.getContext("2d");
  let mouse = { x: -100, y: -100 };
  let particles = [];

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 6,
      char: Math.random() > 0.5 ? "1" : "0",
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      op: 0.1,
    }));
  }

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;
      let d = Math.sqrt(dx * dx + dy * dy);
      if (d < 300) {
        let force = (300 - d) / 300;
        p.x += dx * 0.02 * force;
        p.y += dy * 0.02 * force;
        p.op = 0.9 * force + 0.4;
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.op = Math.min(0.4, p.op + 0.005);
      }
      ctx.font = `${p.size}px 'JetBrains Mono'`;
      ctx.fillStyle = `rgba(255, 255, 255, ${p.op})`;
      ctx.fillText(p.char, p.x, p.y);
    });
    requestAnimationFrame(draw);
  }

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  init();
  draw();
  window.addEventListener("resize", init);
})();

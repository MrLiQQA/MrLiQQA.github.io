(function () {
  const defaults = {
    pageTitle: "520 · 给乖乖的情书",
    dateBadge: "5 · 2 · 0",
    tag: "520来信",
    zoomLines: ["5", "2", "0"],
    zoomDurationMs: 2400,
    zoomGapMs: 200,
    heroLine: "我爱你",
    subtitle: "五月二十，谐音是我爱你。把这句话，只说给你听。",
    letterText:
      "乖乖，520 这天我想郑重地说一遍：我爱你。谢谢你愿意走进我的生活，陪我笑、陪我闹，也陪我慢慢长大。愿此后的每个日子，我都能做你最踏实的依靠，而你，永远是我心里最柔软的那一束光。",
    stageHint: "轻触屏幕 · 跳过动画",
    footer: "I Love You · 520 · 岁岁有你",
    restartBtnLabel: "再看一遍",
    typeSpeedMs: 48,
    typeDelayBeforeMs: 1600,
    contentTransitionMs: 700,
  };

  const cfg =
    typeof siteConfig !== "undefined" && siteConfig.love520
      ? Object.assign({}, defaults, siteConfig.love520)
      : defaults;

  document.title = cfg.pageTitle;

  const stageZoom = document.getElementById("stage-zoom");
  const stageContent = document.getElementById("stage-content");
  const zoomText = document.getElementById("zoom-text");
  const zoomStage = document.getElementById("zoom-stage");
  const stageHint = document.getElementById("stage-hint");
  const dateBadge = document.getElementById("date-badge");
  const heroLine = document.getElementById("hero-line");
  const subtitle = document.getElementById("subtitle");
  const letterTag = document.getElementById("letter-tag");
  const letterText = document.getElementById("letter-text");
  const footerText = document.getElementById("footer-text");
  const restartBtn = document.getElementById("restart-btn");
  const letterPanel = document.querySelector(".letter-panel");
  const actionRow = document.querySelector(".action-row");

  stageHint.textContent = cfg.stageHint;
  dateBadge.textContent = cfg.dateBadge;
  heroLine.textContent = cfg.heroLine;
  subtitle.textContent = cfg.subtitle;
  letterTag.textContent = cfg.tag;
  footerText.textContent = cfg.footer;
  restartBtn.textContent = cfg.restartBtnLabel;

  let typeTimer = null;
  let typingRunId = 0;
  let sequenceToken = 0;
  let zoomAborted = false;
  let contentTimers = [];

  function fitZoomFontSize(text) {
    const len = String(text).length;
    const vw = Math.min(window.innerWidth, 900);
    let size;
    if (len <= 1) {
      size = vw * 0.42;
    } else if (len <= 3) {
      size = vw * 0.28;
    } else {
      size = vw * 0.18;
    }
    zoomText.style.fontSize = `${Math.min(size, 220)}px`;
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function waitAnimation(el) {
    return new Promise(function (resolve) {
      function done() {
        el.removeEventListener("animationend", done);
        resolve();
      }
      el.addEventListener("animationend", done, { once: true });
      window.setTimeout(done, (cfg.zoomDurationMs || 2400) + 400);
    });
  }

  function clearTypeTimer() {
    if (typeTimer) {
      window.clearTimeout(typeTimer);
      typeTimer = null;
    }
  }

  function cancelContentTimers() {
    contentTimers.forEach(function (id) {
      window.clearTimeout(id);
    });
    contentTimers = [];
  }

  function scheduleContentTimer(fn, ms) {
    const id = window.setTimeout(fn, ms);
    contentTimers.push(id);
    return id;
  }

  function stopTyping() {
    typingRunId += 1;
    clearTypeTimer();
    letterText.textContent = "";
    letterText.classList.remove("typing");
  }

  function resetDom() {
    cancelContentTimers();
    stopTyping();
    zoomAborted = false;
    sequenceToken += 1;

    zoomText.className = "zoom-text";
    zoomText.textContent = "";
    zoomText.style.removeProperty("--zoom-duration");

    stageZoom.classList.add("stage-active");
    stageZoom.classList.remove("stage-leaving");
    stageZoom.hidden = false;

    stageContent.classList.remove("stage-active");
    stageContent.hidden = true;

    dateBadge.classList.remove("visible");
    heroLine.classList.remove("reveal");
    subtitle.classList.remove("reveal");
    letterPanel.classList.remove("reveal");
    footerText.classList.remove("reveal");
    actionRow.classList.remove("reveal");
  }

  function typeLetter() {
    typingRunId += 1;
    const runId = typingRunId;
    const text = cfg.letterText;
    let i = 0;

    clearTypeTimer();
    letterText.classList.add("typing");
    letterText.textContent = "";

    function step() {
      if (runId !== typingRunId) return;
      if (i >= text.length) {
        letterText.classList.remove("typing");
        return;
      }
      letterText.textContent += text.charAt(i);
      i += 1;
      const delay = cfg.typeSpeedMs + Math.floor(Math.random() * 25);
      typeTimer = window.setTimeout(step, delay);
    }

    step();
  }

  function scheduleTyping() {
    cancelContentTimers();
    scheduleContentTimer(function () {
      typeLetter();
    }, cfg.typeDelayBeforeMs || 1600);
  }

  function revealContentStage() {
    stageZoom.classList.remove("stage-active", "stage-leaving");
    stageZoom.hidden = true;
    stageContent.hidden = false;
    stageContent.classList.add("stage-active");

    heroLine.classList.add("reveal");
    subtitle.classList.add("reveal");
    letterPanel.classList.add("reveal");
    footerText.classList.add("reveal");
    actionRow.classList.add("reveal");
  }

  function showContentStage(token) {
    if (token !== sequenceToken || zoomAborted) return;

    stageZoom.classList.add("stage-leaving");
    stageZoom.classList.remove("stage-active");

    scheduleContentTimer(function () {
      if (token !== sequenceToken || zoomAborted) return;
      revealContentStage();
      scheduleTyping();
    }, cfg.contentTransitionMs || 700);
  }

  async function playZoomLine(text, isLast, token) {
    if (token !== sequenceToken || zoomAborted) return;

    fitZoomFontSize(text);
    zoomText.textContent = text;
    zoomText.className = "zoom-text";
    zoomText.style.setProperty(
      "--zoom-duration",
      `${(cfg.zoomDurationMs || 2400) / 1000}s`
    );

    void zoomText.offsetWidth;
    zoomText.classList.add("is-animating");
    await waitAnimation(zoomText);

    if (token !== sequenceToken || zoomAborted) return;

    if (!isLast) {
      zoomText.classList.remove("is-animating");
      zoomText.classList.add("is-exit");
      await wait(900);
      zoomText.classList.remove("is-exit");
    } else {
      zoomText.classList.remove("is-animating");
      zoomText.classList.add("is-hold");
      dateBadge.classList.add("visible");
      await wait(cfg.zoomGapMs + 600);
    }
  }

  async function runZoomSequence(token) {
    const lines = Array.isArray(cfg.zoomLines) && cfg.zoomLines.length
      ? cfg.zoomLines
      : ["5", "2", "0"];

    for (let i = 0; i < lines.length; i += 1) {
      await playZoomLine(lines[i], i === lines.length - 1, token);
      if (token !== sequenceToken || zoomAborted) return;
      await wait(cfg.zoomGapMs || 200);
    }

    if (token !== sequenceToken || zoomAborted) return;

    zoomText.classList.remove("is-hold");
    zoomText.classList.add("is-exit");
    await wait(800);

    showContentStage(token);
  }

  function skipToContent() {
    if (stageContent.classList.contains("stage-active")) return;

    zoomAborted = true;
    cancelContentTimers();
    stopTyping();
    revealContentStage();
    scheduleTyping();
  }

  function start() {
    resetDom();
    const token = sequenceToken;
    runZoomSequence(token);
  }

  function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = [];
    const count = 36;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i += 1) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2.5,
        vy: 0.12 + Math.random() * 0.28,
        vx: (Math.random() - 0.5) * 0.15,
      });
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(function (d) {
        d.y -= d.vy;
        d.x += d.vx;
        if (d.y < -10) {
          d.y = canvas.height + 10;
          d.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 150, 190, 0.45)";
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }

    frame();
  }

  restartBtn.addEventListener("click", start);

  stageZoom.addEventListener("click", skipToContent);
  zoomStage.addEventListener("click", function (e) {
    e.stopPropagation();
    skipToContent();
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") {
      if (!stageContent.hidden && stageContent.classList.contains("stage-active")) {
        return;
      }
      e.preventDefault();
      skipToContent();
    }
  });

  initParticles();
  start();
})();

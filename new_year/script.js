(function () {
  const fullText =
    "旧岁烟火烬，新元灯火明，执手共赴山海约，岁岁相依，岁岁皆安暖。";

  const letterTextEl = document.getElementById("letter-text");
  const helperTextEl = document.getElementById("helper-text");
  const openBtn = document.getElementById("open-btn");
  const restartBtn = document.getElementById("restart-btn");
  const letterCard = document.getElementById("letter-card");

  let index = 0;
  let timerId = null;
  let isTyping = false;

  function triggerConfetti() {
    const existing = document.querySelector(".confetti-container");
    if (existing) {
      existing.remove();
    }

    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);

    const colors = [
      "#ffd66b",
      "#facc6b",
      "#fecaca",
      "#fb7185",
      "#e11d48",
      "#b91c1c",
    ];
    const pieceCount = 42;

    for (let i = 0; i < pieceCount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.backgroundColor = color;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDuration = `${1.5 + Math.random() * 1}s`;
      piece.style.animationDelay = `${Math.random() * 0.3}s`;
      container.appendChild(piece);
    }

    window.setTimeout(function () {
      container.remove();
    }, 2800);
  }

  function clearTyping() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    isTyping = false;
  }

  function resetState() {
    clearTyping();
    index = 0;
    letterTextEl.textContent = "";
    letterTextEl.classList.remove("glow");
    openBtn.disabled = false;
    openBtn.setAttribute("aria-disabled", "false");
    openBtn.classList.remove("opacity-70", "cursor-not-allowed");
    restartBtn.classList.add("hidden");
    helperTextEl.textContent =
      "轻按「打开信件」，让今年最后一串烟火，为你写下新年的第一句祝福。";
  }

  function typeNextChar() {
    if (!isTyping) return;

    if (index >= fullText.length) {
      isTyping = false;
      openBtn.disabled = true;
      openBtn.setAttribute("aria-disabled", "true");
      openBtn.classList.add("opacity-70", "cursor-not-allowed");
      restartBtn.classList.remove("hidden");
      letterTextEl.classList.add("glow");
      helperTextEl.textContent =
        "愿你在新的一年，心有所向，皆能如愿。点击「重看」，再次打开这封新岁来信。";
      triggerConfetti();
      restartBtn.focus({ preventScroll: true });
      return;
    }

    const currentChar = fullText.charAt(index);
    letterTextEl.textContent += currentChar;
    index += 1;

    const baseDelay = 55;
    const randomExtra = Math.floor(Math.random() * 30);
    const delay = baseDelay + randomExtra;

    timerId = window.setTimeout(typeNextChar, delay);
  }

  function startTyping() {
    clearTyping();
    letterTextEl.textContent = "";
    letterTextEl.classList.remove("glow");
    index = 0;
    isTyping = true;
    helperTextEl.textContent = "烟火正在铺陈字句，请稍候……";

    typeNextChar();
  }

  function playOpenAnimationAndType() {
    if (isTyping) return;

    openBtn.disabled = true;
    openBtn.setAttribute("aria-disabled", "true");
    openBtn.classList.add("opacity-70", "cursor-not-allowed");

    try {
      if (window.anime && typeof window.anime === "function") {
        window.anime({
          targets: "#letter-card",
          scale: [1, 1.04],
          translateY: [0, -10],
          opacity: [0.94, 1],
          duration: 520,
          easing: "easeOutQuad",
          begin: function () {
            letterCard.classList.add("opened");
          },
          complete: function () {
            startTyping();
          },
        });
      } else {
        letterCard.classList.add("opened");
        startTyping();
      }
    } catch (e) {
      letterCard.classList.add("opened");
      startTyping();
    }
  }

  openBtn.addEventListener("click", function () {
    playOpenAnimationAndType();
  });

  restartBtn.addEventListener("click", function () {
    resetState();
    setTimeout(function () {
      playOpenAnimationAndType();
      openBtn.focus({ preventScroll: true });
    }, 100);
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      const target = event.target;
      if (target === openBtn) {
        event.preventDefault();
        playOpenAnimationAndType();
      } else if (target === restartBtn) {
        event.preventDefault();
        restartBtn.click();
      }
    }
  });

  resetState();
})();

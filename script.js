const form = document.getElementById("matchForm");
const input1 = document.getElementById("name1");
const input2 = document.getElementById("name2");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const heartWrap = document.getElementById("heartWrap");
const fillRect = document.getElementById("fillRect");
const percentEl = document.getElementById("percent");
const namesEl = document.getElementById("names");
const messageEl = document.getElementById("message");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Result messages by score range
function getMessage(score) {
  if (score >= 90) return "A perfect match. Start planning the wedding!";
  if (score >= 70) return "Great chemistry. This one has real promise.";
  if (score >= 50) return "A solid match. Give it some time.";
  if (score >= 30) return "Some sparks, but it will take effort.";
  return "Not a natural fit, but opposites sometimes attract.";
}

function showError(message, badInputs) {
  errorEl.textContent = message;
  [input1, input2].forEach(i => i.setAttribute("aria-invalid", "false"));
  badInputs.forEach(i => i.setAttribute("aria-invalid", "true"));
  if (badInputs[0]) badInputs[0].focus();
}

function clearError() {
  errorEl.textContent = "";
  [input1, input2].forEach(i => i.setAttribute("aria-invalid", "false"));
}

// Count the number up from 0 to the final score
function countUp(target) {
  if (reduceMotion) { percentEl.textContent = target + "%"; return; }
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    percentEl.textContent = Math.round(target * progress) + "%";
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function spawnHearts() {
  if (reduceMotion) return;
  for (let i = 0; i < 8; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = "\u2764";
    h.style.left = 10 + Math.random() * 80 + "%";
    h.style.animationDelay = Math.random() * 0.6 + "s";
    h.style.color = "#e8325f";
    heartWrap.appendChild(h);
    setTimeout(() => h.remove(), 2400);
  }
}

function showResult(name1, name2, score) {
  // Colour changes with the score: blue (low) -> pink/red (high)
  const hue = 220 + (score / 100) * 130;        // 220 (blue) -> 350 (red-pink)
  fillRect.setAttribute("fill", `hsl(${hue}, 85%, 55%)`);

  namesEl.textContent = `${name1} + ${name2}`;
  messageEl.textContent = getMessage(score);
  resultEl.classList.add("show");

  // restart pop animation
  heartWrap.classList.remove("pop");
  void heartWrap.offsetWidth;
  heartWrap.classList.add("pop");

  // reset fill, then raise it to the score level
  fillRect.setAttribute("y", 92);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fillRect.setAttribute("y", 92 - (score / 100) * 92);
  }));

  countUp(score);
  if (score >= 70) spawnHearts();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name1 = input1.value.trim();
  const name2 = input2.value.trim();

  // Validation
  if (!name1 && !name2) { showError("Please enter both names.", [input1, input2]); return; }
  if (!name1) { showError("Please enter the first name.", [input1]); return; }
  if (!name2) { showError("Please enter the second name.", [input2]); return; }
  if (name1.toLowerCase() === name2.toLowerCase()) {
    showError("Please enter two different names.", [input2]);
    return;
  }

  clearError();
  const score = Math.floor(Math.random() * 101);  // random 0-100
  showResult(name1, name2, score);
});

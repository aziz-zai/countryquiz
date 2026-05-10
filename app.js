// ─── Game state ───────────────────────────────────────────
const state = {
  currentFactIndex: 0,
  maxPoints: 3,
  gameOver: false,
};

// ─── DOM refs ─────────────────────────────────────────────
const scoreDisplay    = document.getElementById("score-display");
const factsList       = document.getElementById("facts-list");
const guessInput      = document.getElementById("guess-input");
const guessBtn        = document.getElementById("guess-btn");
const hintBtn         = document.getElementById("hint-btn");
const resultBox       = document.getElementById("result-box");
const suggestionsList = document.getElementById("suggestions-list");

// ─── Autocomplete state ───────────────────────────────────
let activeIndex = -1;

// ─── Init ─────────────────────────────────────────────────
function init() {
  buildScoreDots();
  revealFact(0);
  setupAutocomplete();

  guessBtn.addEventListener("click", handleGuess);
  hintBtn.addEventListener("click", handleHint);
}

// ═══════════════════════════════════════════════════════════
// SCORE DISPLAY
// ═══════════════════════════════════════════════════════════

function buildScoreDots() {
  // Dots — one per fact
  const dotsWrapper = document.createElement("div");
  dotsWrapper.id = "score-dots";
  dotsWrapper.className = "flex items-center gap-1.5";

  for (let i = 0; i < quizData.facts.length; i++) {
    const dot = document.createElement("span");
    dot.className = "score-dot";
    dotsWrapper.appendChild(dot);
  }

  // Point label
  const label = document.createElement("span");
  label.id = "score-label";
  label.className = "text-xs font-semibold text-violet-400 tracking-wide uppercase";
  label.textContent = `${state.maxPoints} Pkt`;

  scoreDisplay.appendChild(dotsWrapper);
  scoreDisplay.appendChild(label);
}

function updateScoreDisplay() {
  document.querySelectorAll(".score-dot").forEach((dot, i) => {
    dot.classList.toggle("used", i >= state.maxPoints);
  });
  const label = document.getElementById("score-label");
  if (label) label.textContent = `${state.maxPoints} Pkt`;
}

// ═══════════════════════════════════════════════════════════
// AUTOCOMPLETE
// ═══════════════════════════════════════════════════════════

function setupAutocomplete() {
  guessInput.addEventListener("input", onAutocompleteInput);
  guessInput.addEventListener("keydown", onAutocompleteKeydown);

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete-wrapper")) hideSuggestions();
  });
}

function onAutocompleteInput() {
  const query = guessInput.value.trim().toLowerCase();
  if (!query) { hideSuggestions(); return; }

  // "starts with" ranks above "contains"; then alphabetical
  const matches = countries
    .filter(c => c.toLowerCase().includes(query))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query);
      const bStarts = b.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return  1;
      return a.localeCompare("de");
    })
    .slice(0, 8);

  renderSuggestions(matches, query);
}

function renderSuggestions(matches, query) {
  suggestionsList.innerHTML = "";
  activeIndex = -1;

  if (matches.length === 0) { hideSuggestions(); return; }

  matches.forEach(country => {
    const li = document.createElement("li");
    li.innerHTML = highlightMatch(country, query);

    // mousedown fires before blur so the click registers before the list closes
    li.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectCountry(country);
    });

    suggestionsList.appendChild(li);
  });

  suggestionsList.classList.remove("hidden");
}

function highlightMatch(country, query) {
  const idx = country.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return country;
  return (
    country.slice(0, idx) +
    `<mark>${country.slice(idx, idx + query.length)}</mark>` +
    country.slice(idx + query.length)
  );
}

function hideSuggestions() {
  suggestionsList.classList.add("hidden");
  suggestionsList.innerHTML = "";
  activeIndex = -1;
}

function selectCountry(country) {
  guessInput.value = country;
  hideSuggestions();
  guessInput.focus();
}

function onAutocompleteKeydown(e) {
  const items  = suggestionsList.querySelectorAll("li");
  const isOpen = !suggestionsList.classList.contains("hidden");

  if (e.key === "ArrowDown" && isOpen) {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, items.length - 1);
    highlightActive(items);
  } else if (e.key === "ArrowUp" && isOpen) {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, -1);
    highlightActive(items);
  } else if (e.key === "Enter") {
    if (isOpen && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      selectCountry(items[activeIndex].textContent);
    } else {
      handleGuess();
    }
  } else if (e.key === "Escape") {
    hideSuggestions();
  }
}

function highlightActive(items) {
  items.forEach((item, i) => item.classList.toggle("active", i === activeIndex));
}

// ═══════════════════════════════════════════════════════════
// GAME LOGIC
// ═══════════════════════════════════════════════════════════

function revealFact(index) {
  const li    = document.createElement("li");
  li.className = "fact-item";

  const badge = document.createElement("span");
  badge.className = "fact-badge";
  badge.textContent = index + 1;

  const text  = document.createElement("span");
  text.className = "fact-text";
  text.textContent = quizData.facts[index];

  li.appendChild(badge);
  li.appendChild(text);
  factsList.appendChild(li);
}

function handleGuess() {
  if (state.gameOver) return;

  const guess  = guessInput.value.trim().toLowerCase();
  const answer = quizData.country.toLowerCase();

  if (!guess) return;

  hideSuggestions();

  if (guess === answer) {
    endGame(true);
    return;
  }

  shakeInput();
  advanceHint();
}

function handleHint() {
  if (state.gameOver) return;
  advanceHint();
}

function advanceHint() {
  const nextIndex = state.currentFactIndex + 1;

  if (nextIndex < quizData.facts.length) {
    state.currentFactIndex = nextIndex;
    state.maxPoints = Math.max(1, quizData.facts.length - nextIndex);
    revealFact(nextIndex);
    updateScoreDisplay();
    guessInput.value = "";
    guessInput.focus();

    if (state.currentFactIndex >= quizData.facts.length - 1) {
      hintBtn.disabled = true;
    }
  } else {
    endGame(false);
  }
}

function endGame(won) {
  state.gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled   = true;
  hintBtn.disabled    = true;
  hideSuggestions();

  resultBox.className = won
    ? "mt-5 p-4 rounded-xl text-sm font-medium leading-relaxed result-win"
    : "mt-5 p-4 rounded-xl text-sm font-medium leading-relaxed result-loss";

  resultBox.textContent = won
    ? `🎉 Richtig! Die Antwort war ${quizData.country}. Du hast ${state.maxPoints} Punkt${state.maxPoints !== 1 ? "e" : ""} erreicht!`
    : `😞 Leider falsch. Das gesuchte Land war: ${quizData.country}.`;
}

function shakeInput() {
  guessInput.classList.add("shake");
  guessInput.addEventListener("animationend", () => {
    guessInput.classList.remove("shake");
  }, { once: true });
}

// ─── Start ────────────────────────────────────────────────
init();

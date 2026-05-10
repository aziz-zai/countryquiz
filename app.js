// ─── Game state ───────────────────────────────────────────────
const state = {
  categoryIndices: {},
  maxPoints: 0,
  gameOver: false,
};

// ─── DOM refs ─────────────────────────────────────────────────
const scoreDisplay      = document.getElementById("score-display");
const factsList         = document.getElementById("facts-list");
const guessInput        = document.getElementById("guess-input");
const guessBtn          = document.getElementById("guess-btn");
const hintBtn           = document.getElementById("hint-btn");
const insultBox         = document.getElementById("insult-box");
const categoryPicker    = document.getElementById("category-picker");
const categoryGrid      = document.getElementById("category-grid");
const cancelCategoryBtn = document.getElementById("cancel-category-btn");
const resultBox         = document.getElementById("result-box");
const suggestionsList   = document.getElementById("suggestions-list");
const winModal          = document.getElementById("win-modal");
const winFlags          = document.getElementById("win-flags");
const winCountryName    = document.getElementById("win-country-name");
const winScoreText      = document.getElementById("win-score-text");
const winWikiLink       = document.getElementById("win-wiki-link");
const winCloseBtn       = document.getElementById("win-close-btn");

// ─── Autocomplete state ──────────────────────────────────────
let activeIndex = -1;

// ─── Insult messages ─────────────────────────────────────────
const insults = [
  g => `${g}? Ernsthaft? Bist nicht der Hellste, oder?`,
  g => `${g}?? Schule – ist dir das ein Begriff?`,
  g => `Ach, ${g}. Mutig. Falsch, aber mutig.`,
  g => `${g}? Wow. Einfach... wow. Ich bin sprachlos.`,
  g => `Ja super Tipp. ${g}. Dein Geographielehrer weint gerade.`,
  g => `${g}?! Das war dein Tipp – und du stehst dazu?`,
  g => `Keine Sorge, ${g} ist auch ein schönes Land. Nur leider das falsche.`,
  g => `${g}. Ich weine innerlich für dich.`,
  g => `Bist du sicher mit ${g}? Ganz sicher? ... Falsch.`,
  g => `${g}? Nicht mal annähernd. Wirklich.`,
  g => `${g}?? Hat Google heute Urlaub oder was?`,
  g => `${g}. Ich frage mich ernsthaft, was da oben vorgeht.`,
  g => `Aha, ${g}. Da hat jemand im Unterricht nicht aufgepasst.`,
  g => `${g}? Das war ein Tipp, keine Aussage über deinen IQ. Oder?`,
  g => `${g}... Interessante Wahl. Falsch, aber interessant.`,
  g => `${g}?! Ich hab Pflanzen, die geographisch besser orientiert sind.`,
  g => `${g}. Tief durchatmen. Nochmal nachdenken. Dann wieder falsch liegen.`,
  g => `Lass mich raten – du warst in Geographie krank? Immer? Jahrelang?`,
];

let insultTimeout = null;

// ─── Helpers ─────────────────────────────────────────────────
function totalHintCount() {
  return Object.values(quizData.hints).reduce((s, cat) => s + cat.facts.length, 0);
}

function anyHintsRemain() {
  return Object.entries(quizData.hints).some(
    ([key, cat]) => state.categoryIndices[key] < cat.facts.length
  );
}

// ─── Init ────────────────────────────────────────────────────
function init() {
  Object.keys(quizData.hints).forEach(key => {
    state.categoryIndices[key] = 0;
  });
  state.maxPoints = totalHintCount();

  buildScoreDots();
  setupAutocomplete();

  guessBtn.addEventListener("click", handleGuess);
  hintBtn.addEventListener("click", openPicker);
  cancelCategoryBtn.addEventListener("click", closePicker);
  winCloseBtn.addEventListener("click", closeWinModal);
}

// ═══════════════════════════════════════════════════════════════
// SCORE DISPLAY
// ═══════════════════════════════════════════════════════════════

function buildScoreDots() {
  const dotsWrapper = document.createElement("div");
  dotsWrapper.id = "score-dots";
  dotsWrapper.className = "flex items-center gap-1.5";

  // One dot per category
  Object.keys(quizData.hints).forEach(key => {
    const dot = document.createElement("span");
    dot.className = "score-dot";
    dot.dataset.category = key;
    dotsWrapper.appendChild(dot);
  });

  const label = document.createElement("span");
  label.id = "score-label";
  label.className = "text-xs font-semibold text-violet-400 tracking-wide uppercase";
  label.textContent = `${state.maxPoints} Pkt`;

  scoreDisplay.appendChild(dotsWrapper);
  scoreDisplay.appendChild(label);
}

function updateScoreDisplay() {
  // Dot turns grey when all hints in its category are exhausted
  document.querySelectorAll(".score-dot[data-category]").forEach(dot => {
    const key = dot.dataset.category;
    const cat = quizData.hints[key];
    dot.classList.toggle("used", state.categoryIndices[key] >= cat.facts.length);
  });
  const label = document.getElementById("score-label");
  if (label) label.textContent = `${state.maxPoints} Pkt`;
}

// ═══════════════════════════════════════════════════════════════
// AUTOCOMPLETE
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// CATEGORY PICKER
// ═══════════════════════════════════════════════════════════════

function openPicker() {
  if (state.gameOver) return;
  hintBtn.classList.add("hidden");
  categoryPicker.classList.remove("hidden");
  renderCategoryPicker();
}

function closePicker() {
  categoryPicker.classList.add("hidden");
  hintBtn.classList.remove("hidden");
}

function renderCategoryPicker() {
  categoryGrid.innerHTML = "";

  Object.entries(quizData.hints).forEach(([key, cat]) => {
    const remaining = cat.facts.length - state.categoryIndices[key];
    const exhausted = remaining === 0;

    const btn = document.createElement("button");
    btn.className = exhausted ? "category-btn exhausted" : "category-btn";
    btn.disabled = exhausted;
    btn.innerHTML = `
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-label">${cat.label}</span>
      <span class="cat-remaining">${remaining} Hinweis${remaining !== 1 ? "e" : ""} übrig</span>
    `;
    btn.addEventListener("click", () => handleCategorySelect(key));
    categoryGrid.appendChild(btn);
  });
}

function handleCategorySelect(key) {
  const cat = quizData.hints[key];
  const idx = state.categoryIndices[key];

  if (idx >= cat.facts.length) return;

  revealHint(key, idx);
  state.categoryIndices[key]++;
  state.maxPoints = Math.max(1, state.maxPoints - 1);
  updateScoreDisplay();

  closePicker();

  if (!anyHintsRemain()) {
    hintBtn.disabled = true;
  }

  guessInput.value = "";
  guessInput.focus();
}

// ═══════════════════════════════════════════════════════════════
// GAME LOGIC
// ═══════════════════════════════════════════════════════════════

function revealHint(categoryKey, hintIndex) {
  const cat = quizData.hints[categoryKey];

  const li = document.createElement("li");
  li.className = "fact-item";

  const badge = document.createElement("span");
  badge.className = "fact-badge";
  badge.textContent = cat.icon;

  const content = document.createElement("div");
  content.className = "flex-1 min-w-0";

  const catLabel = document.createElement("span");
  catLabel.className = "fact-cat-label";
  catLabel.textContent = cat.label;

  const text = document.createElement("span");
  text.className = "fact-text block";
  text.textContent = cat.facts[hintIndex];

  content.appendChild(catLabel);
  content.appendChild(text);
  li.appendChild(badge);
  li.appendChild(content);
  factsList.appendChild(li);
}

function handleGuess() {
  if (state.gameOver) return;

  const rawGuess = guessInput.value.trim();
  const guess    = rawGuess.toLowerCase();
  const answer   = quizData.country.toLowerCase();

  if (!guess) return;

  hideSuggestions();

  if (guess === answer) {
    endGame(true);
    return;
  }

  showInsult(rawGuess);
  shakeInput();

  // Wrong guess → open category picker if hints remain
  if (anyHintsRemain() && !hintBtn.disabled) {
    openPicker();
  }
}

function showInsult(rawGuess) {
  const display = rawGuess.charAt(0).toUpperCase() + rawGuess.slice(1);
  const fn = insults[Math.floor(Math.random() * insults.length)];
  insultBox.textContent = fn(display);
  insultBox.classList.remove("hidden");

  clearTimeout(insultTimeout);
  insultTimeout = setTimeout(() => insultBox.classList.add("hidden"), 5000);
}

function endGame(won) {
  state.gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled   = true;
  hintBtn.disabled    = true;
  categoryPicker.classList.add("hidden");
  insultBox.classList.add("hidden");
  clearTimeout(insultTimeout);
  hideSuggestions();

  if (won) {
    showWinModal();
  } else {
    resultBox.className = "mt-5 p-4 rounded-xl text-sm font-medium leading-relaxed result-loss";
    resultBox.textContent = `😞 Leider falsch. Das gesuchte Land war: ${quizData.country}.`;
  }
}

function showWinModal() {
  winFlags.textContent = (quizData.flag || "🏳️").repeat(5);
  winCountryName.textContent = quizData.country;
  winScoreText.textContent = `Du hast ${state.maxPoints} Punkt${state.maxPoints !== 1 ? "e" : ""} erreicht!`;
  winWikiLink.href = quizData.wikiPage || `https://de.wikipedia.org/wiki/${encodeURIComponent(quizData.country)}`;
  winWikiLink.textContent = `Mehr über die ${quizData.country} erfahren →`;

  winModal.classList.remove("hidden");
  launchConfetti();
}

function closeWinModal() {
  winModal.classList.add("hidden");
  resultBox.className = "mt-5 p-4 rounded-xl text-sm font-medium leading-relaxed result-win";
  resultBox.textContent = `🎉 Richtig! Die Antwort war ${quizData.country}. Du hast ${state.maxPoints} Punkt${state.maxPoints !== 1 ? "e" : ""} erreicht!`;
}

function launchConfetti() {
  // Netherlands flag colors: red, white, blue
  const colors = ["#ae2029", "#ffffff", "#21468b"];
  const end = Date.now() + 3500;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 58,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 58,
      origin: { x: 1, y: 0.6 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function shakeInput() {
  guessInput.classList.add("shake");
  guessInput.addEventListener("animationend", () => {
    guessInput.classList.remove("shake");
  }, { once: true });
}

// ─── Start ────────────────────────────────────────────────────
init();

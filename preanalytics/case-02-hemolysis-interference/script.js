const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const viewedSections = new Set();

const scores = {
  cases: { correct: 0, total: 0 },
  quiz: { correct: 0, total: 0 },
};

document.querySelectorAll(".question-block").forEach((block) => {
  const group = block.dataset.group;
  if (scores[group]) {
    scores[group].total += 1;
  }
});

updateScores();
updateProgress();

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      viewedSections.add(entry.target.id);
      updateProgress();

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  { rootMargin: "-42% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll(".question-block").forEach((block) => {
  const buttons = Array.from(block.querySelectorAll(".answers button"));
  const feedback = block.querySelector(".feedback");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (block.dataset.answered === "true") return;

      const isCorrect = button.dataset.correct === "true";
      const group = block.dataset.group;
      const correctButton = buttons.find((item) => item.dataset.correct === "true");

      block.dataset.answered = "true";
      button.classList.add(isCorrect ? "correct" : "incorrect");
      correctButton?.classList.add("correct");

      buttons.forEach((item) => {
        item.disabled = true;
      });

      feedback.textContent = button.dataset.explanation;
      feedback.classList.add(isCorrect ? "correct" : "incorrect");
      feedback.classList.remove(isCorrect ? "incorrect" : "correct");

      if (scores[group]) {
        if (isCorrect) scores[group].correct += 1;
        updateScores();
      }
    });
  });
});

document.querySelectorAll(".next-action").forEach((button) => {
  button.addEventListener("click", () => {
    const feedback = document.querySelector("#algorithm-feedback");
    if (!feedback) return;
    feedback.textContent = button.dataset.message;
  });
});

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const card = button.closest(".script-card");
    const text = card?.querySelector(".template-text")?.textContent?.trim();
    const status = document.querySelector("#copy-status");
    if (!text || !status) return;

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied template to clipboard.";
    } catch {
      status.textContent = "Copy was not available in this browser. Select the template text manually.";
    }
  });
});

document.querySelector("#reset-cases")?.addEventListener("click", () => {
  resetGroup("cases");
});

document.querySelector("#reset-quiz")?.addEventListener("click", () => {
  resetGroup("quiz");
});

function resetGroup(group) {
  document.querySelectorAll(`.question-block[data-group="${group}"]`).forEach((block) => {
    block.dataset.answered = "false";
    block.querySelectorAll(".answers button").forEach((button) => {
      button.disabled = false;
      button.classList.remove("correct", "incorrect");
    });

    const feedback = block.querySelector(".feedback");
    feedback.textContent = "";
    feedback.classList.remove("correct", "incorrect");
  });

  if (scores[group]) {
    scores[group].correct = 0;
    updateScores();
  }
}

function updateScores() {
  setText("#case-score", scores.cases.correct);
  setText("#case-total", scores.cases.total);
  setText("#quiz-score", scores.quiz.correct);
  setText("#quiz-total", scores.quiz.total);
}

function updateProgress() {
  const total = sections.length;
  const count = viewedSections.size;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  setText("#progress-count", count);

  const bar = document.querySelector("#progress-bar");
  if (bar) {
    bar.style.width = `${percent}%`;
  }
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = String(value);
}

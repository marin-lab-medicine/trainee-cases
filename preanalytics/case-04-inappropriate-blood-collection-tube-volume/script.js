const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const questionBlocks = Array.from(document.querySelectorAll(".question-block"));
const totalScoreEl = document.querySelector("#total-score");
const quizScoreEl = document.querySelector("#quiz-score");
const resetButton = document.querySelector("#reset-scores");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const markCompleteButton = document.querySelector("#mark-complete");
const caseTabs = Array.from(document.querySelectorAll(".case-tab"));
const casePanels = Array.from(document.querySelectorAll("[data-case-panel]"));

const storageKey = "case4InappropriateFillingProgress";
const answeredQuestions = new Map();
const completedSections = new Set();
const completedCases = new Set();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    (saved.sections || []).forEach((id) => completedSections.add(id));
    (saved.cases || []).forEach((id) => completedCases.add(id));
    (saved.questions || []).forEach((entry) => {
      answeredQuestions.set(entry.id, { points: entry.points, isCorrect: entry.isCorrect });
    });
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveState() {
  const questions = Array.from(answeredQuestions.entries()).map(([id, result]) => ({
    id,
    points: result.points,
    isCorrect: result.isCorrect
  }));

  localStorage.setItem(storageKey, JSON.stringify({
    sections: Array.from(completedSections),
    cases: Array.from(completedCases),
    questions
  }));
}

function updateScores() {
  const totalAvailable = questionBlocks.reduce((sum, block) => sum + Number(block.dataset.points || 0), 0);
  const totalEarned = Array.from(answeredQuestions.values()).reduce((sum, result) => sum + result.points, 0);

  const quizBlocks = questionBlocks.filter((block) => block.classList.contains("quiz-question"));
  const quizAvailable = quizBlocks.reduce((sum, block) => sum + Number(block.dataset.points || 0), 0);
  const quizEarned = quizBlocks.reduce((sum, block) => {
    const result = answeredQuestions.get(block.dataset.questionId);
    return sum + (result ? result.points : 0);
  }, 0);

  totalScoreEl.textContent = `${totalEarned} / ${totalAvailable}`;
  quizScoreEl.textContent = `${quizEarned} / ${quizAvailable}`;
}

function updateProgress() {
  const sectionWeight = 70;
  const caseWeight = 15;
  const questionWeight = 15;
  const caseCount = 3;

  const sectionProgress = sections.length ? completedSections.size / sections.length : 0;
  const caseProgress = caseCount ? completedCases.size / caseCount : 0;
  const questionProgress = questionBlocks.length ? answeredQuestions.size / questionBlocks.length : 0;
  const percent = Math.round((sectionProgress * sectionWeight) + (caseProgress * caseWeight) + (questionProgress * questionWeight));

  progressLabel.textContent = `${Math.min(percent, 100)}%`;
  progressBar.style.width = `${Math.min(percent, 100)}%`;
}

function setFeedback(block, button) {
  const isCorrect = button.dataset.correct === "true";
  const points = isCorrect ? Number(block.dataset.points || 0) : 0;
  const questionId = block.dataset.questionId;
  const feedback = block.querySelector(".feedback");
  const buttons = Array.from(block.querySelectorAll(".answer-list button"));

  answeredQuestions.set(questionId, { points, isCorrect });

  buttons.forEach((answerButton) => {
    answerButton.disabled = true;
    if (answerButton.dataset.correct === "true") {
      answerButton.classList.add("correct");
    }
  });

  button.classList.add(isCorrect ? "correct" : "incorrect");
  feedback.classList.add(isCorrect ? "correct" : "incorrect");
  feedback.textContent = `${isCorrect ? "Correct." : "Not quite."} ${button.dataset.explanation}`;

  updateScores();
  updateProgress();
  saveState();
}

function restoreAnsweredQuestions() {
  questionBlocks.forEach((block) => {
    const result = answeredQuestions.get(block.dataset.questionId);
    if (!result) return;

    const feedback = block.querySelector(".feedback");
    const buttons = Array.from(block.querySelectorAll(".answer-list button"));

    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      }
    });

    feedback.classList.add(result.isCorrect ? "correct" : "incorrect");
    feedback.textContent = result.isCorrect ? "Correct. Previously answered correctly." : "Previously answered. Reset questions to try again.";
  });
}

function resetScores() {
  answeredQuestions.clear();

  questionBlocks.forEach((block) => {
    const feedback = block.querySelector(".feedback");
    const buttons = Array.from(block.querySelectorAll(".answer-list button"));

    feedback.textContent = "";
    feedback.classList.remove("correct", "incorrect");
    buttons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("correct", "incorrect");
    });
  });

  updateScores();
  updateProgress();
  saveState();
}

function updateActiveNavigation() {
  const scrollPosition = window.scrollY + 120;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    const isActive = section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition;
    link.classList.toggle("active", isActive);
  });
}

function markSectionComplete(id) {
  if (!id || completedSections.has(id)) return;
  completedSections.add(id);
  updateProgress();
  saveState();
}

function switchCase(targetId) {
  caseTabs.forEach((tab) => {
    const isActive = tab.dataset.caseTarget === targetId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  casePanels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

function handleCaseChoice(button) {
  const caseBlock = button.closest(".branching-case");
  const caseId = caseBlock.dataset.caseId;
  const quality = button.dataset.quality;
  const feedback = caseBlock.querySelector(".case-feedback");
  const buttons = Array.from(caseBlock.querySelectorAll(".choice-grid button"));

  buttons.forEach((choice) => {
    choice.classList.remove("best", "partial", "poor");
  });

  button.classList.add(quality);
  feedback.classList.remove("best", "partial", "poor");
  feedback.classList.add(quality);
  feedback.textContent = button.dataset.feedback;

  completedCases.add(caseId);
  updateProgress();
  saveState();
}

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

questionBlocks.forEach((block) => {
  block.querySelectorAll(".answer-list button").forEach((button) => {
    button.addEventListener("click", () => setFeedback(block, button));
  });
});

caseTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchCase(tab.dataset.caseTarget));
});

document.querySelectorAll(".choice-grid button").forEach((button) => {
  button.addEventListener("click", () => handleCaseChoice(button));
});

resetButton.addEventListener("click", resetScores);

if (markCompleteButton) {
  markCompleteButton.addEventListener("click", () => {
    sections.forEach((section) => completedSections.add(section.id));
    updateProgress();
    saveState();
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      markSectionComplete(entry.target.id);
    }
  });
}, { threshold: 0.55 });

sections.forEach((section) => observer.observe(section));
window.addEventListener("scroll", updateActiveNavigation);

loadState();
restoreAnsweredQuestions();
updateScores();
updateProgress();
updateActiveNavigation();

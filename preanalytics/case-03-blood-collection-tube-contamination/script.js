const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const questionBlocks = Array.from(document.querySelectorAll(".question-block"));
const totalScoreEl = document.querySelector("#total-score");
const quizScoreEl = document.querySelector("#quiz-score");
const resetButton = document.querySelector("#reset-scores");

const answeredQuestions = new Map();

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

resetButton.addEventListener("click", resetScores);
window.addEventListener("scroll", updateActiveNavigation);

updateScores();
updateActiveNavigation();

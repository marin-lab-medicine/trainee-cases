const methods = [
  {
    name: "PT, aPTT, and Platelet Count",
    question: "Which part of hemostasis is initially abnormal?",
    useful: "At the start of a bleeding consultation.",
    limitation: "Screening tests localize the problem but rarely provide the final diagnosis.",
    rationale: "Normal PT and platelet count with isolated prolonged aPTT focuses the differential on intrinsic pathway factor deficiency, inhibitor, lupus anticoagulant, or contact factor abnormality."
  },
  {
    name: "Mixing Study",
    question: "Deficiency or inhibitor pattern?",
    useful: "After isolated prolonged aPTT with normal PT and platelets.",
    limitation: "It points toward a category, not a single diagnosis.",
    rationale: "Failure to correct supports an inhibitor pattern, including lupus anticoagulant or a specific factor inhibitor."
  },
  {
    name: "LAC-Sensitive aPTT",
    question: "Is a phospholipid-dependent inhibitor present?",
    useful: "When the mixing study suggests inhibitor and the clinical context is confusing.",
    limitation: "LAC usually does not explain bleeding by itself.",
    rationale: "A positive result can explain clot-based assay interference, but it should not end the workup when the patient is bleeding."
  },
  {
    name: "Chromogenic FVIII",
    question: "Is FVIII truly low despite LAC interference risk?",
    useful: "When one-stage FVIII is very low in a patient with lupus anticoagulant.",
    limitation: "It clarifies FVIII activity but does not directly identify why FVIII is low.",
    rationale: "Chromogenic FVIII is less susceptible to lupus anticoagulant interference than one-stage clot-based FVIII assays."
  },
  {
    name: "vWF Antigen and Activity",
    question: "Is FVIII low because vWF is absent or dysfunctional?",
    useful: "When bleeding symptoms and very low FVIII do not fit LAC alone.",
    limitation: "Activity and antigen still need clinical correlation and sometimes multimer analysis.",
    rationale: "Absent vWF antigen and activity shift concern toward severe vWF deficiency or acquired von Willebrand syndrome."
  },
  {
    name: "vWF Multimers",
    question: "Are vWF multimers present?",
    useful: "When vWF antigen and activity are profoundly reduced or discordant results exist.",
    limitation: "Methodology and gel review matter when outside results conflict.",
    rationale: "Absent multimers at the home institution helped support type 3 acquired von Willebrand syndrome."
  }
];

const caseSteps = [
  {
    title: "Module 1: The Consult",
    findings: ["77-year-old woman", "No prior bleeding disorder", "New bruising and gum bleeding", "PT normal, aPTT prolonged, platelets normal"],
    question: "What belongs in the initial differential diagnosis?",
    type: "multi",
    answers: ["Factor VIII deficiency", "Factor IX deficiency", "Lupus anticoagulant", "Acquired inhibitor", "Contact factor deficiency", "Specimen issue"],
    correct: [0, 1, 2, 3, 4, 5],
    explanation: "All are reasonable early considerations. A laboratory director should start broadly and include specimen quality before narrowing the differential."
  },
  {
    title: "Module 2: The Mixing Study",
    findings: ["Mixing study does not correct", "PT remains normal", "Bleeding symptoms persist"],
    question: "What does this result suggest?",
    type: "single",
    answers: ["Factor deficiency", "Inhibitor", "Liver disease", "DIC"],
    correct: [1],
    explanation: "Failure to correct after mixing supports an inhibitor pattern. The next task is to decide whether this is LAC, a specific factor inhibitor, or both."
  },
  {
    title: "Module 3: LAC Workup",
    findings: ["dRVVT negative", "LAC-sensitive aPTT positive", "Anticardiolipin IgM positive"],
    question: "Which statement is most accurate?",
    type: "single",
    answers: ["LAC explains all findings", "LAC causes bleeding", "LAC may interfere with coagulation testing", "LAC confirms APS"],
    correct: [2],
    explanation: "LAC can interfere with phospholipid-dependent assays. It does not automatically explain bleeding or establish antiphospholipid syndrome."
  },
  {
    title: "Module 4: Unexpected FVIII",
    findings: ["FVIII activity is less than 3%", "LAC is present", "The patient is bleeding"],
    question: "What diagnosis is most concerning at this point?",
    type: "single",
    answers: ["Hemophilia A", "Acquired FVIII inhibitor", "Assay interference", "vWF disorder"],
    correct: [1],
    explanation: "A new severe FVIII reduction in an older bleeding patient is alarming for acquired FVIII inhibitor, although interference and vWF-related disease still need evaluation."
  },
  {
    title: "Module 5: Clot-Based vs Chromogenic",
    findings: ["Clot-based FVIII is very low", "Chromogenic FVIII is also very low"],
    question: "Why is the chromogenic assay valuable?",
    type: "single",
    answers: ["Less affected by lupus anticoagulant", "More affected by lupus anticoagulant", "Measures antigen", "Detects antibodies"],
    correct: [0],
    explanation: "Chromogenic FVIII helps evaluate whether a low one-stage FVIII result is merely LAC interference. Here, the low result persists."
  },
  {
    title: "Module 6: The vWF Puzzle",
    findings: ["vWF antigen undetectable", "vWF activity undetectable", "FVIII remains low"],
    question: "Which explanation is most likely?",
    type: "single",
    answers: ["Laboratory artifact", "Severe inherited VWD", "Acquired VWD", "Lupus anticoagulant interference"],
    correct: [2],
    explanation: "New-onset bleeding at age 77 with absent vWF strongly supports acquired von Willebrand syndrome over inherited type 3 VWD."
  },
  {
    title: "Module 7: The Contradiction",
    findings: ["Outside hospital reports normal multimers", "Your institution reports absent multimers"],
    question: "What should the laboratory do next?",
    type: "multi",
    answers: ["Ignore discrepancy", "Review methodology", "Review actual multimer gel", "Repeat testing"],
    correct: [1, 2, 3],
    explanation: "Discordant high-impact results require method review, direct gel review when possible, and repeat testing. Ignoring the discrepancy is not stewardship."
  },
  {
    title: "Module 8: Final Diagnosis",
    findings: ["FVIII low", "vWF absent", "Multimers absent", "Bleeding symptoms", "Response to IVIG"],
    question: "Most likely diagnosis?",
    type: "single",
    answers: ["Type 3 inherited VWD", "Acquired FVIII inhibitor", "Type 3 acquired von Willebrand syndrome", "APS with assay interference"],
    correct: [2],
    explanation: "The age of onset, bleeding phenotype, absent vWF studies, absent multimers, and IVIG response support type 3 acquired von Willebrand syndrome."
  }
];

const quizQuestions = [
  ["A prolonged aPTT that fails to correct with a mixing study most strongly suggests:", ["Factor VIII deficiency", "Factor IX deficiency", "Presence of an inhibitor", "Vitamin K deficiency"], 2],
  ["Which disorder typically prolongs aPTT but is not associated with bleeding?", ["Hemophilia A", "Lupus anticoagulant", "Acquired VWD", "Factor XI deficiency"], 1],
  ["Which assay is least susceptible to lupus anticoagulant interference?", ["One-stage FVIII assay", "aPTT", "Chromogenic FVIII assay", "Mixing study"], 2],
  ["The primary physiologic role of vWF in relation to factor VIII is:", ["Activate thrombin", "Inhibit fibrinolysis", "Stabilize FVIII in circulation", "Activate platelets directly"], 2],
  ["A patient with absent vWF and low FVIII would most likely have:", ["Shortened aPTT", "Elevated fibrinogen", "Prolonged primary hemostasis testing", "Positive HIT antibody"], 2],
  ["Which finding most supports acquired rather than inherited VWD?", ["Low vWF activity", "Low FVIII", "New-onset bleeding at age 77", "Prolonged PFA closure time"], 2],
  ["Which laboratory result would be expected in APS?", ["Low fibrinogen", "Positive anticardiolipin antibody", "Absent multimers", "Low platelet aggregation"], 1],
  ["The major purpose of a chromogenic FVIII assay in this case was to:", ["Measure FVIII antigen", "Confirm inhibitor titer", "Evaluate for assay interference", "Diagnose APS"], 2],
  ["Which test ultimately confirmed the diagnosis?", ["dRVVT", "FVIII inhibitor assay", "Platelet count", "vWF multimer analysis"], 3],
  ["The most important educational point from this case is:", ["LAC always causes bleeding", "Mixing studies diagnose APS", "Assay selection matters when results conflict with the clinical picture", "Chromogenic assays replace all clot-based assays"], 2]
];

let score = 0;
let attempted = 0;
let currentCase = 0;
const answered = new Set();

const scoreEl = document.querySelector("#score");
const attemptedEl = document.querySelector("#attempted");
const summaryText = document.querySelector("#summaryText");

function updateScore() {
  scoreEl.textContent = score;
  attemptedEl.textContent = attempted;
  summaryText.textContent = attempted === 0
    ? "Answer questions to build your score."
    : `Current performance: ${score} correct out of ${attempted} answered.`;
}

function renderMethods() {
  const buttons = document.querySelector("#methodButtons");
  const detail = document.querySelector("#methodDetail");

  buttons.innerHTML = methods.map((method, index) => (
    `<button class="method-choice" type="button" data-method="${index}">${method.name}</button>`
  )).join("");

  buttons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-method]");
    if (!button) return;
    document.querySelectorAll(".method-choice").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const method = methods[Number(button.dataset.method)];
    detail.innerHTML = `
      <h3>${method.name}</h3>
      <p>${method.rationale}</p>
      <div class="method-meta">
        <div><strong>Question</strong>${method.question}</div>
        <div><strong>Best Use</strong>${method.useful}</div>
        <div><strong>Limitation</strong>${method.limitation}</div>
      </div>
    `;
  });
}

function isCorrectSelection(selected, correct) {
  if (selected.length !== correct.length) return false;
  return selected.every((item) => correct.includes(item));
}

function renderCase() {
  const stage = document.querySelector("#caseStage");
  const question = document.querySelector("#caseQuestion");
  const step = caseSteps[currentCase];
  const key = `case-${currentCase}`;

  stage.innerHTML = `
    <h3>${step.title}</h3>
    <ul class="finding-list">
      ${step.findings.map((finding) => `<li>${finding}</li>`).join("")}
    </ul>
    <div class="tag-row">
      <span class="tag">Coagulation consult</span>
      <span class="tag">aPTT</span>
      <span class="tag">Director decision</span>
    </div>
  `;

  question.innerHTML = `
    <h3>${step.question}</h3>
    <p>${step.type === "multi" ? "Select all that apply." : "Select the best answer."}</p>
    <div class="answer-grid">
      ${step.answers.map((answer, index) => (
        `<button class="answer" type="button" data-question="${key}" data-answer="${index}">${answer}</button>`
      )).join("")}
    </div>
    <div class="feedback" hidden></div>
    <div class="case-controls">
      <button class="button secondary" type="button" id="prevCase" ${currentCase === 0 ? "disabled" : ""}>Previous</button>
      <button class="button primary" type="button" id="nextCase">${currentCase === caseSteps.length - 1 ? "Finish Case" : "Next"}</button>
    </div>
  `;
}

function handleAnswer(button) {
  const questionKey = button.dataset.question;
  const answerIndex = Number(button.dataset.answer);
  const isCase = questionKey.startsWith("case-");
  const questionIndex = Number(questionKey.split("-")[1]);
  const data = isCase ? caseSteps[questionIndex] : { correct: [quizQuestions[questionIndex][2]], explanation: quizExplanations(questionIndex) };
  const card = button.closest(".question-card, .quiz-card");
  const buttons = [...card.querySelectorAll(".answer")];
  const feedback = card.querySelector(".feedback");

  if (data.type === "multi" && isCase) {
    button.classList.toggle("selected");
    const selected = buttons
      .filter((item) => item.classList.contains("selected"))
      .map((item) => Number(item.dataset.answer));
    feedback.hidden = false;
    feedback.textContent = selected.length === 0
      ? "Select one or more answers."
      : data.explanation;
    if (!answered.has(questionKey) && isCorrectSelection(selected, data.correct)) {
      score += 1;
      attempted += 1;
      answered.add(questionKey);
      updateScore();
    }
    return;
  }

  if (answered.has(questionKey)) return;
  const correct = data.correct.includes(answerIndex);
  buttons.forEach((item) => {
    item.disabled = true;
    const itemIndex = Number(item.dataset.answer);
    if (data.correct.includes(itemIndex)) item.classList.add("correct");
  });
  if (!correct) button.classList.add("incorrect");

  attempted += 1;
  if (correct) score += 1;
  answered.add(questionKey);
  feedback.hidden = false;
  feedback.textContent = data.explanation;
  updateScore();
}

function quizExplanations(index) {
  const explanations = [
    "Non-correction suggests an inhibitor rather than a simple factor deficiency.",
    "Lupus anticoagulant prolongs phospholipid-dependent assays but is classically thrombotic rather than hemorrhagic.",
    "Chromogenic FVIII is less affected by lupus anticoagulant than one-stage clot-based FVIII testing.",
    "vWF binds and stabilizes FVIII in circulation.",
    "Absent vWF impairs platelet adhesion and can secondarily reduce FVIII.",
    "New-onset bleeding late in life strongly favors an acquired process.",
    "Anticardiolipin antibodies are part of the antiphospholipid antibody profile.",
    "The chromogenic assay helped test whether the low FVIII was only clot-based assay interference.",
    "Multimer analysis helped confirm the severe acquired vWF abnormality.",
    "The central lesson is diagnostic stewardship: match assay method to the clinical and analytical problem."
  ];
  return explanations[index];
}

function renderQuiz() {
  const grid = document.querySelector("#quizGrid");
  grid.innerHTML = quizQuestions.map(([prompt, answers], index) => `
    <article class="quiz-card">
      <h3>Question ${index + 1}</h3>
      <p>${prompt}</p>
      <div class="answer-grid">
        ${answers.map((answer, answerIndex) => (
          `<button class="answer" type="button" data-question="quiz-${index}" data-answer="${answerIndex}">${answer}</button>`
        )).join("")}
      </div>
      <div class="feedback" hidden></div>
    </article>
  `).join("");
}

function setupNavigation() {
  const menuToggle = document.querySelector("#menuToggle");
  const sidebar = document.querySelector("#sidebar");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  menuToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  document.querySelectorAll(".page-section").forEach((section) => observer.observe(section));
}

document.addEventListener("click", (event) => {
  const answer = event.target.closest(".answer");
  if (answer) handleAnswer(answer);

  if (event.target.id === "nextCase") {
    currentCase = Math.min(caseSteps.length - 1, currentCase + 1);
    renderCase();
  }

  if (event.target.id === "prevCase") {
    currentCase = Math.max(0, currentCase - 1);
    renderCase();
  }

  if (event.target.id === "resetScore") {
    score = 0;
    attempted = 0;
    answered.clear();
    currentCase = 0;
    renderCase();
    renderQuiz();
    updateScore();
  }
});

renderMethods();
renderCase();
renderQuiz();
setupNavigation();
updateScore();

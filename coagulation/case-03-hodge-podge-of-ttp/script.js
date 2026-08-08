const sections = [
  ["home", "Home"], ["objectives", "Learning Objectives"],
  ["background", "Background"], ["core-content", "Core Content"],
  ["mechanisms", "Mechanisms"], ["clinical-cases", "Clinical Cases"],
  ["quiz", "Knowledge Check"], ["summary", "Summary"]
];
const progressKey = "ttp-case3-scroll-progress";
const readProgress = () => { try { return JSON.parse(localStorage.getItem(progressKey)) || {}; } catch { return {}; } };
const writeProgress = value => localStorage.setItem(progressKey, JSON.stringify(value));

function renderShell() {
  document.querySelector("#sidebar").innerHTML = `
    <div class="brand"><div class="brand-mark">A13</div><div><strong>Hodge Podge of TTP</strong><span>Resident learning module</span></div></div>
    <nav class="nav-list" aria-label="Module sections">${sections.map(([id, name], i) => `<a class="nav-link ${i === 0 ? "active" : ""}" data-nav="${id}" href="#${id}"><span class="nav-number">${String(i + 1).padStart(2,"0")}</span><span>${name}</span><span class="nav-check" aria-hidden="true"></span></a>`).join("")}</nav>
    <div class="sidebar-progress"><div class="progress-label"><span>Module progress</span><span id="progress-text">0%</span></div><div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div><button class="reset-button" id="reset-progress">Reset progress</button></div>`;
  updateProgressUI();
}

function updateProgressUI() {
  const progress = readProgress();
  const done = sections.filter(([id]) => progress[id]).length;
  const pct = Math.round(done / sections.length * 100);
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("complete", !!progress[link.dataset.nav]));
  document.querySelector("#progress-fill").style.width = `${pct}%`;
  document.querySelector("#progress-text").textContent = `${pct}%`;
}

window.markSectionComplete = id => { const p = readProgress(); p[id] = true; writeProgress(p); updateProgressUI(); };
window.markPageComplete = () => window.markSectionComplete("clinical-cases");

const quiz = [
  {q:"A patient has a classic TTP phenotype, ADAMTS13 activity below 5%, and a negative functional inhibitor assay. Which interpretation is best?", a:["Congenital TTP is proven","Immune TTP remains possible because low-titer or clearing antibodies may be missed","TTP is excluded","The activity result should be ignored"], c:1, e:"A functional inhibitor test detects neutralization in vitro. Low-titer antibodies and non-neutralizing antibodies that accelerate clearance can yield a negative inhibitor result."},
  {q:"What does a functional ADAMTS13 inhibitor assay principally ask?", a:["Is ADAMTS13 antigen present?","Can patient plasma inhibit ADAMTS13 activity in vitro?","Does the patient carry an ADAMTS13 variant?","Are schistocytes present?"], c:1, e:"The assay mixes patient plasma with a source of ADAMTS13 and measures residual activity after incubation."},
  {q:"Which assay is most likely to detect a non-neutralizing anti-ADAMTS13 antibody?", a:["Functional inhibitor assay","Anti-ADAMTS13 IgG ELISA","CBC","PT/INR"], c:1, e:"An antibody immunoassay detects binding antibodies, including those that accelerate clearance without neutralizing activity in vitro."},
  {q:"Gross in vitro hemolysis accompanies an unexpectedly low ADAMTS13 activity. What is the best laboratory response?", a:["Diagnose immune TTP","Report congenital TTP","Request a fresh, non-hemolyzed citrate specimen","Convert the result to an inhibitor titer"], c:2, e:"In vitro hemolysis can interfere with some activity assays. Recollection is recommended when the result and clinical picture are discordant."},
  {q:"Why is EDTA contamination problematic for an ADAMTS13 activity assay?", a:["It activates platelets","It chelates divalent cations needed by the metalloprotease","It creates anti-ADAMTS13 antibodies","It increases VWF synthesis"], c:1, e:"ADAMTS13 is a zinc-containing metalloprotease. EDTA chelation can inhibit activity and produce an artifactual low result."},
  {q:"Which specimen is normally preferred for ADAMTS13 testing?", a:["EDTA whole blood","Platelet-poor plasma from properly filled sodium citrate blood","Clotted blood left on cells overnight","Capillary blood"], c:1, e:"Properly prepared platelet-poor citrated plasma is the usual specimen; collection and processing details matter."},
  {q:"Which statement best describes the PLASMIC score?", a:["It confirms immune TTP","It estimates the probability of severe ADAMTS13 deficiency before results are available","It replaces ADAMTS13 testing","It distinguishes neutralizing from clearing antibodies"], c:1, e:"PLASMIC is a clinical prediction tool. It supports urgent decisions but is neither an etiologic diagnosis nor a substitute for ADAMTS13 testing."},
  {q:"What is the central laboratory medicine lesson in this module?", a:["Every negative result excludes disease","Analytical results must be interpreted in biological and clinical context","Repeat testing is never useful","Assay type does not affect interpretation"], c:1, e:"A test is an estimate of biology. Knowing what the method detects—and what it may miss—is essential when results and phenotype disagree."}
];
let quizIndex = 0, quizScore = 0, quizAnswered = false;

function renderQuestion() {
  const root = document.querySelector("#quiz-root");
  if (quizIndex >= quiz.length) {
    root.innerHTML = `<div class="quiz-result"><p class="quiz-kicker">Module complete</p><div class="quiz-score">${quizScore}/${quiz.length}</div><h2>${quizScore >= 7 ? "Excellent work" : quizScore >= 5 ? "Solid foundation" : "Review the core concepts"}</h2><p>${quizScore >= 7 ? "You demonstrated strong command of ADAMTS13 assay interpretation." : "Revisit the mechanisms and clinical cases, then try again."}</p><div class="hero-actions" style="justify-content:center"><button class="button button-primary" id="retry">Retry quiz</button><a class="button button-secondary" href="#summary">Continue to summary ↓</a></div></div>`;
    localStorage.setItem("ttp-case3-quiz", JSON.stringify({score:quizScore, total:quiz.length}));
    window.markSectionComplete("quiz");
    document.querySelector("#retry").addEventListener("click", () => { quizIndex=0; quizScore=0; renderQuestion(); });
    return;
  }
  quizAnswered = false;
  const item = quiz[quizIndex];
  document.querySelector("#quiz-bar").style.width = `${quizIndex / quiz.length * 100}%`;
  root.innerHTML = `<p class="quiz-kicker">Question ${quizIndex + 1} of ${quiz.length}</p><h2>${item.q}</h2><div class="choice-group">${item.a.map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div><div class="feedback" id="quiz-feedback" role="status"></div><button class="button button-primary" id="next-question" hidden>${quizIndex === quiz.length-1 ? "View results" : "Next question →"}</button>`;
  root.querySelectorAll(".choice").forEach(button => button.addEventListener("click", () => {
    if (quizAnswered) return; quizAnswered = true;
    const selected = Number(button.dataset.i), correct = selected === item.c;
    if (correct) quizScore++;
    button.classList.add(correct ? "correct" : "incorrect");
    root.querySelector(`[data-i="${item.c}"]`).classList.add("correct");
    const feedback = document.querySelector("#quiz-feedback");
    feedback.className = `feedback show ${correct ? "correct" : "incorrect"}`;
    feedback.innerHTML = `<strong>${correct ? "Correct." : "Not quite."}</strong> ${item.e}`;
    document.querySelector("#next-question").hidden = false;
  }));
  document.querySelector("#next-question").addEventListener("click", () => { quizIndex++; renderQuestion(); });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  const menu = document.querySelector("#menu-button"), sidebar = document.querySelector("#sidebar");
  menu.addEventListener("click", () => { const open = sidebar.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); });
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => { sidebar.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }));
  document.querySelector("#reset-progress").addEventListener("click", () => { if (confirm("Reset all module progress and quiz results?")) { localStorage.removeItem(progressKey); localStorage.removeItem("ttp-case3-quiz"); location.reload(); } });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.nav === id));
    history.replaceState(null, "", `#${id}`);
    window.markSectionComplete(id);
  }), { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  document.querySelectorAll(".module-section").forEach(section => observer.observe(section));

  document.querySelectorAll(".case-tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".case-tab").forEach(t => t.setAttribute("aria-selected", "false"));
    document.querySelectorAll(".case-panel").forEach(p => p.hidden = true);
    tab.setAttribute("aria-selected", "true");
    document.querySelector(`#${tab.dataset.target}`).hidden = false;
  }));
  document.querySelectorAll("[data-reveal]").forEach(button => button.addEventListener("click", () => { document.querySelector(`#${button.dataset.reveal}`).hidden = false; button.hidden = true; }));
  document.querySelectorAll("[data-answer]").forEach(button => button.addEventListener("click", () => {
    const group = button.closest(".question-block"); if (group.dataset.answered) return; group.dataset.answered = "true";
    const correct = button.dataset.answer === "correct"; button.classList.add(correct ? "correct" : "incorrect");
    group.querySelector(correct ? ".feedback.correct" : ".feedback.incorrect").classList.add("show");
    if (correct) window.markPageComplete();
  }));
  const checks = document.querySelectorAll(".plasmic input"), plasmicScore = document.querySelector("#plasmic-score");
  checks.forEach(box => box.addEventListener("change", () => {
    const n = [...checks].filter(x => x.checked).length, band = n <= 4 ? "low risk" : n === 5 ? "intermediate risk" : "high risk";
    plasmicScore.innerHTML = `<strong>${n}/7 — ${band}</strong><br><small>Use as a pretest-probability aid; it does not replace clinical judgment or ADAMTS13 testing.</small>`;
  }));

  renderQuestion();
  document.querySelector("#retake-quiz")?.addEventListener("click", () => { quizIndex=0; quizScore=0; renderQuestion(); });
});

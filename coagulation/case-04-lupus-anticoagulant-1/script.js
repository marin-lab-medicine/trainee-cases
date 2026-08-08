window.LA_CONTENT = {
  sections: [
    ["home", "Home"], ["objectives", "Learning Objectives"], ["background", "Background"],
    ["core-content", "Core Content"], ["mechanisms", "Mechanisms"],
    ["clinical-cases", "Clinical Case"], ["quiz", "Knowledge Check"], ["summary", "Summary"]
  ],
  mechanisms: {
    screen: {
      kicker: "Question 1 · Is the assay prolonged?",
      title: "Low phospholipid exposes interference",
      copy: "The screening reagent limits phospholipid. If an antibody disrupts phospholipid-dependent complex assembly, clot formation is delayed. This is sensitive evidence of interference—not yet proof of LA.",
      labels: ["Patient plasma + low-phospholipid reagent", "Normal plasma + low-phospholipid reagent"],
      bars: [62, 28]
    },
    mix: {
      kicker: "Question 2 · Deficiency or inhibitor pattern?",
      title: "Normal plasma supplies factors—but also dilutes antibody",
      copy: "A 1:1 mixture that remains prolonged supports an inhibitor pattern. Yet a weak LA may appear to correct after dilution, so the mixing result must remain subordinate to the whole screen–confirm pattern.",
      labels: ["Patient plasma", "Pooled normal plasma", "Mixture remains prolonged"],
      bars: [62, 40, 53]
    },
    confirm: {
      kicker: "Question 3 · Is the inhibitor phospholipid dependent?",
      title: "Excess phospholipid neutralizes the functional effect",
      copy: "The confirm reagent supplies substantially more phospholipid. Characteristic shortening demonstrates that the prolongation depends on phospholipid availability—the central analytical signature of LA.",
      labels: ["Screen", "High-phospholipid confirm", "Screen:confirm positive"],
      bars: [62, 43, 45]
    }
  }
};

window.LA_QUIZ = [
  {q:"Which statement best defines lupus anticoagulant?", choices:["A single antibody against factor VIII","A functional phospholipid-dependent inhibitor phenomenon","A diagnosis equivalent to systemic lupus erythematosus","Any cause of a prolonged aPTT"], answer:1, explain:"LA is a functional laboratory phenomenon caused by heterogeneous antiphospholipid antibodies; it is not a single antibody or a diagnosis of lupus."},
  {q:"Why should residual platelets be minimized in plasma for LA testing?", choices:["They consume fibrinogen","Their phospholipids can partially neutralize LA","They release apixaban","They falsely increase hematocrit"], answer:1, explain:"Platelet phospholipid can blunt the inhibitor effect and produce a false-negative result."},
  {q:"A DRVVT screen is prolonged. What has been established?", choices:["APS is present","A factor VIII inhibitor is present","Something interferes with the screen; phospholipid dependence is not yet proven","LA is definitively present"], answer:2, explain:"Screen prolongation detects interference. Confirmation with excess phospholipid and exclusion of alternatives are still required."},
  {q:"Patient DRVVT screen time is 61.5 seconds and mean normal time is 40.0 seconds. What is the normalized ratio?", choices:["1.06","1.32","1.45","1.54"], answer:3, explain:"61.5 ÷ 40.0 = 1.5375, reported as 1.54."},
  {q:"A 1:1 mixing study remains prolonged. What is the most precise conclusion?", choices:["An inhibitor pattern is supported","Phospholipid dependence is proven","Isolated factor deficiency is proven","APS is classified"], answer:0, explain:"Noncorrection supports an inhibitor pattern but does not identify the inhibitor as phospholipid dependent."},
  {q:"Why can a weak LA appear to correct in a mixing study?", choices:["The confirm reagent contains heparin","Normal plasma removes all antibodies","The 1:1 mix dilutes the antibody","Factor X is absent from pooled plasma"], answer:2, explain:"Mixing patient plasma with pooled normal plasma dilutes the antibody by about one-half, potentially masking a weak LA."},
  {q:"Which result most directly demonstrates phospholipid dependence?", choices:["Normal PT","Prolonged aPTT","Failure to correct in a mix","Shortening with a phospholipid-rich confirm reagent"], answer:3, explain:"Characteristic shortening when excess phospholipid is supplied is the mechanistic confirmation step."},
  {q:"Why use both DRVVT and SCT?", choices:["One diagnoses APS and the other diagnoses lupus","LA antibodies are heterogeneous and may affect assay systems differently","Both are required to calculate INR","SCT detects only factor deficiencies"], answer:1, explain:"Complementary assay principles improve sensitivity to heterogeneous LA antibodies."},
  {q:"A patient with thrombosis has one positive LA result. What is still needed for APS classification?", choices:["A bleeding event","A factor VIII assay","Persistence on repeat testing at least 12 weeks later","A prolonged thrombin time"], answer:2, explain:"A single positive result may be transient. Persistent positivity at least 12 weeks apart is required in the appropriate clinical context."},
  {q:"A follow-up sample has a positive numerical DRVVT ratio and apixaban level of 124 ng/mL. What should be reported?", choices:["LA positive","LA negative","APS confirmed","Clot-based LA is not reliably interpretable; LA cannot be confirmed or excluded"], answer:3, explain:"Clinically relevant apixaban can create false-positive or false-negative clot-based patterns. The result should not be overcalled."}
];

(function () {
  const storageKey = "coag-case4-quiz";
  let state = { index: 0, score: 0, answers: [], finished: false };
  const read = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || state; } catch { return state; } };
  const save = () => localStorage.setItem(storageKey, JSON.stringify(state));

  function render() {
    const root = document.querySelector("#quiz-root");
    if (!root) return;
    if (state.finished) {
      const pct = Math.round(state.score / LA_QUIZ.length * 100);
      root.innerHTML = `<div class="quiz-result"><div class="quiz-score">${state.score}/${LA_QUIZ.length}</div><h2>${pct >= 80 ? "Strong interpretation" : pct >= 60 ? "Nearly there" : "Review the pattern"}</h2><p>${pct >= 80 ? "You can integrate screen, mix, confirm, and interference findings." : "Use the explanations to revisit the steps that caused difficulty."}</p><button class="button button-primary" id="quiz-restart">Retake knowledge check</button></div>`;
      document.querySelector("#quiz-bar").style.width = "100%";
      window.markSectionComplete?.("quiz");
      document.querySelector("#quiz-restart").addEventListener("click", reset);
      return;
    }
    const item = LA_QUIZ[state.index];
    const answered = state.answers[state.index];
    root.innerHTML = `<p class="quiz-kicker">Question ${state.index + 1} of ${LA_QUIZ.length}</p><h2>${item.q}</h2><div class="choice-group quiz-choices">${item.choices.map((c,i)=>`<button class="choice ${answered !== undefined ? (i === item.answer ? "correct" : i === answered ? "incorrect" : "") : ""}" data-index="${i}" ${answered !== undefined ? "disabled" : ""}><span>${String.fromCharCode(65+i)}</span>${c}</button>`).join("")}</div>${answered !== undefined ? `<div class="quiz-explanation ${answered === item.answer ? "is-correct" : "is-incorrect"}"><strong>${answered === item.answer ? "Correct" : "Not quite"}</strong><p>${item.explain}</p></div><button class="button button-primary" id="quiz-next">${state.index === LA_QUIZ.length - 1 ? "See results" : "Next question →"}</button>` : ""}`;
    document.querySelector("#quiz-bar").style.width = `${state.index / LA_QUIZ.length * 100}%`;
    if (answered === undefined) root.querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => answer(Number(btn.dataset.index))));
    else document.querySelector("#quiz-next").addEventListener("click", next);
  }
  function answer(index) { state.answers[state.index] = index; if (index === LA_QUIZ[state.index].answer) state.score++; save(); render(); }
  function next() { if (state.index === LA_QUIZ.length - 1) state.finished = true; else state.index++; save(); render(); }
  function reset() { state = { index:0, score:0, answers:[], finished:false }; save(); render(); }
  window.resetLAQuiz = reset;
  document.addEventListener("DOMContentLoaded", () => { state = read(); render(); });
})();

const progressKey = "coag-case4-progress";
const caseKey = "coag-case4-clinical";
const sections = window.LA_CONTENT.sections;
const readJSON = (key, fallback = {}) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };

function renderSidebar() {
  const sidebar = document.querySelector("#sidebar");
  sidebar.innerHTML = `<div class="brand"><div class="brand-mark">LA</div><div><strong>Lupus Anticoagulant 1</strong><span>Resident learning module</span></div></div><nav class="nav-list" aria-label="Module sections">${sections.map(([id,name],i)=>`<a class="nav-link ${i===0?"active":""}" data-nav="${id}" href="#${id}"><span class="nav-number">${String(i+1).padStart(2,"0")}</span><span>${name}</span><span class="nav-check" aria-hidden="true"></span></a>`).join("")}</nav><div class="sidebar-progress"><div class="progress-label"><span>Module progress</span><span id="progress-text">0%</span></div><div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div><button class="reset-button" id="reset-progress">Reset all progress</button></div>`;
  updateProgress();
}

function updateProgress() {
  const progress = readJSON(progressKey);
  const done = sections.filter(([id]) => progress[id]).length;
  const pct = Math.round(done / sections.length * 100);
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("complete", !!progress[link.dataset.nav]));
  document.querySelector("#progress-fill").style.width = `${pct}%`;
  document.querySelector("#progress-text").textContent = `${pct}%`;
  const start = document.querySelector("#start-button");
  if (start && done > 1) { start.innerHTML = `Resume module <span aria-hidden="true">→</span>`; start.href = `#${progress.last || "objectives"}`; }
}
window.markSectionComplete = id => { const progress = readJSON(progressKey); progress[id] = true; progress.last = id; localStorage.setItem(progressKey, JSON.stringify(progress)); updateProgress(); };

function setupNavigation() {
  const menu = document.querySelector("#menu-button"); const sidebar = document.querySelector("#sidebar");
  menu.addEventListener("click", () => { const open = sidebar.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); });
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => { sidebar.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }));
  document.querySelector("#reset-progress").addEventListener("click", () => { if (confirm("Reset module progress, clinical case, and quiz results?")) { [progressKey, caseKey, "coag-case4-quiz"].forEach(k=>localStorage.removeItem(k)); location.reload(); } });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; const id=entry.target.id; document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.dataset.nav===id)); history.replaceState(null,"",`#${id}`); window.markSectionComplete(id); }), {rootMargin:"-35% 0px -55% 0px", threshold:0});
  document.querySelectorAll(".module-section").forEach(section=>observer.observe(section));
}

function setupCalculator() {
  const patient = document.querySelector("#patient-time"), normal = document.querySelector("#normal-time"), output = document.querySelector("#ratio-output"), flag = document.querySelector("#ratio-flag");
  const calculate = () => { const result = Number(patient.value) / Number(normal.value); if (!isFinite(result) || result <= 0) { output.textContent="—"; flag.textContent="Enter valid times"; flag.className="status"; return; } output.textContent=result.toFixed(2); const high=result>1.2; flag.textContent=high?"Above 1.20":"At or below 1.20"; flag.className=`status ${high?"alert":"good"}`; };
  [patient,normal].forEach(input=>input.addEventListener("input",calculate));
}

function renderMechanism(name) {
  const data = LA_CONTENT.mechanisms[name];
  document.querySelector("#mechanism-stage").innerHTML = `<div class="mechanism-copy"><p class="step-kicker">${data.kicker}</p><h2>${data.title}</h2><p>${data.copy}</p></div><div class="mechanism-bars" aria-label="Conceptual clotting time comparison">${data.labels.map((label,i)=>`<div><span>${label}</span><i><b style="width:${data.bars[i]}%"></b></i><strong>${i===2 ? data.bars[i] : data.bars[i]+" s"}</strong></div>`).join("")}</div>`;
}
function setupMechanisms() { renderMechanism("screen"); document.querySelectorAll(".mechanism-tab").forEach(tab=>tab.addEventListener("click",()=>{ document.querySelectorAll(".mechanism-tab").forEach(t=>{t.classList.toggle("active",t===tab);t.setAttribute("aria-selected",String(t===tab));});renderMechanism(tab.dataset.mechanism);})); }

let caseState = { step:0, completed:[] };
const caseExplanations = [
  "Correct. Anticoagulants can alter screening and confirmation differently, producing either false-positive or false-negative patterns.",
  "Correct. The normal thrombin time makes a major direct thrombin inhibitor or unfractionated heparin effect less likely, but the prolonged aPTT remains nonspecific.",
  "Correct. 61.5 ÷ 40.0 = 1.54, above the training screen cutoff of 1.20. The screen is prolonged, but phospholipid dependence is not yet proven.",
  "Correct. Noncorrection supports inhibition; confirmation is needed to demonstrate that the inhibition is phospholipid dependent.",
  "Correct. Both systems shorten with phospholipid-rich confirm reagents and have positive screen-to-confirm ratios.",
  "Correct. A qualifying clinical event plus one positive LA result is not sufficient to demonstrate persistent antiphospholipid antibody positivity.",
  "Correct. The numerical ratio cannot be trusted in the presence of clinically relevant apixaban. Follow the laboratory's validated interference protocol."
];
function showCaseStep() {
  document.querySelectorAll(".case-step").forEach((el,i)=>{ el.hidden=i!==caseState.step; el.classList.toggle("active",i===caseState.step); });
  const decisions=Math.min(caseState.completed.length,6); document.querySelector("#case-progress-text").textContent=`${decisions} / 6 decisions`; document.querySelector("#case-progress-fill").style.width=`${decisions/6*100}%`;
  document.querySelector("#case-complete").hidden=caseState.step<7;
}
function advanceCase(step, feedback) {
  if (!caseState.completed.includes(step)) caseState.completed.push(step);
  localStorage.setItem(caseKey,JSON.stringify(caseState));
  feedback.className="case-feedback success"; feedback.innerHTML=`<strong>Well reasoned.</strong><p>${caseExplanations[step]}</p><button class="button button-primary case-next">${step===5?"Open 13-week follow-up →":"Continue →"}</button>`;
  feedback.querySelector(".case-next").addEventListener("click",()=>{caseState.step=step+1;localStorage.setItem(caseKey,JSON.stringify(caseState));showCaseStep();document.querySelector(`[data-case-step="${caseState.step}"]`)?.scrollIntoView({behavior:"smooth",block:"center"});if(caseState.step===7)window.markSectionComplete("clinical-cases");});
}
function setupCase() {
  caseState=readJSON(caseKey,{step:0,completed:[]}); if(caseState.step>7)caseState.step=7; showCaseStep();
  document.querySelectorAll(".case-step .choice").forEach(button=>button.addEventListener("click",()=>{const step=Number(button.closest(".case-step").dataset.caseStep), feedback=button.closest(".case-step").querySelector(".case-feedback");button.parentElement.querySelectorAll(".choice").forEach(b=>b.classList.remove("selected","correct","incorrect"));button.classList.add("selected",button.dataset.correct==="true"?"correct":"incorrect");if(button.dataset.correct==="true")advanceCase(step,feedback);else{feedback.className="case-feedback error";feedback.innerHTML="<strong>Reconsider the claim.</strong><p>Choose the most precise conclusion supported by the data available at this step.</p>";}}));
  document.querySelector(".check-calculation").addEventListener("click",()=>{const input=Number(document.querySelector("#screen-answer").value),feedback=document.querySelector('[data-case-step="2"] .case-feedback');if(Math.abs(input-1.54)<=.01)advanceCase(2,feedback);else{feedback.className="case-feedback error";feedback.innerHTML="<strong>Try the normalized ratio.</strong><p>Divide the patient clotting time by the mean normal clotting time and round to two decimals.</p>";}});
  document.querySelector("#restart-case").addEventListener("click",()=>{caseState={step:0,completed:[]};localStorage.setItem(caseKey,JSON.stringify(caseState));showCaseStep();location.hash="clinical-cases";});
  document.querySelector("#retake-quiz").addEventListener("click",()=>{window.resetLAQuiz?.();location.hash="quiz";});
}

document.addEventListener("DOMContentLoaded",()=>{renderSidebar();setupNavigation();setupCalculator();setupMechanisms();setupCase();});

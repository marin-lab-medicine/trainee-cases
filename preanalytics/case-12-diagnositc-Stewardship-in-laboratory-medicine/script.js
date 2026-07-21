const storageKey="case12DiagnosticStewardshipV1";
const sectionIds=["home","objectives","background","core","mechanisms","cases","quiz","summary"];
const navLinks=[...document.querySelectorAll(".nav-link")];
const sections=[...document.querySelectorAll("[data-section]")];
const sidebar=document.querySelector(".sidebar");
const menuToggle=document.querySelector(".menu-toggle");
const toast=document.querySelector("#toast");

const quizQuestions=[
  {q:"Which statement best distinguishes diagnostic stewardship from cost containment?",a:["Stewardship always selects the least expensive test","Stewardship optimizes testing for meaningful clinical decisions and patient outcomes","Stewardship prohibits all send-out testing","Stewardship applies only after a result is reported"],correct:1,e:"Stewardship targets diagnostic quality and patient outcomes across ordering, performance, reporting, interpretation, and follow-up. Lower cost may be a benefit, but it is not the defining goal."},
  {q:"A highly specific antibody test is ordered in a population with extremely low disease prevalence. What is the central concern?",a:["Analytical sensitivity automatically falls","Positive predictive value may be low despite good assay performance","Specificity becomes irrelevant","A negative result will always be false"],correct:1,e:"At very low pretest probability, false positives can constitute a substantial proportion of positive results. Test characteristics must be interpreted in the population being tested."},
  {q:"Which question should come first during a laboratory medicine consultation?",a:["Which vendor offers the largest panel?","What clinical decision will this result change?","Can the specimen be sent today?","How many analytes can be measured?"],correct:1,e:"A defined clinical question and intended use anchor every later choice, including method, specimen, pathway, and turnaround."},
  {q:"Which property asks whether an assay accurately and reproducibly measures its target?",a:["Clinical utility","Operational feasibility","Analytical validity","Clinical validity"],correct:2,e:"Analytical validity concerns measurement performance. Clinical validity concerns association with disease, while utility concerns improvement in decisions or outcomes."},
  {q:"When is a specialized send-out test most appropriate?",a:["Whenever it is newer than the local assay","When it answers a focused question not adequately addressed by a feasible local pathway","Before first-line testing in every complex case","Whenever a clinician requests a branded assay"],correct:1,e:"Specialized testing is valuable when its distinct method, expertise, or content is necessary for a defined clinical need and the logistics support actionable use."},
  {q:"A patient has a high PLASMIC score and strong clinical suspicion for immune TTP. ADAMTS13 is a send-out. What is the best approach?",a:["Delay therapy until the assay returns","Use PLASMIC as definitive and cancel ADAMTS13","Collect pretreatment plasma if feasible, send urgently, and do not delay appropriate empiric treatment","Repeat the PLASMIC score daily instead of testing"],correct:2,e:"ADAMTS13 activity below 10% supports confirmation, but suspected immune TTP is time-critical. Obtain an appropriate pretreatment specimen when feasible without delaying urgent management."},
  {q:"A ctDNA MRD assay predicts relapse in observational studies. What additional evidence most directly addresses clinical utility?",a:["A lower analytical detection limit","Evidence that acting on the result improves a meaningful care decision or outcome","A colorful report format","A large menu of tracked variants"],correct:1,e:"Prognostic association establishes part of clinical validity. Utility asks whether use of the result improves decisions or patient outcomes in the intended setting."},
  {q:"Why should phenotyping and first-line evaluation precede whole-exome sequencing in chronic anemia?",a:["Exome sequencing cannot identify hematologic disorders","Better phenotype definition sharpens test selection and variant interpretation and may reveal a simpler cause","Genetic testing is never appropriate for anemia","A peripheral smear supplies the same data as sequencing"],correct:1,e:"Broad sequencing can be appropriate, but a precise phenotype, pedigree, and basic workup reduce uncertainty and improve interpretation and yield."},
  {q:"Which item belongs in the postanalytic phase of stewardship?",a:["Specimen labeling","Method validation","Closed-loop communication and action on the result","Patient preparation before collection"],correct:2,e:"Reporting, interpretation, communication, follow-up, and documented action are postanalytic responsibilities. A result without follow-up ownership is incomplete."},
  {q:"A proposed assay has excellent precision but no evidence that its result changes care. What is the best conclusion?",a:["Implement immediately because precision proves value","Reject permanently because new tests are risky","Analytical validity is encouraging, but clinical validity, utility, and feasibility still require review","Order it only for insured patients"],correct:2,e:"Strong measurement performance is necessary but not sufficient. Implementation requires an intended use, clinical evidence, an operational plan, and monitoring criteria."}
];

const stages=[
  ["Stage 01 · Clinical question","Name the decision before selecting the assay.","Define the phenotype, differential diagnosis, urgency, and action threshold.","A specific, answerable question","Shotgun panels and defensive ordering","Translate the request into an intended use"],
  ["Stage 02 · Pretest probability","Estimate disease probability before the result exists.","Use prevalence, history, examination, and validated prediction tools when available.","Explicit probability category or threshold","Testing very-low-risk patients without a rationale","Explain how prevalence changes predictive value"],
  ["Stage 03 · Test selection","Match assay performance to the clinical task.","Choose a rule-in, rule-out, confirmatory, monitoring, or prognostic strategy deliberately.","Method and threshold fit the intended use","Selecting by name, novelty, or panel size","Compare methods, limits, and alternatives"],
  ["Stage 04 · Specimen","Protect the answer before analysis begins.","Confirm patient preparation, source, container, timing, volume, stability, and transport.","Optimal specimen collected at the right time","Mislabeled, treated, degraded, or insufficient sample","Anticipate preanalytic effects and rescue options"],
  ["Stage 05 · Analysis","Generate a result fit for its intended use.","Validate accuracy, precision, analytical sensitivity and specificity, interferences, and quality controls.","Performance verified across the reportable range","Reliable number interpreted beyond assay limits","Connect analytical limitations to clinical risk"],
  ["Stage 06 · Verification + report","Make the result intelligible and actionable.","Verify plausibility, reference limits, flags, comments, critical values, and timely delivery.","Clear report with appropriate context","Technically correct but misleading output","Add interpretation and escalate discordance"],
  ["Stage 07 · Clinical interpretation","Update probability in the whole-patient context.","Integrate the result with phenotype, timing, treatment, and other data.","Result reconciled with clinical evidence","Binary thinking or ignoring discordance","Explain uncertainty and recommend next steps"],
  ["Stage 08 · Decision + outcome","Close the loop and learn from use.","Document action, communicate with responsible teams, and monitor outcomes and utilization.","Named owner and completed action","Result seen but not acted upon","Ensure follow-up and identify system improvements"]
];
const gates=[
  "Define the intended use, target population, comparator, evidence quality, and unmet clinical need.",
  "Specify eligible patients, prerequisites, ordering roles, reflex logic, and exception pathways.",
  "Verify performance claims in the local setting with appropriate specimens, controls, and acceptance criteria.",
  "Build collection, accessioning, interfaces, reporting, billing, staffing, downtime, and result ownership.",
  "Teach ordering criteria, limitations, interpretation, workflow, and escalation routes before go-live.",
  "Track utilization, turnaround, cancellations, discordance, downstream action, outcomes, and review dates."
];
const sorts=[
  {title:"“The ANA is negative. Should I order the entire autoimmune panel?”",context:"Choose the strongest first response.",correct:"clarify",feedback:"Clarify the phenotype and intended decision. A broad panel in a low-probability setting risks incidental positives and a diagnostic cascade."},
  {title:"“The local assay takes 45 minutes; a send-out promises higher sensitivity in five days.”",context:"The patient needs a decision today.",correct:"deny",feedback:"Do not substitute a non-actionable turnaround for a fit-for-purpose local pathway unless the performance difference changes the immediate clinical decision."},
  {title:"“This new assay is precise, but we do not know how clinicians will act on it.”",context:"The committee requests your first recommendation.",correct:"clarify",feedback:"Clarify the intended use and evidence for clinical utility, then define implementation and monitoring criteria before routine approval."}
];

let state={visited:[],cases:[],quiz:{},summary:false};
let sortIndex=0;
function load(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||"{}");state={...state,...saved};state.visited=state.visited||[];state.cases=state.cases||[];state.quiz=state.quiz||{};}catch{localStorage.removeItem(storageKey)}}
function save(){localStorage.setItem(storageKey,JSON.stringify(state));updateProgress()}
function flash(message){toast.textContent=message;toast.classList.add("show");clearTimeout(flash.timer);flash.timer=setTimeout(()=>toast.classList.remove("show"),2200)}
function updateProgress(){
  const sectionPart=state.visited.length/sectionIds.length*45;
  const casePart=state.cases.length/5*25;
  const quizPart=Object.keys(state.quiz).length/quizQuestions.length*25;
  const percent=Math.min(100,Math.round(sectionPart+casePart+quizPart+(state.summary?5:0)));
  document.querySelector("#progress-label").textContent=`${percent}%`;
  document.querySelector("#progress-bar").style.width=`${percent}%`;
  document.querySelector("#progress-detail").textContent=`${state.visited.length} of ${sectionIds.length} sections visited`;
  navLinks.forEach(link=>link.classList.toggle("complete",state.visited.includes(link.hash.slice(1))));
  document.querySelector("#case-progress-text").textContent=`${state.cases.length} of 5 cases attempted`;
  document.querySelector("#case-progress-bar").style.width=`${state.cases.length/5*100}%`;
  const answered=Object.keys(state.quiz).length;
  const score=Object.values(state.quiz).filter(item=>item.correct).length;
  document.querySelector("#quiz-score").textContent=`${score} / 10`;
  document.querySelector("#quiz-answered").textContent=`${answered} / 10`;
  document.querySelector("#completion-title").textContent=percent===100?"Module complete":`${percent}% complete`;
  document.querySelector("#completion-copy").textContent=percent===100?`You completed every activity and scored ${score} of 10 on the knowledge check.`:"Visit each section, attempt every case, and complete the quiz.";
}

menuToggle.addEventListener("click",()=>{const open=sidebar.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open))});
navLinks.forEach(link=>link.addEventListener("click",()=>{sidebar.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const id=entry.target.id;navLinks.forEach(link=>link.classList.toggle("active",link.hash===`#${id}`));if(!state.visited.includes(id)){state.visited.push(id);save()}}),{rootMargin:"-30% 0px -55% 0px"});
sections.forEach(section=>observer.observe(section));

document.querySelectorAll("[data-lens]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-lens]").forEach(item=>{item.classList.toggle("active",item===button);item.setAttribute("aria-selected",String(item===button))});
  document.querySelectorAll("[data-lens-panel]").forEach(panel=>{const active=panel.id===`lens-${button.dataset.lens}`;panel.hidden=!active;panel.classList.toggle("active",active)});
}));

function renderSort(){const item=sorts[sortIndex];document.querySelector("#sort-title").textContent=item.title;document.querySelector("#sort-context").textContent=item.context;document.querySelector("#sort-feedback").textContent="Select a response to reveal the stewardship rationale.";document.querySelectorAll("[data-sort]").forEach(button=>button.classList.remove("active"))}
document.querySelectorAll("[data-sort]").forEach(button=>button.addEventListener("click",()=>{const item=sorts[sortIndex];document.querySelectorAll("[data-sort]").forEach(item=>item.classList.remove("active"));button.classList.add("active");document.querySelector("#sort-feedback").textContent=`${button.dataset.sort===item.correct?"Strong choice.":"Reconsider."} ${item.feedback}`}));
document.querySelector("#next-sort").addEventListener("click",()=>{sortIndex=(sortIndex+1)%sorts.length;renderSort()});

document.querySelectorAll("[data-stage]").forEach(button=>button.addEventListener("click",()=>{const item=stages[Number(button.dataset.stage)];document.querySelectorAll("[data-stage]").forEach(el=>el.classList.toggle("active",el===button));["kicker","title","copy","control","failure","role"].forEach((key,index)=>document.querySelector(`#stage-${key}`).textContent=item[index])}));
document.querySelectorAll("[data-gate]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-gate]").forEach(el=>el.classList.toggle("active",el===button));document.querySelector("#gate-detail").textContent=gates[Number(button.dataset.gate)]}));

document.querySelectorAll("[data-case-target]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-case-target]").forEach(el=>el.classList.toggle("active",el===button));document.querySelectorAll("[data-case-panel]").forEach(panel=>{const active=panel.id===`case-${button.dataset.caseTarget}`;panel.hidden=!active;panel.classList.toggle("active",active)})}));
document.querySelectorAll("[data-case-panel] fieldset button").forEach(button=>button.addEventListener("click",()=>{const panel=button.closest("[data-case-panel]");panel.querySelectorAll("fieldset button").forEach(el=>el.classList.remove("best","partial","poor"));button.classList.add(button.dataset.quality);const feedback=panel.querySelector(".case-feedback");feedback.className=`case-feedback ${button.dataset.quality}`;feedback.textContent=button.dataset.feedback;if(!state.cases.includes(panel.dataset.caseId)){state.cases.push(panel.dataset.caseId);save()}}));
document.querySelectorAll(".reveal-button").forEach(button=>button.addEventListener("click",()=>{const panel=button.nextElementSibling;panel.hidden=!panel.hidden;button.textContent=panel.hidden?button.textContent.replace("Hide","Reveal"):button.textContent.replace("Reveal","Hide")}));

function renderQuiz(){
  document.querySelector("#quiz-list").innerHTML=quizQuestions.map((item,index)=>`<article class="quiz-question" data-quiz="${index}"><h3><span>${String(index+1).padStart(2,"0")}</span>${item.q}</h3><div class="answer-options">${item.a.map((answer,i)=>`<button type="button" data-answer="${i}">${answer}</button>`).join("")}</div><div class="quiz-feedback" aria-live="polite"></div></article>`).join("");
  Object.keys(state.quiz).forEach(index=>restoreQuestion(Number(index)));
  document.querySelectorAll("[data-answer]").forEach(button=>button.addEventListener("click",()=>answerQuestion(button)));
  showQuizResult();updateProgress();
}
function answerQuestion(button){const block=button.closest("[data-quiz]");const index=Number(block.dataset.quiz);if(Object.hasOwn(state.quiz,index))return;const chosen=Number(button.dataset.answer);state.quiz[index]={correct:chosen===quizQuestions[index].correct,chosen};save();restoreQuestion(index);showQuizResult()}
function restoreQuestion(index){const block=document.querySelector(`[data-quiz="${index}"]`);if(!block)return;const record=state.quiz[index];block.querySelectorAll("[data-answer]").forEach(button=>{button.disabled=true;const answer=Number(button.dataset.answer);if(answer===quizQuestions[index].correct)button.classList.add("correct");if(answer===record.chosen&&!record.correct)button.classList.add("incorrect")});const feedback=block.querySelector(".quiz-feedback");feedback.className=`quiz-feedback ${record.correct?"correct":"incorrect"}`;feedback.innerHTML=`<strong>${record.correct?"Correct.":"Not quite."}</strong> ${quizQuestions[index].e}`}
function showQuizResult(){const result=document.querySelector("#quiz-result");if(Object.keys(state.quiz).length<quizQuestions.length){result.hidden=true;return}const score=Object.values(state.quiz).filter(item=>item.correct).length;result.hidden=false;result.innerHTML=`<h3>${score>=9?"Excellent stewardship reasoning.":score>=7?"Strong foundation. Review any missed explanations.":"Revisit the pathway and cases, then try again."}</h3><p>You scored ${score} of ${quizQuestions.length} (${score*10}%).</p>`}

document.querySelector("#retry-quiz").addEventListener("click",()=>{state.quiz={};save();renderQuiz();flash("Quiz reset. Try the questions again.")});
document.querySelector("#mark-summary").addEventListener("click",()=>{state.summary=true;if(!state.visited.includes("summary"))state.visited.push("summary");save();flash("Summary marked as reviewed.")});
document.querySelector("#reset-progress").addEventListener("click",()=>{if(!window.confirm("Reset all section, case, and quiz progress for this module?"))return;state={visited:[],cases:[],quiz:{},summary:false};save();renderQuiz();document.querySelectorAll(".case-feedback").forEach(el=>{el.className="case-feedback";el.textContent="Choose a response to reveal the diagnostic reasoning."});document.querySelectorAll("[data-case-panel] fieldset button").forEach(el=>el.classList.remove("best","partial","poor"));location.hash="#home";flash("Module progress reset.")});

load();renderQuiz();renderSort();updateProgress();

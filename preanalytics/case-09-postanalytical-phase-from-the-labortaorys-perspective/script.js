const storageKey = "case9PostanalyticalProgressV1";
const sectionIds = ["home","objectives","background","core","mechanisms","cases","quiz","summary"];
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("[data-section]")];
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const toast = document.querySelector("#toast");

const quizQuestions = [
  {q:"What does a failed delta check establish?",a:["The analyzer malfunctioned","The current result is incorrect","The result warrants investigation before release","The specimen must be recollected"],correct:2,e:"A delta failure is a safety signal. It identifies an unexpected change but does not determine whether the change is true or erroneous."},
  {q:"Which statement best describes autoverification?",a:["Automated release after predefined safety rules are satisfied","Automatic repeat testing of every abnormal value","Release of all noncritical values without review","Replacement of laboratory director oversight"],correct:0,e:"Autoverification applies validated rules to release eligible results. Its design and ongoing performance still require professional oversight."},
  {q:"A technologist requests consultation about a flagged result. What should the resident do first?",a:["Ignore the flag if QC passed","Ask what generated the flag and what investigation has already occurred","Order recollection in every case","Release the numeric result without qualification"],correct:1,e:"Instrument flags are alerts, not diagnoses. Understand the flag and prior work before choosing additional testing or manual review."},
  {q:"Which element is essential to a closed-loop critical-result workflow?",a:["Posting the result to the EMR only","Leaving a voicemail without follow-up","Read-back and documented recipient details","Repeating every critical result regardless of policy"],correct:2,e:"Critical communication includes an appropriate recipient, read-back, documentation, and escalation when the initial recipient cannot be reached."},
  {q:"Which interpretive comment is most appropriate?",a:["Start treatment immediately","Hemolysis is present; consider validated interference and clinical correlation","Abnormal result—use caution","Diagnosis: specimen contamination"],correct:1,e:"A good comment states the limitation and relevant context without diagnosing from a flag or directing medical management."},
  {q:"Which finding can cause a completed result to require manual verification?",a:["A disqualifying analyzer flag","Passing all autoverification rules","An unchanged stable result with acceptable indices","A normal result with no flags"],correct:0,e:"Flags, delta failures, critical values, questionable specimen integrity, and analytical exceptions commonly route results to human review."},
  {q:"Most postanalytical errors highlighted in this module are best understood as:",a:["Failures of measurement chemistry only","Communication or systems failures","Unavoidable biological variation","Errors that occur only before collection"],correct:1,e:"Wrong units, wrong recipients, missed notification, delayed reports, and failures to correct reports can occur after accurate measurement."},
  {q:"Which question most reflects laboratory-director thinking?",a:["Is the analyzer correct?—and nothing else","Can the result be released faster?","Is brief investigation safer than releasing a potentially misleading result?","Can all exceptions be resolved by repeating the test?"],correct:2,e:"Director-level judgment balances turnaround time with specimen integrity, plausibility, identification, communication, and patient harm."}
];

let state={visited:[],cases:[],quiz:{},summary:false};
function load(){try{state={...state,...JSON.parse(localStorage.getItem(storageKey)||"{}")};state.visited=state.visited||[];state.cases=state.cases||[];state.quiz=state.quiz||{};}catch{localStorage.removeItem(storageKey)}}
function save(){localStorage.setItem(storageKey,JSON.stringify(state));updateProgress()}
function flash(message){toast.textContent=message;toast.classList.add("show");clearTimeout(flash.timer);flash.timer=setTimeout(()=>toast.classList.remove("show"),2200)}
function updateProgress(){
  const sectionPart=(state.visited.length/sectionIds.length)*55;
  const casePart=(state.cases.length/5)*20;
  const quizPart=(Object.keys(state.quiz).length/quizQuestions.length)*20;
  const summaryPart=state.summary?5:0;
  const percent=Math.min(100,Math.round(sectionPart+casePart+quizPart+summaryPart));
  document.querySelector("#progress-label").textContent=`${percent}%`;
  document.querySelector("#progress-bar").style.width=`${percent}%`;
  document.querySelector("#progress-detail").textContent=`${state.visited.length} of ${sectionIds.length} sections visited`;
  navLinks.forEach(link=>link.classList.toggle("complete",state.visited.includes(link.hash.slice(1))));
  document.querySelector("#case-progress-text").textContent=`${state.cases.length} of 5 cases attempted`;
  document.querySelector("#case-progress-bar").style.width=`${state.cases.length/5*100}%`;
  const answered=Object.keys(state.quiz).length;
  const score=Object.values(state.quiz).filter(Boolean).length;
  document.querySelector("#quiz-score").textContent=`${score} / 8`;
  document.querySelector("#quiz-answered").textContent=`${answered} / 8`;
  const title=document.querySelector("#completion-title"),copy=document.querySelector("#completion-copy");
  if(percent===100){title.textContent="Module complete";copy.textContent=`You completed all sections and scored ${score} of 8 on the knowledge check.`}else{title.textContent=`${percent}% complete`;copy.textContent="Visit each section, attempt all cases, and finish the quiz."}
}

menuToggle.addEventListener("click",()=>{const open=sidebar.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open))});
navLinks.forEach(link=>link.addEventListener("click",()=>{sidebar.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const id=entry.target.id;navLinks.forEach(link=>link.classList.toggle("active",link.hash===`#${id}`));if(!state.visited.includes(id)){state.visited.push(id);save()}})},{rootMargin:"-30% 0px -55% 0px"});
sections.forEach(section=>observer.observe(section));

document.querySelectorAll(".topic-tab").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".topic-tab").forEach(b=>{b.classList.toggle("active",b===button);b.setAttribute("aria-selected",String(b===button))});
  document.querySelectorAll("[data-topic-panel]").forEach(panel=>{const active=panel.id===button.dataset.panel;panel.hidden=!active;panel.classList.toggle("active",active)});
}));

const profiles={
  routine:{steps:[["Checkpoint 1","QC acceptable"],["Checkpoint 2","No flags"],["Checkpoint 3","Delta passed"],["Checkpoint 4","Range + indices acceptable"],["Destination","Release to EMR"]],explain:"A routine result can pass a validated rule set without manual intervention. This shortens turnaround time while reserving human review for exceptions."},
  delta:{steps:[["Signal","Delta exceeded"],["Investigate","Prior results + identity"],["Inspect","Specimen + indices"],["Correlate","Clinical context"],["Decision","Release, qualify, or recollect"]],alert:0,explain:"The delta rule pauses release. The laboratory investigates competing explanations—true physiologic change, specimen issue, misidentification, contamination, interference, or analytical concern—before choosing a disposition."},
  critical:{steps:[["Generate","Critical result"],["Verify","Result + identity"],["Communicate","Responsible clinician"],["Close loop","Read-back + document"],["If needed","Escalate by policy"]],alert:0,explain:"A critical result activates a time-sensitive, closed-loop workflow. Repeat testing is performed only when indicated by policy or the specific analytical situation; communication must not be needlessly delayed."}
};
function renderWorkflow(name){const p=profiles[name];document.querySelector("#workflow").innerHTML=p.steps.map((s,i)=>`${i?'<span class="flow-arrow">→</span>':''}<div class="flow-step ${p.alert===i?'alert':''}"><small>${s[0]}</small><strong>${s[1]}</strong></div>`).join("");document.querySelector("#mechanism-explain").textContent=p.explain}
document.querySelectorAll("[data-profile]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-profile]").forEach(b=>b.classList.toggle("active",b===button));renderWorkflow(button.dataset.profile)}));

document.querySelectorAll("[data-case-target]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-case-target]").forEach(b=>b.classList.toggle("active",b===button));
  document.querySelectorAll("[data-case-panel]").forEach(panel=>{const active=panel.id===button.dataset.caseTarget;panel.hidden=!active;panel.classList.toggle("active",active)});
}));
document.querySelectorAll("[data-case-panel] fieldset button").forEach(button=>button.addEventListener("click",()=>{
  const panel=button.closest("[data-case-panel]");panel.querySelectorAll("fieldset button").forEach(b=>b.classList.remove("best","partial","poor"));button.classList.add(button.dataset.quality);
  const feedback=panel.querySelector(".case-feedback");feedback.className=`case-feedback ${button.dataset.quality}`;feedback.textContent=button.dataset.feedback;
  if(!state.cases.includes(panel.dataset.caseId)){state.cases.push(panel.dataset.caseId);save()}
}));

function renderQuiz(){
  const list=document.querySelector("#quiz-list");list.innerHTML=quizQuestions.map((item,i)=>`<article class="quiz-question" data-quiz="${i}"><h3><span>${String(i+1).padStart(2,"0")}</span>${item.q}</h3><div class="answer-options">${item.a.map((answer,j)=>`<button type="button" data-answer="${j}">${answer}</button>`).join("")}</div><div class="quiz-feedback" aria-live="polite"></div></article>`).join("");
  Object.keys(state.quiz).forEach(i=>restoreQuestion(Number(i)));
  list.querySelectorAll("[data-answer]").forEach(button=>button.addEventListener("click",()=>answerQuestion(button)));
  showQuizResult();updateProgress();
}
function answerQuestion(button){const block=button.closest("[data-quiz]");const i=Number(block.dataset.quiz);if(Object.hasOwn(state.quiz,i))return;const chosen=Number(button.dataset.answer),correct=chosen===quizQuestions[i].correct;state.quiz[i]=correct;save();restoreQuestion(i,chosen);showQuizResult()}
function restoreQuestion(i,chosen=null){const block=document.querySelector(`[data-quiz="${i}"]`);if(!block)return;const buttons=[...block.querySelectorAll("[data-answer]")];buttons.forEach(b=>{b.disabled=true;if(Number(b.dataset.answer)===quizQuestions[i].correct)b.classList.add("correct")});if(chosen!==null&&!state.quiz[i])buttons[chosen].classList.add("incorrect");const feedback=block.querySelector(".quiz-feedback");feedback.className=`quiz-feedback show ${state.quiz[i]?"correct":"incorrect"}`;feedback.innerHTML=`<strong>${state.quiz[i]?"Correct.":"Not quite."}</strong> ${quizQuestions[i].e}`}
function showQuizResult(){const result=document.querySelector("#quiz-result"),answered=Object.keys(state.quiz).length;if(answered<8){result.hidden=true;return}const score=Object.values(state.quiz).filter(Boolean).length;result.hidden=false;result.innerHTML=`<h3>${score>=7?"Excellent release judgment.":score>=5?"Good foundation—review the explanations.":"Revisit the core workflows, then retry."}</h3><p>You scored ${score} of 8 (${Math.round(score/8*100)}%). Each explanation identifies the reasoning to carry into practice.</p>`}
document.querySelector("#retry-quiz").addEventListener("click",()=>{state.quiz={};save();renderQuiz();flash("Quiz reset. Try the questions again.")});
document.querySelector("#mark-summary").addEventListener("click",()=>{state.summary=true;if(!state.visited.includes("summary"))state.visited.push("summary");save();flash("Summary marked as reviewed.")});
document.querySelector("#reset-progress").addEventListener("click",()=>{if(!window.confirm("Reset all section, case, and quiz progress for this module?"))return;state={visited:[],cases:[],quiz:{},summary:false};save();location.hash="#home";renderQuiz();document.querySelectorAll(".case-feedback").forEach(el=>{el.className="case-feedback";el.textContent="Choose a response to see the reasoning."});document.querySelectorAll("fieldset button").forEach(b=>b.classList.remove("best","partial","poor"));flash("Module progress reset.")});

load();renderWorkflow("routine");renderQuiz();updateProgress();

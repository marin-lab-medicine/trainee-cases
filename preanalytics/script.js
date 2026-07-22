const storageKey="case10InterpretationProgressV1";
const sectionIds=["home","objectives","background","core","mechanisms","cases","quiz","summary"];
const navLinks=[...document.querySelectorAll(".nav-link")];
const sections=[...document.querySelectorAll("[data-section]")];
const menuToggle=document.querySelector(".menu-toggle");
const sidebar=document.querySelector(".sidebar");
const toast=document.querySelector("#toast");

const quizQuestions=[
  {q:"Which statement describes analytical sensitivity?",a:["The proportion of diseased patients who test positive","The smallest amount of analyte an assay can reliably detect","The probability of disease after a positive result","The ability of a negative test to rule out disease"],correct:1,e:"Analytical sensitivity concerns detection capability, such as a limit of detection. Clinical sensitivity concerns the proportion of patients with disease who test positive."},
  {q:"In a 2 × 2 table, what is the denominator for clinical sensitivity?",a:["TP + FP","TN + FN","TP + FN","TN + FP"],correct:2,e:"Sensitivity begins with patients who have disease: true positives divided by all diseased patients, TP/(TP+FN)."},
  {q:"A disease becomes much less prevalent in the tested population while sensitivity and specificity remain fixed. What usually happens?",a:["PPV rises","PPV falls","Sensitivity falls","Specificity rises"],correct:1,e:"When disease is rarer, false positives make up a larger share of all positive results, so PPV falls. Sensitivity and specificity do not change merely because prevalence changes."},
  {q:"A test has 90% sensitivity and 90% specificity. What is its positive likelihood ratio?",a:["0.11","1","9","90"],correct:2,e:"LR+ = sensitivity/(1-specificity) = 0.90/0.10 = 9."},
  {q:"Which expression correctly updates probability using a likelihood ratio?",a:["Pretest probability + LR = post-test probability","Pretest odds × LR = post-test odds","Pretest odds ÷ prevalence = post-test probability","Sensitivity × specificity = post-test odds"],correct:1,e:"Bayesian updating converts probability to odds, multiplies by the applicable likelihood ratio, and converts post-test odds back to probability."},
  {q:"Why is D-dimer most useful in appropriately selected patients with low or intermediate pretest probability?",a:["A positive result proves pulmonary embolism","A negative result can reduce probability below a testing threshold in an appropriate pathway","Specificity becomes 100% in low-risk patients","Pretest probability no longer matters"],correct:1,e:"D-dimer is commonly used as a rule-out test within validated clinical pathways. A positive result is nonspecific and generally requires further evaluation."},
  {q:"Two patients have identical elevated troponin concentrations. Which conclusion is justified from the laboratory value alone?",a:["Both have myocardial infarction","Both have myocardial injury","Neither has myocardial infarction","Both require identical treatment"],correct:1,e:"Troponin reflects myocardial injury. Infarction and its cause require clinical evidence, often including symptoms, ECG findings, imaging, and serial change."},
  {q:"What is the best first step before ordering a HIT immunoassay?",a:["Calculate the 4Ts score using accurate clinical information","Order the immunoassay in every thrombocytopenic patient","Stop all anticoagulation","Assume any platelet decrease is HIT"],correct:0,e:"ASH guidance recommends estimating clinical probability with the 4Ts score. Routine testing is discouraged with a low score unless uncertainty or missing information limits the score."},
  {q:"A low PLASMIC score and ADAMTS13 activity below 10% are discordant. What is the best response?",a:["Reject the assay result","Exclude TTP based only on the score","Investigate preanalytical, analytical, and clinical explanations and consult","Wait for spontaneous agreement between the data"],correct:2,e:"Prediction tools stratify risk but do not invalidate unexpected results. Severe deficiency warrants timely investigation of specimen timing, method, interference, score inputs, and the evolving presentation."},
  {q:"Which question best represents diagnostic stewardship?",a:["Can another panel be added?","Will this result change management in this patient?","Is the result outside the reference interval?","Can the test be ordered before examining the patient?"],correct:1,e:"Stewardship begins with a defined clinical question and asks whether the selected test, in the selected patient, can change a decision."}
];

let state={visited:[],cases:[],quiz:{},summary:false};
function load(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||"{}");state={...state,...saved};state.visited=state.visited||[];state.cases=state.cases||[];state.quiz=state.quiz||{};}catch{localStorage.removeItem(storageKey)}}
function save(){localStorage.setItem(storageKey,JSON.stringify(state));updateProgress()}
function flash(message){toast.textContent=message;toast.classList.add("show");clearTimeout(flash.timer);flash.timer=setTimeout(()=>toast.classList.remove("show"),2200)}
function updateProgress(){
  const sectionPart=state.visited.length/sectionIds.length*50;
  const casePart=state.cases.length/4*20;
  const quizPart=Object.keys(state.quiz).length/quizQuestions.length*25;
  const summaryPart=state.summary?5:0;
  const percent=Math.min(100,Math.round(sectionPart+casePart+quizPart+summaryPart));
  document.querySelector("#progress-label").textContent=`${percent}%`;
  document.querySelector("#progress-bar").style.width=`${percent}%`;
  document.querySelector("#progress-detail").textContent=`${state.visited.length} of ${sectionIds.length} sections visited`;
  navLinks.forEach(link=>link.classList.toggle("complete",state.visited.includes(link.hash.slice(1))));
  document.querySelector("#case-progress-text").textContent=`${state.cases.length} of 4 cases attempted`;
  document.querySelector("#case-progress-bar").style.width=`${state.cases.length/4*100}%`;
  const answered=Object.keys(state.quiz).length;
  const score=Object.values(state.quiz).filter(record=>typeof record==="boolean"?record:record.correct).length;
  document.querySelector("#quiz-score").textContent=`${score} / 10`;
  document.querySelector("#quiz-answered").textContent=`${answered} / 10`;
  const title=document.querySelector("#completion-title");
  const copy=document.querySelector("#completion-copy");
  if(percent===100){title.textContent="Module complete";copy.textContent=`You completed every activity and scored ${score} of 10 on the knowledge check.`}
  else{title.textContent=`${percent}% complete`;copy.textContent="Visit each section, attempt every case, and complete the quiz."}
}

menuToggle.addEventListener("click",()=>{const open=sidebar.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open))});
navLinks.forEach(link=>link.addEventListener("click",()=>{sidebar.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const id=entry.target.id;navLinks.forEach(link=>link.classList.toggle("active",link.hash===`#${id}`));if(!state.visited.includes(id)){state.visited.push(id);save()}}),{rootMargin:"-30% 0px -55% 0px"});
sections.forEach(section=>observer.observe(section));

document.querySelectorAll("[data-concept]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-concept]").forEach(item=>{item.classList.toggle("active",item===button);item.setAttribute("aria-selected",String(item===button))});
  document.querySelectorAll("[data-concept-panel]").forEach(panel=>{const active=panel.id===`concept-${button.dataset.concept}`;panel.hidden=!active;panel.classList.toggle("active",active)});
}));

const calcInputs={prevalence:document.querySelector("#prevalence"),sensitivity:document.querySelector("#sensitivity"),specificity:document.querySelector("#specificity")};
function formatCount(value){return Math.round(value).toLocaleString("en-US")}
function updateCalculator(){
  const population=10000;
  const prevalence=Number(calcInputs.prevalence.value)/100;
  const sensitivity=Number(calcInputs.sensitivity.value)/100;
  const specificity=Number(calcInputs.specificity.value)/100;
  const diseased=population*prevalence,noDisease=population-diseased;
  const tp=diseased*sensitivity,fn=diseased-tp,tn=noDisease*specificity,fp=noDisease-tn;
  const ppv=tp/(tp+fp),npv=tn/(tn+fn);
  document.querySelector("#prevalence-output").textContent=`${Number(calcInputs.prevalence.value).toFixed(Number(calcInputs.prevalence.value)<1?1:0)}%`;
  document.querySelector("#sensitivity-output").textContent=`${Number(calcInputs.sensitivity.value).toFixed(1).replace(".0","")}%`;
  document.querySelector("#specificity-output").textContent=`${Number(calcInputs.specificity.value).toFixed(1).replace(".0","")}%`;
  document.querySelector("#ppv-result").textContent=`${(ppv*100).toFixed(1)}%`;
  document.querySelector("#npv-result").textContent=`${(npv*100).toFixed(1)}%`;
  document.querySelector("#tp-count").textContent=formatCount(tp);document.querySelector("#fp-count").textContent=formatCount(fp);
  document.querySelector("#disease-count").textContent=formatCount(diseased);document.querySelector("#no-disease-count").textContent=formatCount(noDisease);
  document.querySelector("#fn-count").textContent=formatCount(fn);document.querySelector("#tn-count").textContent=formatCount(tn);
  document.querySelector("#tp-bar").style.width=`${ppv*100}%`;document.querySelector("#fp-bar").style.width=`${(1-ppv)*100}%`;
  const positives=tp+fp;
  document.querySelector("#population-explanation").textContent=`At ${Number(calcInputs.prevalence.value).toFixed(Number(calcInputs.prevalence.value)<1?1:0)}% pretest probability, about ${formatCount(tp)} of ${formatCount(positives)} positive results are true positives (${(ppv*100).toFixed(1)}% PPV).`;
}
Object.values(calcInputs).forEach(input=>input.addEventListener("input",updateCalculator));
document.querySelector("#reset-calculator").addEventListener("click",()=>{calcInputs.prevalence.value=1;calcInputs.sensitivity.value=99;calcInputs.specificity.value=99;updateCalculator()});

document.querySelectorAll("[data-case-target]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-case-target]").forEach(item=>item.classList.toggle("active",item===button));
  document.querySelectorAll("[data-case-panel]").forEach(panel=>{const active=panel.id===`case-${button.dataset.caseTarget}`;panel.hidden=!active;panel.classList.toggle("active",active)});
}));
document.querySelectorAll("[data-case-panel] fieldset button").forEach(button=>button.addEventListener("click",()=>{
  const panel=button.closest("[data-case-panel]");panel.querySelectorAll("fieldset button").forEach(item=>item.classList.remove("best","partial","poor"));button.classList.add(button.dataset.quality);
  const feedback=panel.querySelector(".case-feedback");feedback.className=`case-feedback ${button.dataset.quality}`;feedback.textContent=button.dataset.feedback;
  if(!state.cases.includes(panel.dataset.caseId)){state.cases.push(panel.dataset.caseId);save()}
}));
document.querySelectorAll(".consult-button").forEach(button=>button.addEventListener("click",()=>{const note=button.nextElementSibling;note.hidden=!note.hidden;button.textContent=note.hidden?button.textContent.replace("Hide","Reveal"):button.textContent.replace("Reveal","Hide")}));

function renderQuiz(){
  const list=document.querySelector("#quiz-list");
  list.innerHTML=quizQuestions.map((item,i)=>`<article class="quiz-question" data-quiz="${i}"><h3><span>${String(i+1).padStart(2,"0")}</span>${item.q}</h3><div class="answer-options">${item.a.map((answer,j)=>`<button type="button" data-answer="${j}">${answer}</button>`).join("")}</div><div class="quiz-feedback" aria-live="polite"></div></article>`).join("");
  Object.keys(state.quiz).forEach(index=>restoreQuestion(Number(index)));
  list.querySelectorAll("[data-answer]").forEach(button=>button.addEventListener("click",()=>answerQuestion(button)));
  showQuizResult();updateProgress();
}
function answerQuestion(button){const block=button.closest("[data-quiz]");const index=Number(block.dataset.quiz);if(Object.hasOwn(state.quiz,index))return;const chosen=Number(button.dataset.answer);state.quiz[index]={correct:chosen===quizQuestions[index].correct,chosen};save();restoreQuestion(index);showQuizResult()}
function restoreQuestion(index){const block=document.querySelector(`[data-quiz="${index}"]`);if(!block)return;const record=state.quiz[index];const correct=typeof record==="boolean"?record:record.correct;const chosen=typeof record==="boolean"?null:record.chosen;block.querySelectorAll("[data-answer]").forEach(button=>{button.disabled=true;const answer=Number(button.dataset.answer);if(answer===quizQuestions[index].correct)button.classList.add("correct");if(chosen===answer&&!correct)button.classList.add("incorrect")});const feedback=block.querySelector(".quiz-feedback");feedback.className=`quiz-feedback show ${correct?"correct":"incorrect"}`;feedback.innerHTML=`<strong>${correct?"Correct.":"Not quite."}</strong> ${quizQuestions[index].e}`}
function showQuizResult(){const result=document.querySelector("#quiz-result");const answered=Object.keys(state.quiz).length;if(answered<quizQuestions.length){result.hidden=true;return}const score=Object.values(state.quiz).filter(record=>typeof record==="boolean"?record:record.correct).length;result.hidden=false;result.innerHTML=`<h3>${score>=9?"Excellent diagnostic reasoning.":score>=7?"Strong foundation. Review any missed explanations.":"Revisit the probability model and core concepts, then retry."}</h3><p>You scored ${score} of ${quizQuestions.length} (${Math.round(score/quizQuestions.length*100)}%).</p>`}

document.querySelector("#retry-quiz").addEventListener("click",()=>{state.quiz={};save();renderQuiz();flash("Quiz reset. Try the questions again.")});
document.querySelector("#mark-summary").addEventListener("click",()=>{state.summary=true;if(!state.visited.includes("summary"))state.visited.push("summary");save();flash("Summary marked as reviewed.")});
document.querySelector("#reset-progress").addEventListener("click",()=>{if(!window.confirm("Reset all section, case, and quiz progress for this module?"))return;state={visited:[],cases:[],quiz:{},summary:false};save();renderQuiz();document.querySelectorAll(".case-feedback").forEach(item=>{item.className="case-feedback";item.textContent="Choose a response to see the diagnostic reasoning."});document.querySelectorAll("[data-case-panel] fieldset button").forEach(item=>item.classList.remove("best","partial","poor"));location.hash="#home";flash("Module progress reset.")});

load();updateCalculator();renderQuiz();updateProgress();

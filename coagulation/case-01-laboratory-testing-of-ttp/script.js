(function () {
  const criteria = document.getElementById('plasmic-criteria');
  if (!criteria) return;
  const scoreEl = document.getElementById('plasmic-score');
  const resultEl = document.getElementById('plasmic-result');
  function update() {
    const score = criteria.querySelectorAll('input:checked').length;
    scoreEl.textContent = score;
    let group = 'Low risk', risk = '0%', note = 'A low score makes severe deficiency less likely in the source model.';
    if (score === 5) { group = 'Intermediate risk'; risk = '6%'; note = 'Proceed with urgent ADAMTS13 testing and integrate the full clinical picture.'; }
    if (score >= 6) { group = 'High risk'; risk = '72%'; note = 'Severe ADAMTS13 deficiency is likely. Testing is confirmatory, but treatment should not await a delayed result when suspicion is high.'; }
    resultEl.innerHTML = `<span>Current interpretation</span><h3>${group}</h3><strong>${risk} risk of severe ADAMTS13 deficiency*</strong><p>${note}</p><small>*Risk values reproduced from the supplied educational source.</small>`;
  }
  criteria.addEventListener('change', update);
})();

const TTP_CASES = (() => {
  const stages = [
    {
      label: 'Presentation', title: 'A concerning constellation', step: 'Stage 1 · Emergency department',
      text: 'A 25-year-old woman presents with fever, severe headache, and confusion after a two-week upper respiratory illness. Head CT shows no acute intracranial process.',
      labs: [['Hematocrit','19%','Low'],['Platelets','15 × 10⁹/L','Low'],['LDH','1050 U/L','High'],['Haptoglobin','<10 mg/dL','Absent'],['Total bilirubin','3.1 mg/dL','High'],['Indirect bilirubin','2.1 mg/dL','High']],
      question: 'Which unifying process should be recognized first?',
      choices: ['Immune hemolytic anemia','Microangiopathic hemolytic anemia','Isolated immune thrombocytopenia','Acute blood loss'], correct: 1,
      explanation: 'Anemia, thrombocytopenia, markedly elevated LDH, absent haptoglobin, and indirect hyperbilirubinemia strongly support intravascular hemolysis with platelet consumption. The next step is to confirm fragmentation on the smear.'
    },
    {
      label: 'Smear', title: 'The smear clarifies the process', step: 'Stage 2 · Initial laboratory workup',
      text: 'The direct and indirect antiglobulin tests are negative. The peripheral smear shows severe thrombocytopenia and frequent schistocytes, accounting for approximately 1–2% of red cells.',
      labs: [['DAT','Negative',''],['Schistocytes','1–2%','Present'],['Creatinine','Normal',''],['PT / aPTT','Normal',''],['Fibrinogen','Normal',''],['D-dimer','Minimally elevated','']],
      question: 'Which feature most strongly argues against overt DIC?',
      choices: ['Elevated LDH','Neurologic symptoms','Normal PT, aPTT, and fibrinogen','Schistocytes'], correct: 2,
      explanation: 'Schistocytes and high LDH may occur in more than one microangiopathic process. Preserved routine coagulation parameters and fibrinogen make overt consumptive coagulopathy less likely.'
    },
    {
      label: 'Pretest risk', title: 'Estimate severe deficiency', step: 'Stage 3 · Before ADAMTS13 results',
      text: 'Platelets are below 30 × 10⁹/L, hemolysis is present, there is no active cancer or transplant history, INR is below 1.5, and creatinine is below 2.0 mg/dL. MCV should be verified to complete the PLASMIC score.',
      question: 'What is the best use of the PLASMIC score?',
      choices: ['It definitively diagnoses immune TTP','It estimates the probability of severe ADAMTS13 deficiency','It determines the plasma-exchange duration','It replaces ADAMTS13 activity testing'], correct: 1,
      explanation: 'PLASMIC is a pretest probability tool. It helps estimate the likelihood of severe ADAMTS13 deficiency while confirmatory testing is pending; it does not replace testing or clinical judgment.'
    },
    {
      label: 'Testing', title: 'Protect the diagnostic specimen', step: 'Stage 4 · Laboratory selection',
      text: 'Treatment is about to begin. The team calls the coagulation laboratory to clarify collection requirements.',
      question: 'Which collection plan is best?',
      choices: ['EDTA plasma after the first exchange','Serum collected before treatment','Citrated platelet-poor plasma collected before treatment','Any plasma type after corticosteroids'], correct: 2,
      explanation: 'Collect citrated platelet-poor plasma before therapy. EDTA chelates metal ions required by this metalloproteinase, serum formation exposes ADAMTS13 to thrombin, and therapy can alter measured levels.'
    },
    {
      label: 'Resolution', title: 'Classify and follow the disease', step: 'Stage 5 · Results and remission',
      text: 'The acute specimen shows ADAMTS13 activity <5% and a 1.8-BU inhibitor. After plasma exchange and prednisone, symptoms, thrombocytopenia, and hemolysis resolve. In remission, activity is 15% with a 0.6-BU inhibitor.',
      question: 'What is the most appropriate interpretation?',
      choices: ['Hereditary TTP is established','The acute pattern supports acquired immune TTP, with ongoing relapse risk','The remission result excludes relapse risk','Plasma exchange should continue until activity normalizes'], correct: 1,
      explanation: 'Severe activity deficiency plus an inhibitor supports acquired immune TTP. Persistent reduced activity and inhibitor in remission warrant close surveillance. Acute exchange duration is guided by platelet recovery and resolution of hemolysis and symptoms, not activity normalization alone.'
    }
  ];
  let current = 0, answered = new Set();
  function init() { renderTimeline(); renderStage(); }
  function renderTimeline() {
    const el = document.getElementById('case-timeline'); if (!el) return;
    el.innerHTML = stages.map((s,i)=>`<button class="timeline-step ${i===current?'active':''} ${answered.has(i)?'done':''}" data-stage="${i}"><small>0${i+1}</small><br><strong>${s.label}</strong></button>`).join('');
    el.querySelectorAll('button').forEach(b=>b.onclick=()=>{ current=+b.dataset.stage; renderTimeline(); renderStage(); });
  }
  function renderStage() {
    const s=stages[current], el=document.getElementById('case-stage'); if(!el)return;
    const labs=s.labs?`<div class="lab-grid">${s.labs.map(x=>`<div class="lab"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('')}</div>`:'';
    el.innerHTML=`<div class="case-banner"><span class="eyebrow">${s.step}</span><h2>${s.title}</h2></div><p>${s.text}</p>${labs}<h3>${s.question}</h3><div class="choice-list">${s.choices.map((c,i)=>`<button data-choice="${i}">${String.fromCharCode(65+i)}. ${c}</button>`).join('')}</div><div id="case-feedback"></div>`;
    el.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(+b.dataset.choice));
  }
  function answer(choice) {
    const s=stages[current], buttons=document.querySelectorAll('#case-stage [data-choice]');
    buttons.forEach((b,i)=>{b.disabled=true;if(i===s.correct)b.classList.add('correct');if(i===choice)b.classList.add('selected',i===s.correct?'correct':'wrong')});
    answered.add(current); renderTimeline();
    document.getElementById('case-feedback').innerHTML=`<div class="case-feedback"><strong>${choice===s.correct?'Correct.':'Not quite.'}</strong> ${s.explanation}</div>${current<stages.length-1?'<button class="button primary case-next" id="case-next">Continue case →</button>':'<button class="button primary case-next" data-go="quiz">Go to knowledge check →</button>'}`;
    const next=document.getElementById('case-next'); if(next)next.onclick=()=>{current++;renderTimeline();renderStage()};
    document.querySelectorAll('#case-feedback [data-go]').forEach(b=>b.onclick=()=>window.TTP_APP.go(b.dataset.go));
  }
  return {init};
})();
document.addEventListener('DOMContentLoaded',TTP_CASES.init);

const TTP_QUIZ = (() => {
  const questions = [
    {q:'Which combination most strongly supports MAHA in this patient?',a:['Low hematocrit and fever','Schistocytes, elevated LDH, low haptoglobin, and indirect hyperbilirubinemia','Thrombocytopenia and headache alone','Negative antiglobulin testing alone'],c:1,e:'Fragmented red cells plus biochemical evidence of intravascular hemolysis establish the MAHA pattern. Negative antiglobulin testing supports a nonimmune mechanism but is not sufficient alone.'},
    {q:'Which anticoagulant is unacceptable for an ADAMTS13 activity specimen?',a:['Sodium citrate','EDTA','No anticoagulant is acceptable','Either citrate or EDTA'],c:1,e:'EDTA strongly chelates metal ions needed for ADAMTS13 metalloproteinase activity and may produce an artifactually absent result.'},
    {q:'When should the diagnostic ADAMTS13 specimen ideally be collected?',a:['After the first plasma exchange','Only after the platelet count recovers','Before therapy begins','During remission'],c:2,e:'Treatment alters ADAMTS13 levels. A pretreatment specimen best preserves diagnostic information even though therapy should not be delayed while awaiting results.'},
    {q:'In a FRET-VWF73 assay, ADAMTS13 activity is detected by:',a:['Direct measurement of antigen concentration','Fluorescent emission after cleavage separates a fluorophore from its quencher','Clot formation after adding tissue factor','Agglutination of antibody-coated particles'],c:1,e:'The VWF73 substrate places a fluorophore and quencher around the cleavage site. Cleavage produces fluorescence proportional to protease activity.'},
    {q:'Marked icterus may cause some solution-phase FRET assays to:',a:['Overestimate activity because bilirubin fluoresces','Underestimate activity because bilirubin quenches emission','Report a false inhibitor only when creatinine is high','Become insensitive to hemoglobin'],c:1,e:'At sufficiently high concentrations, bilirubin can quench fluorescence and underestimate activity. The effect depends on the substrate and may be reduced by specimen dilution.'},
    {q:'A Bethesda assay is designed primarily to detect:',a:['ADAMTS13 antigen','Neutralizing ADAMTS13 antibodies','All non-neutralizing antibodies','ADAMTS13 gene variants'],c:1,e:'Bethesda-style mixing studies detect functional neutralization. They miss some pathogenic non-neutralizing antibodies that can be detected by binding ELISA.'},
    {q:'What does ADAMTS13 activity of 35% mean in a critically ill patient?',a:['It proves TTP','It proves hereditary TTP','It is nonspecific and may reflect decreased synthesis or increased consumption','It excludes any thrombotic microangiopathy'],c:2,e:'Mild-to-moderate reductions occur in several illnesses. Severe deficiency—classically below 10%—is the much more diagnostically useful finding in the proper clinical context.'},
    {q:'During remission, persistent reduced ADAMTS13 activity and a detectable inhibitor should prompt:',a:['No further laboratory follow-up','Immediate exclusion of immune TTP','Recognition of continued relapse risk and close monitoring','Plasma exchange until activity reaches 100%'],c:2,e:'Persistent deficiency or inhibitor during clinical remission is associated with relapse risk. Acute treatment duration is based on clinical and hematologic recovery rather than activity normalization alone.'}
  ];
  let current=0,score=0,locked=false;
  function render(){const el=document.getElementById('quiz-content');if(!el)return;locked=false;const q=questions[current];document.getElementById('quiz-count').textContent=`Question ${current+1} of ${questions.length}`;document.getElementById('quiz-score').textContent=`${score} correct`;document.getElementById('quiz-progress').style.width=`${current/questions.length*100}%`;el.innerHTML=`<div class="quiz-question"><span class="eyebrow">Single best answer</span><h2>${q.q}</h2>${q.a.map((x,i)=>`<button class="quiz-option" data-answer="${i}"><b>${String.fromCharCode(65+i)}.</b> ${x}</button>`).join('')}<div id="quiz-feedback"></div></div>`;el.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(+b.dataset.answer));}
  function answer(i){if(locked)return;locked=true;const q=questions[current],ok=i===q.c;if(ok)score++;document.querySelectorAll('.quiz-option').forEach((b,n)=>{b.disabled=true;if(n===q.c)b.classList.add('correct');if(n===i&&!ok)b.classList.add('wrong')});document.getElementById('quiz-score').textContent=`${score} correct`;document.getElementById('quiz-feedback').innerHTML=`<div class="quiz-explanation ${ok?'':'wrong'}"><strong>${ok?'Correct.':'Incorrect.'}</strong> ${q.e}</div><button class="button primary quiz-next" id="quiz-next">${current===questions.length-1?'View results':'Next question →'}</button>`;document.getElementById('quiz-next').onclick=next;}
  function next(){current++;if(current<questions.length){render();return}result();}
  function result(){const pct=Math.round(score/questions.length*100);document.getElementById('quiz-count').textContent='Quiz complete';document.getElementById('quiz-progress').style.width='100%';document.getElementById('quiz-content').innerHTML=`<div class="quiz-result"><span class="eyebrow">Your result</span><div class="result-ring" style="--score:${pct}%"><strong>${score}/${questions.length}</strong></div><h2>${pct>=75?'Strong laboratory judgment':'Review, then try again'}</h2><p>${pct>=75?'You demonstrated a solid grasp of specimen selection, method principles, and clinical interpretation.':'Revisit the core content, especially the assay and preanalytical sections, before another attempt.'}</p><button class="button secondary" id="quiz-retry">Retry quiz</button> <button class="button primary" data-go="summary">Continue to summary →</button></div>`;document.getElementById('quiz-retry').onclick=()=>{current=0;score=0;render()};document.querySelector('[data-go="summary"]').onclick=()=>window.TTP_APP.go('summary');}
  return{init:render};
})();
document.addEventListener('DOMContentLoaded',TTP_QUIZ.init);

const TTP_APP = (() => {
  const sectionIds=['home','objectives','background','core','mechanisms','cases','quiz','summary'];
  let current='home';
  let completed=new Set(JSON.parse(localStorage.getItem('ttp-completed')||'[]'));
  const details={
    fragment:['01','Mechanical hemolysis','Red cells traversing platelet-rich microvascular thrombi fragment, producing schistocytes and intravascular hemolysis. A negative direct antiglobulin test supports a nonimmune mechanism.','Peripheral smear','In the source case, schistocytes account for approximately 1–2% of red cells.'],
    platelets:['02','Platelet-rich microthrombi','Ultra-large VWF multimers recruit platelets in the microcirculation. Consumption within these thrombi can produce striking thrombocytopenia, as in the source platelet count of 15 × 10⁹/L.','Clinical implication','Severe thrombocytopenia plus MAHA should accelerate the TTP evaluation.'],
    organs:['03','Microvascular ischemia','Platelet-rich thrombi impair tissue perfusion. Headache and confusion are prominent in this case, while the normal creatinine reminds us that severe renal injury is not required for TTP.','Diagnostic discipline','Do not wait for a historical “pentad.” Integrate the active syndrome and laboratory data.'],
    coag:['04','A different kind of consumption','TTP forms platelet-rich microthrombi without the widespread coagulation-factor consumption typical of overt DIC. Normal PT, aPTT, and fibrinogen therefore support—but do not independently prove—the distinction.','Pattern recognition','A minimally elevated D-dimer does not outweigh the preserved coagulation profile.']
  };
  const specimens=[
    {title:'Pretreatment citrated platelet-poor plasma',type:'blue',desc:'Collected before plasma exchange and processed promptly.',answer:'test',why:'This is the preferred diagnostic specimen and timing for ADAMTS13 testing.'},
    {title:'EDTA plasma',type:'purple',desc:'Purple-top plasma arrives with an urgent activity request.',answer:'reject',why:'EDTA strongly chelates the metal ions required for ADAMTS13 activity and can produce an artifactually absent result—even in normal plasma.'},
    {title:'Serum specimen',type:'red',desc:'Collected before therapy, but the blood was allowed to clot.',answer:'reject',why:'Thrombin generated during clot formation can degrade ADAMTS13. Citrated platelet-poor plasma is preferred.'},
    {title:'Markedly hemolyzed citrated plasma',type:'pink',desc:'Visible hemolysis; estimated free hemoglobin exceeds 2 g/L.',answer:'qualify',why:'Free hemoglobin inhibits ADAMTS13 activity. Some in vivo hemolysis may be unavoidable, but marked hemolysis can compromise interpretation and should be documented or recollected when feasible.'},
    {title:'Frozen citrated plasma',type:'frozen',desc:'Separated promptly and frozen because testing could not occur within four hours.',answer:'test',why:'Freezing is appropriate when testing cannot occur within four hours. Avoid repeated freeze–thaw cycles.'},
    {title:'Post-exchange citrated plasma',type:'blue',desc:'Collected after therapeutic plasma exchange began.',answer:'qualify',why:'Therapy changes ADAMTS13 levels. Testing may still yield information, but this is not an ideal diagnostic specimen; seek a retained pretreatment sample if available.'}
  ];
  let specimenIndex=0;
  const assays={
    fret:{title:'FRET-VWF73 activity assay',body:'A VWF73 peptide carries a fluorophore and quencher flanking the ADAMTS13 cleavage site. Cleavage separates them, producing fluorescence in direct proportion to activity.',points:['Functional first-line method','Typical analytical time of approximately 1–3 hours','Some substrates are vulnerable to bilirubin quenching','Dilution may minimize icteric interference']},
    chrom:{title:'Chromogenic activity ELISA',body:'Cleavage of VWF73 exposes a specific amino-acid sequence. An HRP-conjugated antibody recognizes the exposed site, and a subsequent reaction produces color.',points:['Measures function with a chromogenic endpoint','Uses capture and wash steps','Avoids direct fluorescence measurement','Still requires laboratory validation and quality control']},
    antigen:{title:'ADAMTS13 antigen assay',body:'Antigen methods quantify protein concentration rather than proteolytic function. They are less useful as a first-line test because a neutralizing antibody can leave antigen present while function is severely impaired.',points:['Measures amount, not activity','Insensitive to purely neutralizing inhibition','Rarely used as the primary diagnostic assay','May have selected research or complementary roles']},
    ldt:{title:'Laboratory-developed activity methods',body:'Some laboratories use synthetic substrates with in-house FRET procedures or specialized detection such as mass spectrometry. These methods require rigorous local validation.',points:['Can leverage available synthetic substrates','May offer specialized analytical capabilities','Greater technical complexity','Turnaround time and access vary']}
  };
  const mechanisms=[
    ['Normal physiology','Endothelial cells release ultra-large von Willebrand factor multimers that unfurl under shear stress.','UL','VWF','Flow'],
    ['Controlled cleavage','ADAMTS13 cleaves the VWF A2 domain, regulating multimer size and limiting excessive platelet adhesion.','VWF','✂','Fragments'],
    ['Severe functional deficiency','When activity falls below approximately 10%, ultra-large VWF multimers persist in the microcirculation.','UL-VWF','AD13↓','Persist'],
    ['Platelet-rich thrombi','Persistent multimers capture platelets, forming platelet-rich microvascular thrombi and consuming circulating platelets.','VWF','PLT','Thrombus'],
    ['MAHA and ischemia','Red cells fragment across the obstructed microvasculature while impaired perfusion produces neurologic and other organ manifestations.','RBC','⌁','Ischemia']
  ];
  let mechanismIndex=0;
  function save(){localStorage.setItem('ttp-completed',JSON.stringify([...completed]));localStorage.setItem('ttp-current',current)}
  function setCurrent(id,markPrevious=true){if(!sectionIds.includes(id)||id===current)return;if(markPrevious)completed.add(current);current=id;document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.section===id));updateProgress();save()}
  function go(id){if(!sectionIds.includes(id))return;setCurrent(id,true);document.querySelector('.sidebar').classList.remove('open');document.getElementById('menu-button').setAttribute('aria-expanded','false');document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'})}
  function observeSections(){const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(e=>setCurrent(e.target.id,true))},{rootMargin:'-18% 0px -72% 0px',threshold:0});document.querySelectorAll('.module-section').forEach(section=>observer.observe(section))}
  function updateProgress(){const pct=Math.round(completed.size/sectionIds.length*100);document.getElementById('progress-percent').textContent=`${pct}%`;document.getElementById('mobile-progress').textContent=`${pct}%`;document.getElementById('progress-bar').style.width=`${pct}%`;document.getElementById('progress-detail').textContent=`${completed.size} of ${sectionIds.length} sections complete`;document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('complete',completed.has(b.dataset.section)));const idx=sectionIds.indexOf(current);document.getElementById('footer-section').textContent=`${String(idx+1).padStart(2,'0')} / 08 · ${document.getElementById(current).dataset.title}`;document.getElementById('previous-section').disabled=idx===0;document.getElementById('next-section').textContent=idx===sectionIds.length-1?'Finish ✓':'Next →'}
  function renderSpecimen(){const s=specimens[specimenIndex],el=document.getElementById('specimen-card');document.getElementById('specimen-counter').textContent=`${specimenIndex+1} / ${specimens.length}`;el.innerHTML=`<div class="specimen-vignette"><div class="tube ${s.type}" aria-hidden="true"></div><div><span class="eyebrow">Specimen ${specimenIndex+1}</span><h2>${s.title}</h2><p>${s.desc}</p></div></div><div class="decision-buttons"><button data-decision="test">Accept for testing</button><button data-decision="qualify">Test with qualification</button><button data-decision="reject">Reject / recollect</button></div><div id="specimen-feedback"></div>`;el.querySelectorAll('[data-decision]').forEach(b=>b.onclick=()=>{const ok=b.dataset.decision===s.answer;el.querySelectorAll('[data-decision]').forEach(x=>x.disabled=true);document.getElementById('specimen-feedback').innerHTML=`<div class="feedback-box ${ok?'':'wrong'}"><strong>${ok?'Good laboratory decision.':'Consider the mechanism of interference.'}</strong>${s.why}</div><button class="button primary next-card" id="next-specimen">${specimenIndex===specimens.length-1?'Start again':'Next specimen →'}</button>`;document.getElementById('next-specimen').onclick=()=>{specimenIndex=(specimenIndex+1)%specimens.length;renderSpecimen()}})}
  function renderAssay(key='fret'){const a=assays[key];document.getElementById('assay-detail').innerHTML=`<div><span class="eyebrow">Method principle</span><h2>${a.title}</h2><p>${a.body}</p></div><div><strong>Laboratory considerations</strong><ul>${a.points.map(x=>`<li>${x}</li>`).join('')}</ul></div>`}
  function renderMechanism(){const m=mechanisms[mechanismIndex];document.getElementById('mechanism-stage').innerHTML=`<span class="step-label">Step ${mechanismIndex+1}</span><h2>${m[0]}</h2><p>${m[1]}</p><div class="mechanism-diagram" aria-hidden="true"><div class="line"></div><span class="node n1">${m[2]}</span><span class="node n2">${m[3]}</span><span class="node n3">${m[4]}</span></div>`;document.getElementById('mechanism-rail').innerHTML=mechanisms.map((_,i)=>`<span class="step-dot ${i===mechanismIndex?'active':i<mechanismIndex?'past':''}"></span>`).join('');document.getElementById('mechanism-count').textContent=`${mechanismIndex+1} of ${mechanisms.length}`;document.getElementById('mechanism-prev').disabled=mechanismIndex===0;document.getElementById('mechanism-next').textContent=mechanismIndex===mechanisms.length-1?'Restart ↺':'Next step →'}
  function renderDisease(type='immune'){const immune=type==='immune';document.getElementById('disease-panel').innerHTML=immune?`<div><span class="eyebrow">Mechanism</span><div class="big-stat">Autoantibody</div></div><div><h2>Acquired immune TTP</h2><p>Autoantibodies may neutralize functional sites, accelerate ADAMTS13 clearance without directly neutralizing function, or do both. Activity assays are sensitive to all these routes to functional deficiency.</p></div>`:`<div><span class="eyebrow">Mechanism</span><div class="big-stat">Variants</div></div><div><h2>Hereditary TTP</h2><p>Pathogenic ADAMTS13 variants cause congenital deficiency (Upshaw–Schulman syndrome). Severe activity deficiency without an identifiable antibody—interpreted carefully alongside history—raises this possibility.</p></div>`}
  function toast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}
  function init(){document.querySelectorAll('[data-section],[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.section||b.dataset.go)));document.getElementById('menu-button').onclick=()=>{const s=document.getElementById('sidebar'),open=s.classList.toggle('open');document.getElementById('menu-button').setAttribute('aria-expanded',open)};document.getElementById('previous-section').onclick=()=>{const i=sectionIds.indexOf(current);if(i>0)go(sectionIds[i-1])};document.getElementById('next-section').onclick=()=>{const i=sectionIds.indexOf(current);if(i<sectionIds.length-1)go(sectionIds[i+1]);else{completed=new Set(sectionIds);updateProgress();save();toast('Module complete — excellent work.')}};document.getElementById('complete-module').onclick=()=>{completed=new Set(sectionIds);updateProgress();save();toast('Module complete — excellent work.')};document.getElementById('reset-progress').onclick=()=>{if(confirm('Reset saved progress and return to the home page?')){completed.clear();localStorage.removeItem('ttp-completed');localStorage.removeItem('ttp-current');go('home')}};
    const prior=localStorage.getItem('ttp-current');if(prior&&prior!=='home'){const r=document.getElementById('resume-button');r.hidden=false;r.onclick=()=>go(prior)}
    document.querySelectorAll('.feature').forEach(b=>b.onclick=()=>{document.querySelectorAll('.feature').forEach(x=>x.classList.remove('active'));b.classList.add('active');const d=details[b.dataset.detail];document.getElementById('background-detail').innerHTML=`<span class="detail-number">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p><div class="mini-pearl"><b>${d[3]}</b><span>${d[4]}</span></div>`});
    document.querySelectorAll('.content-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.content-tab').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false')});document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');b.setAttribute('aria-selected','true');document.getElementById(`tab-${b.dataset.tab}`).classList.add('active')});
    document.querySelectorAll('.assay-card').forEach(b=>b.onclick=()=>{document.querySelectorAll('.assay-card').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderAssay(b.dataset.assay)});
    document.getElementById('mechanism-prev').onclick=()=>{if(mechanismIndex>0)mechanismIndex--;renderMechanism()};document.getElementById('mechanism-next').onclick=()=>{mechanismIndex=mechanismIndex===mechanisms.length-1?0:mechanismIndex+1;renderMechanism()};document.querySelectorAll('[data-disease]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-disease]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDisease(b.dataset.disease)});
    renderSpecimen();renderAssay();renderMechanism();renderDisease();updateProgress();observeSections();
  }
  document.addEventListener('DOMContentLoaded',init);
  return{go};
})();
window.TTP_APP=TTP_APP;

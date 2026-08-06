(() => {
  const values = {P:'unknown',L:'unknown',A:'unknown',S:'unknown',M:'unknown',I:'unknown',C:'unknown'};
  const categories = {
    low: {title:'Low risk',range:'Score 0–4',text:'Severe ADAMTS13 deficiency is less likely, but clinical context and definitive testing still matter.'},
    intermediate: {title:'Intermediate risk',range:'Score 5',text:'Severe ADAMTS13 deficiency remains possible. Continue urgent evaluation and interpret the full syndrome.'},
    high: {title:'High risk',range:'Score 6–7',text:'Severe ADAMTS13 deficiency is more likely. If immune TTP is suspected, obtain pretreatment testing and follow the emergency treatment pathway.'}
  };

  function render() {
    const yes = Object.values(values).filter(v => v === 'yes').length;
    const unknown = Object.values(values).filter(v => v === 'unknown').length;
    const score = document.getElementById('plasmic-score');
    const result = document.getElementById('plasmic-result');
    if (!score || !result) return;
    score.textContent = yes;
    if (unknown) {
      result.innerHTML = `<span>Current interpretation</span><h3>Incomplete</h3><strong>${yes} confirmed point${yes===1?'':'s'} · ${unknown} unknown</strong><p>The possible final score is ${yes}–${yes+unknown}. Resolve missing values before assigning a formal risk category.</p><small>PLASMIC predicts severe ADAMTS13 deficiency; it does not diagnose TTP or determine the cause of TMA.</small>`;
      return;
    }
    const key = yes <= 4 ? 'low' : yes === 5 ? 'intermediate' : 'high';
    const c = categories[key];
    result.innerHTML = `<span>Current interpretation</span><h3>${c.title}</h3><strong>${yes} / 7 · ${c.range}</strong><p>${c.text}</p><small>A score never substitutes for ADAMTS13 testing or clinical judgment.</small>`;
  }

  function select(field, value) {
    values[field.dataset.key] = value;
    field.querySelectorAll('[data-value]').forEach(b => b.classList.toggle('selected', b.dataset.value === value));
    render();
  }

  function init() {
    const root = document.getElementById('plasmic-criteria');
    if (!root) return;
    root.querySelectorAll('fieldset').forEach(field => field.querySelectorAll('[data-value]').forEach(button => button.addEventListener('click', () => select(field, button.dataset.value))));
    document.getElementById('load-case-values').addEventListener('click', () => {
      const known = {P:'yes',L:'yes',A:'yes',S:'no',M:'unknown',I:'unknown',C:'unknown'};
      root.querySelectorAll('fieldset').forEach(field => select(field, known[field.dataset.key]));
    });
    render();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
(() => {
  const stages = [
    {
      day:'POD 9', label:'First signal', title:'Fever and altered mental status',
      body:'A 56-year-old woman underwent orthotopic heart and liver transplantation. Tacrolimus began on POD 4. On POD 9 she develops fever, leukocytosis, and altered mental status; cultures and imaging reveal no active infection.',
      labs:[['Context','Heart–liver transplant'],['Drug','Tacrolimus'],['Cultures','No growth'],['Imaging','No infection']],
      question:'Which next approach is most appropriate?',
      options:['Diagnose TTP immediately','Continue surveillance and investigate evolving organ dysfunction','Exclude TMA because thrombocytopenia is not yet described'], correct:1,
      explain:'TMA cannot yet be established, but the transplant setting and calcineurin-inhibitor exposure create risk. Follow the CBC, hemolysis markers, renal function, blood pressure, graft status, and neurologic course.'
    },
    {
      day:'POD 11', label:'Organ injury', title:'Oliguria and worsening thrombocytopenia',
      body:'Urine output falls despite diuretics. Creatinine rises and thrombocytopenia worsens.',
      labs:[['Urine output','Decreased'],['Creatinine','Elevated'],['Platelets','Falling'],['Response to diuretic','Poor']],
      question:'Which laboratory pattern would most strongly support TMA?',
      options:['Positive DAT with spherocytes','Schistocytes with increased LDH and low haptoglobin','Prolonged PT alone'], correct:1,
      explain:'The combination of red-cell fragmentation and intravascular hemolysis supports MAHA. Coupled with thrombocytopenia and kidney injury, it establishes a clinical TMA syndrome.'
    },
    {
      day:'POD 16', label:'TMA recognized', title:'Schistocytes and biochemical hemolysis',
      body:'The smear shows schistocytes. LDH is 535 IU/L, haptoglobin is below 15 mg/dL, and platelets fall to 25 × 10⁹/L. Plasma exchange is initiated for suspected TTP.',
      labs:[['Platelets','25 × 10⁹/L'],['LDH','535 IU/L'],['Haptoglobin','<15 mg/dL'],['Smear','Schistocytes']],
      question:'What is the most precise interpretation at this moment?',
      options:['TMA is established; TTP remains an urgent possibility pending ADAMTS13','Immune TTP is proven','The findings are specific for tacrolimus toxicity'], correct:0,
      explain:'These findings establish TMA, not its etiology. Because untreated immune TTP is dangerous, pretreatment ADAMTS13 sampling and empiric emergency management may be appropriate while the result is pending.'
    },
    {
      day:'POD 17', label:'Pathology', title:'Renal cortical necrosis and microthrombi',
      body:'Renal biopsy demonstrates cortical necrosis with microthrombi. Ultrasound later shows no flow to the left kidney.',
      labs:[['Biopsy','Microthrombi'],['Cortex','Necrosis'],['Left kidney','No flow'],['Pattern','Renal TMA']],
      question:'What does the biopsy establish?',
      options:['Immune TTP specifically','Complement-mediated TMA specifically','TMA with severe renal injury, without a specific etiology'], correct:2,
      explain:'Microthrombi and cortical necrosis corroborate organ-level TMA. Morphology alone generally cannot distinguish TTP from drug-, transplant-, complement-, or hypertension-associated TMA.'
    },
    {
      day:'POD 18+', label:'Reclassification', title:'ADAMTS13 activity returns at 62%',
      body:'Tacrolimus is discontinued. ADAMTS13 activity is mildly below the laboratory reference interval of 67%, but well above the severe-deficiency threshold.',
      labs:[['ADAMTS13','62%'],['TTP threshold','<10%'],['Tacrolimus','Discontinued'],['Clinical course','Improving']],
      question:'Which final classification is most defensible?',
      options:['Immune TTP','Tacrolimus-/transplant-associated TMA','Congenital TTP'], correct:1,
      explain:'An activity of 62% does not support TTP. In this transplant recipient, the exposure history, renal-predominant injury, pathology, and improvement after tacrolimus withdrawal support tacrolimus-associated or transplant-associated TMA.'
    }
  ];
  let index = 0;

  function render() {
    const timeline = document.getElementById('case-timeline');
    const stage = document.getElementById('case-stage');
    if (!timeline || !stage) return;
    timeline.innerHTML = stages.map((s,i)=>`<button class="timeline-step ${i===index?'active':''} ${i<index?'past':''}" data-stage="${i}"><span>${i+1}</span><strong>${s.day}</strong><small>${s.label}</small></button>`).join('');
    const s = stages[index];
    stage.innerHTML = `<div class="case-banner"><span>${s.day}</span><h2>${s.title}</h2><p>${s.body}</p></div><div class="lab-grid">${s.labs.map(l=>`<div><span>${l[0]}</span><strong>${l[1]}</strong></div>`).join('')}</div><div class="case-question"><span class="eyebrow">Decision point</span><h3>${s.question}</h3>${s.options.map((o,i)=>`<button class="case-option" data-answer="${i}">${o}</button>`).join('')}<div id="case-feedback"></div></div>`;
    timeline.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{index=Number(b.dataset.stage);render()}));
    stage.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>answer(Number(button.dataset.answer))));
  }
  function answer(choice) {
    const s=stages[index], buttons=document.querySelectorAll('.case-option');
    buttons.forEach((b,i)=>{b.disabled=true;b.classList.toggle('correct',i===s.correct);b.classList.toggle('wrong',i===choice&&i!==s.correct)});
    document.getElementById('case-feedback').innerHTML=`<div class="feedback-box ${choice===s.correct?'':'wrong'}"><strong>${choice===s.correct?'Well reasoned.':'Reconsider what the evidence can prove.'}</strong>${s.explain}</div><button class="button primary next-card" id="next-case">${index===stages.length-1?'Review from the beginning':'Continue case →'}</button>`;
    document.getElementById('next-case').addEventListener('click',()=>{index=index===stages.length-1?0:index+1;render()});
  }
  document.addEventListener('DOMContentLoaded', render);
})();
(() => {
  const questions = [
    {q:'Which finding defines TTP most specifically in a patient with TMA?',o:['Any schistocytes','ADAMTS13 activity below 10%','Elevated LDH','Thrombocytopenia below 30 × 10⁹/L'],a:1,e:'TTP is defined by severe ADAMTS13 deficiency, generally below 10%, in the appropriate clinical context. The other findings support TMA but are not specific for TTP.'},
    {q:'The case ADAMTS13 activity is 62%. What is the best interpretation?',o:['Diagnostic of immune TTP','Consistent with congenital TTP','Mildly reduced but not supportive of TTP','Uninterpretable after transplantation'],a:2,e:'Although 62% is slightly below the stated reference interval, it is far above the severe-deficiency threshold. Mild reductions can occur in critical illness, liver disease, inflammation, and secondary TMA.'},
    {q:'What does a renal biopsy showing cortical necrosis and microthrombi establish?',o:['Immune TTP','Renal TMA with severe ischemic injury','Tacrolimus toxicity specifically','Complement dysregulation'],a:1,e:'The pathology corroborates renal TMA and its severity but does not, by itself, determine the underlying mechanism.'},
    {q:'What is the correct role of the PLASMIC score?',o:['It diagnoses TTP','It predicts severe ADAMTS13 deficiency','It identifies calcineurin-inhibitor toxicity','It replaces ADAMTS13 testing'],a:1,e:'PLASMIC estimates the pretest probability of severe ADAMTS13 deficiency. It is a triage tool, not a definitive etiologic test.'},
    {q:'Why does transplant history lower the PLASMIC score?',o:['TTP never occurs after transplantation','Transplantation provides a plausible alternative cause of TMA','ADAMTS13 cannot be measured after transplantation','All transplant TMAs are complement-mediated'],a:1,e:'Transplant recipients have alternative mechanisms for TMA, including endothelial injury, drugs, infection, ischemia, rejection, and complement activation. TTP remains possible but is less specifically predicted by the clinical pattern.'},
    {q:'Which source-case combination best establishes microangiopathic hemolysis?',o:['Fever and leukocytosis','Oliguria and elevated creatinine','Schistocytes, LDH 535 IU/L, and haptoglobin <15 mg/dL','Platelets 25 × 10⁹/L alone'],a:2,e:'Schistocytes plus increased LDH and markedly reduced haptoglobin demonstrate red-cell fragmentation with intravascular hemolysis.'},
    {q:'Which contemporary case label is most defensible?',o:['Tacrolimus-induced TTP','Tacrolimus-/transplant-associated TMA','Congenital TTP','Isolated renal infarction'],a:1,e:'The patient has TMA after transplantation and tacrolimus exposure without severe ADAMTS13 deficiency. The broader secondary-TMA label is more accurate.'},
    {q:'Why is precise terminology clinically important?',o:['It changes only coding language','Every TMA receives the same therapy','The TTP label implies plasma exchange, immunosuppression, and often caplacizumab','ADAMTS13 results do not affect management'],a:2,e:'True immune TTP requires an urgent, specific pathway. Drug- and transplant-associated TMA may instead prioritize removal of triggers, supportive care, and selected mechanism-directed therapy.'}
  ];
  let index=0, score=0, answered=false;
  function render(){
    const root=document.getElementById('quiz-content'); if(!root)return;
    const q=questions[index]; answered=false;
    document.getElementById('quiz-count').textContent=`Question ${index+1} of ${questions.length}`;
    document.getElementById('quiz-score').textContent=`${score} correct`;
    document.getElementById('quiz-progress').style.width=`${index/questions.length*100}%`;
    root.innerHTML=`<div class="quiz-question"><span class="eyebrow">Select one answer</span><h2>${q.q}</h2>${q.o.map((o,i)=>`<button class="quiz-option" data-choice="${i}"><span>${String.fromCharCode(65+i)}</span>${o}</button>`).join('')}<div id="quiz-explanation"></div></div>`;
    root.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>answer(Number(b.dataset.choice))));
  }
  function answer(choice){if(answered)return;answered=true;const q=questions[index];if(choice===q.a)score++;document.querySelectorAll('.quiz-option').forEach((b,i)=>{b.disabled=true;b.classList.toggle('correct',i===q.a);b.classList.toggle('wrong',i===choice&&i!==q.a)});document.getElementById('quiz-score').textContent=`${score} correct`;document.getElementById('quiz-explanation').innerHTML=`<div class="quiz-explanation ${choice===q.a?'':'wrong'}"><strong>${choice===q.a?'Correct.':'Not quite.'}</strong><p>${q.e}</p></div><button class="button primary quiz-next" id="quiz-next">${index===questions.length-1?'View results':'Next question →'}</button>`;document.getElementById('quiz-next').addEventListener('click',next)}
  function next(){if(index<questions.length-1){index++;render();return}const pct=Math.round(score/questions.length*100);document.getElementById('quiz-progress').style.width='100%';document.getElementById('quiz-content').innerHTML=`<div class="quiz-result"><span class="eyebrow">Knowledge check complete</span><div class="result-ring" style="--score:${pct}%"><strong>${pct}%</strong></div><h2>${pct>=75?'Strong diagnostic precision':'Review the key distinctions'}</h2><p>You answered ${score} of ${questions.length} questions correctly.</p><button class="button primary" id="retry-quiz">Retry quiz</button></div>`;document.getElementById('retry-quiz').addEventListener('click',()=>{index=0;score=0;render()})}
  document.addEventListener('DOMContentLoaded',render);
})();
const TMA_APP = (() => {
  const sectionIds=['home','objectives','background','core','mechanisms','cases','quiz','summary'];
  let current='home';
  let completed=new Set(JSON.parse(localStorage.getItem('tma-case2-completed')||'[]'));
  const details={
    maha:['01','Mechanical red-cell injury','Red cells fragment while traversing narrowed, thrombus-lined microvessels. The resulting intravascular hemolysis raises LDH and consumes circulating haptoglobin.','Source case','Schistocytes, LDH 535 IU/L, and haptoglobin below 15 mg/dL establish microangiopathic hemolysis in context.'],
    platelets:['02','Platelet consumption','Endothelial activation and microvascular thrombi recruit and consume platelets. The degree varies by mechanism and does not independently classify the TMA.','Source case','The platelet count reached 25 × 10⁹/L—an urgent signal, but not proof of TTP.'],
    organs:['03','Microvascular ischemia','TMA can injure multiple organs. Kidney-predominant failure favors several secondary TMAs, while neurologic findings may be prominent in TTP; neither pattern is absolute.','Source case','Oliguria, elevated creatinine, cortical necrosis, and loss of renal blood flow mark severe kidney injury.'],
    path:['04','A pattern, not an etiology','Platelet–fibrin microthrombi, endothelial swelling, mesangiolysis, and chronic double contours may occur across TMA mechanisms.','Pathology pearl','Biopsy may confirm TMA and define injury, but clinical and laboratory correlation is required to identify the cause.']
  };
  const mechanisms=[
    ['Endothelial stress','Transplantation, ischemia, inflammation, drugs, rejection, and complement activation can injure or activate microvascular endothelium.','Trigger','Endothelium','Activation'],
    ['Prothrombotic surface','Activated endothelium loses antithrombotic properties and promotes platelet adhesion, VWF-mediated recruitment, and local coagulation.','VWF','Platelets','Adhesion'],
    ['Microvascular thrombi','Platelet-rich and fibrin-containing thrombi narrow small vessels and consume circulating platelets.','Platelets','Thrombus','↓ Count'],
    ['Red-cell fragmentation','Erythrocytes shear as they traverse the altered microvasculature, generating schistocytes and intravascular hemolysis.','RBC','⌁','MAHA'],
    ['Ischemic organ injury','Reduced perfusion produces renal, neurologic, cardiac, gastrointestinal, or multisystem injury.','Kidney','Brain','Ischemia']
  ];
  const management={
    ttp:{title:'Immune TTP',lead:'Treat as a hematologic emergency.',body:'Obtain pretreatment ADAMTS13 testing, but do not wait for a delayed result when clinical suspicion is high. The contemporary pathway includes therapeutic plasma exchange, corticosteroids, caplacizumab, and often rituximab according to the clinical situation.',tag:'Severe ADAMTS13 deficiency'},
    drug:{title:'Drug-associated TMA',lead:'Identify and remove the implicated exposure.',body:'Discontinue the suspected drug when feasible, provide organ-supportive care, and determine whether the pattern is immune-mediated or dose-related endothelial toxicity. Plasma exchange is not automatically beneficial in non-TTP drug-associated TMA.',tag:'Exposure + mechanism'},
    transplant:{title:'Transplant-associated TMA',lead:'Address the multihit endothelial environment.',body:'Evaluate calcineurin-inhibitor exposure, rejection, infection, ischemia, graft function, blood pressure, and complement activation. Modify triggers and immunosuppression with the transplant team; selected patients may require complement-directed therapy.',tag:'Multifactorial endothelial injury'},
    complement:{title:'Complement-mediated TMA',lead:'Recognize persistent complement-driven injury.',body:'Exclude competing causes, assess the clinical phenotype, and obtain appropriate complement-focused evaluation without assuming normal screening markers rule it out. Timely complement inhibition may be organ-saving in selected patients.',tag:'Alternative-pathway dysregulation'}
  };
  const triggerDetails={
    cni:['Calcineurin inhibitor exposure','Tacrolimus and cyclosporine can promote vasoconstriction and endothelial injury. A temporal association supports the diagnosis, but transplant TMA is often multifactorial.'],
    ischemia:['Ischemia–reperfusion injury','Surgical and graft-related ischemia activates endothelium, inflammation, coagulation, and complement, creating a susceptible microvascular bed.'],
    infection:['Infection and systemic inflammation','Inflammatory cytokines and pathogen-associated signals can amplify endothelial activation. Negative cultures reduce—but do not eliminate—infectious possibilities.'],
    rejection:['Graft injury or rejection','Immune-mediated graft injury can contribute endothelial stress and microvascular thrombosis. Correlate with graft function and transplant-specific studies.'],
    complement:['Complement activation','Complement may amplify endothelial injury even when another trigger is present. Selected severe or persistent cases warrant mechanism-directed evaluation.']
  };
  let mechanismIndex=0;

  function save(){localStorage.setItem('tma-case2-completed',JSON.stringify([...completed]));localStorage.setItem('tma-case2-current',current)}
  function setCurrent(id,markPrevious=true){if(!sectionIds.includes(id)||id===current)return;if(markPrevious)completed.add(current);current=id;document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.section===id));updateProgress();save()}
  function go(id){if(!sectionIds.includes(id))return;setCurrent(id,true);document.getElementById('sidebar').classList.remove('open');document.getElementById('menu-button').setAttribute('aria-expanded','false');document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'})}
  function observeSections(){const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(e=>setCurrent(e.target.id,true))},{rootMargin:'-18% 0px -72% 0px',threshold:0});document.querySelectorAll('.module-section').forEach(section=>observer.observe(section))}
  function updateProgress(){const pct=Math.round(completed.size/sectionIds.length*100);document.getElementById('progress-percent').textContent=`${pct}%`;document.getElementById('mobile-progress').textContent=`${pct}%`;document.getElementById('progress-bar').style.width=`${pct}%`;document.getElementById('progress-detail').textContent=`${completed.size} of ${sectionIds.length} sections complete`;document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('complete',completed.has(b.dataset.section)));const idx=sectionIds.indexOf(current);document.getElementById('footer-section').textContent=`${String(idx+1).padStart(2,'0')} / 08 · ${document.getElementById(current).dataset.title}`;document.getElementById('previous-section').disabled=idx===0;document.getElementById('next-section').textContent=idx===sectionIds.length-1?'Finish ✓':'Next →'}
  function renderMechanism(){const m=mechanisms[mechanismIndex];document.getElementById('mechanism-stage').innerHTML=`<span class="step-label">Step ${mechanismIndex+1}</span><h2>${m[0]}</h2><p>${m[1]}</p><div class="mechanism-diagram" aria-hidden="true"><div class="line"></div><span class="node n1">${m[2]}</span><span class="node n2">${m[3]}</span><span class="node n3">${m[4]}</span></div>`;document.getElementById('mechanism-rail').innerHTML=mechanisms.map((_,i)=>`<span class="step-dot ${i===mechanismIndex?'active':i<mechanismIndex?'past':''}"></span>`).join('');document.getElementById('mechanism-count').textContent=`${mechanismIndex+1} of ${mechanisms.length}`;document.getElementById('mechanism-prev').disabled=mechanismIndex===0;document.getElementById('mechanism-next').textContent=mechanismIndex===mechanisms.length-1?'Restart ↺':'Next step →'}
  function renderManagement(key='ttp'){const m=management[key];document.getElementById('management-panel').innerHTML=`<div><span class="eyebrow">First priority</span><h2>${m.lead}</h2><p>${m.body}</p></div><aside><span>${m.tag}</span><strong>${m.title}</strong></aside>`}
  function toast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}

  function init(){
    document.querySelectorAll('[data-section],[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.section||b.dataset.go)));
    document.getElementById('menu-button').addEventListener('click',()=>{const s=document.getElementById('sidebar'),open=s.classList.toggle('open');document.getElementById('menu-button').setAttribute('aria-expanded',open)});
    document.getElementById('previous-section').addEventListener('click',()=>{const i=sectionIds.indexOf(current);if(i>0)go(sectionIds[i-1])});
    document.getElementById('next-section').addEventListener('click',()=>{const i=sectionIds.indexOf(current);if(i<sectionIds.length-1)go(sectionIds[i+1]);else{completed=new Set(sectionIds);updateProgress();save();toast('Module complete — excellent work.')}});
    document.getElementById('complete-module').addEventListener('click',()=>{completed=new Set(sectionIds);updateProgress();save();toast('Module complete — excellent work.')});
    document.getElementById('reset-progress').addEventListener('click',()=>{if(confirm('Reset saved progress and return to the home page?')){completed.clear();localStorage.removeItem('tma-case2-completed');localStorage.removeItem('tma-case2-current');go('home')}});
    const prior=localStorage.getItem('tma-case2-current');if(prior&&prior!=='home'){const r=document.getElementById('resume-button');r.hidden=false;r.addEventListener('click',()=>go(prior))}
    document.querySelectorAll('[data-thesis]').forEach(b=>b.addEventListener('click',()=>{const good=b.dataset.thesis==='no';document.querySelectorAll('[data-thesis]').forEach(x=>{x.disabled=true;x.classList.toggle('correct',x.dataset.thesis==='no');x.classList.toggle('wrong',x.dataset.thesis==='yes')});document.getElementById('thesis-feedback').innerHTML=`<div class="feedback-box ${good?'':'wrong'}"><strong>${good?'Exactly.':'That was the historical shortcut.'}</strong> MAHA, thrombocytopenia, and schistocytes establish TMA. TTP requires severe ADAMTS13 deficiency—generally activity below 10%.</div>`}));
    document.querySelectorAll('.feature').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.feature').forEach(x=>x.classList.remove('active'));b.classList.add('active');const d=details[b.dataset.detail];document.getElementById('background-detail').innerHTML=`<span class="detail-number">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p><div class="mini-pearl"><b>${d[3]}</b><span>${d[4]}</span></div>`}));
    document.querySelectorAll('.content-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.content-tab').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false')});document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');b.setAttribute('aria-selected','true');document.getElementById(`tab-${b.dataset.tab}`).classList.add('active')}));
    document.querySelectorAll('[data-management]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-management]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderManagement(b.dataset.management)}));
    document.getElementById('mechanism-prev').addEventListener('click',()=>{if(mechanismIndex>0)mechanismIndex--;renderMechanism()});
    document.getElementById('mechanism-next').addEventListener('click',()=>{mechanismIndex=mechanismIndex===mechanisms.length-1?0:mechanismIndex+1;renderMechanism()});
    document.querySelectorAll('[data-trigger]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-trigger]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const d=triggerDetails[b.dataset.trigger];document.getElementById('trigger-detail').innerHTML=`<span class="eyebrow">Contributing hit</span><h3>${d[0]}</h3><p>${d[1]}</p>`}));
    renderManagement();renderMechanism();updateProgress();observeSections();
  }
  document.addEventListener('DOMContentLoaded',init);
  return{go};
})();
window.TMA_APP=TMA_APP;

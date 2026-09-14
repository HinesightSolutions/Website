(() => {
  const PLAN_DATE = '2026-09-14';
  const PLAN_LABEL = 'Monday, September 14';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 3, pitch: 0, sale: 0 },
    goals: { warm: 5, pitch: 2, sale: 1 },
    followupsDone: {},
    tasks: [
      { id:'sep14-13', name:'Deborah A Wilson Wilson', action:'Fresh Positive Response — Convert Now', note:'Fresh response today from an older Carson 1 transfer lead. Work her while she is engaged and move toward a real conversation or firm appointment.', priority:'high', done:false },
      { id:'sep14-12', name:'Joy Tennyson', action:'Tomorrow 9:30 AM Appointment — Confirm + Prep', note:'New appointment set today for tomorrow morning. Confirm the 9:30 AM time and have the strongest recommendation ready before the call.', priority:'hot', done:false },
      { id:'sep14-11', name:'Germain Kennard', action:'Fresh Positive Response — Convert Now', note:'Fresh response today from an older Carson PingPost lead. Work him while he is engaged and move toward a real conversation or firm appointment.', priority:'high', done:false },
      { id:'sep14-10', name:'Larry Marion', action:'Fresh Positive Response — Convert Now', note:'Fresh response today from an older #2 Exclusive LM transfer lead. Work him while he is engaged and move toward a real conversation or firm appointment.', priority:'high', done:false },
      { id:'sep14-0', name:'Donna Burgess', action:'4:00 PM Appointment — Protect the Show', note:'First close window today. Confirm she is still good for 4:00, then keep the call focused on getting to a clear recommendation.', priority:'hot', done:false },
      { id:'sep14-1', name:'Jennifer Barker', action:'6:00 PM Appointment — Close Attempt', note:'Already at Pitch Completed and back on the calendar tonight. Reopen the decision, isolate the remaining concern, and ask for the application.', priority:'hot', done:false },
      { id:'sep14-2', name:'Michael Greenfield', action:'Pitch Follow-Up — Close the Loop', note:'Decision follow-up is overdue. Ask whether price, benefits, or timing is the last thing holding this up.', priority:'hot', done:false },
      { id:'sep14-3', name:'Jeannie Sass', action:'Pitch Follow-Up — Reopen the Decision', note:'Already pitched. Keep it low pressure and find the one concern that still needs to be solved.', priority:'hot', done:false },
      { id:'sep14-4', name:'Gerald Drewa', action:'Pitch Follow-Up — Ask What He Is Leaning Toward', note:'He has already seen the options. Reopen the comparison and ask what is keeping him from choosing one.', priority:'hot', done:false },
      { id:'sep14-5', name:'Joshua Morman', action:'Pitch Follow-Up — One Clean Close Attempt', note:'Long-running high-interest opportunity. Give him one simple path back into the application instead of another full presentation.', priority:'warm', done:false },
      { id:'sep14-6', name:'Chiquita Tucker', action:'Due Today — Re-Engage While Still Warm', note:'Her Day 14 touch is due today. Use a soft keep-it-open message and try to create a concrete next step.', priority:'high', done:false },
      { id:'sep14-7', name:'Missed Appointment Recovery', action:'Beverly Cheaton → Drew Davis', note:'Recover the two missed-appointment clients in the live due queue before spending too much time on colder aged leads.', priority:'high', done:false },
      { id:'sep14-8', name:'Friday Fresh Response Block', action:'Marcina → David → John → Patricia → Stephanie', note:'These five responded Friday and are now overdue for their Day 1 touch. Work them as a focused block and aim to create at least two real conversations.', priority:'high', done:false },
      { id:'sep14-9', name:'Fresh Lead Flow', action:'KEEP NEW LEADS RUNNING', note:'Do not let the funnel dry up while working the 21 due follow-ups. Keep fresh traffic moving so tonight and tomorrow have new opportunities behind them.', priority:'high', done:false }
    ]
  };

  const freshFollowups = [
    {id:'sep14f-0',name:'Beverly Cheaton',phone:'5743156214',stage:'Appointment Missed',priority:'hot',due:'Day 14 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-1',name:'Drew Davis',phone:'3369783868',stage:'Appointment Missed',priority:'hot',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-2',name:'Natalie Sparks',phone:'8597497689',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 9',dueNow:true,twoTouch:false},
    {id:'sep14f-3',name:'Chris Swan',phone:'5019402768',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 9',dueNow:true,twoTouch:false},
    {id:'sep14f-4',name:'Kimberly Graves',phone:'9195190351',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 9',dueNow:true,twoTouch:false},
    {id:'sep14f-5',name:'David Coker',phone:'6086954295',stage:'Positive Response',priority:'high',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-6',name:'Carroll Cason',phone:'2292215529',stage:'Positive Response',priority:'high',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-7',name:'Monica Elwood',phone:'3192061049',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-8',name:'Kristine Kilde',phone:'5416680778',stage:'Positive Response',priority:'high',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-9',name:'Raymond Riojas',phone:'9472296928',stage:'Positive Response',priority:'high',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-10',name:'Marcina Morris',phone:'7658104246',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 11',dueNow:true,twoTouch:false},
    {id:'sep14f-11',name:'David Chastain',phone:'5022373204',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 11',dueNow:true,twoTouch:false},
    {id:'sep14f-12',name:'John Mason',phone:'5174204101',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 11',dueNow:true,twoTouch:false},
    {id:'sep14f-13',name:'Patricia Almond',phone:'7063085851',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 11',dueNow:true,twoTouch:false},
    {id:'sep14f-14',name:'Stephanie Blackmon',phone:'4058873419',stage:'Positive Response',priority:'high',due:'Day 1 overdue',worked:'Sep 11',dueNow:true,twoTouch:false},
    {id:'sep14f-15',name:'Tacara Maxwell',phone:'2168040164',stage:'Positive Response',priority:'high',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-16',name:'Chiquita Tucker',phone:'2105745727',stage:'Positive Response',priority:'high',due:'Day 14 due today',worked:'Sep 10',dueNow:true,twoTouch:false},
    {id:'sep14f-17',name:'Joshua Morman',phone:'8658950199',stage:'Pitch Completed',priority:'warm',due:'Day 30 overdue',worked:'Sep 10',dueNow:true,twoTouch:true},
    {id:'sep14f-18',name:'Jeannie Sass',phone:'3214801461',stage:'Pitch Completed',priority:'warm',due:'Day 1 overdue',worked:'Sep 9',dueNow:true,twoTouch:true},
    {id:'sep14f-19',name:'Michael Greenfield',phone:'6316445821',stage:'Pitch Completed',priority:'warm',due:'Day 1 overdue',worked:'Sep 5',dueNow:true,twoTouch:true},
    {id:'sep14f-20',name:'Gerald Drewa',phone:'7158464000',stage:'Pitch Completed',priority:'warm',due:'Day 4 overdue',worked:'Sep 10',dueNow:true,twoTouch:true}
  ];

  const clonePlan = () => typeof structuredClone === 'function' ? structuredClone(plan) : JSON.parse(JSON.stringify(plan));
  const localDateKey = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

  try {
    let saved=null; try { saved=JSON.parse(localStorage.getItem(K)||'null'); } catch {}
    if (!saved || saved.planDate !== PLAN_DATE) {
      if (saved) { try { localStorage.setItem(K+'-archive-'+(saved.planDate||'previous'),JSON.stringify(saved)); } catch {} }
      s=clonePlan();
    } else {
      s=saved;
      s.planDate=PLAN_DATE;
      s.avGoal=Number(s.avGoal||plan.avGoal);
      s.av=Math.max(Number(s.av||0),plan.av);
      s.goals={...plan.goals};
      s.targets=s.targets||{warm:0,pitch:0,sale:0};
      s.targets.warm=Math.max(Number(s.targets.warm||0),plan.targets.warm);
      s.targets.pitch=Math.max(Number(s.targets.pitch||0),plan.targets.pitch);
      s.targets.sale=Math.max(Number(s.targets.sale||0),plan.targets.sale);
      const priorByName=new Map((s.tasks||[]).map(t=>[t.name,t]));
      s.tasks=plan.tasks.map(task=>{const prior=priorByName.get(task.name);return prior?{...task,done:!!prior.done||!!task.done}:{...task};});
      s.followupsDone=s.followupsDone||{};
    }
    localStorage.setItem(K,JSON.stringify(s));

    const dateEl=document.getElementById('date'); if(dateEl) dateEl.textContent=localDateKey()<PLAN_DATE?`UPCOMING • ${PLAN_LABEL.toUpperCase()}`:PLAN_LABEL.toUpperCase();
    const title=document.querySelector('#todayView h1'); if(title) title.textContent='Monday Sales Plan';
    const heroCopy=document.querySelector('#todayView .hero .muted');
    if(heroCopy) heroCopy.textContent='Current board: 3 positive responses, 1 appointment set, 0 pitches, 0 sales, $0 Written AV, and $0 Issued AV. Deborah Wilson, Germain Kennard, and Larry Marion are the three warm conversations on the board today, with Joy Tennyson booked for tomorrow at 9:30 AM.';

    const reset=document.getElementById('reset');
    if(reset) reset.onclick=()=>{if(confirm("Reset today's checklist?")){s=clonePlan();localStorage.setItem(K,JSON.stringify(s));renderToday();}};

    if(!document.getElementById('dayScheduleCss')){
      const css=document.createElement('style'); css.id='dayScheduleCss';
      css.textContent=`.daySchedule{margin:16px 0 0;padding:17px 18px}.dayScheduleTitle{font:700 17px Georgia;color:var(--navy);margin:4px 0 10px}.dayScheduleItems{display:flex;gap:7px;flex-wrap:wrap}.dayScheduleItem{background:#f0eee9;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:750;color:var(--navy)}.dayScheduleItem strong{color:var(--blue);margin-right:4px}.leadFlowFocus{margin:16px 0 0;padding:19px 20px;border:1px solid var(--line)}.leadFlowTitle{font:700 22px Georgia;color:var(--navy);margin:4px 0 5px}.leadFlowCopy{font-size:11px;line-height:1.55;color:var(--muted);max-width:780px}.leadFlowMix{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}.leadFlowMix div{background:#f0eee9;border:1px solid var(--line);border-radius:14px;padding:12px}.leadFlowMix b{display:block;font-size:18px;color:var(--navy);margin-bottom:3px}.leadFlowMix span{font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}@media(max-width:760px){.leadFlowMix{grid-template-columns:1fr}}`;
      document.head.appendChild(css);
    }

    document.querySelector('.daySchedule')?.remove(); document.querySelector('.leadFlowFocus')?.remove();
    const head=document.querySelector('#todayView .head');
    if(head){
      const leadFlow=document.createElement('section'); leadFlow.className='card leadFlowFocus';
      leadFlow.innerHTML=`<div class="eyebrow">MONDAY GAME PLAN • BUILD FLOW + CLOSE THE WARM MONEY</div><div class="leadFlowTitle">Three positive responses today + Joy booked for tomorrow morning</div><div class="leadFlowCopy">Deborah Wilson, Germain Kennard, and Larry Marion are all live warm conversations today, and Joy Tennyson is booked for Tuesday at 9:30 AM. Keep converting the live interest, then protect the scheduled appointment windows.</div><div class="leadFlowMix"><div><b>35%</b><span>Fresh Lead Flow</span></div><div><b>40%</b><span>Due Follow-Ups</span></div><div><b>25%</b><span>Appointments + Close</span></div></div>`;
      head.parentNode.insertBefore(leadFlow,head);
      const schedule=document.createElement('section'); schedule.className='card daySchedule';
      schedule.innerHTML=`<div class="eyebrow">CLOSE WINDOWS</div><div class="dayScheduleTitle">Current appointment schedule</div><div class="dayScheduleItems"><span class="dayScheduleItem"><strong>4:00 PM</strong> Donna Burgess — Appointment</span><span class="dayScheduleItem"><strong>6:00 PM</strong> Jennifer Barker — Appointment / Close</span><span class="dayScheduleItem"><strong>Tue 9:30 AM</strong> Joy Tennyson — Appointment</span><span class="dayScheduleItem"><strong>Tue 9:30 AM</strong> Christine Milham — Follow-Up</span><span class="dayScheduleItem"><strong>Wed 5:30 PM</strong> Aurora Kramer — Appointment</span><span class="dayScheduleItem"><strong>Sat 11:30 AM</strong> Victoria Thompson — Appointment</span></div>`;
      head.parentNode.insertBefore(schedule,head);
    }

    const patchClient=(name,patch)=>{const row=PIPELINE.find(x=>x.name===name);if(row)Object.assign(row,patch);else PIPELINE.unshift({name,...patch});};
    patchClient('Deborah A Wilson Wilson',{work:'Sep 14',appt:'—',stage:'Positive Response',source:'Carson 1'});
    patchClient('Joy Tennyson',{work:'Sep 14',appt:'Sep 15 • 9:30 AM',stage:'Appointment Set',source:'Carson - Branded'});
    patchClient('Germain Kennard',{work:'Sep 14',appt:'—',stage:'Positive Response',source:'Carson - PingPost Exclusive'});
    patchClient('Larry Marion',{work:'Sep 14',appt:'—',stage:'Positive Response',source:'#2 Exclusive LM'});
    patchClient('Donna Burgess',{work:'Sep 3',appt:'Sep 14 • 4:00 PM',stage:'Appointment Set',source:'Branded'});
    patchClient('Jennifer Barker',{work:'Sep 8',appt:'Sep 14 • 6:00 PM',stage:'Pitch Completed',source:'Montague New'});
    patchClient('Christine Milham',{work:'Sep 9',appt:'Sep 15 • 9:30 AM',stage:'Sold',source:'Montague New',av:6638.52});
    patchClient('Aurora Kramer',{work:'Aug 24',appt:'Sep 16 • 5:30 PM',stage:'Appointment Set',source:'Pipeline'});
    patchClient('Victoria Thompson',{work:'Sep 11',appt:'Sep 19 • 11:30 AM',stage:'Appointment Set',source:'#2 Exclusive LM'});
    patchClient('Michael Greenfield',{work:'Sep 5',appt:'—',stage:'Pitch Completed',source:'Pipeline'});
    patchClient('Jeannie Sass',{work:'Sep 9',appt:'—',stage:'Pitch Completed',source:'Carson - Branded'});
    patchClient('Gerald Drewa',{work:'Sep 10',appt:'—',stage:'Pitch Completed',source:'Pipeline'});
    patchClient('Joshua Morman',{work:'Sep 10',appt:'—',stage:'Pitch Completed',source:'Branded'});
    patchClient('Chiquita Tucker',{work:'Sep 10',appt:'—',stage:'Positive Response',source:'Exclusive'});

    FOLLOWUPS.splice(0,FOLLOWUPS.length,...freshFollowups);

    const pipelineHero=document.querySelector('#pipelineView .snapshot'); if(pipelineHero) pipelineHero.textContent='Current pipeline snapshot • September 14';
    const pipelineStats=document.querySelectorAll('#pipelineView .statNum'); const pipelineCounts=[42,23,6,10,9,5,24];
    pipelineStats.forEach((el,i)=>{if(i<pipelineCounts.length)el.textContent=pipelineCounts[i];});
    const followHero=document.querySelector('#followupsView .snapshot'); if(followHero) followHero.textContent='Live cadence-due snapshot • September 14';
    const followStats=document.querySelectorAll('#followupsView .statNum'); const followCounts=[21,2,15,4];
    followStats.forEach((el,i)=>{if(i<followCounts.length)el.textContent=followCounts[i];});

    renderToday(); renderPipeline(); renderFollowups();
  } catch(err){ console.error('Unable to load September 14 sales plan',err); }
})();
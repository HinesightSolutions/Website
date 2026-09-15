(() => {
  const PLAN_DATE='2026-09-15';
  const PLAN_LABEL='Tuesday, September 15';

  function apply(){
    if(typeof renderToday!=='function'||typeof renderPipeline!=='function'||typeof PIPELINE==='undefined'||typeof s==='undefined'||typeof K==='undefined'){
      setTimeout(apply,120);
      return;
    }

    const prior=s&&typeof s==='object'?s:{};
    try{
      if(prior.planDate&&prior.planDate!==PLAN_DATE){
        localStorage.setItem(K+'-archive-'+prior.planDate,JSON.stringify(prior));
      }
    }catch{}

    s={
      planDate:PLAN_DATE,
      av:0,
      avGoal:Number(prior.avGoal||10000),
      targets:{warm:0,pitch:0,sale:0},
      goals:{warm:5,pitch:2,sale:1},
      followupsDone:prior.followupsDone||{},
      tasks:[
        {id:'sep15-0',name:'Joy Tennyson',action:'9:30 AM Appointment — Protect + Close',note:'Appointment carried over from yesterday. Confirm the morning time, keep the recommendation simple, and ask for the application.',priority:'hot',done:false},
        {id:'sep15-1',name:'Germain Kennard',action:'1:00 PM Appointment — Protect + Close',note:'Positive response and worked yesterday; appointment was set today for 1:00 PM. Confirm the time and move directly toward a recommendation.',priority:'hot',done:false},
        {id:'sep15-2',name:'Christine Milham',action:'9:30 AM Follow-Up',note:'Keep the scheduled follow-up concise and resolve the remaining next step.',priority:'high',done:false},
        {id:'sep15-3',name:'Due Follow-Up Queue',action:'Work the hottest overdue conversations first',note:'Recover missed appointments and pitched business before spending too much time on colder aged leads.',priority:'high',done:false},
        {id:'sep15-4',name:'Fresh Lead Flow',action:'KEEP NEW LEADS RUNNING',note:'Keep fresh traffic moving between appointment windows so the next close is already entering the funnel.',priority:'high',done:false}
      ]
    };
    try{localStorage.setItem(K,JSON.stringify(s));}catch{}

    const dateEl=document.getElementById('date');if(dateEl)dateEl.textContent=PLAN_LABEL.toUpperCase();
    const title=document.querySelector('#todayView h1');if(title)title.textContent='Tuesday Sales Plan';
    const heroCopy=document.querySelector('#todayView .hero .muted');
    if(heroCopy)heroCopy.textContent='Current board: 1 appointment set today, 0 pitches, 0 sales, and $0 Written AV so far. Joy Tennyson is scheduled for 9:30 AM and Germain Kennard is scheduled for 1:00 PM.';

    document.querySelector('.daySchedule')?.remove();
    document.querySelector('.leadFlowFocus')?.remove();
    const head=document.querySelector('#todayView .head');
    if(head){
      const focus=document.createElement('section');focus.className='card leadFlowFocus';
      focus.innerHTML='<div class="eyebrow">TUESDAY GAME PLAN • PROTECT THE APPOINTMENTS</div><div class="leadFlowTitle">Joy at 9:30 AM + Germain at 1:00 PM</div><div class="leadFlowCopy">Germain converted from yesterday\'s positive response into a 1:00 PM appointment today. Protect both appointment windows, keep fresh lead flow moving between them, and use the due queue for focused follow-up blocks.</div><div class="leadFlowMix"><div><b>35%</b><span>Fresh Lead Flow</span></div><div><b>30%</b><span>Due Follow-Ups</span></div><div><b>35%</b><span>Appointments + Close</span></div></div>';
      head.parentNode.insertBefore(focus,head);
      const schedule=document.createElement('section');schedule.className='card daySchedule';
      schedule.innerHTML='<div class="eyebrow">CLOSE WINDOWS</div><div class="dayScheduleTitle">Current appointment schedule</div><div class="dayScheduleItems"><span class="dayScheduleItem"><strong>9:30 AM</strong> Joy Tennyson — Appointment</span><span class="dayScheduleItem"><strong>9:30 AM</strong> Christine Milham — Follow-Up</span><span class="dayScheduleItem"><strong>1:00 PM</strong> Germain Kennard — Appointment</span><span class="dayScheduleItem"><strong>Wed 5:30 PM</strong> Aurora Kramer — Appointment</span><span class="dayScheduleItem"><strong>Sat 11:30 AM</strong> Victoria Thompson — Appointment</span></div>';
      head.parentNode.insertBefore(schedule,head);
    }

    const patchClient=(name,patch)=>{const row=PIPELINE.find(x=>x.name===name);if(row)Object.assign(row,patch);else PIPELINE.unshift({name,...patch});};
    patchClient('Joy Tennyson',{work:'Sep 14',appt:'Sep 15 • 9:30 AM',stage:'Appointment Set',source:'Carson - Branded'});
    patchClient('Germain Kennard',{work:'Sep 14',appt:'Sep 15 • 1:00 PM',stage:'Appointment Set',source:'Carson - PingPost Exclusive'});
    patchClient('Jennifer Barker',{work:'Sep 14',appt:'Sep 14 • 6:00 PM',stage:'Sold',source:'Montague New',av:16555.08});

    const pipelineHero=document.querySelector('#pipelineView .snapshot');if(pipelineHero)pipelineHero.textContent='Current pipeline snapshot • September 15';
    const pipelineStats=document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts=[41,24,5,11,9,5,24];
    pipelineStats.forEach((el,i)=>{if(i<pipelineCounts.length)el.textContent=pipelineCounts[i];});

    renderToday();renderPipeline();
  }

  setTimeout(apply,180);
})();

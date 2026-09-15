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
      targets:{warm:0,pitch:1,sale:0},
      goals:{warm:5,pitch:2,sale:1},
      followupsDone:prior.followupsDone||{},
      tasks:[
        {id:'sep15-0',name:'Joy Tennyson',action:'9:30 AM MISSED — Recover + Reschedule',note:'Joy missed the 9:30 AM appointment. Call/text now and offer two concrete same-day or next-day times.',priority:'hot',done:false},
        {id:'sep15-1',name:'Germain Kennard',action:'1:00 PM Appointment — Protect + Close',note:'Positive response and worked yesterday; appointment was set today for 1:00 PM. Confirm the time and move directly toward a recommendation.',priority:'hot',done:false},
        {id:'sep15-2',name:'Christine Milham',action:'Pitch Completed Today — Worked',note:'Worked today and pitch completed. No hard appointment/follow-up time is set. Keep her existing Sold / $6,638.52 production history intact.',priority:'high',done:true},
        {id:'sep15-3',name:'Paul Creason',action:'7:30 PM Appointment — Protect + Close',note:'Worked today and appointment set for 7:30 PM. Lead source: Windback JT Leads. Protect the evening close window and confirm before the call.',priority:'hot',done:false},
        {id:'sep15-4',name:'Due Follow-Up Queue',action:'Work the hottest overdue conversations first',note:'Recover missed appointments and pitched business before spending too much time on colder aged leads.',priority:'high',done:false},
        {id:'sep15-5',name:'Fresh Lead Flow',action:'KEEP NEW LEADS RUNNING',note:'Keep fresh traffic moving between appointment windows so the next close is already entering the funnel.',priority:'high',done:false}
      ]
    };
    try{localStorage.setItem(K,JSON.stringify(s));}catch{}

    const dateEl=document.getElementById('date');if(dateEl)dateEl.textContent=PLAN_LABEL.toUpperCase();
    const title=document.querySelector('#todayView h1');if(title)title.textContent='Tuesday Sales Plan';
    const heroCopy=document.querySelector('#todayView .hero .muted');
    if(heroCopy)heroCopy.textContent='Current board: 2 appointments set today, 1 pitch completed, 0 sales, and $0 Written AV so far. Germain Kennard is at 1:00 PM and Paul Creason is at 7:30 PM; Joy Tennyson remains a missed-appointment recovery.';

    document.querySelector('.daySchedule')?.remove();
    document.querySelector('.leadFlowFocus')?.remove();
    const head=document.querySelector('#todayView .head');
    if(head){
      const focus=document.createElement('section');focus.className='card leadFlowFocus';
      focus.innerHTML='<div class="eyebrow">TUESDAY GAME PLAN • PROTECT THE CLOSE WINDOWS</div><div class="leadFlowTitle">Germain at 1:00 PM + Paul at 7:30 PM</div><div class="leadFlowCopy">Christine is already worked and pitched today. Recover Joy from the 9:30 miss, keep fresh lead flow moving between appointments, and protect both Germain\'s 1:00 PM and Paul\'s 7:30 PM close windows.</div><div class="leadFlowMix"><div><b>20%</b><span>No-Show Recovery</span></div><div><b>30%</b><span>Fresh Lead Flow</span></div><div><b>50%</b><span>Appointments + Close</span></div></div>';
      head.parentNode.insertBefore(focus,head);
      const schedule=document.createElement('section');schedule.className='card daySchedule';
      schedule.innerHTML='<div class="eyebrow">CLOSE WINDOWS</div><div class="dayScheduleTitle">Current appointment schedule</div><div class="dayScheduleItems"><span class="dayScheduleItem"><strong>9:30 AM</strong> Joy Tennyson — MISSED</span><span class="dayScheduleItem"><strong>1:00 PM</strong> Germain Kennard — Appointment</span><span class="dayScheduleItem"><strong>7:30 PM</strong> Paul Creason — Appointment</span><span class="dayScheduleItem"><strong>Wed 5:30 PM</strong> Aurora Kramer — Appointment</span><span class="dayScheduleItem"><strong>Sat 11:30 AM</strong> Victoria Thompson — Appointment</span></div>';
      head.parentNode.insertBefore(schedule,head);
    }

    const patchClient=(name,patch)=>{const row=PIPELINE.find(x=>x.name===name);if(row)Object.assign(row,patch);else PIPELINE.unshift({name,...patch});};
    patchClient('Joy Tennyson',{work:'Sep 14',appt:'Sep 15 • 9:30 AM',stage:'Appointment Missed',source:'Carson - Branded'});
    patchClient('Germain Kennard',{work:'Sep 14',appt:'Sep 15 • 1:00 PM',stage:'Appointment Set',source:'Carson - PingPost Exclusive'});
    patchClient('Christine Milham',{work:'Sep 15',appt:'No hard appointment set',stage:'Sold',source:'Montague New',av:6638.52});
    patchClient('Paul Creason',{work:'Sep 15',appt:'Sep 15 • 7:30 PM',stage:'Appointment Set',source:'Windback JT Leads'});
    patchClient('Jennifer Barker',{work:'Sep 14',appt:'Sep 14 • 6:00 PM',stage:'Sold',source:'Montague New',av:16555.08});
    patchClient('Donna Burgess',{work:'Sep 3',appt:'Sep 14 • 4:00 PM',stage:'Sold',source:'Branded',av:6694.20,issued:6694.20});

    if(typeof FOLLOWUPS!=='undefined'&&!FOLLOWUPS.some(x=>x.name==='Joy Tennyson')){
      FOLLOWUPS.unshift({id:'f-joy-sep15',name:'Joy Tennyson',stage:'Appointment Missed',priority:'hot',due:'Due now',worked:'Sep 14'});
    }

    const pipelineHero=document.querySelector('#pipelineView .snapshot');if(pipelineHero)pipelineHero.textContent='Current pipeline snapshot • September 15';
    const pipelineStats=document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts=[41,23,5,12,10,5,24];
    pipelineStats.forEach((el,i)=>{if(i<pipelineCounts.length)el.textContent=pipelineCounts[i];});

    const followStats=document.querySelectorAll('#followupsView .statNum');
    if(typeof FOLLOWUPS!=='undefined'&&followStats.length>=4){
      const missed=FOLLOWUPS.filter(x=>x.stage==='Appointment Missed').length;
      const interested=FOLLOWUPS.filter(x=>x.stage==='Positive Response').length;
      const pitched=FOLLOWUPS.filter(x=>x.stage==='Pitch Completed').length;
      followStats[0].textContent=FOLLOWUPS.length;
      followStats[1].textContent=missed;
      followStats[2].textContent=interested;
      followStats[3].textContent=pitched;
    }

    renderToday();renderPipeline();if(typeof renderFollowups==='function')renderFollowups();
  }

  setTimeout(apply,180);
})();

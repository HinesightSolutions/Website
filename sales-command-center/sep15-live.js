(() => {
  const PLAN_DATE='2026-09-16';
  const PLAN_LABEL='Wednesday, September 16';

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
        {id:'sep16-0',name:'Stephanie Blackmon',action:'10:30 AM Appointment — Protect + Close',note:'Verified on today\'s calendar. Keep this as the first close window of the day.',priority:'hot',done:false},
        {id:'sep16-1',name:'Aurora Kramer',action:'5:30 PM Appointment — Protect + Close',note:'Verified on today\'s calendar. Client invite is orange, so the email is attached.',priority:'hot',done:false},
        {id:'sep16-2',name:'Mary Peterson',action:'Thu 6:30 PM Appointment — Keep Warm',note:'Worked today and appointment set for Thursday, September 17 at 6:30 PM. Client email is attached to the calendar invite and the event is orange.',priority:'hot',done:false},
        {id:'sep16-3',name:'Eva Moore',action:'Wed 9/23 12:30 PM Appointment — Pitch Follow-Up',note:'Worked and pitched today. Appointment is set for Wednesday, September 23 at 12:30 PM. Client email is attached to the orange calendar invite.',priority:'hot',done:false},
        {id:'sep16-4',name:'Fred Genovese',action:'Positive Response Carryover — Convert to Appointment',note:'Positive response and worked on 9/15. No hard appointment has been recorded yet.',priority:'hot',done:false},
        {id:'sep16-5',name:'Paul Creason',action:'Yesterday 7:30 PM Appointment — Outcome Needed',note:'No outcome has been reported yet. Keep his current pipeline status until the result is confirmed.',priority:'high',done:false},
        {id:'sep16-6',name:'Joy Tennyson',action:'Missed Appointment Recovery',note:'Missed the 9/15 9:30 AM appointment. Offer two concrete reschedule options.',priority:'high',done:false},
        {id:'sep16-7',name:'Matthew Barber',action:'Friday 10:00 AM Appointment — Keep Warm',note:'Appointment is set for Friday 9/18 at 10:00 AM. Client email is attached to the calendar invite.',priority:'high',done:false},
        {id:'sep16-8',name:'Fresh Lead Flow',action:'KEEP NEW LEADS RUNNING',note:'Use the gaps around today\'s two verified appointments to keep fresh opportunities entering the pipeline.',priority:'high',done:false}
      ]
    };
    try{localStorage.setItem(K,JSON.stringify(s));}catch{}

    const dateEl=document.getElementById('date');if(dateEl)dateEl.textContent=PLAN_LABEL.toUpperCase();
    const title=document.querySelector('#todayView h1');if(title)title.textContent='Wednesday Sales Plan';
    const heroCopy=document.querySelector('#todayView .hero .muted');
    if(heroCopy)heroCopy.textContent='Current board: 2 appointments set today, 1 pitch completed, 0 sales, and $0 Written AV. Stephanie and Aurora are today\'s close windows; Mary is secured for Thursday, and Eva Moore is pitched with a follow-up appointment next Wednesday at 12:30 PM.';

    document.querySelector('.daySchedule')?.remove();
    document.querySelector('.leadFlowFocus')?.remove();
    const head=document.querySelector('#todayView .head');
    if(head){
      const focus=document.createElement('section');focus.className='card leadFlowFocus';
      focus.innerHTML='<div class="eyebrow">WEDNESDAY GAME PLAN • TWO CLOSE WINDOWS</div><div class="leadFlowTitle">Stephanie 10:30 • Aurora 5:30 • Mary Thu • Eva next Wed</div><div class="leadFlowCopy">Protect today\'s two verified appointments, keep Mary warm for Thursday, keep Eva engaged after today\'s pitch for next Wednesday at 12:30 PM, convert Fred while he is still warm, and keep fresh lead flow moving during the open blocks.</div><div class="leadFlowMix"><div><b>20%</b><span>Carryover Recovery</span></div><div><b>35%</b><span>Fresh Lead Flow</span></div><div><b>45%</b><span>Appointments + Close</span></div></div>';
      head.parentNode.insertBefore(focus,head);
      const schedule=document.createElement('section');schedule.className='card daySchedule';
      schedule.innerHTML='<div class="eyebrow">CLOSE WINDOWS</div><div class="dayScheduleTitle">Verified client schedule</div><div class="dayScheduleItems"><span class="dayScheduleItem"><strong>10:30 AM</strong> Stephanie Blackmon — Appointment</span><span class="dayScheduleItem"><strong>5:30 PM</strong> Aurora Kramer — Appointment</span><span class="dayScheduleItem"><strong>Thu 6:30 PM</strong> Mary Peterson — Appointment</span><span class="dayScheduleItem"><strong>Fri 10:00 AM</strong> Matthew Barber — Appointment</span><span class="dayScheduleItem"><strong>Wed 9/23 12:30 PM</strong> Eva Moore — Pitch Follow-Up</span><span class="dayScheduleItem"><strong>Sat 11:30 AM</strong> Victoria Thompson — Appointment</span></div>';
      head.parentNode.insertBefore(schedule,head);
    }

    const patchClient=(name,patch)=>{const row=PIPELINE.find(x=>x.name===name);if(row)Object.assign(row,patch);else PIPELINE.unshift({name,...patch});};
    patchClient('Stephanie Blackmon',{appt:'Sep 16 • 10:30 AM',stage:'Appointment Set',source:'NextGen Leads'});
    patchClient('Aurora Kramer',{appt:'Sep 16 • 5:30 PM',stage:'Appointment Set',source:'Branded'});
    patchClient('Mary Peterson',{work:'Sep 16',appt:'Sep 17 • 6:30 PM',stage:'Appointment Set',source:'Carson - Branded'});
    patchClient('Eva Moore',{work:'Sep 16',appt:'Sep 23 • 12:30 PM',stage:'Pitch Completed',source:'Carson - Branded'});
    patchClient('Matthew Barber',{work:'Sep 15',appt:'Sep 18 • 10:00 AM',stage:'Appointment Set',source:'Montague New'});
    patchClient('Fred Genovese',{work:'Sep 15',appt:'No hard appointment set',stage:'Positive Response',source:'Montague New'});
    patchClient('Paul Creason',{work:'Sep 15',appt:'Sep 15 • 7:30 PM',stage:'Appointment Set',source:'Windback JT Leads'});
    patchClient('Joy Tennyson',{work:'Sep 14',appt:'Sep 15 • 9:30 AM',stage:'Appointment Missed',source:'Carson - Branded'});
    patchClient('Germain Kennard',{work:'Sep 15',appt:'Sep 15 • 1:00 PM',stage:'Sold',source:'Carson - PingPost Exclusive',av:6296.16});
    patchClient('Jennifer Barker',{work:'Sep 14',appt:'Sep 14 • 6:00 PM',stage:'Sold',source:'Montague New',av:16555.08,issued:16555.08});
    patchClient('Donna Burgess',{work:'Sep 3',appt:'Sep 14 • 4:00 PM',stage:'Sold',source:'Branded',av:6694.20,issued:6694.20});

    const pipelineHero=document.querySelector('#pipelineView .snapshot');if(pipelineHero)pipelineHero.textContent='Current pipeline snapshot • September 16';
    const pipelineStats=document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts=[41,25,6,13,10,5,24];
    pipelineStats.forEach((el,i)=>{if(i<pipelineCounts.length)el.textContent=pipelineCounts[i];});

    renderToday();renderPipeline();if(typeof renderFollowups==='function')renderFollowups();
  }

  setTimeout(apply,180);
})();

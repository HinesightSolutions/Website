(() => {
  const PLAN_DATE = '2026-09-11';
  const PLAN_LABEL = 'Friday, September 11';

  const plan = {
    planDate: PLAN_DATE,
    av: 3076.92,
    avGoal: 10000,
    targets: { warm: 8, pitch: 1, sale: 1 },
    goals: { warm: 8, pitch: 4, sale: 2 },
    followupsDone: {},
    tasks: [
      { id: 'sep11-0', name: 'Jaime Lamboy', action: 'SOLD + ISSUED — $3,076.92', note: 'Jaime’s policy issued today for the full $3,076.92. That sale is fully on the board now.', priority: 'hot', done: true },
      { id: 'sep11-1', name: 'Marcina Morris', action: 'Fresh Positive Response — Convert Now', note: 'Fresh response today. Keep the lag time tiny and move her into a real conversation or firm appointment.', priority: 'high', done: false },
      { id: 'sep11-2', name: 'David Chastain', action: 'Fresh Positive Response — Convert Now', note: 'Fresh response today. Work him while the request is still active and get a concrete next step.', priority: 'high', done: false },
      { id: 'sep11-3', name: 'John Mason', action: 'Fresh Positive Response — Convert Now', note: 'Fresh response today. Keep the conversation active and turn the Marketplace reinstatement question into a clear next step.', priority: 'high', done: false },
      { id: 'sep11-4', name: 'Patricia Almond', action: 'Fresh Positive Response — Convert Now', note: 'Fresh response today from an older request. Work her while she is engaged and move toward a firm appointment or plan review.', priority: 'high', done: false },
      { id: 'sep11-5', name: 'Apurva Soundararajan', action: '8:36 AM Follow-Up — Move the Conversation Forward', note: 'Morning follow-up window. Find the remaining question and create a concrete next step.', priority: 'hot', done: false },
      { id: 'sep11-6', name: 'Collin Veach', action: 'Fresh Positive Response — Convert Now', note: 'New lead and positive response today. Work him while the request is still fresh.', priority: 'high', done: false },
      { id: 'sep11-7', name: 'Michael Greenfield', action: '10:30 AM Pitch Follow-Up — Close Attempt', note: 'Already pitched with a firm appointment today. Isolate the last concern and ask for the application.', priority: 'hot', done: false },
      { id: 'sep11-8', name: 'Fresh Lead Flow', action: 'KEEP RUNNING LEADS — Do Not Let the Funnel Dry Up', note: 'You have already produced 8 positive responses and a fully issued sale today. Keep fresh traffic moving while converting the people who are raising their hands.', priority: 'high', done: false },
      { id: 'sep11-9', name: 'Monica Elwood', action: 'Day 1 Follow-Up — Turn Interest Into a Time', note: 'Fresh response from yesterday. Give her a simple choice: options by text first or a quick call.', priority: 'high', done: false },
      { id: 'sep11-10', name: 'Jeannie Sass', action: 'Pitch Follow-Up — Reopen the Decision', note: 'Already pitched. Ask whether price or benefits are the bigger remaining question and move from there.', priority: 'hot', done: false },
      { id: 'sep11-11', name: 'Juanae Jackson', action: '7:00 PM Appointment — Protect the Show', note: 'Evening close window. Confirm earlier in the day and send a short reminder before the call.', priority: 'hot', done: false }
    ]
  };

  const freshFollowups = [
    { id:'sep11f-0', name:'Beverly Cheaton', phone:'5743156214', stage:'Appointment Missed', priority:'hot', due:'Day 14 due today', worked:'Sep 10', dueNow:true, twoTouch:false },
    { id:'sep11f-1', name:'Natalie Sparks', phone:'8597497689', stage:'Positive Response', priority:'high', due:'Day 1 overdue', worked:'Sep 9', dueNow:true, twoTouch:false },
    { id:'sep11f-2', name:'Chris Swan', phone:'5019402768', stage:'Positive Response', priority:'high', due:'Day 1 overdue', worked:'Sep 9', dueNow:true, twoTouch:false },
    { id:'sep11f-3', name:'Kimberly Graves', phone:'9195190351', stage:'Positive Response', priority:'high', due:'Day 1 overdue', worked:'Sep 9', dueNow:true, twoTouch:false },
    { id:'sep11f-4', name:'David Coker', phone:'6086954295', stage:'Positive Response', priority:'high', due:'Day 30 due today', worked:'Sep 10', dueNow:true, twoTouch:false },
    { id:'sep11f-5', name:'Carroll Cason', phone:'2292215529', stage:'Positive Response', priority:'high', due:'Day 30 due today', worked:'Sep 10', dueNow:true, twoTouch:false },
    { id:'sep11f-6', name:'Monica Elwood', phone:'3192061049', stage:'Positive Response', priority:'high', due:'Day 1 due today', worked:'Sep 10', dueNow:true, twoTouch:true },
    { id:'sep11f-7', name:'Joshua Morman', phone:'8658950199', stage:'Pitch Completed', priority:'warm', due:'Day 30 due today', worked:'Sep 10', dueNow:true, twoTouch:true },
    { id:'sep11f-8', name:'Jeannie Sass', phone:'3214801461', stage:'Pitch Completed', priority:'warm', due:'Day 1 due today', worked:'Sep 9', dueNow:true, twoTouch:true }
  ];

  const clonePlan = () => typeof structuredClone === 'function' ? structuredClone(plan) : JSON.parse(JSON.stringify(plan));
  const localDateKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  try {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(K) || 'null'); } catch {}

    if (!saved || saved.planDate !== PLAN_DATE) {
      if (saved) {
        try { localStorage.setItem(K + '-archive-' + (saved.planDate || 'previous'), JSON.stringify(saved)); } catch {}
      }
      s = clonePlan();
    } else {
      s = saved;
      s.planDate = PLAN_DATE;
      s.avGoal = Number(s.avGoal || plan.avGoal);
      s.av = Math.max(Number(s.av || 0), plan.av);
      s.goals = { ...plan.goals };
      s.targets = s.targets || { warm:0, pitch:0, sale:0 };
      s.targets.warm = Math.max(Number(s.targets.warm || 0), plan.targets.warm);
      s.targets.pitch = Math.max(Number(s.targets.pitch || 0), plan.targets.pitch);
      s.targets.sale = Math.max(Number(s.targets.sale || 0), plan.targets.sale);
      const priorByName = new Map((s.tasks || []).map(t => [t.name, t]));
      s.tasks = plan.tasks.map(task => {
        const prior = priorByName.get(task.name);
        return prior ? { ...task, done: !!prior.done || !!task.done } : { ...task };
      });
    }
    localStorage.setItem(K, JSON.stringify(s));

    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.textContent = localDateKey() < PLAN_DATE ? `UPCOMING • ${PLAN_LABEL.toUpperCase()}` : PLAN_LABEL.toUpperCase();
    const title = document.querySelector('#todayView h1');
    if (title) title.textContent = 'Friday Sales Plan';
    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'Current board: 8 positive responses, 1 appointment set, 1 pitch, 1 sale, $3,076.92 Written AV, and $3,076.92 Issued AV. You hit the warm-conversation target — keep converting the fresh interest and keep lead flow active.';

    const reset = document.getElementById('reset');
    if (reset) reset.onclick = () => {
      if (confirm("Reset today's checklist?")) {
        s = clonePlan();
        localStorage.setItem(K, JSON.stringify(s));
        renderToday();
      }
    };

    if (!document.getElementById('dayScheduleCss')) {
      const css = document.createElement('style');
      css.id = 'dayScheduleCss';
      css.textContent = `.daySchedule{margin:16px 0 0;padding:17px 18px}.dayScheduleTitle{font:700 17px Georgia;color:var(--navy);margin:4px 0 10px}.dayScheduleItems{display:flex;gap:7px;flex-wrap:wrap}.dayScheduleItem{background:#f0eee9;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:750;color:var(--navy)}.dayScheduleItem strong{color:var(--blue);margin-right:4px}.leadFlowFocus{margin:16px 0 0;padding:19px 20px;border:1px solid var(--line)}.leadFlowTitle{font:700 22px Georgia;color:var(--navy);margin:4px 0 5px}.leadFlowCopy{font-size:11px;line-height:1.55;color:var(--muted);max-width:780px}.leadFlowMix{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}.leadFlowMix div{background:#f0eee9;border:1px solid var(--line);border-radius:14px;padding:12px}.leadFlowMix b{display:block;font-size:18px;color:var(--navy);margin-bottom:3px}.leadFlowMix span{font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}@media(max-width:760px){.leadFlowMix{grid-template-columns:1fr}}`;
      document.head.appendChild(css);
    }

    document.querySelector('.daySchedule')?.remove();
    document.querySelector('.leadFlowFocus')?.remove();
    const head = document.querySelector('#todayView .head');
    if (head) {
      const leadFlow = document.createElement('section');
      leadFlow.className = 'card leadFlowFocus';
      leadFlow.innerHTML = `
        <div class="eyebrow">FRIDAY GAME PLAN • FRESH FLOW + FAST CONVERSION</div>
        <div class="leadFlowTitle">Eight positive responses and a fully issued sale are already on the board</div>
        <div class="leadFlowCopy">You have now hit the 8-response target for the day. Patricia Almond and John Mason are fresh opportunities added to the board, alongside Marcina Morris, David Chastain, and Collin Veach. Shift more attention toward converting those conversations into firm appointments and pitches without shutting off fresh lead flow.</div>
        <div class="leadFlowMix"><div><b>40%</b><span>Fresh Lead Flow</span></div><div><b>40%</b><span>Fresh / Warm Conversion</span></div><div><b>20%</b><span>Pitch + Due Follow-Up</span></div></div>`;
      head.parentNode.insertBefore(leadFlow, head);

      const schedule = document.createElement('section');
      schedule.className = 'card daySchedule';
      schedule.innerHTML = `
        <div class="eyebrow">TODAY'S ANCHORS</div><div class="dayScheduleTitle">Friday schedule</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>8:36</strong> Apurva — Follow-Up</span>
          <span class="dayScheduleItem"><strong>10:30</strong> Michael Greenfield — Pitch Follow-Up</span>
          <span class="dayScheduleItem"><strong>12:00</strong> Friday Kick-Off</span>
          <span class="dayScheduleItem"><strong>4:00</strong> Advanced Track</span>
          <span class="dayScheduleItem"><strong>7:00</strong> Juanae Jackson — Appointment</span>
          <span class="dayScheduleItem"><strong>Sat 9/19</strong> Victoria Thompson — 11:30 AM</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch); else PIPELINE.unshift({ name, ...patch });
    };
    patchClient('Jaime Lamboy', { work:'Sep 11', appt:'—', stage:'Sold', source:'Montague New', av:3076.92, issued:3076.92 });
    patchClient('Marcina Morris', { work:'Sep 11', appt:'—', stage:'Positive Response', source:'Montague New' });
    patchClient('David Chastain', { work:'Sep 11', appt:'—', stage:'Positive Response', source:'Montague New' });
    patchClient('John Mason', { work:'Sep 11', appt:'—', stage:'Positive Response', source:'Carson - Branded' });
    patchClient('Patricia Almond', { work:'Sep 11', appt:'—', stage:'Positive Response', source:'Carson - PingPost Exclusive' });
    patchClient('Michael Greenfield', { work:'Sep 5', appt:'Sep 11 • 10:30 AM', stage:'Pitch Completed', source:'Pipeline' });
    patchClient('Victoria Thompson', { work:'Sep 11', appt:'Sep 19 • 11:30 AM', stage:'Appointment Set', source:'#2 Exclusive LM' });
    patchClient('Juanae Jackson', { work:'Sep 9', appt:'Sep 11 • 7:00 PM', stage:'Appointment Set', source:'Carson - Branded' });
    patchClient('Judith Icenogle', { work:'Sep 11', appt:'—', stage:'Not Interested', source:'Carson - PingPost Exclusive' });
    patchClient('Collin Veach', { work:'Sep 11', appt:'—', stage:'Positive Response', source:'Carson - PingPost Exclusive' });
    patchClient('Elizabeth McGuire', { work:'Sep 11', appt:'—', stage:'Not Interested', source:'Carson - Branded' });
    patchClient('Monica Elwood', { work:'Sep 10', appt:'—', stage:'Positive Response', source:'Montague New' });
    patchClient('Jeannie Sass', { work:'Sep 9', appt:'Sep 10 • 4:30 PM', stage:'Pitch Completed', source:'Carson - Branded' });
    patchClient('Joshua Morman', { work:'Sep 10', appt:'Aug 12 • 5:00 PM', stage:'Pitch Completed', source:'Branded' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 11';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [38, 22, 6, 9, 9, 5, 24];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Live cadence-due snapshot • September 11';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [9, 1, 6, 2];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load September 11 sales plan', err);
  }
})();
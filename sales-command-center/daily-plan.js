(() => {
  const PLAN_DATE = '2026-09-10';
  const PLAN_LABEL = 'Thursday, September 10';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 0, pitch: 0, sale: 0 },
    goals: { warm: 8, pitch: 4, sale: 2 },
    followupsDone: {},
    tasks: [
      { id: 'sep10-0', name: 'Fresh Lead Flow', action: 'PRIMARY FOCUS — Create New At-Bats', note: 'Yesterday produced 5 positive responses, 5 appointments set, and a $6,638.52 sale. Keep feeding the top of the funnel today instead of overworking old inventory.', priority: 'hot', done: false },
      { id: 'sep10-1', name: 'Natalie Sparks', action: 'Day 1 Follow-Up — Convert Fresh Interest', note: 'Fresh positive response from yesterday. Move her toward a real conversation or firm appointment while the interest is still warm.', priority: 'high', done: false },
      { id: 'sep10-2', name: 'Victoria Thompson', action: 'Day 1 Follow-Up — Convert Fresh Interest', note: 'Fresh positive response from yesterday. Keep the ask simple and move toward a firm appointment.', priority: 'high', done: false },
      { id: 'sep10-3', name: 'Chris Swan', action: 'Day 1 Follow-Up — Business Owner Opportunity', note: 'Fresh positive response yesterday. He is a business owner, so treat this as both an individual and potential small-business opportunity.', priority: 'high', done: false },
      { id: 'sep10-4', name: 'Gerald Drewa', action: 'Pitch Follow-Up — Ask for the Business', note: 'Pitch completed and worked yesterday. Isolate the remaining concern and make a direct close attempt.', priority: 'hot', done: false },
      { id: 'sep10-5', name: 'Christine Milham', action: '4:15 PM Follow-Up — Protect the Sold Client', note: 'Already sold for $6,638.52 Written AV. Use the scheduled follow-up to finish anything outstanding and protect the business.', priority: 'normal', done: false },
      { id: 'sep10-6', name: 'Cy Garland', action: '5:00 PM Appointment — Protect & Close', note: 'Firm appointment today. Confirm the time, send a short pre-call reminder, and make this a focused close opportunity.', priority: 'hot', done: false },
      { id: 'sep10-7', name: 'Jeannie Sass', action: '5:00 PM Pitch Follow-Up — Close Attempt', note: 'Already pitched and specifically scheduled for today. Revisit the exact concern and ask for the application.', priority: 'hot', done: false },
      { id: 'sep10-8', name: 'Jennifer Barker', action: '6:00 PM Pitch Follow-Up — Close Attempt', note: 'Pitch completed with a firm follow-up tonight. Protect the show rate and go into the call looking for the remaining objection.', priority: 'hot', done: false },
      { id: 'sep10-9', name: 'Protect Friday Follow-Ups', action: 'Michael 10:30 AM • Juanae 7:00 PM', note: 'Before leaving today, confirm Michael Greenfield for 10:30 AM Friday and Juanae Jackson for 7:00 PM Friday.', priority: 'normal', done: false }
    ]
  };

  const freshFollowups = [
    ['Lawrence Jackson','Positive Response','high','Day 14 due today','Sep 8'],
    ['Darci Bray','Positive Response','high','Day 7 due today','Sep 8'],
    ['Darnelle Guidry','Positive Response','high','Day 7 due today','Sep 8'],
    ['Natalie Sparks','Positive Response','high','Day 1 due today','Sep 9'],
    ['Victoria Thompson','Positive Response','high','Day 1 due today','Sep 9'],
    ['Chris Swan','Positive Response','high','Day 1 due today','Sep 9'],
    ['Gerald Drewa','Pitch Completed','warm','Day 2 due today','Sep 9']
  ].map((x, i) => ({ id: 'sep10f-' + i, name: x[0], stage: x[1], priority: x[2], due: x[3], worked: x[4] }));

  function clonePlan() {
    return typeof structuredClone === 'function' ? structuredClone(plan) : JSON.parse(JSON.stringify(plan));
  }

  function localDateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  try {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(K) || 'null'); } catch {}

    if (!saved || saved.planDate !== PLAN_DATE) {
      if (saved) {
        const archiveDate = saved.planDate || 'previous';
        try { localStorage.setItem(K + '-archive-' + archiveDate, JSON.stringify(saved)); } catch {}
      }
      s = clonePlan();
      localStorage.setItem(K, JSON.stringify(s));
    } else {
      s = saved;
      s.planDate = PLAN_DATE;
      s.avGoal = Number(s.avGoal || plan.avGoal);
      s.av = Math.max(Number(s.av || 0), plan.av);
      s.goals = { ...plan.goals };
      s.targets = s.targets || { warm: 0, pitch: 0, sale: 0 };
      s.targets.warm = Math.max(Number(s.targets.warm || 0), plan.targets.warm);
      s.targets.pitch = Math.max(Number(s.targets.pitch || 0), plan.targets.pitch);
      s.targets.sale = Math.max(Number(s.targets.sale || 0), plan.targets.sale);
      const existingByName = new Map((s.tasks || []).map(t => [t.name, t]));
      s.tasks = plan.tasks.map(task => {
        const prior = existingByName.get(task.name);
        return prior ? { ...task, done: !!prior.done || !!task.done } : { ...task };
      });
      localStorage.setItem(K, JSON.stringify(s));
    }

    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.textContent = localDateKey() < PLAN_DATE ? `UPCOMING • ${PLAN_LABEL.toUpperCase()}` : PLAN_LABEL.toUpperCase();

    const title = document.querySelector('#todayView h1');
    if (title) title.textContent = 'Thursday Sales Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'Yesterday finished with 5 positive responses, 5 appointments set, 2 pitches, 1 sale, and $6,638.52 Written AV. Today has three strong close windows from 5–6 PM, but fresh lead flow still needs to stay active.';

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
      css.textContent = `
        .daySchedule{margin:16px 0 0;padding:17px 18px}
        .dayScheduleTitle{font:700 17px Georgia;color:var(--navy);margin:4px 0 10px}
        .dayScheduleItems{display:flex;gap:7px;flex-wrap:wrap}
        .dayScheduleItem{background:#f0eee9;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:750;color:var(--navy)}
        .dayScheduleItem strong{color:var(--blue);margin-right:4px}
        .leadFlowFocus{margin:16px 0 0;padding:19px 20px;border:1px solid var(--line)}
        .leadFlowTitle{font:700 22px Georgia;color:var(--navy);margin:4px 0 5px}
        .leadFlowCopy{font-size:11px;line-height:1.55;color:var(--muted);max-width:760px}
        .leadFlowMix{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}
        .leadFlowMix div{background:#f0eee9;border:1px solid var(--line);border-radius:14px;padding:12px}
        .leadFlowMix b{display:block;font-size:18px;color:var(--navy);margin-bottom:3px}
        .leadFlowMix span{font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
        @media(max-width:760px){.leadFlowMix{grid-template-columns:1fr}}
      `;
      document.head.appendChild(css);
    }

    const oldSchedule = document.querySelector('.daySchedule');
    if (oldSchedule) oldSchedule.remove();
    const oldLeadFlow = document.querySelector('.leadFlowFocus');
    if (oldLeadFlow) oldLeadFlow.remove();

    const head = document.querySelector('#todayView .head');
    if (head) {
      const leadFlow = document.createElement('section');
      leadFlow.className = 'card leadFlowFocus';
      leadFlow.innerHTML = `
        <div class="eyebrow">PRIMARY CONSTRAINT • FRESH LEAD FLOW</div>
        <div class="leadFlowTitle">Feed the funnel, then convert the evening board</div>
        <div class="leadFlowCopy">Yesterday proved the aged and fresh outreach can still create opportunities. Keep generating new conversations this morning and early afternoon, then shift hard into appointment protection and closing as the 4:15–6:00 PM block approaches.</div>
        <div class="leadFlowMix">
          <div><b>60%</b><span>Fresh Lead Flow</span></div>
          <div><b>25%</b><span>Fresh / Warm Follow-Up</span></div>
          <div><b>15%</b><span>Older Pipeline Recycling</span></div>
        </div>`;
      head.parentNode.insertBefore(leadFlow, head);

      const schedule = document.createElement('section');
      schedule.className = 'card daySchedule';
      schedule.innerHTML = `
        <div class="eyebrow">TODAY'S ANCHORS</div>
        <div class="dayScheduleTitle">Thursday schedule</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>4:15</strong> Christine Milham — Follow-Up</span>
          <span class="dayScheduleItem"><strong>5:00</strong> Cy Garland — Appointment</span>
          <span class="dayScheduleItem"><strong>5:00</strong> Jeannie Sass — Pitch Follow-Up</span>
          <span class="dayScheduleItem"><strong>6:00</strong> Jennifer Barker — Pitch Follow-Up</span>
          <span class="dayScheduleItem"><strong>Fri 10:30</strong> Michael Greenfield</span>
          <span class="dayScheduleItem"><strong>Fri 7:00</strong> Juanae Jackson</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
      else PIPELINE.unshift({ name, ...patch });
    };

    patchClient('Christine Milham', { work: 'Sep 9', appt: 'Sep 10 • 4:15 PM', stage: 'Sold', source: 'Montague New', av: 6638.52 });
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });
    patchClient('Jeannie Sass', { work: 'Sep 9', appt: 'Sep 10 • 5:00 PM', stage: 'Pitch Completed', source: 'Carson - Branded' });
    patchClient('Jennifer Barker', { work: 'Sep 8', appt: 'Sep 10 • 6:00 PM', stage: 'Pitch Completed', source: 'Montague New' });
    patchClient('Michael Greenfield', { work: 'Sep 5', appt: 'Sep 11 • 10:30 AM', stage: 'Pitch Completed', source: 'Pipeline' });
    patchClient('Juanae Jackson', { work: 'Sep 9', appt: 'Sep 11 • 7:00 PM', stage: 'Appointment Set', source: 'Carson - Branded' });
    patchClient('Natalie Sparks', { work: 'Sep 9', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Victoria Thompson', { work: 'Sep 9', appt: '—', stage: 'Positive Response', source: '#2 Exclusive LM' });
    patchClient('Chris Swan', { work: 'Sep 9', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Gerald Drewa', { work: 'Sep 9', appt: 'Sep 8 • 11:00 AM', stage: 'Pitch Completed', source: 'Branded' });
    patchClient('Lawrence Jackson', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Branded' });
    patchClient('Darci Bray', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Darnelle Guidry', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Carson - Shared' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 10';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [32, 20, 6, 8, 9, 5, 22];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Live cadence-due snapshot • September 10';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [7, 0, 6, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load September 10 sales plan', err);
  }
})();

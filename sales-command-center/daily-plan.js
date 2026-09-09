(() => {
  const PLAN_DATE = '2026-09-09';
  const PLAN_LABEL = 'Wednesday, September 9';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 1, pitch: 0, sale: 0 },
    goals: { warm: 8, pitch: 4, sale: 2 },
    followupsDone: {},
    tasks: [
      { id: 'sep9-0', name: 'Betty Adsit', action: 'Morning Appointment Held — Follow-Up Set for Sep 23', note: 'Good outcome: the appointment held and a firm follow-up is on the calendar for September 23 at 9:34 AM.', priority: 'hot', done: true },
      { id: 'sep9-1', name: 'Fresh Lead Flow', action: 'PRIMARY FOCUS — Build New At-Bats', note: 'The warm pipeline has been worked hard. Put roughly 60–70% of prospecting time into genuinely fresh leads and new conversations today.', priority: 'hot', done: false },
      { id: 'sep9-2', name: 'Richard Goodine', action: '5:30 PM Appointment — Protect & Close', note: 'Fresh appointment set today. Confirm it, protect the show rate, and treat this as the best immediate close opportunity on the board.', priority: 'hot', done: false },
      { id: 'sep9-3', name: 'Pitch Completed Queue', action: 'Worked — Monitor Responses', note: 'Joshua, Jennifer, Michael, Dustin, and Gerald have been worked. Do not spend the day recycling them again; respond quickly if one re-engages.', priority: 'warm', done: true },
      { id: 'sep9-4', name: 'Fresh Positive Responses', action: 'Work New Interest First', note: 'Prioritize brand-new responses like Natalie Sparks and anyone else who responds today before going deep into older interested leads.', priority: 'high', done: false },
      { id: 'sep9-5', name: 'Interested Pipeline', action: 'Short Warm Re-Engagement Block', note: 'Keep this to roughly 20–25% of prospecting time. Work the freshest and highest-intent names, then get back to creating new lead flow.', priority: 'warm', done: false },
      { id: 'sep9-6', name: 'Aged Lead Bulk', action: 'Two-Touch Low-Friction Campaign', note: 'Use the October 1 / incomplete-request message to generate replies from older leads without letting the aged file consume the entire day.', priority: 'normal', done: false },
      { id: 'sep9-7', name: 'New Lead Speed-to-Contact', action: 'Protect Every Fresh Opportunity', note: 'Fresh leads only help if they are contacted fast. Keep the first-call / first-text response window tight and move interested people toward a firm time.', priority: 'high', done: false },
      { id: 'sep9-8', name: 'Cy Garland', action: 'Protect Tomorrow — 5:00 PM Appointment', note: 'Confirm tomorrow’s appointment today so the next close opportunity is protected before you finish the day.', priority: 'normal', done: false },
      { id: 'sep9-9', name: 'Tomorrow Lead Queue', action: 'Finish With Fresh Inventory', note: 'Do not end the day with an empty top of funnel. Make sure tomorrow starts with fresh names ready to call, not only recycled pipeline.', priority: 'normal', done: false }
    ]
  };

  const freshFollowups = [
    ['Kaleigh Wilson','Positive Response','high','Day 14 due today','Sep 8'],
    ['Steve Ferguson','Positive Response','high','Day 14 due today','Sep 8'],
    ['Elizabeth Tetreault','Positive Response','high','Day 14 due today','Sep 8'],
    ['Fnu Bharat','Positive Response','high','Day 14 due today','Sep 8'],
    ['Gerald Drewa','Pitch Completed','warm','Worked today','Sep 9']
  ].map((x, i) => ({ id: 'sep9f-' + i, name: x[0], stage: x[1], priority: x[2], due: x[3], worked: x[4] }));

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
      s.goals = { ...plan.goals };
      s.targets = s.targets || { warm: 0, pitch: 0, sale: 0 };
      s.targets.warm = Math.max(Number(s.targets.warm || 0), 1);
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
    if (title) title.textContent = 'Wednesday Sales Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'The warm pipeline has been worked hard. Today’s constraint is fresh at-bats: make new lead flow the main prospecting priority, protect Richard at 5:30, and recycle older opportunities in short blocks.';

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
        <div class="leadFlowTitle">Create more fresh at-bats</div>
        <div class="leadFlowCopy">You have already worked the existing interested and pitched inventory hard. Keep warm follow-up alive, but shift the majority of prospecting energy back to genuinely new leads and fast first contact.</div>
        <div class="leadFlowMix">
          <div><b>60–70%</b><span>Fresh Lead Flow</span></div>
          <div><b>20–25%</b><span>Fresh / Warm Follow-Up</span></div>
          <div><b>10–15%</b><span>Older Pipeline Recycling</span></div>
        </div>`;
      head.parentNode.insertBefore(leadFlow, head);

      const schedule = document.createElement('section');
      schedule.className = 'card daySchedule';
      schedule.innerHTML = `
        <div class="eyebrow">TODAY'S ANCHORS</div>
        <div class="dayScheduleTitle">Wednesday schedule</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>✓</strong> Betty Adsit — Held</span>
          <span class="dayScheduleItem"><strong>5:30</strong> Richard Goodine — Appointment</span>
          <span class="dayScheduleItem"><strong>Fresh</strong> Natalie Sparks — Positive Response</span>
          <span class="dayScheduleItem"><strong>Next</strong> Thu 5:00 PM — Cy Garland</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
      else PIPELINE.unshift({ name, ...patch });
    };

    patchClient('Betty Adsit', { work: 'Sep 9', appt: 'Sep 23 • 9:34 AM', stage: 'Appointment Answered', source: 'Branded' });
    patchClient('Richard Goodine', { work: 'Sep 9', appt: 'Sep 9 • 5:30 PM', stage: 'Appointment Set', source: 'CSV Upload' });
    patchClient('Natalie Sparks', { work: 'Sep 9', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });
    patchClient('Gerald Drewa', { work: 'Sep 9', appt: 'Sep 8 • 11:00 AM', stage: 'Pitch Completed', source: 'Branded' });
    patchClient('Kaleigh Wilson', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Pipeline' });
    patchClient('Steve Ferguson', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Pipeline' });
    patchClient('Elizabeth Tetreault', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Pipeline' });
    patchClient('Fnu Bharat', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Pipeline' });
    patchClient('Dustin Beard', { work: 'Sep 8', appt: 'Sep 1 • 1:10 PM', stage: 'Pitch Completed', source: 'Branded' });
    patchClient('Mary Fondren', { work: 'Sep 8', appt: 'Sep 1 • 4:00 PM', stage: 'Appointment Missed', source: 'Montague New' });
    patchClient('Chiquita Tucker', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Exclusive' });
    patchClient('Lawrence Jackson', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Branded' });
    patchClient('Darci Bray', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Darnelle Guidry', { work: 'Sep 8', appt: '—', stage: 'Positive Response', source: 'Carson - Shared' });
    patchClient('Veretta Jones', { work: 'Sep 8', appt: 'Sep 4 • 3:00 PM', stage: 'Appointment Missed', source: 'Carson 1' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 9';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [29, 18, 5, 7, 9, 5, 22];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Live cadence-due snapshot • September 9';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [5, 0, 4, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load September 9 sales plan', err);
  }
})();

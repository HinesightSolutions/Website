(() => {
  const PLAN_DATE = '2026-09-08';
  const PLAN_LABEL = 'Tuesday, September 8';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 0, pitch: 0, sale: 0 },
    goals: { warm: 8, pitch: 4, sale: 2 },
    followupsDone: {},
    tasks: [
      { id: 'sep8-0', name: 'Mark Binkley', action: '8:30 AM Appointment', note: 'First client appointment of the day. Protect the show, slow the conversation down, and move to a firm decision or next step.', priority: 'hot', done: false },
      { id: 'sep8-1', name: 'Junior Jules', action: '10:00 AM Appointment', note: 'Keep the morning momentum going. Confirm the need, present clearly, and ask for the business when the fit is there.', priority: 'hot', done: false },
      { id: 'sep8-2', name: 'Gerald Drewa', action: '11:00 AM Follow-Up Appointment', note: 'This is already pitched business. Focus on what is still unresolved rather than starting the presentation over.', priority: 'hot', done: false },
      { id: 'sep8-3', name: 'Jeannie Sass', action: '4:30 PM Appointment', note: 'Protect the afternoon appointment and turn the conversation into a clear recommendation and next step.', priority: 'hot', done: false },
      { id: 'sep8-4', name: 'Jennifer Barker', action: '6:00 PM Follow-Up Appointment', note: 'Previously pitched. Isolate the remaining concern, answer it directly, and ask for the decision.', priority: 'hot', done: false },
      { id: 'sep8-5', name: 'Mary Fondren', action: 'Day 7 Missed-Appointment Recovery — Due Today', note: 'Keep the recovery light. Give her an easy choice between reconnecting later this week or receiving an email.', priority: 'high', done: false },
      { id: 'sep8-6', name: 'Dustin Beard', action: 'Day 7 Pitch Follow-Up — Due Today', note: 'Reopen the decision without re-pitching. Find the real hesitation and move toward a yes, no, or concrete next step.', priority: 'high', done: false },
      { id: 'sep8-7', name: 'Mike Olson', action: 'Day 14 Interested Follow-Up — Due Today', note: 'Use a short low-pressure re-entry and make it easy to choose a later call or an email.', priority: 'high', done: false },
      { id: 'sep8-8', name: 'Interested Pipeline', action: 'Warm Re-Engagement Block', note: 'There are 30 open interested leads in the working pipeline. Work the warmest names after the three cadence-due touches and between appointments.', priority: 'warm', done: false },
      { id: 'sep8-9', name: 'Fresh / Raw Leads', action: 'Prospecting Block', note: 'Use the open space around appointments to create the next wave of conversations and appointments. Do not let a full calendar stop new pipeline creation.', priority: 'normal', done: false }
    ]
  };

  const freshFollowups = [
    ['Mary Fondren','Appointment Missed','hot','Day 7 due today','Sep 7'],
    ['Mike Olson','Positive Response','high','Day 14 due today','Sep 7'],
    ['Dustin Beard','Pitch Completed','warm','Day 7 due today','Sep 7']
  ].map((x, i) => ({ id: 'sep8f-' + i, name: x[0], stage: x[1], priority: x[2], due: x[3], worked: x[4] }));

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
      const existingByName = new Map((s.tasks || []).map(t => [t.name, t]));
      s.tasks = plan.tasks.map(task => {
        const prior = existingByName.get(task.name);
        return prior ? { ...task, done: !!prior.done } : { ...task };
      });
      localStorage.setItem(K, JSON.stringify(s));
    }

    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.textContent = localDateKey() < PLAN_DATE ? `UPCOMING • ${PLAN_LABEL.toUpperCase()}` : PLAN_LABEL.toUpperCase();

    const title = document.querySelector('#todayView h1');
    if (title) title.textContent = 'Tuesday Close Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'Five client appointments are on the calendar today. Protect the show rate, work the three due follow-ups, and turn the schedule into written and issued AV.';

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
      `;
      document.head.appendChild(css);
    }

    const oldSchedule = document.querySelector('.daySchedule');
    if (oldSchedule) oldSchedule.remove();
    const head = document.querySelector('#todayView .head');
    if (head) {
      const schedule = document.createElement('section');
      schedule.className = 'card daySchedule';
      schedule.innerHTML = `
        <div class="eyebrow">TODAY'S ANCHORS</div>
        <div class="dayScheduleTitle">Tuesday schedule</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>8:30</strong> Mark Binkley</span>
          <span class="dayScheduleItem"><strong>10:00</strong> Junior Jules</span>
          <span class="dayScheduleItem"><strong>11:00</strong> Gerald Drewa</span>
          <span class="dayScheduleItem"><strong>12:00</strong> Product Training</span>
          <span class="dayScheduleItem"><strong>4:00</strong> Sales Training</span>
          <span class="dayScheduleItem"><strong>4:30</strong> Jeannie Sass</span>
          <span class="dayScheduleItem"><strong>6:00</strong> Jennifer Barker</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
      else PIPELINE.unshift({ name, ...patch });
    };

    patchClient('Mark Binkley', { work: 'Sep 5', appt: 'Sep 8 • 8:30 AM', stage: 'Appointment Set', source: 'Shared' });
    patchClient('Junior Jules', { work: 'Sep 3', appt: 'Sep 8 • 10:00 AM', stage: 'Appointment Set', source: 'Carson - Branded' });
    patchClient('Gerald Drewa', { work: 'Sep 1', appt: 'Sep 8 • 11:00 AM', stage: 'Pitch Completed', source: 'Branded' });
    patchClient('Jeannie Sass', { work: 'Sep 7', appt: 'Sep 8 • 4:30 PM', stage: 'Appointment Set', source: 'Calendar' });
    patchClient('Jennifer Barker', { work: 'Sep 3', appt: 'Sep 8 • 6:00 PM', stage: 'Pitch Completed', source: 'Montague New' });
    patchClient('Betty Adsit', { work: 'Sep 4', appt: 'Sep 9 • 9:00 AM', stage: 'Appointment Set', source: 'Branded' });
    patchClient('Michael Greenfield', { work: 'Sep 5', appt: 'Sep 11 • 10:30 AM', stage: 'Pitch Completed', source: 'Pipeline' });
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });
    patchClient('Shakeya Dunbar', { work: 'Sep 7', appt: '—', stage: 'Not Interested', source: 'Pipeline' });
    patchClient('Mary Fondren', { work: 'Sep 7', appt: 'Sep 1 • 4:00 PM', stage: 'Appointment Missed', source: 'Montague New' });
    patchClient('Mike Olson', { work: 'Sep 7', appt: '—', stage: 'Positive Response', source: 'Shared' });
    patchClient('Dustin Beard', { work: 'Sep 7', appt: 'Sep 1 • 1:10 PM', stage: 'Pitch Completed', source: 'Branded' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 8 AM';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [30, 19, 5, 7, 9, 5, 20];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Live cadence-due snapshot • September 8 AM';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [3, 1, 1, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load September 8 sales plan', err);
  }
})();

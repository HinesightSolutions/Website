(() => {
  const PLAN_DATE = '2026-09-07';
  const PLAN_LABEL = 'Monday, September 7';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 0, pitch: 0, sale: 0 },
    goals: { warm: 6, pitch: 3, sale: 1 },
    followupsDone: {},
    tasks: [
      { id: 'sep7-0', name: 'Erika Sugihara', action: '10:30 AM Follow-Up', note: 'Protect the scheduled follow-up. Pick the conversation back up naturally and move to the clearest next step.', priority: 'hot', done: false },
      { id: 'sep7-1', name: 'Mary Fondren', action: 'Overdue Missed Appointment Recovery', note: 'Her Day 4 recovery touch is still open. Keep it easy and offer a simple chance to reconnect after the holiday weekend.', priority: 'hot', done: false },
      { id: 'sep7-2', name: 'Shakeya Dunbar', action: 'Day 14 Follow-Up — Due Today', note: 'Soft re-engagement. Give her room to say yes, later, or close the file without making the message feel heavy.', priority: 'high', done: false },
      { id: 'sep7-3', name: 'Chiquita Tucker', action: 'Day 7 Follow-Up — Due Today', note: 'Reopen the conversation with a low-pressure call or text and see whether she still wants help.', priority: 'high', done: false },
      { id: 'sep7-4', name: 'Darci + Caroline + Darnelle', action: 'Overdue Positive Response Block', note: 'All three are past their Day 2 touch. Work them as one focused warm block before widening into older pipeline.', priority: 'high', done: false },
      { id: 'sep7-5', name: 'Dustin Beard', action: 'Overdue Pitch Follow-Up', note: 'Reopen the decision without re-pitching everything. Find the real hesitation and ask what would help him move forward.', priority: 'warm', done: false },
      { id: 'sep7-6', name: 'Tomorrow’s Appointments', action: 'Confirmation Block', note: 'Later today confirm Junior Jules at 10:00 AM, Gerald Drewa at 11:00 AM, and Jennifer Barker at 6:00 PM for Tuesday.', priority: 'high', done: false },
      { id: 'sep7-7', name: 'Interested Pipeline', action: 'Labor Day Warm Outreach Block', note: 'Use the relaxed holiday-weekend message and focus on creating real conversations. Keep the call invitation broad enough for mixed-stage clients.', priority: 'warm', done: false },
      { id: 'sep7-8', name: 'Fresh / Raw Leads', action: 'Prospecting Block', note: 'Only after the scheduled follow-up and warm stack are handled. Build the next wave of appointments for the week.', priority: 'normal', done: false }
    ]
  };

  const freshFollowups = [
    ['Mary Fondren','Appointment Missed','hot','Day 4 overdue','Sep 4'],
    ['Darci Bray','Positive Response','high','Day 2 overdue','Sep 4'],
    ['Caroline Moeller','Positive Response','high','Day 2 overdue','Sep 4'],
    ['Darnelle Guidry','Positive Response','high','Day 2 overdue','Sep 4'],
    ['Shakeya Dunbar','Positive Response','high','Day 14 due today','Sep 4'],
    ['Chiquita Tucker','Positive Response','high','Day 7 due today','Sep 4'],
    ['Dustin Beard','Pitch Completed','warm','Day 4 overdue','Sep 4']
  ].map((x, i) => ({ id: 'sep7f-' + i, name: x[0], stage: x[1], priority: x[2], due: x[3], worked: x[4] }));

  function clonePlan() {
    return typeof structuredClone === 'function'
      ? structuredClone(plan)
      : JSON.parse(JSON.stringify(plan));
  }

  function localDateKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
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
      s.goals = s.goals || { ...plan.goals };
      s.targets = s.targets || { warm: 0, pitch: 0, sale: 0 };
      if (!Array.isArray(s.tasks)) s.tasks = [];

      const existingByName = new Map(s.tasks.map(t => [t.name, t]));
      s.tasks = plan.tasks.map(task => {
        const prior = existingByName.get(task.name);
        return prior ? { ...task, done: !!prior.done } : { ...task };
      });
      localStorage.setItem(K, JSON.stringify(s));
    }

    const todayKey = localDateKey();
    const dateEl = document.getElementById('date');
    if (dateEl) {
      dateEl.textContent = todayKey < PLAN_DATE
        ? `UPCOMING • ${PLAN_LABEL.toUpperCase()}`
        : PLAN_LABEL.toUpperCase();
    }

    const title = document.querySelector('#todayView h1');
    if (title) title.textContent = 'Labor Day Close Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'Protect the 10:30 follow-up, clear the live warm list, then use the holiday window for relaxed outreach before cold prospecting.';

    const reset = document.getElementById('reset');
    if (reset) {
      reset.onclick = () => {
        if (confirm("Reset today's checklist?")) {
          s = clonePlan();
          localStorage.setItem(K, JSON.stringify(s));
          renderToday();
        }
      };
    }

    const css = document.createElement('style');
    css.textContent = `
      .daySchedule{margin:16px 0 0;padding:17px 18px}
      .dayScheduleTitle{font:700 17px Georgia;color:var(--navy);margin:4px 0 10px}
      .dayScheduleItems{display:flex;gap:7px;flex-wrap:wrap}
      .dayScheduleItem{background:#f0eee9;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:750;color:var(--navy)}
      .dayScheduleItem strong{color:var(--blue);margin-right:4px}
    `;
    document.head.appendChild(css);

    const oldSchedule = document.querySelector('.daySchedule');
    if (oldSchedule) oldSchedule.remove();
    const head = document.querySelector('#todayView .head');
    if (head) {
      const schedule = document.createElement('section');
      schedule.className = 'card daySchedule';
      schedule.innerHTML = `
        <div class="eyebrow">TODAY'S ANCHORS</div>
        <div class="dayScheduleTitle">Labor Day schedule</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>10:30</strong> Erika Sugihara follow-up</span>
          <span class="dayScheduleItem"><strong>12:00</strong> Mindset & Workflow</span>
          <span class="dayScheduleItem"><strong>4:00</strong> Knowledge & Misc</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
      else PIPELINE.unshift({ name, ...patch });
    };

    patchClient('Dorothy Fields', { work: 'Sep 5', appt: '—', stage: 'Sold', source: 'Carson 1', av: 1703.28 });
    patchClient('Michael Greenfield', { work: 'Sep 5', appt: 'Sep 11 • 10:30 AM', stage: 'Pitch Completed', source: 'Carson 1' });
    patchClient('Mark Binkley', { work: 'Sep 5', appt: 'Sep 5 • 6:00 PM', stage: 'Appointment Set', source: 'Shared' });
    patchClient('Juri Grispino', { work: 'Sep 5', appt: '—', stage: 'Not Interested', source: 'Branded' });
    patchClient('Betty Adsit', { work: 'Sep 4', appt: 'Sep 9 • 9:00 AM', stage: 'Appointment Set', source: 'Branded' });
    patchClient('Mary Fondren', { work: 'Sep 4', appt: 'Sep 1 • 4:00 PM', stage: 'Appointment Missed', source: 'Montague New' });
    patchClient('Shakeya Dunbar', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Pipeline' });
    patchClient('Chiquita Tucker', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Exclusive' });
    patchClient('Darci Bray', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Caroline Moeller', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Darnelle Guidry', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Carson - Shared' });
    patchClient('Dustin Beard', { work: 'Sep 4', appt: 'Sep 1 • 1:10 PM', stage: 'Pitch Completed', source: 'Branded' });
    patchClient('Junior Jules', { work: 'Sep 3', appt: 'Sep 8 • 10:00 AM', stage: 'Appointment Set', source: 'Carson - Branded' });
    patchClient('Gerald Drewa', { work: 'Sep 1', appt: 'Sep 8 • 11:00 AM', stage: 'Pitch Completed', source: 'Branded' });
    patchClient('Jennifer Barker', { work: 'Sep 3', appt: 'Sep 8 • 6:00 PM', stage: 'Pitch Completed', source: 'Montague New' });
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 7 AM';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [31, 19, 5, 7, 9, 5, 20];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Live follow-up snapshot • September 7 AM';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [7, 1, 5, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load Labor Day sales plan', err);
  }
})();

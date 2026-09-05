(() => {
  const PLAN_DATE = '2026-09-05';
  const PLAN_LABEL = 'Saturday, September 5';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 0, pitch: 1, sale: 1 },
    goals: { warm: 6, pitch: 3, sale: 1 },
    followupsDone: {},
    tasks: [
      { id: 'sep5-0', name: 'Dorothy Fields', action: 'Sale Closed', note: 'Sold today. Keep the file clean and add Written AV when the submitted amount is available.', priority: 'hot', done: true },
      { id: 'sep5-1', name: 'Michael Greenfield', action: 'Pitch Completed', note: 'Completed the 10:30 AM pitch and booked the next follow-up for Friday 9/11 at 10:30 AM.', priority: 'hot', done: true },
      { id: 'sep5-2', name: 'Mark Binkley', action: 'Day 2 Missed Appointment Recovery', note: 'Missed-appointment cadence is due today. Offer today or tomorrow and get a firm new time.', priority: 'hot', done: false },
      { id: 'sep5-3', name: 'Mary Fondren', action: 'Day 4 Missed Appointment Recovery', note: 'Another recovery touch is due today. Keep it low pressure and give two concrete timing choices.', priority: 'hot', done: false },
      { id: 'sep5-4', name: 'Darci Bray', action: 'Day 2 Positive Response Follow-Up', note: 'Still warm. Move toward a real conversation or a firm appointment.', priority: 'high', done: false },
      { id: 'sep5-5', name: 'Caroline Moeller', action: 'Day 2 Positive Response Follow-Up', note: 'Still warm. Move toward a real conversation or a firm appointment.', priority: 'high', done: false },
      { id: 'sep5-6', name: 'Darnelle Guidry', action: 'Day 2 Positive Response Follow-Up', note: 'Still warm. Move toward a real conversation or a firm appointment.', priority: 'high', done: false },
      { id: 'sep5-7', name: 'Juri Grispino', action: 'Day 14 Positive Response Follow-Up', note: 'Soft re-engagement due today. Give an easy keep-open-or-close-out choice.', priority: 'high', done: false },
      { id: 'sep5-8', name: 'Dustin Beard', action: 'Day 4 Pitch Follow-Up', note: 'Reopen the comparison, isolate the concern, and ask what would move the decision forward.', priority: 'warm', done: false },
      { id: 'sep5-9', name: 'Fresh / Raw Leads', action: 'Prospecting Block', note: 'Only after the due warm follow-ups above are handled. Build the next wave of appointments.', priority: 'normal', done: false }
    ]
  };

  const freshFollowups = [
    ['Mark Binkley','Appointment Missed','hot','Day 2 due today','Sep 4'],
    ['Mary Fondren','Appointment Missed','hot','Day 4 due today','Sep 4'],
    ['Juri Grispino','Positive Response','high','Day 14 due today','Sep 4'],
    ['Darci Bray','Positive Response','high','Day 2 due today','Sep 4'],
    ['Caroline Moeller','Positive Response','high','Day 2 due today','Sep 4'],
    ['Darnelle Guidry','Positive Response','high','Day 2 due today','Sep 4'],
    ['Dustin Beard','Pitch Completed','warm','Day 4 due today','Sep 4']
  ].map((x, i) => ({ id: 'sep5f-' + i, name: x[0], stage: x[1], priority: x[2], due: x[3], worked: x[4] }));

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
        const archiveDate = saved.planDate || '2026-09-04';
        try { localStorage.setItem(K + '-archive-' + archiveDate, JSON.stringify(saved)); } catch {}
      }
      s = clonePlan();
      localStorage.setItem(K, JSON.stringify(s));
    } else {
      s = saved;

      // Keep today's known production synced without wiping user checklist progress.
      s.planDate = PLAN_DATE;
      s.targets = s.targets || { warm: 0, pitch: 0, sale: 0 };
      s.targets.pitch = Math.max(Number(s.targets.pitch || 0), 1);
      s.targets.sale = Math.max(Number(s.targets.sale || 0), 1);

      const ensureTask = task => {
        const existing = s.tasks && s.tasks.find(t => t.id === task.id || t.name === task.name);
        if (existing) Object.assign(existing, task, { done: existing.done || task.done });
        else {
          if (!Array.isArray(s.tasks)) s.tasks = [];
          s.tasks.unshift(task);
        }
      };
      ensureTask(plan.tasks[1]);
      ensureTask(plan.tasks[0]);
      localStorage.setItem(K, JSON.stringify(s));
    }

    const todayKey = localDateKey();
    const dateEl = document.getElementById('date');
    if (dateEl) {
      dateEl.textContent = todayKey < PLAN_DATE
        ? `TOMORROW • ${PLAN_LABEL.toUpperCase()}`
        : PLAN_LABEL.toUpperCase();
    }

    const title = document.querySelector('#todayView h1');
    if (title) title.textContent = 'Saturday Close Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'You already have a sale on the board. Finish the due warm follow-ups before widening into raw prospecting.';

    const reset = document.getElementById('reset');
    if (reset) {
      reset.onclick = () => {
        if (confirm("Reset Saturday's checklist?")) {
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
        <div class="eyebrow">TODAY'S APPOINTMENTS</div>
        <div class="dayScheduleTitle">Saturday anchors</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>10:30</strong> Michael Greenfield — completed</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
      else PIPELINE.unshift({ name, ...patch });
    };

    patchClient('Dorothy Fields', { work: 'Sep 5', appt: '—', stage: 'Sold', source: 'Carson 1' });
    patchClient('Michael Greenfield', { work: 'Sep 5', appt: 'Sep 11 • 10:30 AM', stage: 'Pitch Completed', source: 'Carson 1' });
    patchClient('Betty Adsit', { work: 'Sep 4', appt: 'Sep 9 • 9:00 AM', stage: 'Appointment Set', source: 'Branded' });
    patchClient('Veretta Jones', { work: 'Sep 4', appt: 'Sep 4 • 3:00 PM', stage: 'Appointment Missed', source: 'Carson 1' });
    patchClient('Mark Binkley', { work: 'Sep 4', stage: 'Appointment Missed', source: 'Shared' });
    patchClient('Mary Fondren', { work: 'Sep 4', appt: 'Sep 1 • 4:00 PM', stage: 'Appointment Missed', source: 'Montague New' });
    patchClient('Darci Bray', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Caroline Moeller', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Darnelle Guidry', { work: 'Sep 4', appt: '—', stage: 'Positive Response', source: 'Carson - Shared' });
    patchClient('Donna Burgess', { work: 'Sep 3', appt: 'Sep 4 • 5:30 PM', stage: 'Appointment Set', source: 'Branded' });
    patchClient('Junior Jules', { work: 'Sep 3', appt: 'Sep 8 • 10:00 AM', stage: 'Appointment Set', source: 'Carson - Branded' });
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });
    patchClient('Jennifer Barker', { work: 'Sep 3', appt: 'Sep 8 • 6:00 PM', stage: 'Pitch Completed', source: 'Montague New' });
    patchClient('Walter McNeill', { work: 'Sep 2', av: 10426.92, issued: 5198.88, stage: 'Sold', source: 'Branded' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 5';

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Live follow-up snapshot • September 5';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [7, 2, 4, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load Saturday sales plan', err);
  }
})();

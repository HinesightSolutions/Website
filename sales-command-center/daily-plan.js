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
      { id: 'sep9-1', name: 'Gerald Drewa', action: 'Pitch Follow-Up — Due Today', note: 'This is already pitched business. Find the one remaining concern instead of presenting everything again, then ask for a clear decision or next step.', priority: 'hot', done: false },
      { id: 'sep9-2', name: 'Kaleigh Wilson', action: 'Day 14 Interested Follow-Up — Due Today', note: 'Use a short, low-pressure re-entry and make it easy to choose a quick call or an email.', priority: 'high', done: false },
      { id: 'sep9-3', name: 'Steve Ferguson', action: 'Day 14 Interested Follow-Up — Due Today', note: 'Keep it brief and specific. Reopen the conversation and try to turn the interest into a firm time.', priority: 'high', done: false },
      { id: 'sep9-4', name: 'Elizabeth Tetreault', action: 'Day 14 Interested Follow-Up — Due Today', note: 'Give her an easy path back into the conversation without making it feel like a generic follow-up.', priority: 'high', done: false },
      { id: 'sep9-5', name: 'Fnu Bharat', action: 'Day 14 Interested Follow-Up — Due Today', note: 'Use a soft re-engagement and move toward a call only if the interest is still there.', priority: 'high', done: false },
      { id: 'sep9-6', name: 'Pitch Completed Queue', action: 'Close Existing Business', note: 'There are 5 clients currently sitting at Pitch Completed. After Gerald, work the warmest unresolved pitches before spending the whole day on raw leads.', priority: 'warm', done: false },
      { id: 'sep9-7', name: 'Interested Pipeline', action: 'Warm Re-Engagement Block', note: 'There are 29 open Positive Response clients. Start with the freshest names from yesterday — Chiquita Tucker, Lawrence Jackson, Darci Bray, and Darnelle Guidry.', priority: 'warm', done: false },
      { id: 'sep9-8', name: 'Fresh / Raw Leads', action: 'Prospecting Block', note: 'Lead creation still matters today. Build new conversations and appointments after the warmest money has been worked.', priority: 'normal', done: false },
      { id: 'sep9-9', name: 'Cy Garland', action: 'Protect Tomorrow — 5:00 PM Appointment', note: 'Confirm tomorrow’s appointment today so the next close opportunity is protected before you finish the day.', priority: 'normal', done: false }
    ]
  };

  const freshFollowups = [
    ['Kaleigh Wilson','Positive Response','high','Day 14 due today','Sep 8'],
    ['Steve Ferguson','Positive Response','high','Day 14 due today','Sep 8'],
    ['Elizabeth Tetreault','Positive Response','high','Day 14 due today','Sep 8'],
    ['Fnu Bharat','Positive Response','high','Day 14 due today','Sep 8'],
    ['Gerald Drewa','Pitch Completed','warm','Day 1 due today','Sep 1']
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
    if (title) title.textContent = 'Wednesday Close Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'The morning appointment is handled and the next follow-up is protected. Close the warm business first, then lean into fresh lead volume and build the next wave.';

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
        <div class="dayScheduleTitle">Wednesday schedule</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>✓</strong> Betty Adsit — Held</span>
          <span class="dayScheduleItem"><strong>Sep 23</strong> Betty Follow-Up — 9:34 AM</span>
          <span class="dayScheduleItem"><strong>Due</strong> Gerald Drewa — Pitch Follow-Up</span>
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
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });
    patchClient('Gerald Drewa', { work: 'Sep 1', appt: 'Sep 8 • 11:00 AM', stage: 'Pitch Completed', source: 'Branded' });
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
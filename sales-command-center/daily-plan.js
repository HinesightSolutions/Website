(() => {
  const PLAN_DATE = '2026-09-03';
  const PLAN_LABEL = 'Thursday, September 3';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 0, pitch: 0, sale: 0 },
    goals: { warm: 6, pitch: 3, sale: 1 },
    followupsDone: {},
    tasks: [
      ['Donna Burgess', '11:00 AM Appointment', 'Prep by 10:45. Confirm the appointment, hold the conversation, and move into a full pitch.', 'hot'],
      ['Jennifer Barker', '2:00 PM Appointment', 'Protect the appointment and be ready by 1:45. Goal: hold + pitch.', 'hot'],
      ['Mark Binkley', '3:00 PM Appointment', 'Protect the appointment and be ready by 2:45. Goal: hold + pitch.', 'hot'],
      ['Dustin Beard', 'Close Follow-Up', 'Reopen the options you reviewed, isolate the real objection, and ask for the business.', 'hot'],
      ['Mary Fondren', 'Missed Appointment Recovery', 'Give the missed appointment another clean attempt and offer two concrete times.', 'high'],
      ['Overdue Missed Appointments', 'Recovery Block', 'Beverly Cheaton → Michael Greenfield → Susan Dangerfield. Work these before cold prospecting.', 'high'],
      ['Fresh Interested Leads', 'Conversion Block', 'Chiquita Tucker → Betty Adsit → Joe Fisher. Push for a real conversation or firm appointment.', 'high'],
      ['Warm Follow-Ups', 'Focused Conversation Block', 'Douglass Keys → Lawrence Jackson → Juri Grispino → Mike Olson. Target two real conversations.', 'warm'],
      ['Aged Warm Leads', 'Re-Engagement Block', 'Jacob Norrell → Martin McMillan → Kenya Hart. Give them a clean keep-open-or-close-out choice.', 'warm'],
      ['Fresh / Raw Leads', 'Prospecting Block', 'Prospect only after the warm stack is worked. Build the next wave of appointments.', 'normal']
    ].map((x, i) => ({ id: 'sep3-' + i, name: x[0], action: x[1], note: x[2], priority: x[3], done: false }))
  };

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
      if (saved && !saved.planDate) {
        try { localStorage.setItem(K + '-archive-2026-09-02', JSON.stringify(saved)); } catch {}
      }
      s = clonePlan();
      localStorage.setItem(K, JSON.stringify(s));
    } else {
      s = saved;
    }

    const todayKey = localDateKey();
    const dateEl = document.getElementById('date');
    if (dateEl) {
      dateEl.textContent = todayKey < PLAN_DATE
        ? `TOMORROW • ${PLAN_LABEL.toUpperCase()}`
        : PLAN_LABEL.toUpperCase();
    }

    const title = document.querySelector('#todayView h1');
    if (title) title.textContent = 'Thursday Close Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'Protect the three appointments, work the warmest money first, then prospect.';

    const reset = document.getElementById('reset');
    if (reset) {
      reset.onclick = () => {
        if (confirm("Reset Thursday's checklist?")) {
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

    const head = document.querySelector('#todayView .head');
    if (head && !document.querySelector('.daySchedule')) {
      const schedule = document.createElement('section');
      schedule.className = 'card daySchedule';
      schedule.innerHTML = `
        <div class="eyebrow">FIXED SCHEDULE</div>
        <div class="dayScheduleTitle">Tomorrow's anchors</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>11:00</strong> Donna Burgess</span>
          <span class="dayScheduleItem"><strong>12:00</strong> Product Training</span>
          <span class="dayScheduleItem"><strong>2:00</strong> Jennifer Barker</span>
          <span class="dayScheduleItem"><strong>3:00</strong> Mark Binkley</span>
          <span class="dayScheduleItem"><strong>4:00</strong> Sales Training</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    // Bring the static Pipeline snapshot in line with the live sheet as of Sept. 2.
    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
    };
    patchClient('Jennifer Barker', { work: 'Sep 2', appt: 'Sep 3 • 2:00 PM', stage: 'Appointment Set' });
    patchClient('Jennifer Escalera', { work: 'Sep 2', stage: 'Not Interested' });
    patchClient('Walter McNeill', { work: 'Sep 2', av: 10426.92, issued: 5198.88, stage: 'Sold' });
    if (!PIPELINE.some(x => x.name === 'Donna Burgess')) {
      PIPELINE.unshift({ name: 'Donna Burgess', stage: 'Appointment Set', work: 'Sep 2', appt: 'Sep 3 • 11:00 AM', source: 'Branded' });
    }

    // Jennifer Escalera was closed out today, so remove her from the active follow-up queue.
    const closedFollowIndex = FOLLOWUPS.findIndex(x => x.name === 'Jennifer Escalera');
    if (closedFollowIndex >= 0) FOLLOWUPS.splice(closedFollowIndex, 1);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 2 EOD';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [33, 17, 0, 3, 6, 9, 3, 18];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [27, 4, 22, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load Thursday sales plan', err);
  }
})();

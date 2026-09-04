(() => {
  const PLAN_DATE = '2026-09-04';
  const PLAN_LABEL = 'Friday, September 4';

  const plan = {
    planDate: PLAN_DATE,
    av: 0,
    avGoal: 10000,
    targets: { warm: 0, pitch: 0, sale: 0 },
    goals: { warm: 6, pitch: 3, sale: 1 },
    followupsDone: {},
    tasks: [
      ['Alan Bryant', '2:00 PM Follow-Up', 'Use the scheduled follow-up to get a clear yes/no on next steps and move toward a real review.', 'hot'],
      ['Veretta Jones', '3:00 PM Appointment', 'Protect the appointment. Be ready by 2:45 and push for a full pitch if the conversation is qualified.', 'hot'],
      ['Donna Burgess', '5:30 PM Appointment', 'Protect the appointment. Revisit her needs, qualify cleanly, and move into the strongest option.', 'hot'],
      ['Dustin Beard', 'Close Follow-Up', 'This is still one of the warmest money opportunities. Isolate the real objection and ask for the business.', 'hot'],
      ['Mark Binkley', 'Day 1 Missed Appointment Recovery', 'He missed yesterday. Give him a clean recovery attempt and offer two concrete times.', 'high'],
      ['Darci + Caroline + Darnelle', 'Fresh Positive Response Block', 'All three responded yesterday. Work these before aged leads and try to create real conversations or firm appointments.', 'high'],
      ['Kristina + Casey + Bailey', 'Due-Today Warm Block', 'These Day 14 interested leads are due today. Give each a soft keep-open-or-close-out choice.', 'high'],
      ['Missed Appointment Recovery', 'Overdue Recovery Block', 'Mary Fondren → Samantha Bowdy → Irene Dehaven → Ashley Myles → Jessica Lail. Recover what you can before cold prospecting.', 'high'],
      ['Interested Pipeline', 'Focused Warm Conversation Block', 'Chiquita Tucker → Betty Adsit → Juri Grispino → Mike Olson. Target two real conversations.', 'warm'],
      ['Fresh / Raw Leads', 'Prospecting Block', 'Only after the warm stack is worked. Build the next wave of weekend/next-week appointments.', 'normal']
    ].map((x, i) => ({ id: 'sep4-' + i, name: x[0], action: x[1], note: x[2], priority: x[3], done: false }))
  };

  const freshFollowups = [
    ['Beverly Cheaton','Appointment Missed','hot','Day 1 overdue','Aug 28'],
    ['Michael Greenfield','Appointment Missed','hot','Day 2 overdue','Aug 28'],
    ['Susan Dangerfield','Appointment Missed','hot','Day 14 overdue','Aug 28'],
    ['Mary Fondren','Appointment Missed','hot','Day 1 overdue','Sep 1'],
    ['Samantha Bowdy','Appointment Missed','hot','Day 14 overdue','Aug 28'],
    ['Irene Dehaven','Appointment Missed','hot','Day 14 overdue','Aug 28'],
    ['Ashley Myles','Appointment Missed','hot','Day 14 overdue','Aug 28'],
    ['Jessica Lail','Appointment Missed','hot','Day 14 overdue','Aug 28'],
    ['Mark Binkley','Appointment Missed','hot','Day 1 due today','Sep 3'],
    ['Juri Grispino','Positive Response','high','Day 7 overdue','Aug 28'],
    ['Mike Olson','Positive Response','high','Day 4 overdue','Aug 28'],
    ['Lawrence Jackson','Positive Response','high','Day 2 overdue','Aug 28'],
    ['Kaleigh Wilson','Positive Response','high','Day 4 overdue','Aug 28'],
    ['Steve Ferguson','Positive Response','high','Day 4 overdue','Aug 28'],
    ['Elizabeth Tetreault','Positive Response','high','Day 4 overdue','Aug 28'],
    ['Fnu Bharat','Positive Response','high','Day 4 overdue','Aug 28'],
    ['Alan Bryant','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Dylan Vetter','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Jodi Pearce','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Shakeya Dunbar','Positive Response','high','Day 7 overdue','Aug 28'],
    ['Yolanda Castro','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Crystal Valentin','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Bryce Rone','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Shawna Looney','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Chiquita Tucker','Positive Response','high','Day 1 overdue','Aug 31'],
    ['Betty Adsit','Positive Response','high','Day 1 overdue','Aug 31'],
    ['Martin McMillan','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Kenya Hart','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Mohammed Khan','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Dave Lipscomb','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Amanda Cox','Positive Response','high','Day 14 overdue','Aug 28'],
    ['Kristina Brunette','Positive Response','high','Day 14 due today','Aug 28'],
    ['Casey Holsclaw','Positive Response','high','Day 14 due today','Aug 28'],
    ['Bailey Ledford','Positive Response','high','Day 14 due today','Aug 28'],
    ['Darci Bray','Positive Response','high','Day 1 due today','Sep 3'],
    ['Caroline Moeller','Positive Response','high','Day 1 due today','Sep 3'],
    ['Darnelle Guidry','Positive Response','high','Day 1 due today','Sep 3'],
    ['Dustin Beard','Pitch Completed','warm','Day 1 overdue','Sep 1']
  ].map((x, i) => ({ id: 'sep4f-' + i, name: x[0], stage: x[1], priority: x[2], due: x[3], worked: x[4] }));

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
        const archiveDate = saved.planDate || '2026-09-03';
        try { localStorage.setItem(K + '-archive-' + archiveDate, JSON.stringify(saved)); } catch {}
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
    if (title) title.textContent = 'Friday Close Plan';

    const heroCopy = document.querySelector('#todayView .hero .muted');
    if (heroCopy) heroCopy.textContent = 'Protect today’s appointments, work yesterday’s fresh positives, then recover overdue money.';

    const reset = document.getElementById('reset');
    if (reset) {
      reset.onclick = () => {
        if (confirm("Reset Friday's checklist?")) {
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
        <div class="eyebrow">FIXED SCHEDULE</div>
        <div class="dayScheduleTitle">Friday's anchors</div>
        <div class="dayScheduleItems">
          <span class="dayScheduleItem"><strong>12:00</strong> Friday Kick-Off</span>
          <span class="dayScheduleItem"><strong>2:00</strong> Alan Bryant</span>
          <span class="dayScheduleItem"><strong>3:00</strong> Veretta Jones</span>
          <span class="dayScheduleItem"><strong>4:00</strong> Advanced Track</span>
          <span class="dayScheduleItem"><strong>5:30</strong> Donna Burgess</span>
        </div>`;
      head.parentNode.insertBefore(schedule, head);
    }

    const patchClient = (name, patch) => {
      const row = PIPELINE.find(x => x.name === name);
      if (row) Object.assign(row, patch);
      else PIPELINE.unshift({ name, ...patch });
    };

    patchClient('Jennifer Barker', { work: 'Sep 3', appt: 'Sep 8 • 6:00 PM', stage: 'Pitch Completed', source: 'Montague New' });
    patchClient('Jennifer Escalera', { work: 'Sep 2', stage: 'Not Interested', source: 'Exclusive' });
    patchClient('Walter McNeill', { work: 'Sep 2', av: 10426.92, issued: 5198.88, stage: 'Sold', source: 'Branded' });
    patchClient('Mark Binkley', { work: 'Sep 3', appt: 'Sep 3 • 3:00 PM', stage: 'Appointment Missed', source: 'Shared' });
    patchClient('Jacob Norrell', { work: 'Sep 3', stage: 'Not Interested', source: 'Pipeline' });
    patchClient('Douglass Keys', { work: 'Sep 3', stage: 'ACA Appointment', source: 'Shared' });
    patchClient('Joe Fisher', { work: 'Sep 3', stage: 'ACA Appointment', source: 'Branded' });
    patchClient('Darci Bray', { work: 'Sep 3', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Caroline Moeller', { work: 'Sep 3', appt: '—', stage: 'Positive Response', source: 'Carson - Branded' });
    patchClient('Darnelle Guidry', { work: 'Sep 3', appt: '—', stage: 'Positive Response', source: 'Carson - Shared' });
    patchClient('Donna Burgess', { work: 'Sep 3', appt: 'Sep 4 • 5:30 PM', stage: 'Appointment Set', source: 'Branded' });
    patchClient('Junior Jules', { work: 'Sep 3', appt: 'Sep 8 • 10:00 AM', stage: 'Appointment Set', source: 'Carson - Branded' });
    patchClient('Veretta Jones', { work: 'Sep 3', appt: 'Sep 4 • 3:00 PM', stage: 'Appointment Set', source: 'Carson 1' });
    patchClient('Cy Garland', { work: 'Sep 3', appt: 'Sep 10 • 5:00 PM', stage: 'Appointment Set', source: 'Carson 1' });

    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...freshFollowups);

    const pipelineHero = document.querySelector('#pipelineView .snapshot');
    if (pipelineHero) pipelineHero.textContent = 'Current pipeline snapshot • September 3 EOD';
    const pipelineStats = document.querySelectorAll('#pipelineView .statNum');
    const pipelineCounts = [33, 18, 4, 6, 10, 5, 19];
    pipelineStats.forEach((el, i) => { if (i < pipelineCounts.length) el.textContent = pipelineCounts[i]; });

    const followHero = document.querySelector('#followupsView .snapshot');
    if (followHero) followHero.textContent = 'Current follow-up snapshot • September 4 AM';
    const followStats = document.querySelectorAll('#followupsView .statNum');
    const followCounts = [38, 9, 28, 1];
    followStats.forEach((el, i) => { if (i < followCounts.length) el.textContent = followCounts[i]; });

    renderToday();
    renderPipeline();
    renderFollowups();
  } catch (err) {
    console.error('Unable to load Friday sales plan', err);
  }
})();

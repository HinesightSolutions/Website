(() => {
  const EXCLUSIONS = {
    'Shakeya Dunbar': { work: 'Sep 7' },
    'Caroline Moeller': { work: 'Sep 8' }
  };
  const EXCLUDED_NAMES = new Set(Object.keys(EXCLUSIONS));
  const RESCHEDULES = {
    'Jennifer Barker': { work: 'Sep 8', appt: 'Sep 10 • 6:00 PM', stage: 'Pitch Completed' }
  };
  const RESCHEDULED_NAMES = new Set(Object.keys(RESCHEDULES));

  function removeFromToday() {
    try {
      if (Array.isArray(s?.tasks)) {
        const before = s.tasks.length;
        s.tasks = s.tasks.filter(t => !EXCLUDED_NAMES.has(t.name) && !RESCHEDULED_NAMES.has(t.name));
        if (s.tasks.length !== before) {
          localStorage.setItem(K, JSON.stringify(s));
          if (typeof renderToday === 'function') renderToday();
        }
      }
    } catch {}
  }

  function patchPipeline() {
    try {
      if (typeof PIPELINE === 'undefined') return;
      Object.entries(EXCLUSIONS).forEach(([name, meta]) => {
        const row = PIPELINE.find(x => x.name === name);
        if (row) {
          row.stage = 'Not Interested';
          row.work = meta.work;
          row.appt = '—';
        }
      });
      Object.entries(RESCHEDULES).forEach(([name, meta]) => {
        const row = PIPELINE.find(x => x.name === name);
        if (row) {
          row.stage = meta.stage;
          row.work = meta.work;
          row.appt = meta.appt;
        }
      });
      if (typeof renderPipeline === 'function' && document.getElementById('pipelineView')?.classList.contains('active')) {
        renderPipeline();
      }
    } catch {}
  }

  function removeFromFollowups() {
    try {
      if (typeof FOLLOWUPS === 'undefined' || !Array.isArray(FOLLOWUPS)) return false;
      const before = FOLLOWUPS.length;
      for (let i = FOLLOWUPS.length - 1; i >= 0; i--) {
        if (EXCLUDED_NAMES.has(FOLLOWUPS[i]?.name)) FOLLOWUPS.splice(i, 1);
      }
      return before !== FOLLOWUPS.length;
    } catch {
      return false;
    }
  }

  function refreshTodayChrome() {
    try {
      document.querySelectorAll('.dayScheduleItem').forEach(el => {
        if (el.textContent.includes('Jennifer Barker')) el.remove();
      });
      const heroCopy = document.querySelector('#todayView .hero .muted');
      if (heroCopy) heroCopy.textContent = 'Four client appointments remain on today’s calendar. Protect the show rate, work the due follow-ups, and keep building written and issued AV. Jennifer Barker moved to Thursday at 6:00 PM.';
    } catch {}
  }

  function refreshFollowupChrome() {
    const hero = document.querySelector('#followupsView .screenHero');
    if (hero) {
      const copy = hero.querySelector('.muted');
      if (copy) copy.textContent = 'Messages stay warm but use clear choice-based next steps. Two-touch recommendations remain reserved for the strongest open opportunities.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = 'Expanded follow-up snapshot • September 8 • 40 open opportunities';
      const tags = hero.querySelectorAll('.followHeroTag');
      if (tags[0]) tags[0].textContent = '3 DUE TODAY';
      if (tags[1]) tags[1].textContent = '4 TWO-TOUCH TODAY';
      if (tags[2]) tags[2].textContent = '40 OPEN FOLLOW-UPS';
      if (tags[3]) tags[3].textContent = 'CHOICE-BASED CTAs';
    }

    const stats = document.querySelectorAll('#followupsView .statCard');
    const values = [
      ['3','Due Today'],
      ['9','Missed Appts'],
      ['29','Interested'],
      ['2','Pitch Decisions']
    ];
    stats.forEach((card, i) => {
      if (!values[i]) return;
      const n = card.querySelector('.statNum');
      const l = card.querySelector('.statLabel');
      if (n) n.textContent = values[i][0];
      if (l) l.textContent = values[i][1];
    });

    const badge = document.getElementById('followRemaining');
    if (badge && typeof FOLLOWUPS !== 'undefined' && Array.isArray(FOLLOWUPS)) {
      const remaining = FOLLOWUPS.filter(f => !s.followupsDone?.[f.id]).length;
      const dueRemaining = FOLLOWUPS.filter(f => f.dueNow && !s.followupsDone?.[f.id]).length;
      badge.textContent = `${remaining} open • ${dueRemaining} due today • 4 two-touch`;
    }
  }

  function apply() {
    removeFromToday();
    patchPipeline();
    refreshTodayChrome();
    const changed = removeFromFollowups();
    if (changed && typeof renderFollowups === 'function') {
      try { renderFollowups(); } catch {}
    }
    refreshFollowupChrome();
  }

  [0, 250, 800, 1600].forEach(ms => setTimeout(apply, ms));
  window.addEventListener('DOMContentLoaded', apply);
})();

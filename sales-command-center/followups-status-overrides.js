(() => {
  const NAME = 'Shakeya Dunbar';

  function removeFromToday() {
    try {
      if (Array.isArray(s?.tasks)) {
        const before = s.tasks.length;
        s.tasks = s.tasks.filter(t => t.name !== NAME);
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
      const row = PIPELINE.find(x => x.name === NAME);
      if (row) {
        row.stage = 'Not Interested';
        row.work = 'Sep 7';
        row.appt = '—';
      }
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
        if (FOLLOWUPS[i]?.name === NAME) FOLLOWUPS.splice(i, 1);
      }
      return before !== FOLLOWUPS.length;
    } catch {
      return false;
    }
  }

  function refreshFollowupChrome() {
    const hero = document.querySelector('#followupsView .screenHero');
    if (hero) {
      const copy = hero.querySelector('.muted');
      if (copy) copy.textContent = 'The cadence-due clients stay pinned first, and the page includes the broader open warm pool so you always have another person to work.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = 'Expanded follow-up snapshot • September 7 • 41 open opportunities';
      const tags = hero.querySelectorAll('.followHeroTag');
      if (tags[0]) tags[0].textContent = '6 DUE / OVERDUE';
      if (tags[1]) tags[1].textContent = '41 OPEN FOLLOW-UPS';
    }

    const stats = document.querySelectorAll('#followupsView .statCard');
    const values = [
      ['6','Due / Overdue'],
      ['9','Missed Appts'],
      ['30','Interested'],
      ['2','Pitch Decisions']
    ];
    stats.forEach((card, i) => {
      if (!values[i]) return;
      const n = card.querySelector('.statNum');
      const l = card.querySelector('.statLabel');
      if (n) n.textContent = values[i][0];
      if (l) l.textContent = values[i][1];
    });
  }

  function apply() {
    removeFromToday();
    patchPipeline();
    const changed = removeFromFollowups();
    refreshFollowupChrome();
    if (changed && typeof renderFollowups === 'function') {
      try { renderFollowups(); } catch {}
    }
  }

  [0, 250, 800, 1600].forEach(ms => setTimeout(apply, ms));
  window.addEventListener('DOMContentLoaded', apply);
})();

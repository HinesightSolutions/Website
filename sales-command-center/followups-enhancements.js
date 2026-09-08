(() => {
  const SNAPSHOT_DATE = 'September 8';
  const DUE_NAMES = new Set(['Mary Fondren', 'Mike Olson', 'Dustin Beard']);
  const cadence = {
    'Mary Fondren': 'Day 7 due today',
    'Mike Olson': 'Day 14 due today',
    'Dustin Beard': 'Day 7 due today'
  };

  const rows = [
    ['Drew Davis','3369783868','Appointment Missed','Sep 7'],
    ['Beverly Cheaton','5743156214','Appointment Missed','Sep 7'],
    ['Susan Dangerfield','9702141901','Appointment Missed','Sep 7'],
    ['Samantha Bowdy','5124848548','Appointment Missed','Sep 7'],
    ['Irene Dehaven','8172260170','Appointment Missed','Sep 7'],
    ['Ashley Myles','7138165864','Appointment Missed','Sep 7'],
    ['Jessica Lail','9808601272','Appointment Missed','Sep 7'],
    ['Mary Fondren','2254215031','Appointment Missed','Sep 7'],
    ['Veretta Jones','8648006189','Appointment Missed','Sep 7'],

    ['Alan Bryant','7705604750','Positive Response','Sep 7'],
    ['David Coker','6086954295','Positive Response','Sep 7'],
    ['Dylan Vetter','9139446469','Positive Response','Sep 7'],
    ['Kristine Kilde','5416680778','Positive Response','Sep 7'],
    ['Carroll Cason','2292215529','Positive Response','Sep 7'],
    ['Raymond Riojas','9472296928','Positive Response','Sep 7'],
    ['Tacara Maxwell','2168040164','Positive Response','Sep 7'],
    ['Jodi Pearce','5743867893','Positive Response','Sep 7'],
    ['Yolanda Castro','5672282048','Positive Response','Sep 7'],
    ['Crystal Valentin','3524445141','Positive Response','Sep 7'],
    ['Bryce Rone','7194242822','Positive Response','Sep 7'],
    ['Shawna Looney','5015545555','Positive Response','Sep 7'],
    ['Martin McMillan','9109921296','Positive Response','Sep 7'],
    ['Kenya Hart','9195911654','Positive Response','Sep 7'],
    ['Mohammed Khan','6308271788','Positive Response','Sep 7'],
    ['Dave Lipscomb','4434638658','Positive Response','Sep 7'],
    ['Amanda Cox','9366616658','Positive Response','Sep 7'],
    ['Kristina Brunette','7024390065','Positive Response','Sep 7'],
    ['Casey Holsclaw','8049337130','Positive Response','Sep 7'],
    ['Bailey Ledford','8597971162','Positive Response','Sep 7'],
    ['Mike Olson','6084250029','Positive Response','Sep 7'],
    ['Kaleigh Wilson','9018311603','Positive Response','Sep 7'],
    ['Steve Ferguson','2707918917','Positive Response','Sep 7'],
    ['Elizabeth Tetreault','7726433324','Positive Response','Sep 7'],
    ['Fnu Bharat','6157054430','Positive Response','Sep 7'],
    ['Lawrence Jackson','2166129314','Positive Response','Sep 7'],
    ['Chiquita Tucker','2105745727','Positive Response','Sep 7'],
    ['Darci Bray','4057608416','Positive Response','Sep 7'],
    ['Caroline Moeller','5022872508','Positive Response','Sep 7'],
    ['Darnelle Guidry','3372243460','Positive Response','Sep 7'],

    ['Joshua Morman','8658950199','Pitch Completed','Sep 7'],
    ['Dustin Beard','3254235658','Pitch Completed','Sep 7']
  ];

  function priorityFor(stage) {
    if (stage === 'Appointment Missed') return 'hot';
    if (stage === 'Pitch Completed') return 'warm';
    return 'high';
  }

  const expanded = rows.map((r, i) => ({
    id: 'sep8-open-' + i,
    name: r[0],
    phone: r[1],
    stage: r[2],
    worked: r[3],
    priority: priorityFor(r[2]),
    due: cadence[r[0]] || (r[2] === 'Appointment Missed' ? 'Missed recovery pool' : r[2] === 'Pitch Completed' ? 'Decision pool' : 'Interested pool'),
    dueNow: DUE_NAMES.has(r[0])
  }));

  function firstName(name) {
    return (name || '').trim().split(/\s+/)[0] || name;
  }

  function messageFor(f) {
    const first = firstName(f.name);
    if (f.stage === 'Appointment Missed') {
      return `Hey ${first}! I know we missed each other before. Would later this week be better for a quick call, or would you rather I send an email?`;
    }
    if (f.stage === 'Pitch Completed') {
      return `Hey ${first}! I still have the options we reviewed. Would you rather reconnect later this week or have me send the details by email?`;
    }
    return `Hey ${first}! I know things get busy. Would a quick call later this week or an email be easier for you?`;
  }

  function actionFor(f) {
    if (f.stage === 'Appointment Missed') return 'Recover the missed appointment without adding pressure. Aim for a firm later-this-week time or an email permission.';
    if (f.stage === 'Pitch Completed') return 'Reopen the decision without repeating the pitch. Find the unresolved concern and make the next step easy.';
    return 'Warm re-entry. Aim for a reply, a later-this-week call, or permission to send an email.';
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); done(); } finally { ta.remove(); }
  }

  function copyText(text, button) {
    const finish = () => {
      const old = button.textContent;
      button.textContent = 'Copied ✓';
      if (typeof tip === 'function') tip('Message copied');
      setTimeout(() => button.textContent = old, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(finish).catch(() => fallbackCopy(text, finish));
    } else fallbackCopy(text, finish);
  }

  function installCss() {
    if (document.getElementById('followupEnhancementCss')) return;
    const css = document.createElement('style');
    css.id = 'followupEnhancementCss';
    css.textContent = `
      #followupsView .screenHero{position:relative;overflow:hidden}
      .followHeroLine{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .followHeroTag{font-size:10px;font-weight:800;background:#eef2f4;color:var(--navy);border:1px solid var(--line);border-radius:999px;padding:6px 9px}
      .followCard.dueNowCard{border-color:#e2c7a9;box-shadow:0 8px 24px #d7854218}
      .followMessage{margin-top:12px;background:#f7f8f9;border:1px solid var(--line);border-radius:14px;padding:12px}
      .followMessageHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
      .followMessageLabel{font-size:9px;font-weight:850;letter-spacing:.12em;color:var(--blue);text-transform:uppercase}
      .followMessageText{font-size:12px;line-height:1.55;color:var(--ink);white-space:pre-wrap}
      .copyFollowBtn{border:1px solid var(--blue);background:#fff;color:var(--navy);border-radius:10px;padding:6px 9px;font-size:10px;font-weight:850;white-space:nowrap}
      .phoneMeta{font-variant-numeric:tabular-nums}
      .dueBadgeHot{color:var(--red)!important}
      .poolDue{color:var(--muted)!important}
      @media(max-width:760px){.followMessageHead{align-items:flex-start}.copyFollowBtn{padding:7px 10px}}
    `;
    document.head.appendChild(css);
  }

  function updateHeroAndStats() {
    const hero = document.querySelector('#followupsView .screenHero');
    if (hero) {
      const copy = hero.querySelector('.muted');
      if (copy) copy.textContent = 'The 3 cadence-due clients stay pinned first, followed by the full open warm pool so you always have another person to work.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = `Expanded follow-up snapshot • ${SNAPSHOT_DATE} • 41 open opportunities`;
      const oldLine = hero.querySelector('.followHeroLine');
      if (oldLine) oldLine.remove();
      const line = document.createElement('div');
      line.className = 'followHeroLine';
      line.innerHTML = '<span class="followHeroTag">3 DUE TODAY</span><span class="followHeroTag">41 OPEN FOLLOW-UPS</span><span class="followHeroTag">COPY-READY MESSAGES</span>';
      hero.appendChild(line);
    }

    const stats = document.querySelectorAll('#followupsView .statCard');
    const values = [
      ['3','Due Today'],
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

  function enhancedRenderFollowups() {
    const q = document.getElementById('followSearch').value.trim().toLowerCase();
    const stage = document.getElementById('followStage').value;
    const filtered = FOLLOWUPS.filter(f =>
      (activePriority === 'all' || f.priority === activePriority) &&
      (stage === 'all' || f.stage === stage) &&
      (!q || f.name.toLowerCase().includes(q) || f.stage.toLowerCase().includes(q) || (f.phone || '').includes(q))
    );

    const remaining = FOLLOWUPS.filter(f => !s.followupsDone[f.id]).length;
    const dueRemaining = FOLLOWUPS.filter(f => f.dueNow && !s.followupsDone[f.id]).length;
    const badge = document.getElementById('followRemaining');
    if (badge) badge.textContent = `${remaining} open • ${dueRemaining} due today`;

    const list = document.getElementById('followList');
    list.innerHTML = '';
    if (!filtered.length) {
      list.innerHTML = '<div class="empty">No follow-ups match that filter.</div>';
      return;
    }

    filtered.sort((a, b) => {
      const ad = !!s.followupsDone[a.id], bd = !!s.followupsDone[b.id];
      if (ad !== bd) return ad ? 1 : -1;
      if (a.dueNow !== b.dueNow) return a.dueNow ? -1 : 1;
      const stageRank = { 'Appointment Missed': 0, 'Pitch Completed': 1, 'Positive Response': 2 };
      return (stageRank[a.stage] ?? 9) - (stageRank[b.stage] ?? 9);
    });

    filtered.forEach(f => {
      const done = !!s.followupsDone[f.id];
      const a = document.createElement('article');
      a.className = 'followCard' + (done ? ' worked' : '') + (f.dueNow ? ' dueNowCard' : '');
      const msg = messageFor(f);
      const dueClass = f.dueNow ? 'due dueBadgeHot' : 'due poolDue';

      a.innerHTML = `
        <div class="followTop">
          <div>
            <div class="topline"><span class="priorityPill ${f.priority}">${f.priority}</span><span class="followName"></span></div>
            <div class="meta"><span class="st"></span><span class="phoneMeta"></span><span>Last worked ${f.worked}</span></div>
          </div>
          <div class="${dueClass}"></div>
        </div>
        <div class="note" style="margin-top:10px"></div>
        <div class="followMessage">
          <div class="followMessageHead"><span class="followMessageLabel">Suggested message</span><button type="button" class="copyFollowBtn">Copy Text</button></div>
          <div class="followMessageText"></div>
        </div>
        <div class="cardActions"><button class="cardBtn addToday">Add to Today</button><button class="cardBtn primaryish workedBtn"></button></div>`;

      a.querySelector('.followName').textContent = f.name;
      a.querySelector('.st').textContent = f.stage;
      a.querySelector('.phoneMeta').textContent = f.phone;
      a.querySelector('.' + dueClass.split(' ').join('.')).textContent = f.due;
      a.querySelector('.note').textContent = actionFor(f);
      a.querySelector('.followMessageText').textContent = msg;
      a.querySelector('.copyFollowBtn').onclick = () => copyText(msg, a.querySelector('.copyFollowBtn'));
      a.querySelector('.workedBtn').textContent = done ? 'Reopen' : 'Mark Worked';
      a.querySelector('.workedBtn').onclick = () => {
        s.followupsDone[f.id] = !done;
        localStorage.setItem(K, JSON.stringify(s));
        enhancedRenderFollowups();
        if (typeof tip === 'function') tip(!done ? 'Marked worked' : 'Reopened');
      };
      a.querySelector('.addToday').onclick = () => addToToday(f.name, f.stage, actionFor(f), f.priority);
      list.appendChild(a);
    });
  }

  try {
    installCss();
    FOLLOWUPS.splice(0, FOLLOWUPS.length, ...expanded);
    updateHeroAndStats();
    window.renderFollowups = enhancedRenderFollowups;
    enhancedRenderFollowups();

    const followSearch = document.getElementById('followSearch');
    const followStage = document.getElementById('followStage');
    if (followSearch) followSearch.oninput = enhancedRenderFollowups;
    if (followStage) followStage.onchange = enhancedRenderFollowups;
    document.querySelectorAll('#priorityChips .chip').forEach(b => b.onclick = () => {
      activePriority = b.dataset.priority;
      document.querySelectorAll('#priorityChips .chip').forEach(x => x.classList.toggle('active', x === b));
      enhancedRenderFollowups();
    });
  } catch (err) {
    console.error('Unable to refresh follow-up queue', err);
  }
})();

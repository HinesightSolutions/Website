(() => {
  const SNAPSHOT_DATE = 'September 8';
  const DUE_NAMES = new Set(['Mary Fondren', 'Mike Olson', 'Dustin Beard']);
  const TWO_TOUCH_NAMES = new Set(['Mary Fondren', 'Dustin Beard']);
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
    dueNow: DUE_NAMES.has(r[0]),
    twoTouch: TWO_TOUCH_NAMES.has(r[0])
  }));

  function firstName(name) {
    return (name || '').trim().split(/\s+/)[0] || name;
  }

  function localDayNumber() {
    const d = new Date();
    return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
  }

  function nameHash(name) {
    return String(name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  }

  function rotatingMessage(f) {
    const first = firstName(f.name);
    const pools = {
      'Appointment Missed': [
        `Hey ${first}, I still have a note that we never got a chance to connect. Do you have a better day or time this week?`,
        `Hey ${first}, we kept missing each other before. If you still want help, send me a day that is easier and I’ll work around you.`,
        `Hey ${first}, I have a few openings this week if coverage is still on your list. Is morning or afternoon usually easier?`,
        `Hey ${first}, if a call has been hard to line up, I can handle a lot of this by text too. Want to pick it back up that way?`
      ],
      'Pitch Completed': [
        `Hey ${first}, one thing I wanted to ask after our conversation — was the biggest hesitation cost, benefits, or timing?`,
        `Hey ${first}, after having a little time to think about what we reviewed, what is the main thing keeping you from moving forward?`,
        `Hey ${first}, if you tell me what you would want changed about the option we reviewed, I can tell you whether I can improve it.`,
        `Hey ${first}, are you still considering what we discussed, or did you end up going another direction?`
      ],
      'Positive Response': [
        `Hey ${first}, quick question — is getting coverage still something you want to handle this month, or has your situation changed?`,
        `Hey ${first}, when we spoke before you were looking into health coverage. Is that still on your list, or did you get something handled?`,
        `Hey ${first}, I still have your information from when you were looking at coverage. Is there anything specific keeping you from moving forward right now?`,
        `Hey ${first}, I’m working through a few older files today. Do you still want help with yours, or are you all set now?`
      ]
    };
    const pool = pools[f.stage] || pools['Positive Response'];
    return pool[(localDayNumber() + nameHash(f.name)) % pool.length];
  }

  function firstTouchFor(f) {
    if (f.name === 'Mary Fondren') {
      return 'Hey Mary, I still have a note that we never got a chance to connect. Do you have a better day or time this week?';
    }
    if (f.name === 'Dustin Beard') {
      return 'Hey Dustin, one thing I wanted to ask after our conversation — was the biggest hesitation cost, benefits, or timing?';
    }
    if (f.name === 'Mike Olson') {
      return 'Hey Mike, quick question — is getting health coverage still something you want to handle this month, or has your situation changed?';
    }
    return rotatingMessage(f);
  }

  function secondTouchFor(f) {
    if (f.name === 'Mary Fondren') {
      return 'Hey Mary, if a call is tough to line up, I can handle a lot of this by text too. Want to pick it back up that way?';
    }
    if (f.name === 'Dustin Beard') {
      return 'If it’s easier, just reply COST, BENEFITS, or LATER and I’ll know what direction to take from here.';
    }
    return '';
  }

  function actionFor(f) {
    if (f.name === 'Mary Fondren') return 'Two-touch today: missed-appointment recovery now, then a different text-based option later only if she does not reply.';
    if (f.name === 'Dustin Beard') return 'Two-touch today: isolate the hesitation first, then use the simple COST / BENEFITS / LATER reply later only if he stays silent.';
    if (f.stage === 'Appointment Missed') return 'Recover the missed appointment without repeating yesterday’s wording. Aim for a specific day/time or offer text as another path.';
    if (f.stage === 'Pitch Completed') return 'Move the conversation forward with a new angle — hesitation, desired change, or decision — rather than repeating the prior pitch.';
    return 'Use a different angle from yesterday. Ask a concrete status or decision question instead of another generic “later this week or email” message.';
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
      .followHeroTag.twoTouchTag{background:#fff5e9;border-color:#e7cfac}
      .followCard.dueNowCard{border-color:#e2c7a9;box-shadow:0 8px 24px #d7854218}
      .twoTouchBadge{display:inline-flex;margin-left:7px;padding:4px 7px;border-radius:999px;background:#fff2df;border:1px solid #ead0a6;color:#8d5a20;font-size:9px;font-weight:850;letter-spacing:.04em}
      .followMessage{margin-top:12px;background:#f7f8f9;border:1px solid var(--line);border-radius:14px;padding:12px}
      .followMessage.secondTouch{background:#fffaf3;border-color:#e7d9c1}
      .followMessageHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
      .followMessageLabel{font-size:9px;font-weight:850;letter-spacing:.12em;color:var(--blue);text-transform:uppercase}
      .followMessage.secondTouch .followMessageLabel{color:#96652d}
      .followMessageText{font-size:12px;line-height:1.55;color:var(--ink);white-space:pre-wrap}
      .copyFollowBtn{border:1px solid var(--blue);background:#fff;color:var(--navy);border-radius:10px;padding:6px 9px;font-size:10px;font-weight:850;white-space:nowrap}
      .secondTouch .copyFollowBtn{border-color:#c89b61}
      .touchTiming{font-size:10px;color:var(--muted);margin-top:7px;font-weight:700}
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
      if (copy) copy.textContent = 'Recommended texts now rotate by day and stage so they do not sound like yesterday. Two-touch clients get a separate later-day message only if the first touch gets no reply.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = `Expanded follow-up snapshot • ${SNAPSHOT_DATE} • 41 open opportunities`;
      const oldLine = hero.querySelector('.followHeroLine');
      if (oldLine) oldLine.remove();
      const line = document.createElement('div');
      line.className = 'followHeroLine';
      line.innerHTML = '<span class="followHeroTag">3 DUE TODAY</span><span class="followHeroTag twoTouchTag">2 TWO-TOUCH TODAY</span><span class="followHeroTag">41 OPEN FOLLOW-UPS</span><span class="followHeroTag">DAY-AWARE MESSAGES</span>';
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
    if (badge) badge.textContent = `${remaining} open • ${dueRemaining} due today • 2 two-touch`;

    const list = document.getElementById('followList');
    list.innerHTML = '';
    if (!filtered.length) {
      list.innerHTML = '<div class="empty">No follow-ups match that filter.</div>';
      return;
    }

    filtered.sort((a, b) => {
      const ad = !!s.followupsDone[a.id], bd = !!s.followupsDone[b.id];
      if (ad !== bd) return ad ? 1 : -1;
      if (a.twoTouch !== b.twoTouch) return a.twoTouch ? -1 : 1;
      if (a.dueNow !== b.dueNow) return a.dueNow ? -1 : 1;
      const stageRank = { 'Appointment Missed': 0, 'Pitch Completed': 1, 'Positive Response': 2 };
      return (stageRank[a.stage] ?? 9) - (stageRank[b.stage] ?? 9);
    });

    filtered.forEach(f => {
      const done = !!s.followupsDone[f.id];
      const a = document.createElement('article');
      a.className = 'followCard' + (done ? ' worked' : '') + (f.dueNow ? ' dueNowCard' : '');
      const msg1 = firstTouchFor(f);
      const msg2 = secondTouchFor(f);
      const dueClass = f.dueNow ? 'due dueBadgeHot' : 'due poolDue';

      a.innerHTML = `
        <div class="followTop">
          <div>
            <div class="topline"><span class="priorityPill ${f.priority}">${f.priority}</span><span class="followName"></span>${f.twoTouch ? '<span class="twoTouchBadge">2 TOUCHES TODAY</span>' : ''}</div>
            <div class="meta"><span class="st"></span><span class="phoneMeta"></span><span>Last worked ${f.worked}</span></div>
          </div>
          <div class="${dueClass}"></div>
        </div>
        <div class="note" style="margin-top:10px"></div>
        <div class="followMessage firstTouch">
          <div class="followMessageHead"><span class="followMessageLabel">${f.twoTouch ? 'Touch 1 • Send now' : 'Recommended message'}</span><button type="button" class="copyFollowBtn copyFirst">Copy Text</button></div>
          <div class="followMessageText firstText"></div>
        </div>
        ${f.twoTouch ? `<div class="followMessage secondTouch">
          <div class="followMessageHead"><span class="followMessageLabel">Touch 2 • Later if no reply</span><button type="button" class="copyFollowBtn copySecond">Copy Text</button></div>
          <div class="followMessageText secondText"></div>
          <div class="touchTiming">Use later today only if the first message gets no response. Do not send both back-to-back.</div>
        </div>` : ''}
        <div class="cardActions"><button class="cardBtn addToday">Add to Today</button><button class="cardBtn primaryish workedBtn"></button></div>`;

      a.querySelector('.followName').textContent = f.name;
      a.querySelector('.st').textContent = f.stage;
      a.querySelector('.phoneMeta').textContent = f.phone;
      a.querySelector('.' + dueClass.split(' ').join('.')).textContent = f.due;
      a.querySelector('.note').textContent = actionFor(f);
      a.querySelector('.firstText').textContent = msg1;
      a.querySelector('.copyFirst').onclick = () => copyText(msg1, a.querySelector('.copyFirst'));
      if (f.twoTouch && msg2) {
        a.querySelector('.secondText').textContent = msg2;
        a.querySelector('.copySecond').onclick = () => copyText(msg2, a.querySelector('.copySecond'));
      }
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

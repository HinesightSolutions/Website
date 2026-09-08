(() => {
  const SNAPSHOT_DATE = 'September 8';
  const DUE_NAMES = new Set(['Mary Fondren', 'Mike Olson', 'Dustin Beard']);
  const TWO_TOUCH_NAMES = new Set(['Mary Fondren', 'Mike Olson', 'Dustin Beard', 'Joshua Morman']);
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

  function warmRotatingMessage(f) {
    const first = firstName(f.name);
    const pools = {
      'Appointment Missed': [
        `Hey ${first}! Hope your week is going well. I know our timing never quite lined up before. If you still want my help, I’m happy to work around your schedule.`,
        `Hey ${first}! I didn’t want to assume you were no longer interested just because we missed each other. If you still want to revisit this, I’m here whenever it’s convenient.`,
        `Hey ${first}! I know things get busy and we never got a chance to connect. If coverage is still something you want help with, send me a time that usually works well for you.`,
        `Hey ${first}! Just wanted to make sure I didn’t leave you hanging after we missed each other. I’m still happy to help whenever the timing is better on your end.`
      ],
      'Pitch Completed': [
        `Hey ${first}! I was thinking about our conversation and wanted to make sure I didn’t leave you with anything unanswered. Is there anything you want me to go back over?`,
        `Hey ${first}! I know we covered a lot when we talked. I just wanted to make sure you had everything you needed to feel comfortable with whichever direction you go.`,
        `Hey ${first}! I didn’t want to keep chasing you, but I also didn’t want to leave you hanging after we went through everything. If anything is still unclear, send it my way.`,
        `Hey ${first}! Hope you’re doing well. After having a little time to think about what we reviewed, is there anything you’d like me to explain differently or take another look at?`
      ],
      'Positive Response': [
        `Hey ${first}! Hope you’re having a good week. I know we talked about getting your coverage handled and I didn’t want that to get lost in the shuffle. Is this still something you’d like my help with?`,
        `Hey ${first}! I had your file in front of me and wanted to make sure you knew I hadn’t forgotten about you. If you still want help with the coverage, I’m happy to pick things back up whenever you’re ready.`,
        `Hey ${first}! I know life gets busy and health insurance isn’t always the most exciting thing to deal with. If you still want help getting it handled, I’m here and can make it pretty easy on you.`,
        `Hey ${first}! Just wanted to reach out while I had your information in front of me. If this is still on your list, I’m happy to help whenever it makes sense for you.`
      ]
    };
    const pool = pools[f.stage] || pools['Positive Response'];
    return pool[(localDayNumber() + nameHash(f.name)) % pool.length];
  }

  function firstTouchFor(f) {
    if (f.name === 'Mary Fondren') {
      return 'Hey Mary! Hope you had a good weekend. I know we never quite got connected before. If you still want my help, I’m happy to work around your schedule — what time is usually easiest for you?';
    }
    if (f.name === 'Dustin Beard') {
      return 'Hey Dustin! I was thinking about our conversation and wanted to make sure I didn’t leave you with anything unanswered. Was there anything about the plan or price you wanted me to go back over?';
    }
    if (f.name === 'Mike Olson') {
      return 'Hey Mike! Hope you’re having a good week. I know we had talked about getting your coverage handled and I didn’t want it to get lost in the shuffle. Is this still something you’d like my help with?';
    }
    if (f.name === 'Joshua Morman') {
      return 'Hey Joshua! I know we’ve already gone through quite a bit together. I just wanted to make sure you had everything you needed and that I didn’t leave any questions hanging.';
    }
    return warmRotatingMessage(f);
  }

  function secondTouchFor(f) {
    if (f.name === 'Mary Fondren') {
      return 'Hey Mary, one last thought for today — if a phone call is hard to line up, we can keep it simple over text too. Whatever is easiest for you.';
    }
    if (f.name === 'Dustin Beard') {
      return 'Hey Dustin, no rush on my end. I just wanted you to know I’m here if anything came up after we talked. Even if it’s a small question, feel free to shoot it over.';
    }
    if (f.name === 'Mike Olson') {
      return 'Hey Mike, I won’t keep blowing your phone up today. If this is still on your list, just send me a 👍 and I’ll know to keep your file open for you.';
    }
    if (f.name === 'Joshua Morman') {
      return 'Hey Joshua, I don’t want to keep pestering you — I just want to make sure you know I’m here if you decide you want to finish this up or need me to clarify anything.';
    }
    return '';
  }

  function actionFor(f) {
    if (f.name === 'Mary Fondren') return 'Two-touch today: warm missed-appointment recovery first, then a very soft text option later only if she stays silent.';
    if (f.name === 'Dustin Beard') return 'Two-touch today: warm post-pitch question first, then a low-pressure reassurance later only if he does not reply.';
    if (f.name === 'Mike Olson') return 'Two-touch today because his Day 14 touch is due: one genuine re-entry now, then a tiny low-effort reply option later only if there is no response.';
    if (f.name === 'Joshua Morman') return 'Two-touch today because he is already pitched and still open: remind him you are available first, then one gentle closing touch later if he stays silent.';
    if (f.stage === 'Appointment Missed') return 'Warm recovery only. Acknowledge that timing did not line up and make it easy for them to reconnect without pressure.';
    if (f.stage === 'Pitch Completed') return 'Keep it personal after the pitch. Make sure they feel supported rather than pushed toward a decision.';
    return 'Warm re-entry. Sound like you remembered the person, not like you are working a follow-up list.';
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
      if (copy) copy.textContent = 'Messages are warmer and rotate by stage/day so they do not read like yesterday’s text. Two-touch recommendations are reserved for the strongest open opportunities, with the second text used only if the first gets no reply.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = `Expanded follow-up snapshot • ${SNAPSHOT_DATE} • 41 open opportunities`;
      const oldLine = hero.querySelector('.followHeroLine');
      if (oldLine) oldLine.remove();
      const line = document.createElement('div');
      line.className = 'followHeroLine';
      line.innerHTML = '<span class="followHeroTag">3 DUE TODAY</span><span class="followHeroTag twoTouchTag">4 TWO-TOUCH TODAY</span><span class="followHeroTag">41 OPEN FOLLOW-UPS</span><span class="followHeroTag">WARMER MESSAGES</span>';
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
    const searchEl = document.getElementById('followSearch');
    const stageEl = document.getElementById('followStage');
    const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
    const stage = stageEl ? stageEl.value : 'all';
    const filtered = FOLLOWUPS.filter(f =>
      (activePriority === 'all' || f.priority === activePriority) &&
      (stage === 'all' || f.stage === stage) &&
      (!q || f.name.toLowerCase().includes(q) || f.stage.toLowerCase().includes(q) || (f.phone || '').includes(q))
    );

    const remaining = FOLLOWUPS.filter(f => !s.followupsDone[f.id]).length;
    const dueRemaining = FOLLOWUPS.filter(f => f.dueNow && !s.followupsDone[f.id]).length;
    const badge = document.getElementById('followRemaining');
    if (badge) badge.textContent = `${remaining} open • ${dueRemaining} due today • 4 two-touch`;

    const list = document.getElementById('followList');
    if (!list) return;
    list.innerHTML = '';
    if (!filtered.length) {
      list.innerHTML = '<div class="empty">No follow-ups match that filter.</div>';
      return;
    }

    filtered.sort((a, b) => {
      const ad = !!s.followupsDone[a.id], bd = !!s.followupsDone[b.id];
      if (ad !== bd) return ad ? 1 : -1;
      if (a.dueNow !== b.dueNow) return a.dueNow ? -1 : 1;
      if (a.twoTouch !== b.twoTouch) return a.twoTouch ? -1 : 1;
      const stageRank = { 'Appointment Missed': 0, 'Pitch Completed': 1, 'Positive Response': 2 };
      return (stageRank[a.stage] ?? 9) - (stageRank[b.stage] ?? 9);
    });

    filtered.forEach(f => {
      const done = !!s.followupsDone[f.id];
      const a = document.createElement('article');
      a.className = 'followCard' + (done ? ' worked' : '') + (f.dueNow ? ' dueNowCard' : '');
      const firstMsg = firstTouchFor(f);
      const secondMsg = secondTouchFor(f);
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
        <div class="followMessage">
          <div class="followMessageHead"><span class="followMessageLabel">${f.twoTouch ? 'Touch 1 • Send first' : 'Suggested message'}</span><button type="button" class="copyFollowBtn firstCopy">Copy Text</button></div>
          <div class="followMessageText firstText"></div>
        </div>
        ${f.twoTouch && secondMsg ? `<div class="followMessage secondTouch">
          <div class="followMessageHead"><span class="followMessageLabel">Touch 2 • Later if no reply</span><button type="button" class="copyFollowBtn secondCopy">Copy Text</button></div>
          <div class="followMessageText secondText"></div>
          <div class="touchTiming">Use later today only if the first message gets no response.</div>
        </div>` : ''}
        <div class="cardActions"><button class="cardBtn addToday">Add to Today</button><button class="cardBtn primaryish workedBtn"></button></div>`;

      const nameEl = a.querySelector('.followName');
      const stageNode = a.querySelector('.st');
      const phoneEl = a.querySelector('.phoneMeta');
      const dueEl = a.querySelector('.due');
      const noteEl = a.querySelector('.note');
      const firstTextEl = a.querySelector('.firstText');
      if (nameEl) nameEl.textContent = f.name;
      if (stageNode) stageNode.textContent = f.stage;
      if (phoneEl) phoneEl.textContent = f.phone;
      if (dueEl) dueEl.textContent = f.due;
      if (noteEl) noteEl.textContent = actionFor(f);
      if (firstTextEl) firstTextEl.textContent = firstMsg;

      const firstCopy = a.querySelector('.firstCopy');
      if (firstCopy) firstCopy.onclick = () => copyText(firstMsg, firstCopy);

      if (f.twoTouch && secondMsg) {
        const secondTextEl = a.querySelector('.secondText');
        const secondCopy = a.querySelector('.secondCopy');
        if (secondTextEl) secondTextEl.textContent = secondMsg;
        if (secondCopy) secondCopy.onclick = () => copyText(secondMsg, secondCopy);
      }

      const workedBtn = a.querySelector('.workedBtn');
      if (workedBtn) {
        workedBtn.textContent = done ? 'Reopen' : 'Mark Worked';
        workedBtn.onclick = () => {
          s.followupsDone[f.id] = !done;
          localStorage.setItem(K, JSON.stringify(s));
          enhancedRenderFollowups();
          if (typeof tip === 'function') tip(!done ? 'Marked worked' : 'Reopened');
        };
      }

      const addBtn = a.querySelector('.addToday');
      if (addBtn) addBtn.onclick = () => addToToday(f.name, f.stage, actionFor(f), f.priority);
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

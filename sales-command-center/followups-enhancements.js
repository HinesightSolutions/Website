(() => {
  const SNAPSHOT_DATE = 'September 7';
  const DUE_NAMES = new Set(['Mary Fondren','Darci Bray','Caroline Moeller','Darnelle Guidry','Shakeya Dunbar','Chiquita Tucker','Dustin Beard']);
  const cadence = {
    'Mary Fondren': 'Day 4 overdue',
    'Darci Bray': 'Day 2 overdue',
    'Caroline Moeller': 'Day 2 overdue',
    'Darnelle Guidry': 'Day 2 overdue',
    'Shakeya Dunbar': 'Day 14 due today',
    'Chiquita Tucker': 'Day 7 due today',
    'Dustin Beard': 'Day 4 overdue'
  };

  const rows = [
    ['Drew Davis','3369783868','Appointment Missed','Aug 28'],
    ['Beverly Cheaton','5743156214','Appointment Missed','Sep 4'],
    ['Susan Dangerfield','9702141901','Appointment Missed','Sep 4'],
    ['Samantha Bowdy','5124848548','Appointment Missed','Sep 4'],
    ['Irene Dehaven','8172260170','Appointment Missed','Sep 4'],
    ['Ashley Myles','7138165864','Appointment Missed','Sep 4'],
    ['Jessica Lail','9808601272','Appointment Missed','Sep 4'],
    ['Mary Fondren','2254215031','Appointment Missed','Sep 4'],
    ['Veretta Jones','8648006189','Appointment Missed','Sep 4'],

    ['Alan Bryant','7705604750','Positive Response','Sep 4'],
    ['David Coker','6086954295','Positive Response','Aug 28'],
    ['Dylan Vetter','9139446469','Positive Response','Sep 4'],
    ['Kristine Kilde','5416680778','Positive Response','Aug 28'],
    ['Carroll Cason','2292215529','Positive Response','Aug 28'],
    ['Raymond Riojas','9472296928','Positive Response','Aug 28'],
    ['Tacara Maxwell','2168040164','Positive Response','Aug 28'],
    ['Jodi Pearce','5743867893','Positive Response','Sep 4'],
    ['Yolanda Castro','5672282048','Positive Response','Sep 4'],
    ['Crystal Valentin','3524445141','Positive Response','Sep 4'],
    ['Bryce Rone','7194242822','Positive Response','Sep 4'],
    ['Shawna Looney','5015545555','Positive Response','Sep 4'],
    ['Martin McMillan','9109921296','Positive Response','Sep 4'],
    ['Kenya Hart','9195911654','Positive Response','Sep 4'],
    ['Mohammed Khan','6308271788','Positive Response','Sep 4'],
    ['Dave Lipscomb','4434638658','Positive Response','Sep 4'],
    ['Amanda Cox','9366616658','Positive Response','Sep 4'],
    ['Kristina Brunette','7024390065','Positive Response','Sep 4'],
    ['Casey Holsclaw','8049337130','Positive Response','Sep 4'],
    ['Bailey Ledford','8597971162','Positive Response','Sep 4'],
    ['Shakeya Dunbar','7065513114','Positive Response','Sep 4'],
    ['Mike Olson','6084250029','Positive Response','Sep 4'],
    ['Kaleigh Wilson','9018311603','Positive Response','Sep 4'],
    ['Steve Ferguson','2707918917','Positive Response','Sep 4'],
    ['Elizabeth Tetreault','7726433324','Positive Response','Sep 4'],
    ['Fnu Bharat','6157054430','Positive Response','Sep 4'],
    ['Lawrence Jackson','2166129314','Positive Response','Sep 4'],
    ['Chiquita Tucker','2105745727','Positive Response','Sep 4'],
    ['Darci Bray','4057608416','Positive Response','Sep 4'],
    ['Caroline Moeller','5022872508','Positive Response','Sep 4'],
    ['Darnelle Guidry','3372243460','Positive Response','Sep 4'],

    ['Joshua Morman','8658950199','Pitch Completed','Aug 28'],
    ['Dustin Beard','3254235658','Pitch Completed','Sep 4']
  ];

  function priorityFor(name, stage) {
    if (stage === 'Appointment Missed') return 'hot';
    if (stage === 'Pitch Completed') return DUE_NAMES.has(name) ? 'warm' : 'warm';
    return 'high';
  }

  const expanded = rows.map((r, i) => ({
    id: 'sep7-open-' + i,
    name: r[0],
    phone: r[1],
    stage: r[2],
    worked: r[3],
    priority: priorityFor(r[0], r[2]),
    due: cadence[r[0]] || (r[2] === 'Appointment Missed' ? 'Missed recovery pool' : r[2] === 'Pitch Completed' ? 'Decision pool' : 'Interested pool'),
    dueNow: DUE_NAMES.has(r[0])
  }));

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function firstName(name) {
    return (name || '').trim().split(/\s+/)[0] || name;
  }

  function messageFor(f) {
    const first = firstName(f.name);
    const holiday = todayKey() === '2026-09-07';
    let body = '';

    if (holiday) {
      if (f.stage === 'Appointment Missed') {
        body = `Hey ${first}, Happy Labor Day! I know today probably isn’t the day you want to spend on this, so no pressure at all. Since we missed each other before, I can reach back out later this week or send you a quick email in the meantime. Which would be easier?`;
      } else if (f.stage === 'Pitch Completed') {
        body = `Hey ${first}, Happy Labor Day! I know we already went through quite a bit, so I don’t want to bother you on the holiday. I can reach back out later this week, or if it’s easier I can send you a quick email and you can look it over whenever you have time. Which would you prefer?`;
      } else {
        body = `Hey ${first}, Happy Labor Day! I didn’t want to bother you on the holiday, but I also didn’t want to lose track of you. I can reach back out later this week or send you a quick email to look over whenever you have time. Which would be easier?`;
      }
    } else {
      if (f.stage === 'Appointment Missed') {
        body = `Hey ${first}! I know we missed each other before. I can reach back out later this week, or if it’s easier I can send you a quick email in the meantime. Which would be better?`;
      } else if (f.stage === 'Pitch Completed') {
        body = `Hey ${first}! I know we already went through quite a bit. If you still have questions, I can reach back out later this week or send you a quick email to look over whenever you have time. Which would you prefer?`;
      } else {
        body = `Hey ${first}! I wanted to reach back out while I still had your information handy. I can give you a call later this week or send you a quick email to look over whenever you have time. Which would be easier?`;
      }
    }
    return body + ' -James Hines, #state Health Advisor';
  }

  function actionFor(f) {
    if (f.stage === 'Appointment Missed') return 'Low-pressure appointment recovery — make it easy to reconnect later this week.';
    if (f.stage === 'Pitch Completed') return 'Reopen the decision without re-pitching everything; make the next step easy.';
    return 'Warm re-entry — aim for a reply, a later-this-week call, or permission to send an email.';
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
    } else {
      fallbackCopy(text, finish);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); done(); }
    finally { ta.remove(); }
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
      if (copy) copy.textContent = 'The 7 cadence-due clients stay pinned first, but the page now includes the full open warm pool so you always have another person to work.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = `Expanded follow-up snapshot • ${SNAPSHOT_DATE} • 42 open opportunities`;
      if (!hero.querySelector('.followHeroLine')) {
        const line = document.createElement('div');
        line.className = 'followHeroLine';
        line.innerHTML = '<span class="followHeroTag">7 DUE / OVERDUE</span><span class="followHeroTag">42 OPEN FOLLOW-UPS</span><span class="followHeroTag">COPY-READY MESSAGES</span>';
        hero.appendChild(line);
      }
    }

    const stats = document.querySelectorAll('#followupsView .statCard');
    const values = [
      ['7','Due / Overdue'],
      ['9','Missed Appts'],
      ['31','Interested'],
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
    const rows = FOLLOWUPS.filter(f =>
      (activePriority === 'all' || f.priority === activePriority) &&
      (stage === 'all' || f.stage === stage) &&
      (!q || f.name.toLowerCase().includes(q) || f.stage.toLowerCase().includes(q) || (f.phone || '').includes(q))
    );

    const remaining = FOLLOWUPS.filter(f => !s.followupsDone[f.id]).length;
    const dueRemaining = FOLLOWUPS.filter(f => f.dueNow && !s.followupsDone[f.id]).length;
    const badge = document.getElementById('followRemaining');
    if (badge) badge.textContent = `${remaining} open • ${dueRemaining} due now`;

    const list = document.getElementById('followList');
    list.innerHTML = '';
    if (!rows.length) {
      list.innerHTML = '<div class="empty">No follow-ups match that filter.</div>';
      return;
    }

    rows.sort((a, b) => {
      const ad = !!s.followupsDone[a.id], bd = !!s.followupsDone[b.id];
      if (ad !== bd) return ad ? 1 : -1;
      if (a.dueNow !== b.dueNow) return a.dueNow ? -1 : 1;
      const stageRank = { 'Appointment Missed': 0, 'Pitch Completed': 1, 'Positive Response': 2 };
      return (stageRank[a.stage] ?? 9) - (stageRank[b.stage] ?? 9);
    });

    rows.forEach(f => {
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

  function install() {
    installCss();
    try {
      FOLLOWUPS.splice(0, FOLLOWUPS.length, ...expanded);
      window.renderFollowups = enhancedRenderFollowups;
    } catch (err) {
      console.error('Unable to expand follow-up queue', err);
      return;
    }
    updateHeroAndStats();
    enhancedRenderFollowups();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();

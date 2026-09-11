(() => {
  const SNAPSHOT_DATE = 'September 11';
  const TWO_TOUCH_NAMES = new Set(['Monica Elwood','Joshua Morman','Jeannie Sass']);

  const firstName = name => (name || '').trim().split(/\s+/)[0] || name;
  const firstTouch = f => {
    const n = firstName(f.name);
    const special = {
      'Beverly Cheaton': 'Hey Beverly! I know it’s been a bit since we missed each other. Are you still looking for coverage, or did you get something taken care of?',
      'Natalie Sparks': 'Good morning Natalie! I still have your coverage request open from earlier this week. Would you rather I send a couple options here, or find a quick time to go over them?',
      'Chris Swan': 'Good morning Chris! I still have your coverage request open from earlier this week. Would you rather I send a couple options here, or find a quick time to go over them?',
      'Kimberly Graves': 'Good morning Kimberly! I still have your coverage request open from earlier this week. Would you rather I send a couple options here, or find a quick time to go over them?',
      'David Coker': 'Hey David — I’m cleaning up some older coverage requests today. Should I keep yours open, or did you get something handled?',
      'Carroll Cason': 'Hey Carroll — I’m cleaning up some older coverage requests today. Should I keep yours open, or did you get something handled?',
      'Monica Elwood': 'Good morning Monica! I have your information from yesterday. Would you rather I text you a couple options first, or grab a quick time today?',
      'Joshua Morman': 'Hey Joshua! Since we’ve already gone through options, what’s the one thing still holding it up — price, coverage, or timing?',
      'Jeannie Sass': 'Good morning Jeannie! Since we already went through the coverage, what would help most before you decide — revisiting the price or the benefits?'
    };
    if (special[f.name]) return special[f.name];
    if (f.stage === 'Appointment Missed') return `Hey ${n}! I know our timing never quite lined up. Are you still looking, or did you get something taken care of?`;
    if (f.stage === 'Pitch Completed') return `Hey ${n}! After having some time to think it over, is the bigger question for you the price, the coverage, or the timing?`;
    return `Hey ${n}! I still have your coverage request open. Would you rather I send a couple options here, or find a quick time to go over them?`;
  };

  const secondTouch = f => {
    const special = {
      'Monica Elwood': 'Hey Monica — before I wrap up later, should I send those options here or leave this open for next week?',
      'Joshua Morman': 'Hey Joshua, no pressure — if you want, I can adjust the option and send you a cleaner version instead of making you sit through another call.',
      'Jeannie Sass': 'Hey Jeannie, I don’t want to keep bugging you. If you want me to see if I can improve what we looked at, I can; otherwise I can leave it where it is.'
    };
    return special[f.name] || '';
  };

  function copyText(text, button) {
    const done = () => {
      const old = button.textContent;
      button.textContent = 'Copied ✓';
      if (typeof tip === 'function') tip('Message copied');
      setTimeout(() => button.textContent = old, 1200);
    };
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.focus(); ta.select(); try { document.execCommand('copy'); done(); } finally { ta.remove(); }
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(fallback); else fallback();
  }

  function css() {
    if (document.getElementById('followupEnhancementCss')) return;
    const s = document.createElement('style'); s.id = 'followupEnhancementCss';
    s.textContent = `
      .followHeroLine{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.followHeroTag{font-size:10px;font-weight:800;background:#eef2f4;color:var(--navy);border:1px solid var(--line);border-radius:999px;padding:6px 9px}.followHeroTag.twoTouchTag{background:#fff5e9;border-color:#e7cfac}.followCard.dueNowCard{border-color:#e2c7a9;box-shadow:0 8px 24px #d7854218}.twoTouchBadge{display:inline-flex;margin-left:7px;padding:4px 7px;border-radius:999px;background:#fff2df;border:1px solid #ead0a6;color:#8d5a20;font-size:9px;font-weight:850;letter-spacing:.04em}.followMessage{margin-top:12px;background:#f7f8f9;border:1px solid var(--line);border-radius:14px;padding:12px}.followMessage.secondTouch{background:#fffaf3;border-color:#e7d9c1}.followMessageHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.followMessageLabel{font-size:9px;font-weight:850;letter-spacing:.12em;color:var(--blue);text-transform:uppercase}.followMessage.secondTouch .followMessageLabel{color:#96652d}.followMessageText{font-size:12px;line-height:1.55;color:var(--ink);white-space:pre-wrap}.copyFollowBtn{border:1px solid var(--blue);background:#fff;color:var(--navy);border-radius:10px;padding:6px 9px;font-size:10px;font-weight:850;white-space:nowrap}.secondTouch .copyFollowBtn{border-color:#c89b61}.touchTiming{font-size:10px;color:var(--muted);margin-top:7px;font-weight:700}@media(max-width:760px){.followMessageHead{align-items:flex-start}}
    `;
    document.head.appendChild(s);
  }

  function decorateCard(card) {
    const name = card.querySelector('.followName')?.textContent?.trim();
    if (!name || card.dataset.sep11Decorated === '1') return;
    const f = (typeof FOLLOWUPS !== 'undefined' ? FOLLOWUPS : []).find(x => x.name === name);
    if (!f) return;
    card.dataset.sep11Decorated = '1';
    if (f.dueNow) card.classList.add('dueNowCard');
    const top = card.querySelector('.topline');
    if (top && TWO_TOUCH_NAMES.has(name)) {
      const badge = document.createElement('span'); badge.className='twoTouchBadge'; badge.textContent='2 TOUCH TODAY'; top.appendChild(badge);
    }
    const actions = card.querySelector('.cardActions');
    const first = firstTouch(f);
    const box = document.createElement('div'); box.className='followMessage';
    box.innerHTML='<div class="followMessageHead"><span class="followMessageLabel">Touch 1 • Send first</span><button class="copyFollowBtn firstCopy">Copy</button></div><div class="followMessageText firstText"></div>';
    box.querySelector('.firstText').textContent = first;
    box.querySelector('.firstCopy').onclick = e => copyText(first, e.currentTarget);
    card.insertBefore(box, actions);
    if (TWO_TOUCH_NAMES.has(name)) {
      const second = secondTouch(f);
      const box2 = document.createElement('div'); box2.className='followMessage secondTouch';
      box2.innerHTML='<div class="followMessageHead"><span class="followMessageLabel">Touch 2 • Later if no reply</span><button class="copyFollowBtn secondCopy">Copy</button></div><div class="followMessageText secondText"></div><div class="touchTiming">Use later today only if Touch 1 gets no response.</div>';
      box2.querySelector('.secondText').textContent = second;
      box2.querySelector('.secondCopy').onclick = e => copyText(second, e.currentTarget);
      card.insertBefore(box2, actions);
    }
  }

  function updateChrome() {
    const hero = document.querySelector('#followupsView .screenHero');
    if (hero) {
      const copy = hero.querySelector('.muted');
      if (copy) copy.textContent = 'Today’s queue is trimmed to the 9 cadence-due clients from the live pipeline. Two-touch treatment is limited to three strong open opportunities; everyone else gets one clean, specific message.';
      const snap = hero.querySelector('.snapshot');
      if (snap) snap.textContent = `Live follow-up snapshot • ${SNAPSHOT_DATE} • 9 due now`;
      hero.querySelector('.followHeroLine')?.remove();
      const line = document.createElement('div'); line.className='followHeroLine';
      line.innerHTML='<span class="followHeroTag">9 DUE NOW</span><span class="followHeroTag twoTouchTag">3 TWO-TOUCH TODAY</span><span class="followHeroTag">1 MISSED APPT</span><span class="followHeroTag">2 PITCH DECISIONS</span>';
      hero.appendChild(line);
    }
    const stats = document.querySelectorAll('#followupsView .statCard');
    const vals = [['9','Due Now'],['1','Missed Appts'],['6','Interested'],['2','Pitch Decisions']];
    stats.forEach((c,i)=>{ if(!vals[i])return; const n=c.querySelector('.statNum'), l=c.querySelector('.statLabel'); if(n)n.textContent=vals[i][0]; if(l)l.textContent=vals[i][1]; });
    const badge = document.getElementById('followRemaining');
    if (badge && typeof FOLLOWUPS !== 'undefined') {
      const remaining = FOLLOWUPS.filter(f => !s.followupsDone?.[f.id]).length;
      badge.textContent = `${remaining} open • 3 two-touch`;
    }
  }

  function decorateAll() { css(); document.querySelectorAll('#followList .followCard').forEach(decorateCard); updateChrome(); }
  const baseRender = window.renderFollowups;
  if (typeof baseRender === 'function') {
    window.renderFollowups = function(){ baseRender(); requestAnimationFrame(decorateAll); };
  }
  decorateAll();
  const list = document.getElementById('followList');
  if (list) new MutationObserver(() => requestAnimationFrame(decorateAll)).observe(list,{childList:true,subtree:true});
})();

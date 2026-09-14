(() => {
  const SNAPSHOT_DATE = 'September 14';
  const TWO_TOUCH_NAMES = new Set(['Michael Greenfield','Gerald Drewa','Joshua Morman','Jeannie Sass']);

  const firstName = name => (name || '').trim().split(/\s+/)[0] || name;
  const firstTouch = f => {
    const n = firstName(f.name);
    const special = {
      'Beverly Cheaton': 'Hey Beverly! I know our timing never quite lined up. Are you still looking for coverage, or did you get something taken care of?',
      'Drew Davis': 'Hey Drew! It’s been a little while since we were supposed to connect. Are you still looking for health coverage, or are you all set now?',
      'Chiquita Tucker': 'Hey Chiquita! I know things get busy. If you’re still looking, I can pick this back up without you starting over. Should I keep this open for you?',
      'Marcina Morris': 'Hey Marcina! I still have your request open from Friday. Would you rather I send a couple options here first, or find a quick time to go through them?',
      'David Chastain': 'Hey David! I still have your request open from Friday. Would you rather I send a couple options here first, or find a quick time to go through them?',
      'John Mason': 'Hey John! I still have your request open from Friday. If the Marketplace piece is still up in the air, I can also show you what your other options look like. Want me to send a couple over?',
      'Patricia Almond': 'Hey Patricia! I still have your request open from Friday. Would you rather I send a couple options here first, or find a quick time to go through them?',
      'Stephanie Blackmon': 'Hey Stephanie! I still have your request open from Friday. Would you rather I send a couple options here first, or find a quick time to go through them?',
      'Michael Greenfield': 'Hey Michael! Since we already went through the options, what is the main thing still holding it up for you — price, coverage, or timing?',
      'Gerald Drewa': 'Hey Gerald! I still have the plans we reviewed pulled up. Are you leaning one way, or is there something holding you back that I can help with?',
      'Joshua Morman': 'Hey Joshua! Since we’ve already gone through options, what’s the one thing still holding it up — price, coverage, or timing?',
      'Jeannie Sass': 'Hey Jeannie! Since we already went through the coverage, what would help most before you decide — revisiting the price or the benefits?'
    };
    if (special[f.name]) return special[f.name];
    if (f.stage === 'Appointment Missed') return `Hey ${n}! I know our timing never quite lined up. Are you still looking, or did you get something taken care of?`;
    if (f.stage === 'Pitch Completed') return `Hey ${n}! After having some time to think it over, is the bigger question for you the price, the coverage, or the timing?`;
    if (String(f.due || '').includes('Day 30')) return `Hey ${n}! I’m cleaning up some older coverage requests today. Should I keep yours open, or did you get something handled?`;
    return `Hey ${n}! I still have your coverage request open. Would you rather I send a couple options here, or find a quick time to go over them?`;
  };

  const secondTouch = f => {
    const special = {
      'Michael Greenfield': 'Hey Michael — before I close things out for the day, if you want me to adjust the option around price or benefits I can do that. Want me to take one more look?',
      'Gerald Drewa': 'Hey Gerald — I don’t want to keep bugging you. If you want, I can tighten up the option we looked at and send you the cleanest version before I wrap up today.',
      'Joshua Morman': 'Hey Joshua, no pressure — if you want, I can adjust the option and send you a cleaner version instead of making you sit through another call.',
      'Jeannie Sass': 'Hey Jeannie, I don’t want to keep bothering you. If you want me to see if I can improve what we looked at, I can; otherwise I can leave it where it is.'
    };
    return special[f.name] || '';
  };

  function copyText(text, button) {
    const done = () => { const old=button.textContent; button.textContent='Copied ✓'; if(typeof tip==='function') tip('Message copied'); setTimeout(()=>button.textContent=old,1200); };
    const fallback = () => { const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select(); try{document.execCommand('copy');done();}finally{ta.remove();} };
    if(navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(fallback); else fallback();
  }

  function css() {
    if(document.getElementById('followupEnhancementCss')) return;
    const s=document.createElement('style'); s.id='followupEnhancementCss';
    s.textContent=`.followHeroLine{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.followHeroTag{font-size:10px;font-weight:800;background:#eef2f4;color:var(--navy);border:1px solid var(--line);border-radius:999px;padding:6px 9px}.followHeroTag.twoTouchTag{background:#fff5e9;border-color:#e7cfac}.followCard.dueNowCard{border-color:#e2c7a9;box-shadow:0 8px 24px #d7854218}.twoTouchBadge{display:inline-flex;margin-left:7px;padding:4px 7px;border-radius:999px;background:#fff2df;border:1px solid #ead0a6;color:#8d5a20;font-size:9px;font-weight:850;letter-spacing:.04em}.followMessage{margin-top:12px;background:#f7f8f9;border:1px solid var(--line);border-radius:14px;padding:12px}.followMessage.secondTouch{background:#fffaf3;border-color:#e7d9c1}.followMessageHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.followMessageLabel{font-size:9px;font-weight:850;letter-spacing:.12em;color:var(--blue);text-transform:uppercase}.followMessage.secondTouch .followMessageLabel{color:#96652d}.followMessageText{font-size:12px;line-height:1.55;color:var(--ink);white-space:pre-wrap}.copyFollowBtn{border:1px solid var(--blue);background:#fff;color:var(--navy);border-radius:10px;padding:6px 9px;font-size:10px;font-weight:850;white-space:nowrap}.secondTouch .copyFollowBtn{border-color:#c89b61}.touchTiming{font-size:10px;color:var(--muted);margin-top:7px;font-weight:700}@media(max-width:760px){.followMessageHead{align-items:flex-start}}`;
    document.head.appendChild(s);
  }

  function decorateCard(card) {
    const name=card.querySelector('.followName')?.textContent?.trim();
    if(!name || card.dataset.sep14Decorated==='1') return;
    const f=(typeof FOLLOWUPS!=='undefined'?FOLLOWUPS:[]).find(x=>x.name===name); if(!f) return;
    card.dataset.sep14Decorated='1'; if(f.dueNow) card.classList.add('dueNowCard');
    const top=card.querySelector('.topline');
    if(top && TWO_TOUCH_NAMES.has(name)){const badge=document.createElement('span');badge.className='twoTouchBadge';badge.textContent='2 TOUCH TODAY';top.appendChild(badge);}
    const actions=card.querySelector('.cardActions'); const first=firstTouch(f);
    const box=document.createElement('div'); box.className='followMessage';
    box.innerHTML='<div class="followMessageHead"><span class="followMessageLabel">Touch 1 • Send first</span><button class="copyFollowBtn firstCopy">Copy</button></div><div class="followMessageText firstText"></div>';
    box.querySelector('.firstText').textContent=first; box.querySelector('.firstCopy').onclick=e=>copyText(first,e.currentTarget); card.insertBefore(box,actions);
    if(TWO_TOUCH_NAMES.has(name)){
      const second=secondTouch(f); const box2=document.createElement('div'); box2.className='followMessage secondTouch';
      box2.innerHTML='<div class="followMessageHead"><span class="followMessageLabel">Touch 2 • Later if no reply</span><button class="copyFollowBtn secondCopy">Copy</button></div><div class="followMessageText secondText"></div><div class="touchTiming">Use later today only if Touch 1 gets no response.</div>';
      box2.querySelector('.secondText').textContent=second; box2.querySelector('.secondCopy').onclick=e=>copyText(second,e.currentTarget); card.insertBefore(box2,actions);
    }
  }

  function updateChrome() {
    const hero=document.querySelector('#followupsView .screenHero');
    if(hero){
      const copy=hero.querySelector('.muted'); if(copy) copy.textContent='Today’s live queue has 21 cadence-due clients. Work the four pitch decisions and two missed appointments first, then the freshest interested leads. The four pitch decisions get a second touch later today only if the first message gets no reply.';
      const snap=hero.querySelector('.snapshot'); if(snap) snap.textContent=`Live follow-up snapshot • ${SNAPSHOT_DATE} • 21 due now`;
      hero.querySelector('.followHeroLine')?.remove(); const line=document.createElement('div'); line.className='followHeroLine';
      line.innerHTML='<span class="followHeroTag">21 DUE NOW</span><span class="followHeroTag twoTouchTag">4 TWO-TOUCH TODAY</span><span class="followHeroTag">2 MISSED APPTS</span><span class="followHeroTag">4 PITCH DECISIONS</span>';
      hero.appendChild(line);
    }
    const stats=document.querySelectorAll('#followupsView .statCard'); const vals=[['21','Due Now'],['2','Missed Appts'],['15','Interested'],['4','Pitch Decisions']];
    stats.forEach((c,i)=>{if(!vals[i])return;const n=c.querySelector('.statNum'),l=c.querySelector('.statLabel');if(n)n.textContent=vals[i][0];if(l)l.textContent=vals[i][1];});
    const badge=document.getElementById('followRemaining'); if(badge && typeof FOLLOWUPS!=='undefined'){const remaining=FOLLOWUPS.filter(f=>!s.followupsDone?.[f.id]).length;badge.textContent=`${remaining} open • 4 two-touch`;}
  }

  function decorateAll(){css();document.querySelectorAll('#followList .followCard').forEach(decorateCard);updateChrome();}
  const baseRender=window.renderFollowups;
  if(typeof baseRender==='function'){window.renderFollowups=function(){baseRender();requestAnimationFrame(decorateAll);};}
  decorateAll(); const list=document.getElementById('followList'); if(list)new MutationObserver(()=>requestAnimationFrame(decorateAll)).observe(list,{childList:true,subtree:true});
})();
(()=>{
  if(document.getElementById('interestedView')) return;

  const CALL_FIRST=[{"name":"Cr Cantrell","age":1,"calls":1,"source":"Montague New"},{"name":"Didimo Diaz Hernandez","age":5,"calls":1,"source":"Montague New"},{"name":"Fred Genovese","age":5,"calls":3,"source":"Montague New"},{"name":"John Mason","age":5,"calls":2,"source":"USHA branded"},{"name":"Collin Veach","age":5,"calls":1,"source":"Montague New"},{"name":"Christina Dudycha","age":6,"calls":2,"source":"Montague New"},{"name":"Monica Elwood","age":6,"calls":2,"source":"Montague New"},{"name":"Natalie Sparks","age":7,"calls":3,"source":"USHA branded"},{"name":"Dustin Beard","age":15,"calls":8,"source":"USHA branded"},{"name":"Larry Marion","age":16,"calls":0,"source":"#2 Exclusive LM"},{"name":"Robert Villanova","age":23,"calls":3,"source":"Carson 1"},{"name":"Candice Kausboski","age":25,"calls":12,"source":"USHA branded"},{"name":"Tameka Evans","age":26,"calls":4,"source":"Carson 1"},{"name":"Mohammed Khan","age":27,"calls":9,"source":"USHA branded"},{"name":"Loraine Black","age":29,"calls":10,"source":"Shared"},{"name":"Litty McCrea","age":50,"calls":6,"source":"Carson 1"},{"name":"Monique Wade","age":58,"calls":5,"source":"NextGen Leads"},{"name":"Kristine Kilde","age":61,"calls":5,"source":"USHA branded"},{"name":"Nicole Dobbs","age":68,"calls":7,"source":"Montague New"},{"name":"Antonio Rodriguez","age":68,"calls":6,"source":"USHA branded"},{"name":"Chandra Yerasi","age":76,"calls":5,"source":"Montague New"},{"name":"Gary Stillwell","age":76,"calls":3,"source":"Montague New"},{"name":"Leah Fjetland","age":77,"calls":3,"source":"Montague New"},{"name":"Casey Ritz","age":78,"calls":3,"source":"Montague New"},{"name":"Brooke Green","age":78,"calls":4,"source":"Montague New"}];
  const APPT_RESCUE=[{"name":"Isaiah Yeast","age":36,"calls":11,"source":"CSV Upload"},{"name":"Robert Louderback","age":48,"calls":18,"source":"USHA branded"},{"name":"Kristopher Ohara","age":60,"calls":18,"source":"USHA branded"},{"name":"Larketya Sloan","age":63,"calls":18,"source":"USHA branded"},{"name":"Jules Curry","age":69,"calls":18,"source":"USHA branded"},{"name":"Madison Griffith","age":70,"calls":19,"source":"USHA branded"},{"name":"Ashley Jenkins","age":77,"calls":19,"source":"Montague New"},{"name":"Johery Santana","age":83,"calls":19,"source":"USHA branded"},{"name":"Bayleigh Daniels","age":105,"calls":16,"source":"USHA branded"},{"name":"Ladayasha Skinner","age":105,"calls":17,"source":"Montague New"},{"name":"Audra Kerr","age":119,"calls":12,"source":"Carson 1"},{"name":"Olivia Warren","age":126,"calls":18,"source":"Montague New"},{"name":"Lisa Delgado","age":148,"calls":11,"source":"CSV Upload"},{"name":"Bonnie Winter","age":161,"calls":17,"source":"Premium Tampa"},{"name":"Tonya Jones","age":210,"calls":12,"source":"Secret Source"},{"name":"Tallulah Ocallaghan","age":225,"calls":15,"source":"NextGen Leads POOL"},{"name":"Walter Hawes","age":254,"calls":12,"source":"Carson 1"}];

  const LANES=[
    {id:'call',label:'Call First',count:25,mode:'named',tone:'hot',why:'Freshest and strongest concrete intent. Call individually; text immediately if no answer.'},
    {id:'rescue',label:'Appointment Rescue',count:17,mode:'named',tone:'hot',why:'They agreed to an appointment before. Use a missed-appointment recovery message, then dial.'},
    {id:'under',label:'Underworked Aged',count:145,mode:'manual',tone:'high',why:'90+ days old but only 0–2 recorded calls. This is the biggest underworked opportunity.'},
    {id:'warm',label:'Warm Reactivation',count:149,mode:'manual',tone:'high',why:'Still worth working, but lead with a reactivation text and prioritize replies.'},
    {id:'text',label:'Text-First Aged',count:79,mode:'manual',tone:'warm',why:'Older and more worked. Do not spend prime dialing hours brute-forcing these.'},
    {id:'email',label:'Email Only',count:26,mode:'manual',tone:'warm',why:'Unreachable or out-of-service phone status. All 26 have an email address in the export.'},
    {id:'archive',label:'Lowest Priority',count:33,mode:'manual',tone:'cool',why:'Oldest / most worked records. Touch only after the higher-value lanes are exhausted.'}
  ];

  const STORE_KEY='hs-interested-pipeline-plan-v1';
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}};
  const save=s=>localStorage.setItem(STORE_KEY,JSON.stringify(s));
  let state=load();
  if(!state.named) state.named={};
  if(!state.manual) state.manual={under:0,warm:0,text:0,email:0,archive:0};

  const style=document.createElement('style');
  style.id='interestedPlanCss';
  style.textContent=`
    .footer.interestedNavReady{width:min(650px,calc(100% - 28px));grid-template-columns:repeat(4,1fr)}
    #interestedView .screenHero{position:relative;overflow:hidden}
    #interestedView .screenHero:after{content:'';position:absolute;width:180px;height:180px;border-radius:50%;right:-60px;top:-70px;background:#8aa1b122}
    .ipBanner{display:flex;align-items:center;gap:9px;margin-top:14px;padding:10px 12px;border:1px solid #b9d3c5;border-radius:13px;background:#edf7f1;color:#35664d;font-size:11px;font-weight:750;position:relative;z-index:1}
    .ipBannerDot{width:8px;height:8px;border-radius:50%;background:#4d9a70;box-shadow:0 0 0 4px #4d9a7018;flex:0 0 auto}
    .ipOverall{margin-top:18px;position:relative;z-index:1}
    .ipOverall .row{font-size:11px;font-weight:750;color:var(--muted)}
    .ipLaneGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:14px 0}
    .ipLane{background:#fffdfa;border:1px solid var(--line);border-radius:18px;padding:16px;box-shadow:0 7px 20px #1f29350b;position:relative;overflow:hidden}
    .ipLane:before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--blue)}
    .ipLane.hot:before{background:var(--red)}.ipLane.high:before{background:var(--orange)}.ipLane.warm:before{background:var(--yellow)}.ipLane.cool:before{background:#aab4bd}
    .ipLaneTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .ipLaneTitle{font-size:15px;font-weight:850;color:var(--navy)}
    .ipLaneCount{font-size:22px;font-weight:900;color:var(--navy);line-height:1}
    .ipLaneWhy{font-size:11px;line-height:1.45;color:var(--muted);margin-top:7px;min-height:32px}
    .ipLaneProgress{margin-top:11px}.ipLaneProgress .prog{height:10px;margin-top:6px}
    .ipLaneProgress .row{font-size:10px;color:var(--muted)}
    .ipAdjust{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:9px}
    .ipAdjust button,.ipCopy,.ipMark,.ipAddToday{border:1px solid var(--line);background:#fff;color:var(--navy);border-radius:10px;padding:7px 9px;font-size:10px;font-weight:800}
    .ipAdjust button{width:31px;height:29px;padding:0;font-size:15px}.ipAdjust strong{min-width:48px;text-align:center;font-size:11px}
    .ipSection{margin-top:24px}.ipSectionHead{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:0 2px 11px}.ipSectionHead h2{font:700 24px Georgia;color:var(--navy);margin:4px 0 0}.ipBadge{font-size:10px;font-weight:800;background:#e7ecef;color:var(--navy);border-radius:99px;padding:5px 8px;white-space:nowrap}
    .ipOrder{display:grid;gap:8px}.ipStep{display:grid;grid-template-columns:32px 1fr;gap:11px;align-items:start;background:#fffdfa;border:1px solid var(--line);border-radius:15px;padding:13px}.ipStepNum{width:32px;height:32px;border-radius:11px;display:grid;place-items:center;background:var(--navy);color:#fff;font-size:11px;font-weight:900}.ipStep b{display:block;color:var(--navy);font-size:13px}.ipStep span{display:block;color:var(--muted);font-size:11px;line-height:1.45;margin-top:3px}
    .ipSourceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.ipSource{background:#fffdfa;border:1px solid var(--line);border-radius:16px;padding:14px}.ipSource b{display:block;color:var(--navy);font-size:14px}.ipSource strong{font-size:24px;color:var(--navy);display:block;margin:6px 0 2px}.ipSource span{font-size:10px;color:var(--muted);line-height:1.4;display:block}
    .ipTemplates{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.ipTemplate{background:#fffdfa;border:1px solid var(--line);border-radius:16px;padding:15px}.ipTemplateHead{display:flex;align-items:center;justify-content:space-between;gap:10px}.ipTemplate b{color:var(--navy);font-size:12px}.ipTemplate p{font-size:11px;color:var(--muted);line-height:1.5;margin:10px 0 0}
    .ipQueue{display:grid;gap:8px}.ipLead{background:#fffdfa;border:1px solid var(--line);border-radius:15px;padding:13px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.ipLead.worked{opacity:.55}.ipLeadName{font-size:14px;font-weight:850;color:var(--navy)}.ipLeadMeta{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}.ipLeadMeta span{font-size:9px;background:#f0eee9;border-radius:99px;padding:4px 7px;color:var(--muted)}.ipLeadActions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.ipMark.done{background:#e9f5ef;border-color:#9fc9b3;color:#2f6a4f}.ipAddToday{background:var(--navy);border-color:var(--navy);color:white}
    .ipPrivacy{font-size:10px;color:var(--muted);line-height:1.5;margin:18px 2px 0;padding:10px 12px;border:1px dashed #cbd3da;border-radius:12px;background:#ffffff66}
    @media(max-width:760px){.footer.interestedNavReady{width:calc(100% - 18px);bottom:9px}.nav small{font-size:8px}.ipLaneGrid,.ipTemplates,.ipSourceGrid{grid-template-columns:1fr}.ipLead{grid-template-columns:1fr}.ipLeadActions{justify-content:flex-start}.ipLaneWhy{min-height:0}}
  `;
  document.head.appendChild(style);

  const view=document.createElement('main');
  view.id='interestedView';
  view.className='view';
  view.innerHTML=`
    <section class="card screenHero">
      <div class="eyebrow">INTERESTED PIPELINE STRATEGY</div>
      <div class="screenTitle">Interested Attack Plan</div>
      <p class="muted">A clean work order for the 474-lead Interested pipeline — separated by recency, call history, appointment history, and contactability.</p>
      <div class="snapshot">Ringy export snapshot • September 16, 2026</div>
      <div class="ipBanner"><span class="ipBannerDot"></span><span>All 474 leads on this page are treated as having no future appointment, meeting, follow-up, or event.</span></div>
      <div class="ipOverall"><div class="row"><span>Today's attack target</span><strong id="ipTodayTxt">0 / 92</strong></div><div class="prog big"><div class="fill" id="ipTodayBar"></div></div><div class="pct" id="ipTodayPct">0% complete</div></div>
    </section>

    <section class="summaryGrid">
      <article class="statCard"><div class="statNum">474</div><div class="statLabel">Total Interested</div></article>
      <article class="statCard"><div class="statNum">373</div><div class="statLabel">90+ Days Old</div></article>
      <article class="statCard"><div class="statNum">78</div><div class="statLabel">Zero Calls</div></article>
      <article class="statCard"><div class="statNum">162</div><div class="statLabel">0–2 Calls</div></article>
    </section>

    <section id="ipLaneGrid" class="ipLaneGrid"></section>

    <section class="ipSection">
      <div class="ipSectionHead"><div><div class="eyebrow">ORDER OF OPERATIONS</div><h2>Work It In This Order</h2></div><span class="ipBadge">Prime dialing time protected</span></div>
      <div class="ipOrder">
        <div class="ipStep"><div class="ipStepNum">1</div><div><b>Call the 25 Call-First leads individually.</b><span>Use the phone first. If there is no answer, send the no-answer text immediately instead of stacking repeated cold calls.</span></div></div>
        <div class="ipStep"><div class="ipStepNum">2</div><div><b>Recover the 17 missed appointments.</b><span>Lead with the fact that you never actually got through the options. Offer two concrete times, then dial the people who engage.</span></div></div>
        <div class="ipStep"><div class="ipStepNum">3</div><div><b>Work 50 of the 145 Underworked Aged leads.</b><span>Send one reactivation message to the batch, let replies start coming in, then dial through that same 50. Do not blast all 145 at once.</span></div></div>
        <div class="ipStep"><div class="ipStepNum">4</div><div><b>Move into Warm Reactivation.</b><span>Text first. Replies jump the line. This keeps prime phone time focused on people showing a reason to answer.</span></div></div>
        <div class="ipStep"><div class="ipStepNum">5</div><div><b>Text-First Aged → Email Only → Lowest Priority.</b><span>These are cleanup lanes. Work them after the higher-probability groups above, not before.</span></div></div>
      </div>
    </section>

    <section class="ipSection">
      <div class="ipSectionHead"><div><div class="eyebrow">SOURCE SIGNALS</div><h2>Where The Opportunity Is</h2></div></div>
      <div class="ipSourceGrid">
        <article class="ipSource"><b>Carson 1</b><strong>119</strong><span>Median age 280 days • only 2.4 calls on average • 51 show zero calls. Strong aged-lead test pool.</span></article>
        <article class="ipSource"><b>Secret Source</b><strong>20</strong><span>Median age 210 days • 15 show zero calls. Small enough to run as a controlled reactivation block.</span></article>
        <article class="ipSource"><b>USHA Branded</b><strong>80</strong><span>Median age 86 days • 8.8 calls on average. Better suited to text/reactivation than brute-force dialing.</span></article>
      </div>
    </section>

    <section class="ipSection">
      <div class="ipSectionHead"><div><div class="eyebrow">READY-TO-USE</div><h2>Reactivation Messages</h2></div></div>
      <div class="ipTemplates">
        <article class="ipTemplate"><div class="ipTemplateHead"><b>Call-First • No Answer</b><button class="ipCopy" data-copy="call">Copy</button></div><p>Hey [First Name], I was reviewing the options we had been trying to connect on. Are you still needing health coverage, or did you get this handled already?</p></article>
        <article class="ipTemplate"><div class="ipTemplateHead"><b>Appointment Rescue</b><button class="ipCopy" data-copy="rescue">Copy</button></div><p>Hey [First Name], we had tried to connect before but never actually got through the options. I have a little room open — are you still needing coverage or did you already get this handled?</p></article>
        <article class="ipTemplate"><div class="ipTemplateHead"><b>Underworked Aged</b><button class="ipCopy" data-copy="under">Copy</button></div><p>Hey [First Name], I know it’s been a while since you were looking at health coverage. I’m cleaning up my files and wanted to see if you ever got something in place, or if you still need me to look at options.</p></article>
        <article class="ipTemplate"><div class="ipTemplateHead"><b>Warm Reactivation</b><button class="ipCopy" data-copy="warm">Copy</button></div><p>Hey [First Name], I still have your file from when you were comparing health coverage. Before I close it out, did you end up getting something in place or are you still looking?</p></article>
      </div>
    </section>

    <section class="ipSection">
      <div class="ipSectionHead"><div><div class="eyebrow">LANE 1</div><h2>Call First — 25</h2></div><span id="ipCallBadge" class="ipBadge">0 / 25 worked</span></div>
      <section id="ipCallList" class="ipQueue"></section>
    </section>

    <section class="ipSection">
      <div class="ipSectionHead"><div><div class="eyebrow">LANE 2</div><h2>Appointment Rescue — 17</h2></div><span id="ipRescueBadge" class="ipBadge">0 / 17 worked</span></div>
      <section id="ipRescueList" class="ipQueue"></section>
    </section>

    <div class="ipPrivacy">This page intentionally stores only the minimum client-identifying information needed for the work queue. Phone numbers, email addresses, health details, DOBs, and Ringy record links from the export are not published into the website code.</div>
  `;

  const app=document.querySelector('.app');
  app.appendChild(view);

  const footer=document.querySelector('.footer');
  if(footer){
    footer.classList.add('interestedNavReady');
    const btn=document.createElement('button');
    btn.className='nav';
    btn.dataset.tab='interested';
    btn.innerHTML='◎<small>Interested</small>';
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
      view.classList.add('active');
      document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n===btn));
      const reset=document.getElementById('reset');if(reset)reset.style.visibility='hidden';
      render();
      window.scrollTo({top:0,behavior:'smooth'});
    });
    footer.appendChild(btn);
    footer.querySelectorAll('.nav:not([data-tab="interested"])').forEach(existing=>{
      existing.addEventListener('click',()=>view.classList.remove('active'));
    });
  }

  const templateText={
    call:'Hey [First Name], I was reviewing the options we had been trying to connect on. Are you still needing health coverage, or did you get this handled already?',
    rescue:'Hey [First Name], we had tried to connect before but never actually got through the options. I have a little room open — are you still needing coverage or did you already get this handled?',
    under:'Hey [First Name], I know it’s been a while since you were looking at health coverage. I’m cleaning up my files and wanted to see if you ever got something in place, or if you still need me to look at options.',
    warm:'Hey [First Name], I still have your file from when you were comparing health coverage. Before I close it out, did you end up getting something in place or are you still looking?'
  };

  function namedDone(prefix,list){return list.filter(x=>!!state.named[prefix+':'+x.name]).length}
  function manualDone(id,count){return Math.max(0,Math.min(count,Number(state.manual[id]||0)))}
  function laneDone(l){if(l.id==='call')return namedDone('call',CALL_FIRST);if(l.id==='rescue')return namedDone('rescue',APPT_RESCUE);return manualDone(l.id,l.count)}
  function setBar(el,p){if(!el)return;el.style.width=Math.max(0,Math.min(100,p))+'%';el.style.background=p<50?'var(--red)':p<80?'var(--yellow)':'var(--green)'}
  function toast(msg){if(typeof window.tip==='function'){window.tip(msg);return}let t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('on');clearTimeout(t.tm);t.tm=setTimeout(()=>t.classList.remove('on'),1500)}

  function laneCard(l){
    const done=laneDone(l),pct=l.count?done/l.count*100:0;
    const a=document.createElement('article');
    a.className='ipLane '+l.tone;
    a.innerHTML=`<div class="ipLaneTop"><div><div class="ipLaneTitle"></div><div class="ipLaneWhy"></div></div><div class="ipLaneCount"></div></div><div class="ipLaneProgress"><div class="row"><span>Progress</span><strong class="ipLaneTxt"></strong></div><div class="prog"><div class="fill ipLaneBar"></div></div></div>`;
    a.querySelector('.ipLaneTitle').textContent=l.label;
    a.querySelector('.ipLaneWhy').textContent=l.why;
    a.querySelector('.ipLaneCount').textContent=l.count;
    a.querySelector('.ipLaneTxt').textContent=done+' / '+l.count;
    setBar(a.querySelector('.ipLaneBar'),pct);
    if(l.mode==='manual'){
      const c=document.createElement('div');c.className='ipAdjust';
      c.innerHTML='<button type="button" data-d="-1">−</button><strong>'+done+' worked</strong><button type="button" data-d="1">+</button>';
      c.querySelectorAll('button').forEach(b=>b.onclick=()=>{state.manual[l.id]=Math.max(0,Math.min(l.count,manualDone(l.id,l.count)+Number(b.dataset.d)));save(state);render();});
      a.appendChild(c);
    }
    return a;
  }

  function leadCard(item,prefix){
    const key=prefix+':'+item.name,done=!!state.named[key];
    const a=document.createElement('article');
    a.className='ipLead'+(done?' worked':'');
    a.innerHTML='<div><div class="ipLeadName"></div><div class="ipLeadMeta"><span class="age"></span><span class="calls"></span><span class="src"></span></div></div><div class="ipLeadActions"><button type="button" class="ipAddToday">Add to Today</button><button type="button" class="ipMark"></button></div>';
    a.querySelector('.ipLeadName').textContent=item.name;
    a.querySelector('.age').textContent=item.age+' days old';
    a.querySelector('.calls').textContent=item.calls+' call'+(item.calls===1?'':'s');
    a.querySelector('.src').textContent=item.source;
    const mark=a.querySelector('.ipMark');mark.textContent=done?'Worked ✓':'Mark Worked';mark.classList.toggle('done',done);
    mark.onclick=()=>{state.named[key]=!done;save(state);render();toast(!done?'Marked worked':'Reopened')};
    a.querySelector('.ipAddToday').onclick=()=>{
      if(typeof window.addToToday==='function'){
        const action=prefix==='rescue'?'Appointment Rescue':'Interested Pipeline';
        const note=prefix==='rescue'?'Recover the missed appointment and offer two concrete times.':'Call first; if no answer, send the reactivation text immediately.';
        window.addToToday(item.name,action,note,prefix==='rescue'?'hot':'high');
      }else toast('Add-to-Today is unavailable');
    };
    return a;
  }

  function render(){
    const grid=document.getElementById('ipLaneGrid');if(!grid)return;
    grid.innerHTML='';LANES.forEach(l=>grid.appendChild(laneCard(l)));

    const callList=document.getElementById('ipCallList');callList.innerHTML='';CALL_FIRST.forEach(x=>callList.appendChild(leadCard(x,'call')));
    const rescueList=document.getElementById('ipRescueList');rescueList.innerHTML='';APPT_RESCUE.forEach(x=>rescueList.appendChild(leadCard(x,'rescue')));

    const callDone=namedDone('call',CALL_FIRST),rescueDone=namedDone('rescue',APPT_RESCUE),underToday=Math.min(50,manualDone('under',145));
    const todayDone=callDone+rescueDone+underToday,todayGoal=92,pct=todayDone/todayGoal*100;
    document.getElementById('ipTodayTxt').textContent=todayDone+' / '+todayGoal;
    document.getElementById('ipTodayPct').textContent=Math.round(pct)+'% complete';
    setBar(document.getElementById('ipTodayBar'),pct);
    document.getElementById('ipCallBadge').textContent=callDone+' / 25 worked';
    document.getElementById('ipRescueBadge').textContent=rescueDone+' / 17 worked';
  }

  document.querySelectorAll('.ipCopy').forEach(b=>b.onclick=async()=>{
    const text=templateText[b.dataset.copy]||'';
    try{await navigator.clipboard.writeText(text);toast('Message copied')}catch{toast('Copy failed')}
  });

  render();
})();

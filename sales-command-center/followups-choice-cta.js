(() => {
  const dayNumber = () => {
    const d = new Date();
    return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
  };

  const nameHash = name => String(name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const firstName = name => (name || '').trim().split(/\s+/)[0] || name;

  const pick = (name, choices) => choices[(dayNumber() + nameHash(name)) % choices.length];

  function choiceMessage(name, stage) {
    const first = firstName(name);
    const pools = {
      'Appointment Missed': [
        `Hey ${first}! Hope your week’s going well. I know we never quite got connected before. Would later today be easier, or would tomorrow be better?`,
        `Hey ${first}! I know our timing never lined up before. If you still want my help, is morning or afternoon usually easier for you?`,
        `Hey ${first}! I didn’t want to leave you hanging after we missed each other. Would you rather pick a time for a quick call, or keep it simple over text?`,
        `Hey ${first}! I know things get busy. If this is still on your list, would sometime this week work better, or should I circle back next week?`
      ],
      'Pitch Completed': [
        `Hey ${first}! I was thinking about what we went over and wanted to make sure I didn’t leave anything unresolved. Is the bigger question for you the cost or the coverage itself?`,
        `Hey ${first}! I know we covered a lot. Would you rather I look for a way to improve the price, or go back over the benefits we discussed?`,
        `Hey ${first}! After having a little time to think it over, is the main thing holding you up the plan itself or just the timing?`,
        `Hey ${first}! I wanted to make sure I left you with a clear path. Would you rather adjust what we looked at, or keep it as-is and reconnect later?`
      ],
      'Positive Response': [
        `Hey ${first}! Hope your week’s going well. I know we talked about getting your coverage handled and I didn’t want it to get lost in the shuffle. Would it be easier to go over it by text, or would a quick call be better?`,
        `Hey ${first}! I had your file in front of me and didn’t want you to think I’d forgotten about you. Would you rather I send over the basics by text, or find a few minutes for a call?`,
        `Hey ${first}! I know life gets busy. If you still want help with the coverage, is today better to pick it back up or would tomorrow be easier?`,
        `Hey ${first}! Just wanted to reach out while I had your information in front of me. Would morning or afternoon usually be easier if we reconnect?`
      ]
    };
    return pick(name, pools[stage] || pools['Positive Response']);
  }

  function specialFirst(name, stage) {
    if (name === 'Mary Fondren') return 'Hey Mary! Hope your week is going well. I know we never quite got connected before. Would later today be easier, or would tomorrow be better?';
    if (name === 'Dustin Beard') return 'Hey Dustin! I was thinking about what we went over and wanted to make sure I didn’t leave anything unresolved. Is the bigger question for you the cost or the coverage itself?';
    if (name === 'Mike Olson') return 'Hey Mike! Hope your week’s going well. I know we talked about getting your coverage handled and I didn’t want it to get lost in the shuffle. Would it be easier to go over it by text, or would a quick call be better?';
    if (name === 'Joshua Morman') return 'Hey Joshua! I know we’ve already gone through quite a bit together. After having some time to think about it, is the bigger question for you the price or the coverage itself?';
    return choiceMessage(name, stage);
  }

  function specialSecond(name) {
    if (name === 'Mary Fondren') return 'Hey Mary, one last thought for today — if a call is tough to line up, would you rather keep this simple over text or pick a time for me to call tomorrow?';
    if (name === 'Dustin Beard') return 'Hey Dustin, no rush on my end. Would you rather I see if I can improve the option we looked at, or leave it as-is and reconnect later?';
    if (name === 'Mike Olson') return 'Hey Mike, I won’t keep blowing your phone up today. Would you rather I send the basics here by text, or give you a quick call tomorrow?';
    if (name === 'Joshua Morman') return 'Hey Joshua, I don’t want to keep pestering you. Would you rather I tweak what we discussed, or leave it where it is and reconnect another time?';
    return '';
  }

  function copyText(text, button) {
    const finish = () => {
      const old = button.textContent;
      button.textContent = 'Copied ✓';
      if (typeof tip === 'function') tip('Message copied');
      setTimeout(() => { button.textContent = old; }, 1200);
    };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); finish(); } finally { ta.remove(); }
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(finish).catch(fallback);
    else fallback();
  }

  function patchCard(card) {
    const name = card.querySelector('.followName')?.textContent?.trim();
    const stage = card.querySelector('.st')?.textContent?.trim();
    if (!name || !stage) return;

    const first = specialFirst(name, stage);
    const firstText = card.querySelector('.firstText');
    const firstCopy = card.querySelector('.firstCopy');
    if (firstText) firstText.textContent = first;
    if (firstCopy) firstCopy.onclick = () => copyText(first, firstCopy);

    const secondText = card.querySelector('.secondText');
    const secondCopy = card.querySelector('.secondCopy');
    if (secondText && secondCopy) {
      const second = specialSecond(name);
      if (second) {
        secondText.textContent = second;
        secondCopy.onclick = () => copyText(second, secondCopy);
      }
    }
  }

  function patchAll() {
    document.querySelectorAll('#followList .followCard').forEach(patchCard);
    const hero = document.querySelector('#followupsView .screenHero .muted');
    if (hero) hero.textContent = 'Follow-up messages stay warm, but now default to an easy two-choice response so clients always have a clear next step.';
    const tags = document.querySelector('#followupsView .followHeroLine');
    if (tags) {
      const existing = Array.from(tags.querySelectorAll('.followHeroTag')).find(x => x.textContent.includes('WARMER') || x.textContent.includes('CHOICE'));
      if (existing) existing.textContent = 'WARM + CHOICE-BASED CTAs';
    }
  }

  function start() {
    patchAll();
    const list = document.getElementById('followList');
    if (!list) { setTimeout(start, 250); return; }
    new MutationObserver(() => requestAnimationFrame(patchAll)).observe(list, { childList: true, subtree: true });
  }

  start();
})();
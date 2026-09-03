(() => {
  const CONFIG_KEY = 'hs-sales-command-sheet-v1';
  const DEFAULT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxrV9rG_aylUm9dglfI1UMESMmUlLtQjhmX2ciGz5AHFHhRe3g1MWvYtYryiAd7iDz8-w/exec';
  const STAGES = [
    'Positive Response',
    'Appointment Set',
    'Appointment Answered',
    'Pitch Completed',
    'Sold',
    'Not Interested',
    'Appointment Missed',
    'ACA Appointment'
  ];

  const css = document.createElement('style');
  css.textContent = `
    .stageWriteBar{display:flex;justify-content:flex-end;margin:10px 0 4px}
    .stageWriteSetup{border:1px solid var(--line);background:#fff;color:var(--navy);border-radius:12px;padding:8px 10px;font-size:10px;font-weight:800}
    .stageWriteControls{display:flex;gap:7px;align-items:center;justify-content:flex-end;margin-top:12px;flex-wrap:wrap}
    .stageWriteSelect{border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:11px;padding:8px 10px;font-size:11px;min-width:170px}
    .stageWriteSave{border:1px solid var(--navy);background:var(--navy);color:#fff;border-radius:11px;padding:8px 10px;font-size:11px;font-weight:800}
    .stageWriteSave[disabled]{opacity:.55;cursor:wait}
    .stageWriteHint{width:100%;font-size:9px;color:var(--muted);text-align:right}
  `;
  document.head.appendChild(css);

  function getConfig() {
    try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null'); }
    catch { return null; }
  }

  function saveConfig(token) {
    const value = { endpoint: DEFAULT_ENDPOINT, token: token.trim() };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(value));
    return value;
  }

  function configure() {
    const current = getConfig() || {};
    const token = prompt('Paste the private webhook token. It stays only in this browser:', current.token || '');
    if (!token) return null;
    const cfg = saveConfig(token);
    if (typeof tip === 'function') tip('Pipeline connection saved on this device');
    return cfg;
  }

  function ensureSetupButton() {
    const pipeline = document.getElementById('pipelineView');
    if (!pipeline || pipeline.querySelector('.stageWriteBar')) return;
    const bar = document.createElement('div');
    bar.className = 'stageWriteBar';
    const btn = document.createElement('button');
    btn.className = 'stageWriteSetup';
    btn.type = 'button';
    btn.textContent = getConfig() ? 'Sheet Connected • Settings' : 'Connect Pipeline Sheet';
    btn.onclick = () => {
      if (configure()) btn.textContent = 'Sheet Connected • Settings';
    };
    const hero = pipeline.querySelector('.screenHero');
    if (hero) hero.appendChild(bar);
    bar.appendChild(btn);
  }

  function postPipelineUpdate(fields, onSent) {
    let cfg = getConfig();
    if (!cfg) cfg = configure();
    if (!cfg) return false;

    const iframeName = 'hsPipelineWrite_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = DEFAULT_ENDPOINT;
    form.target = iframeName;
    form.style.display = 'none';

    const payload = {
      event: 'sales_command_update_stage',
      token: cfg.token,
      ...fields
    };

    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      try { onSent?.(); } catch (err) { console.error(err); }
      form.remove();
      setTimeout(() => iframe.remove(), 1500);
    }, 650);

    return true;
  }

  function submitStage(clientName, stage, button, pill) {
    button.disabled = true;
    const oldText = button.textContent;
    button.textContent = 'Updating…';

    const started = postPipelineUpdate({ client_name: clientName, stage }, () => {
      if (pill) {
        pill.textContent = stage;
        pill.className = 'stagePill ' + (typeof stageClass === 'function' ? stageClass(stage) : '');
      }
      try {
        if (typeof PIPELINE !== 'undefined') {
          const row = PIPELINE.find(x => x.name === clientName);
          if (row) {
            row.stage = stage;
            row.work = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());
          }
        }
      } catch {}
      button.disabled = false;
      button.textContent = oldText;
      if (typeof tip === 'function') tip(clientName + ' → ' + stage + ' sent to pipeline');
    });

    if (!started) {
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  function submitWorked(clientName, stage, button, originalHandler) {
    button.disabled = true;
    const oldText = button.textContent;
    button.textContent = 'Updating Work Date…';

    const started = postPipelineUpdate({ client_name: clientName, stage }, () => {
      const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());
      try {
        if (typeof PIPELINE !== 'undefined') {
          const row = PIPELINE.find(x => x.name === clientName);
          if (row) row.work = today;
        }
        if (typeof FOLLOWUPS !== 'undefined') {
          const follow = FOLLOWUPS.find(x => x.name === clientName && x.stage === stage);
          if (follow) follow.worked = today;
        }
      } catch {}

      button.disabled = false;
      button.textContent = oldText;
      if (typeof originalHandler === 'function') originalHandler.call(button);
      if (typeof tip === 'function') tip(clientName + ' worked today → pipeline Work Date updated');
    });

    if (!started) {
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  function enhancePipelineCards() {
    ensureSetupButton();
    document.querySelectorAll('#pipelineList .clientCard').forEach(card => {
      if (card.querySelector('.stageWriteControls')) return;
      const name = card.querySelector('.clientName')?.textContent?.trim();
      const pill = card.querySelector('.stagePill');
      if (!name || !pill) return;

      const controls = document.createElement('div');
      controls.className = 'stageWriteControls';
      const select = document.createElement('select');
      select.className = 'stageWriteSelect';
      select.setAttribute('aria-label', 'Change stage for ' + name);
      STAGES.forEach(stage => {
        const opt = document.createElement('option');
        opt.value = stage;
        opt.textContent = stage;
        if (stage === pill.textContent.trim()) opt.selected = true;
        select.appendChild(opt);
      });
      const save = document.createElement('button');
      save.type = 'button';
      save.className = 'stageWriteSave';
      save.textContent = 'Update Stage';
      save.onclick = () => submitStage(name, select.value, save, pill);
      const hint = document.createElement('div');
      hint.className = 'stageWriteHint';
      hint.textContent = 'Updates Current Stage + Work Date in the live pipeline';
      controls.append(select, save, hint);
      card.appendChild(controls);
    });
  }

  function enhanceFollowupCards() {
    document.querySelectorAll('#followList .followCard').forEach(card => {
      const button = card.querySelector('.workedBtn');
      if (!button || button.dataset.sheetWorkedWired === 'true') return;
      button.dataset.sheetWorkedWired = 'true';

      if (button.textContent.trim() !== 'Mark Worked') return;

      const name = card.querySelector('.followName')?.textContent?.trim();
      const stage = card.querySelector('.st')?.textContent?.trim();
      if (!name || !stage || !STAGES.includes(stage)) return;

      const originalHandler = button.onclick;
      button.onclick = () => submitWorked(name, stage, button, originalHandler);
      button.title = 'Updates this client’s Work Date in the live pipeline, then marks the follow-up worked';
    });
  }

  function enhanceCards() {
    enhancePipelineCards();
    enhanceFollowupCards();
  }

  const observer = new MutationObserver(() => enhanceCards());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', enhanceCards);
  setTimeout(enhanceCards, 0);
})();

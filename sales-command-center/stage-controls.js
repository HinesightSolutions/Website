(() => {
  const CONFIG_KEY = 'hs-sales-command-sheet-v1';
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

  function saveConfig(endpoint, token) {
    const value = { endpoint: endpoint.trim(), token: token.trim() };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(value));
    return value;
  }

  function configure() {
    const current = getConfig() || {};
    const endpoint = prompt('Paste your Google Apps Script /exec URL:', current.endpoint || '');
    if (!endpoint) return null;
    const token = prompt('Paste the private webhook token. It stays only in this browser:', current.token || '');
    if (!token) return null;
    const cfg = saveConfig(endpoint, token);
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

  function submitStage(clientName, stage, button, pill) {
    let cfg = getConfig();
    if (!cfg) cfg = configure();
    if (!cfg) return;

    button.disabled = true;
    const oldText = button.textContent;
    button.textContent = 'Updating…';

    const iframeName = 'hsStageWrite_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = cfg.endpoint;
    form.target = iframeName;
    form.style.display = 'none';

    const fields = {
      event: 'sales_command_update_stage',
      token: cfg.token,
      client_name: clientName,
      stage
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // The Apps Script web app is cross-origin, so the page cannot safely read
    // the response. Update the card optimistically after submission; the Sheet
    // remains the source of truth and can be refreshed if the write is rejected.
    setTimeout(() => {
      if (pill) {
        pill.textContent = stage;
        pill.className = 'stagePill ' + (typeof stageClass === 'function' ? stageClass(stage) : '');
      }
      try {
        if (typeof PIPELINE !== 'undefined') {
          const row = PIPELINE.find(x => x.name === clientName);
          if (row) row.stage = stage;
        }
      } catch {}
      button.disabled = false;
      button.textContent = oldText;
      form.remove();
      setTimeout(() => iframe.remove(), 1500);
      if (typeof tip === 'function') tip(clientName + ' → ' + stage + ' sent to pipeline');
    }, 650);
  }

  function enhanceCards() {
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

  const observer = new MutationObserver(() => enhanceCards());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', enhanceCards);
  setTimeout(enhanceCards, 0);
})();

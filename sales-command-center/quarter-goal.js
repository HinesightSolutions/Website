(() => {
  const GOAL = 200000;
  const CURRENT = 92881;
  const DEADLINE = new Date('2026-09-24T23:59:59');

  const money = value => '$' + Math.round(value).toLocaleString('en-US');
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.max(0, Math.ceil((DEADLINE - now) / msPerDay));
  const remaining = Math.max(0, GOAL - CURRENT);
  const pct = Math.min(100, (CURRENT / GOAL) * 100);
  const dailyPace = daysLeft > 0 ? remaining / daysLeft : remaining;

  const todayView = document.getElementById('todayView');
  if (!todayView) return;

  const old = document.getElementById('quarterIssuedGoal');
  if (old) old.remove();

  const css = document.createElement('style');
  css.dataset.quarterGoalStyle = 'true';
  css.textContent = `
    .quarterGoal{margin-top:16px;padding:20px 22px}
    .quarterGoalHead{display:flex;justify-content:space-between;gap:14px;align-items:flex-end;flex-wrap:wrap}
    .quarterGoalTitle{font:700 24px Georgia;color:var(--navy);margin-top:4px}
    .quarterGoalAmount{font-size:24px;font-weight:850;color:var(--navy);white-space:nowrap}
    .quarterGoalMeta{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}
    .quarterGoalStat{background:#f0eee9;border:1px solid var(--line);border-radius:14px;padding:11px 12px}
    .quarterGoalStat b{display:block;color:var(--navy);font-size:16px;margin-bottom:3px}
    .quarterGoalStat span{font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
    .quarterGoal .prog{margin-top:12px}
    .quarterGoal .fill{width:${pct.toFixed(1)}%;background:var(--green)}
    .quarterGoalFoot{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:7px;font-size:10px;color:var(--muted)}
    @media(max-width:760px){.quarterGoalMeta{grid-template-columns:1fr}.quarterGoalAmount{font-size:21px}}
  `;
  document.head.appendChild(css);

  const card = document.createElement('section');
  card.id = 'quarterIssuedGoal';
  card.className = 'card quarterGoal';
  card.innerHTML = `
    <div class="quarterGoalHead">
      <div>
        <div class="eyebrow">QUARTER FINISH LINE • ISSUED AV</div>
        <div class="quarterGoalTitle">$200K by September 24</div>
      </div>
      <div class="quarterGoalAmount">${money(CURRENT)} / ${money(GOAL)}</div>
    </div>
    <div class="prog big"><div class="fill"></div></div>
    <div class="quarterGoalFoot">
      <span>${pct.toFixed(1)}% complete</span>
      <span>${money(remaining)} left to issue</span>
    </div>
    <div class="quarterGoalMeta">
      <div class="quarterGoalStat"><b>${money(remaining)}</b><span>Issued AV Remaining</span></div>
      <div class="quarterGoalStat"><b>${daysLeft}</b><span>Days to Sep 24</span></div>
      <div class="quarterGoalStat"><b>${money(dailyPace)}</b><span>Avg. Issued AV / Day Needed</span></div>
    </div>
  `;

  const targets = todayView.querySelector('.targets');
  if (targets) targets.parentNode.insertBefore(card, targets);
  else todayView.prepend(card);
})();

// ── Navigation ────────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Day View ──────────────────────────────────────────────────
let _currentDay = null;

function openDay(idx) {
  _currentDay = WORKOUT.days[idx];
  document.getElementById('day-label').textContent = _currentDay.name;
  document.getElementById('day-name').textContent  = _currentDay.focus;

  const list = document.getElementById('day-exercise-list');
  list.innerHTML = _currentDay.exercises.map((ex, i) => {
    const svg = ExerciseSVGs[ex.svgFn] ? ExerciseSVGs[ex.svgFn]() : '';
    return `
    <div class="ex-card">
      <div class="ex-card-top">
        <div class="ex-fig-wrap">${svg}</div>
        <div class="ex-info">
          <div class="ex-num">Exercise ${i + 1} of ${_currentDay.exercises.length}</div>
          <div class="ex-name">${ex.name}</div>
          <div class="ex-sets-reps">${ex.sets} sets × ${ex.reps} · ${ex.rest}s rest</div>
          <div class="ex-muscles-row">${ex.muscles.map(m => `<span class="ex-muscle-tag">${m}</span>`).join('')}</div>
        </div>
      </div>
      <div class="ex-cue">${ex.cue}</div>
      ${ex.science ? `<div class="ex-science"><span class="ex-sci-icon">&#x1F52C;</span> ${ex.science}</div>` : ''}
      ${ex.beginner ? `
      <div class="ex-levels">
        <div class="ex-lvl-tabs">
          <button class="ex-lvl-btn active" onclick="switchLevel(this,'beg')">Beginner</button>
          <button class="ex-lvl-btn" onclick="switchLevel(this,'int')">Intermediate</button>
        </div>
        <div class="ex-lvl-pane" data-level="beg">
          <span class="ex-lvl-tag">↓ Try:</span> <strong>${ex.beginner.mod}</strong><br>
          <span class="ex-lvl-text">${ex.beginner.how}</span>
        </div>
        <div class="ex-lvl-pane" data-level="int" style="display:none">
          <span class="ex-lvl-tag">↑ Level up:</span> <strong>${ex.intermediate.mod}</strong><br>
          <span class="ex-lvl-text">${ex.intermediate.how}</span>
        </div>
      </div>` : ''}
    </div>`;
  }).join('');

  show('s-day');
}

function switchLevel(btn, level) {
  const card = btn.closest('.ex-levels');
  card.querySelectorAll('.ex-lvl-btn').forEach(b => b.classList.toggle('active', b === btn));
  card.querySelectorAll('.ex-lvl-pane').forEach(p => {
    p.style.display = p.dataset.level === level ? 'block' : 'none';
  });
}

// ── Whoop global ─────────────────────────────────────────────
let _whoopData = null;

// ── Workout State ─────────────────────────────────────────────
let _exIdx = 0;
let _setIdx = 0;
let _reps = 0;
let _weight = 0;
let _timerInterval = null;
let _timerLeft = 0;
let _startTime = null;
let _elapsedInterval = null;

function isTimed(ex) {
  return typeof ex.reps === 'string' && ex.reps.includes('sec');
}

function parseDuration(ex) {
  const m = String(ex.reps).match(/(\d+)/);
  return m ? parseInt(m[1]) : 30;
}

function startWorkout() {
  _exIdx = 0;
  _setIdx = 0;
  _reps = 0;
  _weight = 0;
  clearInterval(_timerInterval);
  _startTime = Date.now();

  clearInterval(_elapsedInterval);
  _elapsedInterval = setInterval(() => {
    const s  = Math.floor((Date.now() - _startTime) / 1000);
    const m  = Math.floor(s / 60);
    const ss = (s % 60).toString().padStart(2, '0');
    const el = document.getElementById('wk-elapsed');
    if (el) el.textContent = `${m}:${ss}`;
  }, 1000);

  show('s-workout');
  renderExercise();
}

function renderExercise() {
  const day   = _currentDay;
  const ex    = day.exercises[_exIdx];
  const total = day.exercises.length;

  document.getElementById('wk-prog-fill').style.width = `${(_exIdx / total) * 100}%`;
  document.getElementById('wk-prog-text').textContent = `Exercise ${_exIdx + 1} of ${total}`;
  document.getElementById('wk-set-num').textContent   = `${_setIdx + 1} / ${ex.sets}`;

  const isLast = _exIdx === total - 1 && _setIdx === ex.sets - 1;
  document.getElementById('wk-done-btn').textContent = isLast ? 'Finish ✓' : 'Done ✓';

  // Weight — load last used for this exercise
  const weights = JSON.parse(localStorage.getItem('ff_weights') || '{}');
  _weight = weights[ex.name] || 0;
  document.getElementById('wk-weight-num').textContent = _weight;

  // Timed vs rep-counted
  clearInterval(_timerInterval);
  const timed = isTimed(ex);
  document.getElementById('wk-counter-wrap').style.display = timed ? 'none' : 'flex';
  document.getElementById('wk-timer-wrap').style.display   = timed ? 'flex' : 'none';

  if (timed) {
    _timerLeft = parseDuration(ex);
    document.getElementById('wk-timer-num').textContent = _timerLeft;
    _timerInterval = setInterval(() => {
      _timerLeft--;
      document.getElementById('wk-timer-num').textContent = _timerLeft;
      if (_timerLeft <= 0) { clearInterval(_timerInterval); doneSet(); }
    }, 1000);
  } else {
    _reps = 0;
    document.getElementById('wk-rep-num').textContent = '0';
  }

  const svg        = ex.svgFn && ExerciseSVGs[ex.svgFn] ? ExerciseSVGs[ex.svgFn]() : '';
  const phaseLabel = ex.phase || (ex.muscles?.[0] ?? '');
  document.getElementById('wk-body').innerHTML = `
    <div class="wk-phase">${phaseLabel}</div>
    <div class="wk-ex-name">${ex.name}</div>
    <div class="wk-ex-target">${ex.sets} sets × ${ex.reps}</div>
    ${svg ? `<div class="wk-fig-large"><div class="wk-fig-bg">${svg}</div></div>` : ''}
    <div class="wk-cue-box">
      <div class="wk-cue-label">Form cue</div>
      <div class="wk-cue-text">${ex.cue}</div>
    </div>
    ${ex.science ? `<div class="wk-science">&#x1F52C; ${ex.science}</div>` : ''}`;
}

function adjustRep(delta) {
  _reps = Math.max(0, _reps + delta);
  document.getElementById('wk-rep-num').textContent = _reps;
}

function adjustWeight(delta) {
  _weight = Math.max(0, _weight + delta);
  document.getElementById('wk-weight-num').textContent = _weight;
}

function doneSet() {
  clearInterval(_timerInterval);

  const day       = _currentDay;
  const ex        = day.exercises[_exIdx];
  const isLastSet = _setIdx >= ex.sets - 1;
  const isLastEx  = _exIdx  >= day.exercises.length - 1;

  // Persist weight + log history entry
  const weights = JSON.parse(localStorage.getItem('ff_weights') || '{}');
  weights[ex.name] = _weight;
  localStorage.setItem('ff_weights', JSON.stringify(weights));

  const histKey = `${today()}_${day.id || 'AI'}`;
  const hist    = JSON.parse(localStorage.getItem('ff_history') || '{}');
  if (!hist[histKey]) hist[histKey] = [];
  hist[histKey].push({ exercise: ex.name, set: _setIdx + 1, reps: isTimed(ex) ? ex.reps : _reps, weight: _weight });
  localStorage.setItem('ff_history', JSON.stringify(hist));

  if (!isLastSet) {
    const nextSet = _setIdx + 1;
    showRest(ex.rest, `Set ${nextSet + 1} of ${ex.sets}: ${ex.name}`, () => {
      _setIdx = nextSet;
      document.getElementById('wk-set-num').textContent = `${_setIdx + 1} / ${ex.sets}`;
      _reps = 0;
      document.getElementById('wk-rep-num').textContent = '0';
      const nowLast = _exIdx === day.exercises.length - 1 && _setIdx === ex.sets - 1;
      document.getElementById('wk-done-btn').textContent = nowLast ? 'Finish ✓' : 'Done set ✓';
    });
  } else if (!isLastEx) {
    const nextEx = day.exercises[_exIdx + 1];
    showRest(nextEx.rest, `Up next: ${nextEx.name}`, () => {
      _exIdx++;
      _setIdx = 0;
      renderExercise();
    });
  } else {
    finishWorkout();
  }
}

function confirmQuit() {
  if (confirm('End workout early?')) {
    clearInterval(_elapsedInterval);
    clearInterval(_restInterval);
    clearInterval(_timerInterval);
    show(_currentDay?.id === 'AI' ? 's-home' : 's-day');
  }
}

// ── Rest Timer ────────────────────────────────────────────────
let _restInterval = null;
let _restCallback = null;
const CIRCUMFERENCE = 327; // 2π × 52

function showRest(seconds, nextLabel, callback) {
  _restCallback = callback;
  document.getElementById('rest-next').textContent = nextLabel;

  const arc   = document.getElementById('rest-ring-arc');
  const total = seconds;
  let left    = seconds;

  function tick() {
    document.getElementById('rest-seconds').textContent = left;
    arc.style.strokeDashoffset = ((total - left) / total) * CIRCUMFERENCE;
    if (left <= 0) {
      clearInterval(_restInterval);
      show('s-workout');
      if (_restCallback) _restCallback();
      return;
    }
    left--;
  }

  clearInterval(_restInterval);
  arc.style.strokeDashoffset = 0;
  tick();
  show('s-rest');
  _restInterval = setInterval(tick, 1000);
}

function skipRest() {
  clearInterval(_restInterval);
  show('s-workout');
  if (_restCallback) _restCallback();
}

// ── Finish ────────────────────────────────────────────────────
function finishWorkout() {
  clearInterval(_elapsedInterval);
  clearInterval(_restInterval);

  const day       = _currentDay;
  const secs      = Math.floor((Date.now() - _startTime) / 1000);
  const mins      = Math.floor(secs / 60);
  const totalSets = day.exercises.reduce((a, e) => a + e.sets, 0);
  const muscles   = [...new Set(day.exercises.flatMap(e => e.muscles || []))];

  logWorkout({
    id:      day.id || 'AI',
    name:    day.name,
    focus:   day.focus,
    muscles,
  });

  document.getElementById('done-stats').innerHTML = `
    <div class="done-stat">Duration: <strong>${mins} min</strong></div>
    <div class="done-stat">Exercises: <strong>${day.exercises.length}</strong></div>
    <div class="done-stat">Sets completed: <strong>${totalSets}</strong></div>
    <div class="done-stat">Session: <strong>${day.name} — ${day.focus}</strong></div>
    ${muscles.length ? `<div class="done-stat">Muscles: <strong>${muscles.join(', ')}</strong></div>` : ''}`;

  show('s-done');
}

// ── Calendar ──────────────────────────────────────────────────
let _calYear, _calMonth;
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function today() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
}

function logWorkout(info) {
  const log = JSON.parse(localStorage.getItem('ff_log') || '{}');
  log[today()] = typeof info === 'string'
    ? { id: info, name: info, focus: '', muscles: [] }
    : info;
  localStorage.setItem('ff_log', JSON.stringify(log));
}

function openCalendar() {
  const now = new Date();
  _calYear  = now.getFullYear();
  _calMonth = now.getMonth();
  renderCalendar();
  show('s-calendar');
}

function calShift(dir) {
  _calMonth += dir;
  if (_calMonth < 0)  { _calMonth = 11; _calYear--; }
  if (_calMonth > 11) { _calMonth = 0;  _calYear++; }
  renderCalendar();
}

function renderCalendar() {
  const log       = JSON.parse(localStorage.getItem('ff_log') || '{}');
  const todayStr  = today();
  const firstDay  = new Date(_calYear, _calMonth, 1);
  const daysInMo  = new Date(_calYear, _calMonth + 1, 0).getDate();
  const startDow  = (firstDay.getDay() + 6) % 7; // Monday = 0

  document.getElementById('cal-month-label').textContent = `${MONTHS[_calMonth]} ${_calYear}`;

  let html = '';
  for (let i = 0; i < startDow; i++) html += '<div class="cal-cell cal-cell--empty"></div>';
  for (let d = 1; d <= daysInMo; d++) {
    const ds     = `${_calYear}-${String(_calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const logged    = log[ds];
    const loggedId  = logged ? (typeof logged === 'object' ? logged.id   : logged) : null;
    const loggedTip = logged ? (typeof logged === 'object' ? `${logged.name}${logged.muscles?.length ? ' · ' + logged.muscles.join(', ') : ''}` : logged) : '';
    const cls       = ['cal-cell', ds === todayStr ? 'cal-today' : '', loggedId ? 'cal-logged' : ''].filter(Boolean).join(' ');
    html += `<div class="${cls}"${loggedTip ? ` title="${loggedTip}"` : ''}>
      <span class="cal-day-num">${d}</span>
      ${loggedId ? `<span class="cal-badge cal-badge--${loggedId}">${loggedId === 'AI' ? '✓' : loggedId}</span>` : ''}
    </div>`;
  }
  document.getElementById('cal-grid').innerHTML = html;
}

// ── Whoop ─────────────────────────────────────────────────────
function whoopConnect() {
  window.location.href = '/.netlify/functions/whoop-auth';
}

function whoopDisconnect() {
  ['whoop_access_token','whoop_refresh_token','whoop_expires_at'].forEach(k => localStorage.removeItem(k));
  document.getElementById('whoop-card').style.display = 'none';
  document.getElementById('whoop-connect-wrap').style.display = 'block';
  _whoopData = null;
}

async function whoopGetToken() {
  let token     = localStorage.getItem('whoop_access_token');
  const expires = parseInt(localStorage.getItem('whoop_expires_at') || '0');
  if (!token) return null;

  if (Date.now() > expires - 60_000) {
    const refresh = localStorage.getItem('whoop_refresh_token');
    if (!refresh) return null;
    const res  = await fetch('/.netlify/functions/whoop-refresh', {
      method: 'POST', body: JSON.stringify({ refresh_token: refresh }),
    });
    const data = await res.json();
    if (!data.access_token) { whoopDisconnect(); return null; }
    token = data.access_token;
    localStorage.setItem('whoop_access_token', token);
    localStorage.setItem('whoop_refresh_token', data.refresh_token);
    localStorage.setItem('whoop_expires_at', Date.now() + data.expires_in * 1000);
  }
  return token;
}

function renderSparkline(values, color, label, unit) {
  if (!values || values.length < 2) return '';
  const W = 70, H = 36, pad = 4;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last  = pts[pts.length - 1].split(',');
  const val   = Math.round(values[values.length - 1]);
  return `<div class="sparkline-wrap">
    <div class="sparkline-label">${label}</div>
    <svg viewBox="0 0 ${W} ${H}" class="sparkline-svg">
      <polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="3" fill="${color}"/>
    </svg>
    <div class="sparkline-val" style="color:${color}">${val}${unit}</div>
  </div>`;
}

async function whoopLoad() {
  const token = await whoopGetToken();
  if (!token) return;

  const res = await fetch('/.netlify/functions/whoop-data', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return;
  const data = await res.json();
  _whoopData = data;

  const { recovery, cycle, sleep, history } = data;

  const strain  = cycle?.score?.strain;
  const avgHR   = cycle?.score?.average_heart_rate;
  const maxHR   = cycle?.score?.max_heart_rate;
  const kcal    = cycle?.score?.kilojoule ? Math.round(cycle.score.kilojoule / 4.184) : null;
  const slp     = sleep?.score?.sleep_performance_percentage;

  let scoreText, scoreSuffix, color, note, dateStr, metrics;

  if (recovery?.score) {
    const score = Math.round(recovery.score.recovery_score);
    const hrv   = Math.round(recovery.score.hrv_rmssd_milli);
    const rhr   = Math.round(recovery.score.resting_heart_rate);
    color       = score >= 67 ? '#4ade80' : score >= 34 ? '#facc15' : '#f87171';
    note        = score >= 67 ? 'Good to train hard today.' : score < 34 ? 'Consider a lighter session or rest.' : 'Moderate effort recommended.';
    scoreText   = String(score);
    scoreSuffix = '%';
    dateStr     = new Date(recovery.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    metrics     = `<span>HRV ${hrv}ms</span><span>RHR ${rhr}bpm</span>` +
                  (strain != null ? `<span>Strain ${strain.toFixed(1)}</span>` : '') +
                  (slp != null    ? `<span>Sleep ${Math.round(slp)}%</span>`  : '');
  } else if (cycle?.score) {
    // No recovery yet — show cycle metrics as main display
    const strainColor = strain >= 14 ? '#f87171' : strain >= 10 ? '#facc15' : '#4ade80';
    color       = strainColor;
    scoreText   = strain != null ? strain.toFixed(1) : '–';
    scoreSuffix = 'strain';
    dateStr     = new Date(cycle.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    note        = 'Recovery score needs overnight sleep data. Showing today\'s cycle.';
    const bits  = [];
    if (avgHR != null) bits.push(`<span>Avg HR ${avgHR}bpm</span>`);
    if (maxHR != null) bits.push(`<span>Max HR ${maxHR}bpm</span>`);
    if (kcal  != null) bits.push(`<span>${kcal} kcal</span>`);
    metrics     = bits.join('');
  } else {
    color       = '#94a3b8';
    scoreText   = '–';
    scoreSuffix = '';
    dateStr     = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    note        = 'No data yet. Wear your Whoop today.';
    metrics     = '';
  }

  document.getElementById('whoop-score').textContent        = scoreText;
  document.getElementById('whoop-score').style.color        = color;
  document.getElementById('whoop-score-label').textContent  = scoreSuffix;
  document.getElementById('whoop-date').textContent         = dateStr;
  document.getElementById('whoop-metrics').innerHTML        = metrics;
  document.getElementById('whoop-note').textContent         = note;
  document.getElementById('whoop-note').style.color         = color;
  document.getElementById('whoop-card').style.display       = 'block';
  document.getElementById('whoop-connect-wrap').style.display = 'none';

  // Sparklines — use whatever data is available
  if (history) {
    const cycles     = [...(history.cycles     || [])].reverse();
    const recoveries = [...(history.recoveries || [])].reverse();
    const sleeps     = [...(history.sleeps     || [])].reverse();

    const strainVals = cycles.map(c => c.score?.strain).filter(v => v != null);
    const avgHRVals  = cycles.map(c => c.score?.average_heart_rate).filter(v => v != null);
    const recovVals  = recoveries.map(r => r.score?.recovery_score).filter(v => v != null);
    const sleepVals  = sleeps.map(s => s.score?.sleep_performance_percentage).filter(v => v != null);

    const graphs = [
      renderSparkline(strainVals, '#fb923c', 'Strain',   ''),
      renderSparkline(avgHRVals,  '#f472b6', 'Avg HR',   ''),
      renderSparkline(recovVals,  '#4ade80', 'Recovery', '%'),
      renderSparkline(sleepVals,  '#34d399', 'Sleep',    '%'),
    ].filter(Boolean).join('');

    document.getElementById('whoop-graphs').innerHTML = graphs;
  }
}

// ── AI Workout Generation ─────────────────────────────────────
async function generateWorkout() {
  document.getElementById('generate-btn').style.display     = 'none';
  document.getElementById('generate-loading').style.display = 'flex';

  try {
    const log     = JSON.parse(localStorage.getItem('ff_log') || '{}');
    const history = Object.entries(log)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7)
      .map(([date, info]) => ({
        date,
        id:      typeof info === 'object' ? info.id      : info,
        name:    typeof info === 'object' ? info.name    : info,
        muscles: typeof info === 'object' ? (info.muscles || []) : [],
      }));

    const res = await fetch('/.netlify/functions/generate-workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recovery: _whoopData?.recovery ?? null, history }),
    });

    if (!res.ok) throw new Error('Generation failed');
    const workout = await res.json();
    if (workout.error) throw new Error(workout.error);

    localStorage.setItem('ff_today_workout', JSON.stringify({ date: today(), workout }));
    showTodayWorkout(workout);
  } catch (err) {
    document.getElementById('generate-btn').style.display     = 'block';
    document.getElementById('generate-loading').style.display = 'none';
    alert('Could not generate workout: ' + err.message);
  }
}

function showTodayWorkout(workout) {
  document.getElementById('generate-btn').style.display     = 'none';
  document.getElementById('generate-loading').style.display = 'none';

  const intColor = workout.intensity === 'full' ? '#4ade80'
                 : workout.intensity === 'light' ? '#f87171' : '#facc15';
  const intLabel = workout.intensity === 'full' ? 'Full intensity'
                 : workout.intensity === 'light' ? 'Light session' : 'Moderate';

  const card = document.getElementById('today-workout-card');
  card.style.display = 'block';
  card.innerHTML = `
    <div class="twc-header">
      <div>
        <div class="twc-name">${workout.name}</div>
        <div class="twc-focus">${workout.focus}</div>
      </div>
      <div class="twc-intensity" style="color:${intColor}">${intLabel}</div>
    </div>
    <div class="twc-exercises">
      ${workout.exercises.map(e => `<span class="twc-ex-tag">${e.name}</span>`).join('')}
    </div>
    <button class="twc-start-btn" onclick="startAIWorkout()">Start workout →</button>`;

  window._todayWorkout = workout;
}

function startAIWorkout() {
  const stored  = JSON.parse(localStorage.getItem('ff_today_workout') || 'null');
  const workout = window._todayWorkout || stored?.workout;
  if (!workout) return;
  _currentDay = { id: 'AI', name: workout.name, focus: workout.focus, exercises: workout.exercises };
  startWorkout();
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Handle OAuth callback (?code= in URL)
  const params = new URLSearchParams(window.location.search);
  const code   = params.get('code');
  if (code) {
    history.replaceState({}, '', '/');
    const res  = await fetch(`/.netlify/functions/whoop-callback?code=${code}`);
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('whoop_access_token', data.access_token);
      localStorage.setItem('whoop_refresh_token', data.refresh_token);
      localStorage.setItem('whoop_expires_at', Date.now() + data.expires_in * 1000);
    }
  }

  show('s-home');

  // Restore today's generated workout if it exists
  const storedWorkout = JSON.parse(localStorage.getItem('ff_today_workout') || 'null');
  if (storedWorkout?.date === today()) showTodayWorkout(storedWorkout.workout);

  if (localStorage.getItem('whoop_access_token')) whoopLoad();
});

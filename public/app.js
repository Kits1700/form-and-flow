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

  const svg = ExerciseSVGs[ex.svgFn] ? ExerciseSVGs[ex.svgFn]() : '';
  document.getElementById('wk-body').innerHTML = `
    <div class="wk-phase">${ex.phase}</div>
    <div class="wk-ex-name">${ex.name}</div>
    <div class="wk-ex-target">${ex.sets} sets × ${ex.reps}</div>
    <div class="wk-fig-large"><div class="wk-fig-bg">${svg}</div></div>
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

  const histKey = `${today()}_${day.id}`;
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
    show('s-day');
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
  logWorkout(_currentDay.id);

  const secs      = Math.floor((Date.now() - _startTime) / 1000);
  const mins      = Math.floor(secs / 60);
  const day       = _currentDay;
  const totalSets = day.exercises.reduce((a, e) => a + e.sets, 0);

  document.getElementById('done-stats').innerHTML = `
    <div class="done-stat">Duration: <strong>${mins} min</strong></div>
    <div class="done-stat">Exercises: <strong>${day.exercises.length}</strong></div>
    <div class="done-stat">Sets completed: <strong>${totalSets}</strong></div>
    <div class="done-stat">Session: <strong>${day.name} — ${day.focus}</strong></div>`;

  show('s-done');
}

// ── Calendar ──────────────────────────────────────────────────
let _calYear, _calMonth;
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function today() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
}

function logWorkout(dayId) {
  const log = JSON.parse(localStorage.getItem('ff_log') || '{}');
  log[today()] = dayId;
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
    const logged = log[ds];
    const cls    = ['cal-cell', ds === todayStr ? 'cal-today' : '', logged ? 'cal-logged' : ''].filter(Boolean).join(' ');
    html += `<div class="${cls}">
      <span class="cal-day-num">${d}</span>
      ${logged ? `<span class="cal-badge cal-badge--${logged}">${logged}</span>` : ''}
    </div>`;
  }
  document.getElementById('cal-grid').innerHTML = html;
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => show('s-home'));

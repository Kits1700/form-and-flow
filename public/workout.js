// ── Animation helpers (4-keyframe: start → peak → hold → start) ──
const KT = '0;.33;.67;1';
const KS = '.5 0 .5 1;0 0 0 0;.5 0 .5 1';

function av(attr, v1, v2, dur = '3s') {
  return `<animate attributeName="${attr}" values="${v1};${v2};${v2};${v1}" keyTimes="${KT}" calcMode="spline" keySplines="${KS}" dur="${dur}" repeatCount="indefinite"/>`;
}
function ap(v1, v2, dur = '3s') {
  return `<animate attributeName="points" values="${v1};${v2};${v2};${v1}" keyTimes="${KT}" calcMode="spline" keySplines="${KS}" dur="${dur}" repeatCount="indefinite"/>`;
}

const W  = `fill="none" stroke="rgba(255,255,255,0.86)" stroke-linecap="round" stroke-linejoin="round"`;
const H  = `fill="rgba(255,255,255,0.86)"`;
const J  = `fill="rgba(255,255,255,0.42)"`;
const DB = `fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.4)" stroke-width="0.6"`;
const GR = `stroke="rgba(255,255,255,0.07)" stroke-width="1"`;

// ── Goblet Squat / Sumo Squat ─────────────────────────────────────
function svgSquat() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} r="7">${av('cx','50','50')}${av('cy','10','30')}</circle>
  <line ${W} stroke-width="2.5">${av('x1','50','50')}${av('y1','17','37')}${av('x2','50','50')}${av('y2','57','73')}</line>
  <line ${W} stroke-width="2">${av('x1','30','32')}${av('y1','26','46')}${av('x2','70','68')}${av('y2','26','46')}</line>
  <polyline ${W} stroke-width="2">${ap('30,26 36,44 38,57','32,46 38,62 40,73')}</polyline>
  <polyline ${W} stroke-width="2">${ap('70,26 64,44 62,57','68,46 62,62 60,73')}</polyline>
  <circle ${J} r="2.5">${av('cx','36','38')}${av('cy','44','62')}</circle>
  <circle ${J} r="2.5">${av('cx','64','62')}${av('cy','44','62')}</circle>
  <rect rx="1.5" height="5" ${DB}>${av('x','38','39')}${av('y','55','71')}${av('width','24','22')}</rect>
  <polyline ${W} stroke-width="2.5">${ap('44,57 38,80 36,108','44,73 16,85 14,108')}</polyline>
  <polyline ${W} stroke-width="2.5">${ap('56,57 62,80 64,108','56,73 84,85 86,108')}</polyline>
  <circle ${J} r="3">${av('cx','38','16')}${av('cy','80','85')}</circle>
  <circle ${J} r="3">${av('cx','62','84')}${av('cy','80','85')}</circle>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Romanian Deadlift / Dumbbell Deadlift ─────────────────────────
function svgHinge() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} r="7">${av('cx','50','18')}${av('cy','10','36')}</circle>
  <line ${W} stroke-width="2.5">${av('x1','50','22')}${av('y1','17','42')}${av('x2','50','54')}${av('y2','58','64')}</line>
  <line ${W} stroke-width="2">${av('x1','30','14')}${av('y1','26','48')}${av('x2','70','38')}${av('y2','26','38')}</line>
  <polyline ${W} stroke-width="2">${ap('30,26 22,46 16,62','14,48 14,66 16,82')}</polyline>
  <polyline ${W} stroke-width="2">${ap('70,26 78,46 84,62','38,38 40,56 42,70')}</polyline>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','9','9')}${av('y','60','80')}</rect>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','78','36')}${av('y','60','68')}</rect>
  <polyline ${W} stroke-width="2.5">${ap('44,58 40,82 38,108','46,64 42,86 40,108')}</polyline>
  <polyline ${W} stroke-width="2.5">${ap('56,58 60,82 62,108','58,64 62,86 64,108')}</polyline>
  <circle ${J} r="3">${av('cx','40','42')}${av('cy','82','86')}</circle>
  <circle ${J} r="3">${av('cx','60','62')}${av('cy','82','86')}</circle>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Shoulder Press / Arnold Press ─────────────────────────────────
function svgPress() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="50" cy="12" r="7"/>
  <line ${W} stroke-width="2.5" x1="50" y1="19" x2="50" y2="62"/>
  <line ${W} stroke-width="2" x1="30" y1="29" x2="70" y2="29"/>
  <polyline ${W} stroke-width="2">${ap('30,29 18,45 18,29','30,29 26,15 24,3')}</polyline>
  <polyline ${W} stroke-width="2">${ap('70,29 82,45 82,29','70,29 74,15 76,3')}</polyline>
  <circle ${J} r="2.5">${av('cx','18','26')}${av('cy','45','15')}</circle>
  <circle ${J} r="2.5">${av('cx','82','74')}${av('cy','45','15')}</circle>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','11','17')}${av('y','27','1')}</rect>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','75','69')}${av('y','27','1')}</rect>
  <polyline ${W} stroke-width="2.5" points="44,62 38,84 36,108"/>
  <polyline ${W} stroke-width="2.5" points="56,62 62,84 64,108"/>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Bent-Over Row ─────────────────────────────────────────────────
function svgRow() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="22" cy="34" r="6.5"/>
  <line ${W} stroke-width="2.5" x1="28" y1="40" x2="60" y2="62"/>
  <line ${W} stroke-width="2" x1="16" y1="44" x2="38" y2="36"/>
  <polyline ${W} stroke-width="2" points="38,36 40,52 42,66"/>
  <polyline ${W} stroke-width="2">${ap('16,44 18,62 20,78','16,44 24,52 32,56')}</polyline>
  <circle ${J} r="2.5">${av('cx','18','24')}${av('cy','62','52')}</circle>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','13','25')}${av('y','76','54')}</rect>
  <rect rx="1.5" height="5" width="14" ${DB} x="35" y="64"/>
  <polyline ${W} stroke-width="2.5" points="52,62 46,84 44,108"/>
  <polyline ${W} stroke-width="2.5" points="62,62 68,84 70,108"/>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Floor Chest Press ─────────────────────────────────────────────
function svgFloorPress() {
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="12" cy="34" r="6"/>
  <line ${W} stroke-width="2.5" x1="18" y1="34" x2="78" y2="36"/>
  <line ${W} stroke-width="2" x1="26" y1="30" x2="46" y2="30"/>
  <polyline ${W} stroke-width="2">${ap('26,30 24,48 20,62','26,30 28,16 28,4')}</polyline>
  <polyline ${W} stroke-width="2">${ap('46,30 44,48 40,62','46,30 46,16 46,4')}</polyline>
  <circle ${J} r="2.5">${av('cx','24','28')}${av('cy','48','16')}</circle>
  <circle ${J} r="2.5">${av('cx','44','46')}${av('cy','48','16')}</circle>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','13','21')}${av('y','60','2')}</rect>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','33','39')}${av('y','60','2')}</rect>
  <polyline ${W} stroke-width="2" points="70,36 80,52 86,64"/>
  <polyline ${W} stroke-width="2" points="78,36 86,52 92,62"/>
  <line ${GR} fill="none" x1="4" y1="68" x2="116" y2="68"/>
</svg>`;
}

// ── Glute Bridge ──────────────────────────────────────────────────
function svgBridge() {
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="12" cy="40" r="6"/>
  <line ${W} stroke-width="2" x1="18" y1="40" x2="48" y2="42"/>
  <line ${W} stroke-width="2" x1="28" y1="36" x2="26" y2="52"/>
  <line ${W} stroke-width="2" x1="40" y1="38" x2="38" y2="54"/>
  <line ${W} stroke-width="2.5">${av('x1','48','48')}${av('y1','42','36')}${av('x2','72','62')}${av('y2','46','20')}</line>
  <line ${W} stroke-width="2.5">${av('x1','66','58')}${av('y1','46','22')}${av('x2','80','82')}${av('y2','60','60')}</line>
  <line ${W} stroke-width="2.5">${av('x1','74','64')}${av('y1','44','18')}${av('x2','88','90')}${av('y2','58','58')}</line>
  <line ${W} stroke-width="2" x1="80" y1="60" x2="76" y2="72"/>
  <line ${W} stroke-width="2" x1="88" y1="58" x2="86" y2="72"/>
  <rect rx="1.5" height="5" width="20" ${DB}>${av('x','54','44')}${av('y','42','18')}</rect>
  <line ${GR} fill="none" x1="4" y1="74" x2="116" y2="74"/>
</svg>`;
}

// ── Bicep Curl ────────────────────────────────────────────────────
function svgCurl() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="50" cy="11" r="7"/>
  <line ${W} stroke-width="2.5" x1="50" y1="18" x2="50" y2="60"/>
  <line ${W} stroke-width="2" x1="30" y1="28" x2="70" y2="28"/>
  <polyline ${W} stroke-width="2">${ap('30,28 22,50 18,66','30,28 26,42 30,32')}</polyline>
  <polyline ${W} stroke-width="2">${ap('70,28 78,50 82,66','70,28 74,42 70,32')}</polyline>
  <circle ${J} r="2.5">${av('cx','22','26')}${av('cy','50','42')}</circle>
  <circle ${J} r="2.5">${av('cx','78','74')}${av('cy','50','42')}</circle>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','11','23')}${av('y','64','30')}</rect>
  <rect rx="1.5" height="5" width="14" ${DB}>${av('x','75','63')}${av('y','64','30')}</rect>
  <polyline ${W} stroke-width="2.5" points="44,60 38,82 36,108"/>
  <polyline ${W} stroke-width="2.5" points="56,60 62,82 64,108"/>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Lateral Raise ─────────────────────────────────────────────────
function svgLateral() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="50" cy="11" r="7"/>
  <line ${W} stroke-width="2.5" x1="50" y1="18" x2="50" y2="60"/>
  <line ${W} stroke-width="2" x1="30" y1="28" x2="70" y2="28"/>
  <polyline ${W} stroke-width="2">${ap('30,28 22,50 16,66','30,28 14,28 4,28')}</polyline>
  <polyline ${W} stroke-width="2">${ap('70,28 78,50 84,66','70,28 86,28 96,28')}</polyline>
  <circle ${J} r="2.5">${av('cx','22','14')}${av('cy','50','28')}</circle>
  <circle ${J} r="2.5">${av('cx','78','86')}${av('cy','50','28')}</circle>
  <rect rx="1.5" height="5" width="12" ${DB}>${av('x','10','0')}${av('y','64','25')}</rect>
  <rect rx="1.5" height="5" width="12" ${DB}>${av('x','78','88')}${av('y','64','25')}</rect>
  <polyline ${W} stroke-width="2.5" points="44,60 38,82 36,108"/>
  <polyline ${W} stroke-width="2.5" points="56,60 62,82 64,108"/>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Reverse Lunge / Bulgarian Split Squat ─────────────────────────
function svgLunge() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} r="7">${av('cx','50','50')}${av('cy','11','13')}</circle>
  <line ${W} stroke-width="2.5">${av('x1','50','50')}${av('y1','18','20')}${av('x2','50','50')}${av('y2','58','64')}</line>
  <line ${W} stroke-width="2" x1="30" y1="28" x2="70" y2="28"/>
  <line ${W} stroke-width="2" x1="30" y1="28" x2="22" y2="54"/>
  <line ${W} stroke-width="2" x1="70" y1="28" x2="78" y2="54"/>
  <rect rx="1.5" height="5" width="12" ${DB} x="16" y="52"/>
  <rect rx="1.5" height="5" width="12" ${DB} x="72" y="52"/>
  <polyline ${W} stroke-width="2.5">${ap('45,58 40,80 40,108','45,64 42,80 42,108')}</polyline>
  <polyline ${W} stroke-width="2.5">${ap('55,58 60,80 62,108','55,64 72,84 72,108')}</polyline>
  <circle ${J} r="3">${av('cx','40','42')}${av('cy','80','80')}</circle>
  <circle ${J} r="3">${av('cx','60','72')}${av('cy','80','84')}</circle>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Plank / Renegade Row / Side Plank ─────────────────────────────
function svgPlank() {
  return `<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="12" cy="24" r="5.5"/>
  <line ${W} stroke-width="2.5" x1="18" y1="26" x2="92" y2="30"/>
  <line ${W} stroke-width="2" x1="22" y1="22" x2="34" y2="34"/>
  <line ${W} stroke-width="2" x1="22" y1="22" x2="18" y2="40"/>
  <line ${W} stroke-width="2" x1="18" y1="40" x2="18" y2="52"/>
  <line ${W} stroke-width="2" x1="36" y1="26" x2="40" y2="44"/>
  <line ${W} stroke-width="2" x1="40" y1="44" x2="40" y2="56"/>
  <line ${W} stroke-width="2" x1="82" y1="28" x2="76" y2="44"/>
  <line ${W} stroke-width="2" x1="90" y1="30" x2="88" y2="46"/>
  <line ${W} stroke-width="2" x1="76" y1="44" x2="72" y2="60"/>
  <line ${W} stroke-width="2" x1="88" y1="46" x2="90" y2="60"/>
  <animateTransform attributeName="transform" type="translate"
    values="0,0;0,-2;0,-2;0,0" keyTimes="${KT}" calcMode="spline"
    keySplines="${KS}" dur="4s" repeatCount="indefinite" additive="sum"/>
  <line ${GR} fill="none" x1="6" y1="62" x2="114" y2="62"/>
</svg>`;
}

// ── Tricep Kickback ───────────────────────────────────────────────
function svgKickback() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="22" cy="34" r="6.5"/>
  <line ${W} stroke-width="2.5" x1="28" y1="40" x2="62" y2="62"/>
  <line ${W} stroke-width="2" x1="16" y1="44" x2="38" y2="36"/>
  <polyline ${W} stroke-width="2" points="38,36 40,52 42,66"/>
  <line ${W} stroke-width="2" x1="16" y1="44" x2="34" y2="44"/>
  <line ${W} stroke-width="2">${av('x1','34','34')}${av('y1','44','44')}${av('x2','34','56')}${av('y2','62','44')}</line>
  <circle ${J} cx="34" cy="44" r="2.5"/>
  <rect rx="1.5" height="5" width="13" ${DB}>${av('x','27','50')}${av('y','60','41')}</rect>
  <polyline ${W} stroke-width="2.5" points="54,62 48,84 46,108"/>
  <polyline ${W} stroke-width="2.5" points="62,62 68,84 70,108"/>
  <line ${GR} fill="none" x1="8" y1="110" x2="92" y2="110"/>
</svg>`;
}

// ── Dead Bug ──────────────────────────────────────────────────────
function svgDeadbug() {
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} cx="12" cy="36" r="5.5"/>
  <line ${W} stroke-width="2.5" x1="18" y1="36" x2="76" y2="38"/>
  <line ${W} stroke-width="2">${av('x1','28','28')}${av('y1','32','32')}${av('x2','24','18')}${av('y2','16','10')}</line>
  <line ${W} stroke-width="2">${av('x1','46','46')}${av('y1','32','32')}${av('x2','52','58')}${av('y2','16','10')}</line>
  <polyline ${W} stroke-width="2">${ap('62,38 70,50 80,62','62,38 74,46 92,48')}</polyline>
  <polyline ${W} stroke-width="2">${ap('72,38 82,46 90,46','72,38 80,52 86,62')}</polyline>
  <line ${GR} fill="none" x1="4" y1="70" x2="116" y2="70"/>
</svg>`;
}

// ── Step Up ───────────────────────────────────────────────────────
function svgStepUp() {
  return `<svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
  <circle ${H} r="7">${av('cx','50','50')}${av('cy','11','8')}</circle>
  <line ${W} stroke-width="2.5">${av('x1','50','50')}${av('y1','18','15')}${av('x2','50','50')}${av('y2','58','54')}</line>
  <line ${W} stroke-width="2" x1="30" y1="28" x2="70" y2="28"/>
  <line ${W} stroke-width="2" x1="30" y1="28" x2="22" y2="54"/>
  <line ${W} stroke-width="2" x1="70" y1="28" x2="78" y2="54"/>
  <rect rx="1.5" height="5" width="12" ${DB} x="16" y="52"/>
  <rect rx="1.5" height="5" width="12" ${DB} x="72" y="52"/>
  <polyline ${W} stroke-width="2.5">${ap('44,58 38,78 36,96','44,54 40,70 40,84')}</polyline>
  <polyline ${W} stroke-width="2.5">${ap('56,58 62,78 64,108','56,54 64,72 66,92')}</polyline>
  <rect x="24" y="84" width="52" height="9" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <line ${GR} fill="none" x1="8" y1="96" x2="92" y2="96"/>
</svg>`;
}

const ExerciseSVGs = {
  squat: svgSquat, hinge: svgHinge, press: svgPress, row: svgRow,
  floorpress: svgFloorPress, bridge: svgBridge, curl: svgCurl,
  lateral: svgLateral, lunge: svgLunge, plank: svgPlank,
  kickback: svgKickback, deadbug: svgDeadbug, stepup: svgStepUp,
};

// ── Programme ─────────────────────────────────────────────────────
// Sai · 26F · 172cm · 63kg · Beginner/Intermediate · Dumbbells only
const WORKOUT = {
  days: [
    {
      id: 'A', name: 'Day A', focus: 'Lower body + Push',
      muscles: 'Glutes · Quads · Shoulders · Core',
      playlist: [
        { track: 'Aigiri Nandini', artist: 'Rock Version · Various Artists' },
        { track: 'Naatu Naatu', artist: 'MM Keeravani · RRR' },
        { track: 'Deva Shree Ganesha', artist: 'Ajay-Atul · Agneepath' },
        { track: 'Malhari', artist: 'Vishal-Shekhar · Bajirao Mastani' },
        { track: 'Zinda', artist: 'Siddharth Mahadevan · Bhaag Milkha Bhaag' },
        { track: 'Kandisa', artist: 'Indian Ocean' },
        { track: 'Jai Ho', artist: 'AR Rahman · Slumdog Millionaire' },
      ],
      exercises: [
        {
          name: 'Goblet Squat', sets: 3, reps: 12, rest: 90, phase: 'Compound',
          muscles: ['quads', 'glutes', 'core'],
          cue: 'Hold DB at chest. Keep chest tall, push knees out over toes, drive through heels.',
          science: 'Holding the weight at your chest automatically keeps you upright — it\'s almost impossible to slouch. Works your thighs and bum at the same time.',
          beginner: {
            mod: 'Chair-Assisted Squat',
            how: 'Place a chair behind you. Lower toward it and just lightly touch before standing. No weight or 2–3 kg. Focus on chest tall, knees out.'
          },
          intermediate: {
            mod: 'Pause Goblet Squat',
            how: 'Use 8–12 kg. Hold 2 full seconds at the bottom of every rep. Pausing keeps your muscles working the entire time instead of bouncing through the rep.'
          },
          svgFn: 'squat'
        },
        {
          name: 'Romanian Deadlift', sets: 3, reps: 10, rest: 120, phase: 'Compound',
          muscles: ['hamstrings', 'glutes', 'lower back'],
          cue: 'Soft knee, push hips BACK (not down). Feel the stretch in hamstrings. Back flat throughout.',
          science: 'The best dumbbell exercise for the back of your thighs. The slow lowering phase also protects your hamstrings from getting injured.',
          beginner: {
            mod: 'Short-Range RDL',
            how: 'Lower DBs only to mid-shin. Stop when you feel your lower back start to round. Use 3–5 kg. Increase range as hamstring flexibility improves.'
          },
          intermediate: {
            mod: 'Single-Leg RDL',
            how: 'Stand on one leg, hold one DB, hinge forward with the free leg lifting behind you. Much harder balance challenge and hits the glute more than the two-legged version.'
          },
          svgFn: 'hinge'
        },
        {
          name: 'Dumbbell Shoulder Press', sets: 3, reps: 10, rest: 90, phase: 'Compound',
          muscles: ['shoulders', 'triceps', 'upper chest'],
          cue: 'Start at ear level, elbows at 45°. Press straight up. Don\'t flare elbows forward.',
          science: 'Pressing overhead builds your shoulders faster than any single shoulder exercise because it uses more of the shoulder at once.',
          beginner: {
            mod: 'Seated DB Shoulder Press',
            how: 'Sit on a chair with back support. Removes balance demand so you can focus entirely on elbow path and pressing mechanics.'
          },
          intermediate: {
            mod: 'Arnold Press',
            how: 'Start palms facing you at chin level, rotate and press overhead. Reverse on the way down. Hits all three parts of the shoulder instead of just one.'
          },
          svgFn: 'press'
        },
        {
          name: 'Bent-Over Row', sets: 3, reps: 12, rest: 90, phase: 'Compound',
          muscles: ['back', 'biceps', 'rear delts'],
          cue: 'Hinge to 45°, lead with your elbow — pull it toward your hip, not your shoulder.',
          science: 'For every time you press, you need an equal amount of pulling — otherwise your shoulder gradually gets imbalanced and starts hurting. This is the fix.',
          beginner: {
            mod: 'Supported Incline Row',
            how: 'Rest your chest on a pillow placed on a high chair. Row from this supported position — no balance needed, pure back activation.'
          },
          intermediate: {
            mod: 'Slow Eccentric Row',
            how: 'Pull up in 1 second, lower over 4 seconds. The slow lowering is actually where most of the muscle-building happens — don\'t rush it.'
          },
          svgFn: 'row'
        },
        {
          name: 'Reverse Lunge', sets: 2, reps: '10 each side', rest: 75, phase: 'Accessory',
          muscles: ['quads', 'glutes', 'balance'],
          cue: 'Step back, lower back knee toward floor. Torso upright — no forward lean.',
          science: 'Easier on your lower back than a regular squat. Also works each leg separately so your stronger leg can\'t secretly do the work for the weaker one.',
          beginner: {
            mod: 'Bodyweight Reverse Lunge',
            how: 'No DBs, hands on hips. Step back and lower. Focus on keeping your torso completely upright and front knee over foot.'
          },
          intermediate: {
            mod: 'Deficit Reverse Lunge',
            how: 'Stand on a low step (5–10 cm). Step back down to the floor. The extra depth makes your bum and thighs work noticeably harder.'
          },
          svgFn: 'lunge'
        },
        {
          name: 'Lateral Raise', sets: 3, reps: 12, rest: 75, phase: 'Accessory',
          muscles: ['lateral delts', 'upper traps'],
          cue: 'Slight forward lean, lead with elbows, raise to shoulder height. Don\'t shrug.',
          science: 'The only exercise that directly targets the side of your shoulder — nothing else substitutes for it. This is what creates shoulder width.',
          beginner: {
            mod: 'Seated Lateral Raise',
            how: 'Sit for stability. Use 1–2 kg. The lateral deltoid is a small muscle — ego load will make you compensate with your traps. Light and controlled wins.'
          },
          intermediate: {
            mod: '3/7 Lateral Raise',
            how: 'Do 3 reps with a 2-second hold at the top, then 7 reps without stopping. That mix of holding and moving makes the shoulder work far harder than normal reps.'
          },
          svgFn: 'lateral'
        },
        {
          name: 'Plank Hold', sets: 3, reps: '30 sec', rest: 60, phase: 'Core',
          muscles: ['core', 'glutes', 'shoulders'],
          cue: 'Squeeze glutes AND core at the same time. Neutral spine — don\'t let hips sag or pike.',
          science: 'Better for back health than crunches. It trains your core to hold everything in place while the rest of your body moves — which is what your core actually needs to do in real life.',
          beginner: {
            mod: 'Knee Plank',
            how: 'Same perfect form but bottom knee on the floor. Keep the same hard glute and core squeeze — don\'t get lazy because it\'s easier.'
          },
          intermediate: {
            mod: 'Plank + Shoulder Tap',
            how: 'From full plank, lift one hand and tap the opposite shoulder. Alternate sides. The goal is to keep your hips completely still — your core has to fight to stop you twisting.'
          },
          svgFn: 'plank'
        }
      ]
    },
    {
      id: 'B', name: 'Day B', focus: 'Lower body + Pull',
      muscles: 'Hamstrings · Back · Chest · Arms',
      playlist: [
        { track: 'Shiv Tandav Stotram', artist: 'Rock Version · Various Artists' },
        { track: 'Khalibali', artist: 'Shivam Pathak · Padmaavat' },
        { track: 'Jai Jai Shiv Shankar', artist: 'Vishal-Shekhar · War' },
        { track: 'Ghungroo', artist: 'Arijit Singh · War' },
        { track: 'Bandeh', artist: 'Indian Ocean · Black Friday' },
        { track: 'Bulleya', artist: 'Papon · Sultan' },
        { track: 'Rocky Bhai Theme', artist: 'Ravi Basrur · KGF Chapter 2' },
      ],
      exercises: [
        {
          name: 'Sumo Squat', sets: 3, reps: 12, rest: 90, phase: 'Compound',
          muscles: ['inner thighs', 'glutes', 'quads'],
          cue: 'Wide stance, toes out 45°. Sink straight down, knees track over toes.',
          science: 'The wide stance reaches parts of your inner thighs and outer glutes that a regular squat doesn\'t get to.',
          beginner: {
            mod: 'Bodyweight Sumo Squat',
            how: 'No DB, hands on hips. Master the wide-stance position and depth before adding weight. Focus on getting comfortable with the wide stance.'
          },
          intermediate: {
            mod: 'Sumo Pause Squat',
            how: 'Use 10–14 kg DB. Hold 2 seconds at the bottom of every rep. Wide stance + pause maximally recruits glutes and inner thighs.'
          },
          svgFn: 'squat'
        },
        {
          name: 'Dumbbell Deadlift', sets: 3, reps: 8, rest: 120, phase: 'Compound',
          muscles: ['glutes', 'hamstrings', 'back', 'quads'],
          cue: 'DBs at sides. Push the floor away, brace core hard, squeeze glutes at the top.',
          science: 'Burns more calories than any other dumbbell exercise because almost every muscle in your body has to work at once.',
          beginner: {
            mod: 'Light Romanian Deadlift',
            how: 'Use 3–5 kg. Focus on the hip hinge pattern — pushing hips back and feeling the hamstring stretch. Don\'t worry about going heavy yet.'
          },
          intermediate: {
            mod: 'Pause at Mid-Shin',
            how: 'Lower the DBs and pause 2 seconds at mid-shin before completing the lift. Eliminates momentum and doubles time under tension.'
          },
          svgFn: 'hinge'
        },
        {
          name: 'Floor Chest Press', sets: 3, reps: 12, rest: 90, phase: 'Compound',
          muscles: ['chest', 'triceps', 'front delts'],
          cue: 'Lie on floor, elbows at 45°. Press up and squeeze chest at the top.',
          science: 'The floor stops your arms going too far down, which is where most chest exercises cause shoulder pain. Full chest workout — zero shoulder risk.',
          beginner: {
            mod: 'DB Chest Flye',
            how: 'Same floor position. Arms start above chest, open wide like hugging a tree, lower until elbows touch floor. Feel the pec stretch. Use 3–5 kg.'
          },
          intermediate: {
            mod: 'Close-Grip Floor Press',
            how: 'Palms facing each other, keep elbows close to body. Shifts load from chest to triceps for more arm development alongside chest work.'
          },
          svgFn: 'floorpress'
        },
        {
          name: 'Single Arm Row', sets: 3, reps: '10 each side', rest: 90, phase: 'Compound',
          muscles: ['lats', 'rhomboids', 'biceps'],
          cue: 'Support on chair. Pull DB to hip — elbow skims your side. Don\'t rotate your torso.',
          science: 'When you use one arm at a time, your stronger side can\'t secretly do the work for the weaker one. Both sides are forced to pull equally.',
          beginner: {
            mod: 'Two-Arm Bent-Over Row',
            how: 'Hinge 45° and row both DBs simultaneously. Easier to balance. Build pulling confidence before going single-arm.'
          },
          intermediate: {
            mod: 'Chest-Supported Row',
            how: 'Lie face-down on a chair inclined at 45°. Row both DBs. The support means your back doesn\'t have to hold you up — all the effort goes straight to your back muscles.'
          },
          svgFn: 'row'
        },
        {
          name: 'Glute Bridge', sets: 3, reps: 15, rest: 75, phase: 'Accessory',
          muscles: ['glutes', 'hamstrings', 'core'],
          cue: 'DB on hips. Drive hips up explosively, squeeze glutes HARD at top for 1 second.',
          science: 'Study after study shows this is the single most effective exercise for your glutes. Nothing activates them more.',
          beginner: {
            mod: 'Bodyweight Glute Bridge',
            how: 'No DB, just bodyweight. Focus on squeezing glutes maximally at the top. Most beginners have weak glutes — first learn to activate them fully.'
          },
          intermediate: {
            mod: 'Single-Leg Glute Bridge',
            how: 'One leg at a time, with the other leg bent and raised. Each glute has to work twice as hard, and you\'ll feel your hip working to keep you stable.'
          },
          svgFn: 'bridge'
        },
        {
          name: 'Bicep Curl', sets: 3, reps: 12, rest: 75, phase: 'Accessory',
          muscles: ['biceps', 'brachialis', 'forearms'],
          cue: 'Elbows stay fixed at your sides. Curl up, lower SLOWLY — 3 seconds on the way down.',
          science: 'Curling with palms facing up (not inward) activates about 30% more of the bicep muscle — that\'s why this specific hand position matters.',
          beginner: {
            mod: 'Hammer Curl',
            how: 'Palms facing each other throughout. Easier on your wrists. Targets a different part of the bicep area that adds thickness and makes your arm look bigger from the front.'
          },
          intermediate: {
            mod: 'Incline Curl',
            how: 'Sit leaned back at 45°, arms hanging behind you. Starting from a fully stretched position is one of the most effective ways to build the bicep.'
          },
          svgFn: 'curl'
        },
        {
          name: 'Dead Bug', sets: 3, reps: '6 each side', rest: 60, phase: 'Core',
          muscles: ['deep core', 'hip flexors', 'stability'],
          cue: 'Lower back PRESSED to floor at all times. Extend opposite arm + leg slowly. No rushing.',
          science: 'Trains the deep muscles that hold your spine in place, without putting any bending stress on your back. Safe and extremely effective.',
          beginner: {
            mod: 'Dead Bug — Arms Only',
            how: 'Keep both knees bent at 90° and stationary. Only extend opposite arms overhead. Master this before adding leg extensions.'
          },
          intermediate: {
            mod: 'Dead Bug with DB',
            how: 'Hold a 1–2 kg DB in both hands overhead as you extend. A tiny bit of weight here makes your core work significantly harder to stay steady.'
          },
          svgFn: 'deadbug'
        }
      ]
    },
    {
      id: 'C', name: 'Day C', focus: 'Full body + Core',
      muscles: 'Full body · Core · Balance · Stability',
      playlist: [
        { track: 'Om Namah Shivaya', artist: 'Rock Fusion · Various Artists' },
        { track: 'Varaha Roopam', artist: 'Kaala Bhairava · Brahmāstra' },
        { track: 'Srivalli', artist: 'DSP · Pushpa' },
        { track: 'Kesariya', artist: 'Pritam · Brahmāstra' },
        { track: 'Chaleya', artist: 'Anirudh Ravichander · Jawan' },
        { track: 'Saami Saami', artist: 'DSP · Pushpa' },
        { track: 'Naatu Naatu', artist: 'MM Keeravani · RRR' },
      ],
      exercises: [
        {
          name: 'Bulgarian Split Squat', sets: 3, reps: '8 each side', rest: 120, phase: 'Compound',
          muscles: ['quads', 'glutes', 'hamstrings', 'balance'],
          cue: 'Rear foot on chair, front foot far forward. Drop straight down — back knee to floor.',
          science: 'Works your thighs and bum almost as hard as a full barbell squat — but with far less strain on your lower back.',
          beginner: {
            mod: 'Split Squat (No Elevation)',
            how: 'Both feet on the floor. Step one foot forward and lower your back knee toward the floor. Master the lunge position before elevating the rear foot.'
          },
          intermediate: {
            mod: 'Pause Bulgarian Split Squat',
            how: 'Hold 2 seconds at the bottom of every rep. Use heavier DBs. Pausing means you can\'t bounce out of the bottom — your muscles have to do all the work to push back up.'
          },
          svgFn: 'lunge'
        },
        {
          name: 'Romanian Deadlift', sets: 3, reps: 10, rest: 120, phase: 'Compound',
          muscles: ['hamstrings', 'glutes', 'lower back'],
          cue: 'Same as Day A. Try 1–2 kg more than last week — this is progressive overload.',
          science: 'Training the back of your thighs twice a week builds them about 40% faster than once a week — that\'s exactly why it appears in two of the three days.',
          beginner: {
            mod: 'Short-Range RDL',
            how: 'Same as Day A. As your flexibility improves over weeks, gradually let the weights go a little lower each session.'
          },
          intermediate: {
            mod: 'Single-Leg RDL',
            how: 'One leg at a time. Much harder on your glutes and balance than doing both legs together.'
          },
          svgFn: 'hinge'
        },
        {
          name: 'Arnold Press', sets: 3, reps: 10, rest: 90, phase: 'Compound',
          muscles: ['all 3 deltoid heads', 'triceps'],
          cue: 'Start palms facing you at chin, rotate and press overhead. Reverse on the way down.',
          science: 'The rotating movement hits all three parts of your shoulder at once. A regular press only hits two. More muscle worked per rep.',
          beginner: {
            mod: 'Seated Shoulder Press',
            how: 'Sit on a chair, press straight up without the rotation. Master overhead pressing mechanics first before adding the rotation.'
          },
          intermediate: {
            mod: 'Slow-Tempo Arnold Press',
            how: '2 seconds pressing up, 3 seconds lowering. Going slowly means your shoulders do all the work instead of momentum carrying the weight.'
          },
          svgFn: 'press'
        },
        {
          name: 'Renegade Row', sets: 3, reps: '6 each side', rest: 90, phase: 'Compound',
          muscles: ['back', 'core', 'shoulders', 'triceps'],
          cue: 'Plank on DBs, row one to hip. Keep hips DEAD square — zero rotation allowed.',
          science: 'You\'re holding a plank and rowing at the same time. Your whole body fights to stop you tipping sideways — that\'s what makes it so effective.',
          beginner: {
            mod: 'DB Plank Hold',
            how: 'Skip the row. Simply hold a plank with hands on DBs. This alone is very challenging and builds the stability needed before adding the row.'
          },
          intermediate: {
            mod: 'Renegade Row + Push-Up',
            how: 'Row left, row right, then one push-up. Repeat. You\'re working almost every upper body muscle in one go.'
          },
          svgFn: 'plank'
        },
        {
          name: 'Step-Up', sets: 2, reps: '12 each side', rest: 75, phase: 'Accessory',
          muscles: ['quads', 'glutes', 'balance'],
          cue: 'Step onto a solid chair/step. Drive through heel, stand fully tall before stepping down.',
          science: 'Standing fully upright at the top of each rep is the exact moment your glutes fire hardest. Most people rush past it. Don\'t.',
          beginner: {
            mod: 'Low Step-Up',
            how: 'Use a very low platform (thick book, 10 cm step). No DBs. Focus on driving through the heel and standing completely tall at the top.'
          },
          intermediate: {
            mod: 'Slow Eccentric Step-Up',
            how: 'Step up normally, then lower back down on ONE leg over 3–4 seconds. Really effective for building glute strength and protecting your knees long-term.'
          },
          svgFn: 'stepup'
        },
        {
          name: 'Tricep Kickback', sets: 3, reps: '12 each side', rest: 75, phase: 'Accessory',
          muscles: ['triceps', 'rear delts'],
          cue: 'Hinge forward. Upper arm stays parallel to floor. Extend fully — hold 1 second at top.',
          science: 'Your triceps make up about 60% of your upper arm — so if you want bigger arms, this matters more than bicep curls. The squeeze at full straightening is where it works hardest.',
          beginner: {
            mod: 'Lying Tricep Extension',
            how: 'Lie on your back. Hold DBs above your chest with straight arms. Lower by bending ONLY at the elbows until DBs reach your ears. Press back up. Much easier to control form.'
          },
          intermediate: {
            mod: 'Slow Eccentric Kickback',
            how: 'Extend in 1 second, lower over 4 seconds. The slow lowering phase keeps the tricep under maximum tension — that\'s where most growth comes from.'
          },
          svgFn: 'kickback'
        },
        {
          name: 'Side Plank', sets: 3, reps: '20 sec each side', rest: 60, phase: 'Core',
          muscles: ['obliques', 'lateral core', 'glute med'],
          cue: 'Stack feet or stagger. Lift hips — straight line from head to feet. Breathe steadily.',
          science: 'One of the most protective exercises for long-term back health. Trains the muscles on the side of your core that almost everyone ignores.',
          beginner: {
            mod: 'Knee Side Plank',
            how: 'Bottom knee stays on the floor. Lift hips off the floor and maintain a straight torso. Still effectively trains obliques at a manageable level.'
          },
          intermediate: {
            mod: 'Side Plank + Hip Dip',
            how: 'From side plank, lower your hip toward the floor and raise it back up. 10 dips per side per set. Adds dynamic lateral core loading.'
          },
          svgFn: 'plank'
        }
      ]
    }
  ]
};

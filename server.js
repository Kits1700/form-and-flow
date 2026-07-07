// Read config.env (named to avoid dotenvx shell hook interception)
try {
  const fs = require('fs'), p = require('path').join(__dirname, '.config.env');
  fs.readFileSync(p, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
} catch (_) {}
const express   = require('express');
const Anthropic  = require('@anthropic-ai/sdk');
const path      = require('path');

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function claude(prompt, maxTokens, temperature = 0.7) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    temperature,
    system: 'You are a JSON API. Respond with only a valid JSON object, no markdown, no explanation.',
    messages: [{ role: 'user', content: prompt }],
  });
  const text = msg.content[0].text.trim();
  console.log('stop_reason:', msg.stop_reason, '| length:', text.length);
  if (msg.stop_reason !== 'end_turn') throw new Error('Response was cut off — please try again');
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s === -1 || e === -1) throw new Error('No JSON found in response');
  return JSON.parse(text.slice(s, e + 1));
}

// ── Adapted daily workout ──────────────────────────────────────
app.post('/api/workout', async (req, res) => {
  try {
    const { profile, checkin } = req.body;
    const avoid = checkin.avoid?.length ? `Avoid: ${checkin.avoid.join(', ')}.` : '';
    const prompt = `Generate an adapted dumbbell-only workout for:
Profile: ${profile.sex}, ${profile.age}yo, ${profile.height}cm, ${profile.weight}kg, goal=${profile.goal}, exp=${profile.exp}
Today: energy=${checkin.energy}/10, stress=${checkin.stress}/10, soreness=${checkin.sore}/10. ${avoid}
Reduce volume/intensity if energy<5 or soreness>6. Use lighter loads and more mobility if stress>7.

Return JSON only (all string values max 12 words):
{"title":"string","coach_note":"string max 20 words","exercises":[{"phase":"Warmup|Main|Cooldown","name":"string","sets":"string","why":"string max 10 words","beginner":"string max 8 words","advanced":"string max 8 words"}]}

Include 7-9 exercises. Dumbbells and bodyweight only. No gym machines.`;

    const data = await claude(prompt, 1800);
    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.json({ ok: false, error: err.message });
  }
});

// ── 3-Day PPL plan ────────────────────────────────────────────
app.post('/api/plan', async (req, res) => {
  try {
    const { profile } = req.body;
    const prompt = `Generate a 3-day Push/Pull/Legs dumbbell-only programme for:
Profile: ${profile.sex}, ${profile.age}yo, ${profile.height}cm, ${profile.weight}kg, goal=${profile.goal}, exp=${profile.exp}

Return JSON with this exact shape (all string values max 12 words):
{"title":"string","days":[{"name":"Day 1 — Push","ordering_rationale":"string max 20 words","exercises":[{"phase":"Warmup|Compound|Accessory|Cooldown","name":"string","sets":"string","why":"string max 10 words","beginner":"string max 8 words","advanced":"string max 8 words"}]}]}

3 days total (Push, Pull, Legs). Each day 7-8 exercises. Dumbbells and bodyweight only.`;

    const data = await claude(prompt, 4000);
    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.json({ ok: false, error: err.message });
  }
});

// ── Local proxy for Netlify generate-workout function ─────────
app.post('/.netlify/functions/generate-workout', async (req, res) => {
  try {
    const { recovery, sleep, cycle, history, avoid, timeMinutes, intensityOverride, typeOverride } = req.body || {};
    const VALID_TYPES = ['Upper Push', 'Upper Pull', 'Lower Body', 'Full Body', 'Core & Mobility'];
    const forcedType = VALID_TYPES.includes(typeOverride) ? typeOverride : null;
    const recoveryScore = recovery?.score?.recovery_score != null
      ? Math.round(recovery.score.recovery_score) : null;
    const hrv = recovery?.score?.hrv_rmssd_milli != null
      ? Math.round(recovery.score.hrv_rmssd_milli) : null;
    const rhr = recovery?.score?.resting_heart_rate != null
      ? Math.round(recovery.score.resting_heart_rate) : null;
    const sleepPct = sleep?.score?.sleep_performance_percentage != null
      ? Math.round(sleep.score.sleep_performance_percentage) : null;
    const strain = cycle?.score?.strain != null
      ? cycle.score.strain.toFixed(1) : null;
    const autoIntensity = recoveryScore === null ? 'moderate'
      : recoveryScore >= 67 ? 'full'
      : recoveryScore >= 34 ? 'moderate'
      : 'light';
    const intensity = ['light', 'moderate', 'full'].includes(intensityOverride)
      ? intensityOverride
      : autoIntensity;
    const minutes = [15, 30, 45, 60].includes(timeMinutes) ? timeMinutes : 30;
    const exerciseRange = minutes <= 15 ? '2-3'
      : minutes <= 30 ? '3-4'
      : minutes <= 45 ? '5-6'
      : '6-8';
    const historyStr = Array.isArray(history) && history.length
      ? history.slice(0, 7).map(h => `${h.date}: ${h.name || h.id}${h.muscles?.length ? ` — muscles: ${h.muscles.join(', ')}` : ''}`).join('\n')
      : 'No recent history';
    const avoidStr = Array.isArray(avoid) && avoid.length
      ? avoid.map((a, i) => `${i === 0 ? 'MOST RECENT' : `#${i + 1}`}: ${a.type || 'Unknown'} — ${(a.exercises || []).join(', ')}`).join('\n')
      : null;

    const prompt = `You are a personal trainer designing a dumbbell home workout.

USER PROFILE:
- 26F, 172cm, 63kg
- Goal: fat loss + muscle gain
- Equipment: two dumbbells at home (any weight)
- Level: beginner/intermediate
- Health: myasthenia gravis in remission — rest MUST be 90-120s minimum, never train to failure

TODAY'S WHOOP DATA:
${recoveryScore !== null
  ? `- Recovery: ${recoveryScore}%\n- HRV: ${hrv}ms\n- RHR: ${rhr}bpm`
  : '- Recovery data unavailable'}
${sleepPct !== null ? `- Sleep performance: ${sleepPct}% (if below 70%, favour lower volume and more rest even at higher recovery)` : ''}
${strain !== null ? `- Today's strain so far: ${strain}/21 (if already above 10, the user has exerted a lot today — keep this session lighter)` : ''}

USER'S REQUEST FOR TODAY:
- Time available: ${minutes} minutes → aim for ${exerciseRange} exercises total (including warm-up if any)
- Intensity: ${intensityOverride ? `${intensity} — the user explicitly chose this, override the Whoop-based recommendation` : `${intensity} (auto-selected from recovery — Whoop recovery was ${recoveryScore ?? 'unavailable'}%)`}
${forcedType ? `- Split: ${forcedType} — the user explicitly picked this type for today, do not choose a different one` : ''}
- Rest between sets MUST stay 90-120s minimum regardless of time pressure (MG safety) — cut exercise count, not rest time, to fit the time budget

RECENT WORKOUT HISTORY (completed sessions, last 7):
${historyStr}
${avoidStr ? `
SESSIONS ALREADY OFFERED — you MUST NOT repeat these:
${avoidStr}

HARD VARIETY RULES (a good trainer never gives the same session twice):
${forcedType ? `- The type is fixed to "${forcedType}" (see below), so vary this from "MOST RECENT" by exercise selection instead` : `- Pick a DIFFERENT "type" than "MOST RECENT" above`}
- At most ONE exercise may overlap with "MOST RECENT"; ideally zero
- Vary exercise selection, order, rep ranges and tempo from all sessions listed
- If the user trained a muscle group in the last 48h (see history), prioritise the opposite groups today` : ''}

SESSION TYPE SELECTION:
${forcedType
  ? `- The user explicitly requested "${forcedType}" for today — use this type exactly, do not substitute another type even if recovery/history would normally suggest otherwise. Still act like a professional trainer: pick the best exercises, volume and load for this type given today's recovery and intensity.`
  : `Act like a professional trainer programming a weekly split.
Available types: "Upper Push", "Upper Pull", "Lower Body", "Full Body", "Core & Mobility"
- Rotate intelligently: if legs were trained recently, do upper or core today; alternate push/pull
- light intensity → prefer "Core & Mobility" or light "Lower Body"
- moderate intensity → "Upper Push", "Upper Pull", or "Lower Body"
- full intensity → any type, favour what hasn't been done recently
- Only default to "Full Body" when there is no recent history AND nothing to avoid`}

VOLUME:
- Exercise count is driven by TIME AVAILABLE above (${exerciseRange} exercises) — this takes priority
- Within that count, intensity shapes load and exercise choice:
  light = bodyweight or very light loads, mobility-friendly
  moderate = standard compound + accessory mix
  full = compound-first, heavier loads

RULES:
- All exercises: dumbbells or bodyweight only
- science: one plain-English sentence explaining WHY it works for fat loss/muscle
- cue: one sentence with the single most important form tip
- svgFn: pick the closest match — squat, hinge, press, row, floorpress, bridge, curl, lateral, lunge, plank, kickback, deadbug, stepup
- "type" field must be exactly one of: Upper Push, Upper Pull, Lower Body, Full Body, Core & Mobility

Return ONLY valid JSON, no markdown:
{"name":"Short session name","type":"Upper Push","focus":"Main muscles","intensity":"${intensity}","exercises":[{"name":"Exercise name","sets":3,"reps":"10-12","rest":90,"muscles":["Primary","Secondary"],"cue":"Key form tip","science":"Plain English why","svgFn":"squat"}]}`;

    const data = await claude(prompt, 2048, 1);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Running → http://localhost:3000');
});

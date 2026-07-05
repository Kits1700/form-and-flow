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

async function claude(prompt, maxTokens) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
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

app.listen(3000, () => {
  console.log('Running → http://localhost:3000');
});

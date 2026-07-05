const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

    const { recovery, history } = JSON.parse(event.body || '{}');

    const recoveryScore = recovery?.score?.recovery_score != null
      ? Math.round(recovery.score.recovery_score) : null;
    const hrv = recovery?.score?.hrv_rmssd_milli != null
      ? Math.round(recovery.score.hrv_rmssd_milli) : null;
    const rhr = recovery?.score?.resting_heart_rate != null
      ? Math.round(recovery.score.resting_heart_rate) : null;

    const intensity = recoveryScore === null ? 'moderate'
      : recoveryScore >= 67 ? 'full'
      : recoveryScore >= 34 ? 'moderate'
      : 'light';

    const historyStr = Array.isArray(history) && history.length
      ? history.slice(0, 7).map(h =>
          `${h.date}: ${h.name || h.id}${h.muscles?.length ? ` — muscles: ${h.muscles.join(', ')}` : ''}`
        ).join('\n')
      : 'No recent history';

    const prompt = `You are a personal trainer designing a dumbbell home workout.

USER PROFILE:
- 26F, 172cm, 63kg
- Goal: fat loss + muscle gain
- Equipment: two dumbbells at home (any weight)
- Level: beginner/intermediate
- Health: myasthenia gravis in remission — rest MUST be 90-120s minimum, never train to failure

TODAY'S WHOOP RECOVERY:
${recoveryScore !== null
  ? `- Recovery: ${recoveryScore}% → ${intensity} intensity session\n- HRV: ${hrv}ms\n- RHR: ${rhr}bpm`
  : '- Recovery data unavailable → moderate intensity'}

RECENT WORKOUT HISTORY (avoid same muscles within 48h):
${historyStr}

RULES:
- light = 3-4 exercises, bodyweight or very light, mobility + core focus
- moderate = 5-6 exercises, standard compound + accessory mix
- full = 6-7 exercises, compound-first, heavier loads
- All exercises: dumbbells or bodyweight only
- science: one plain-English sentence (no jargon) explaining WHY it works for fat loss/muscle
- cue: one sentence with the single most important form tip

Return ONLY valid JSON, no markdown, no explanation:
{
  "name": "Short session name",
  "focus": "Main muscles",
  "intensity": "${intensity}",
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": "10-12",
      "rest": 90,
      "muscles": ["Primary", "Secondary"],
      "cue": "Key form tip",
      "science": "Plain English why"
    }
  ]
}`;

    const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Claude did not return JSON');
    const workout = JSON.parse(match[0]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

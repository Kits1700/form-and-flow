const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

    const { recovery, sleep, cycle, history } = JSON.parse(event.body || '{}');

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

TODAY'S WHOOP DATA:
${recoveryScore !== null
  ? `- Recovery: ${recoveryScore}% → ${intensity} intensity session\n- HRV: ${hrv}ms\n- RHR: ${rhr}bpm`
  : '- Recovery data unavailable → moderate intensity'}
${sleepPct !== null ? `- Sleep performance: ${sleepPct}% (if below 70%, favour lower volume and more rest even at higher recovery)` : ''}
${strain !== null ? `- Today's strain so far: ${strain}/21 (if already above 10, the user has exerted a lot today — keep this session lighter)` : ''}

RECENT WORKOUT HISTORY (last 7 sessions):
${historyStr}

SESSION TYPE SELECTION — choose the best type given recovery + history:
Available types: "Upper Push", "Upper Pull", "Lower Body", "Full Body", "Core & Mobility"
- Avoid repeating the same type or overlapping muscle groups within 48h
- light intensity → prefer "Core & Mobility" or light "Lower Body"
- moderate intensity → "Upper Push", "Upper Pull", or "Lower Body"
- full intensity → any type, favour what hasn't been done recently
- If history is empty or varied, default to "Full Body"

VOLUME BY INTENSITY:
- light = 3-4 exercises, bodyweight or very light loads
- moderate = 5-6 exercises, standard compound + accessory mix
- full = 6-7 exercises, compound-first, heavier loads

RULES:
- All exercises: dumbbells or bodyweight only
- science: one plain-English sentence explaining WHY it works for fat loss/muscle
- cue: one sentence with the single most important form tip
- svgFn: pick the closest match — squat, hinge, press, row, floorpress, bridge, curl, lateral, lunge, plank, kickback, deadbug, stepup
- "type" field must be exactly one of: Upper Push, Upper Pull, Lower Body, Full Body, Core & Mobility

Return ONLY valid JSON, no markdown, no explanation:
{
  "name": "Short session name",
  "type": "Upper Push",
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
      "science": "Plain English why",
      "svgFn": "squat"
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

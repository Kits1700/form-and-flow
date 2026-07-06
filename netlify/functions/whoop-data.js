const safeJson = async (res) => {
  const text = await res.text();
  try { return { data: JSON.parse(text), raw: text.slice(0, 500) }; }
  catch { return { data: null, raw: text.slice(0, 500) }; }
};

exports.handler = async (event) => {
  try {
    const token = (event.headers.authorization || '').replace('Bearer ', '');
    if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'No token' }) };

    const headers = { Authorization: `Bearer ${token}` };

    const [recoveryRes, cycleRes, sleepRes, workoutRes] = await Promise.all([
      fetch('https://api.prod.whoop.com/developer/v2/recovery?limit=7', { headers }),
      fetch('https://api.prod.whoop.com/developer/v2/cycle?limit=7', { headers }),
      fetch('https://api.prod.whoop.com/developer/v2/activity/sleep?limit=7', { headers }),
      fetch('https://api.prod.whoop.com/developer/v2/activity/workout?limit=7', { headers }),
    ]);

    const [recoveryResult, cycleResult, sleepResult, workoutResult] = await Promise.all([
      safeJson(recoveryRes),
      safeJson(cycleRes),
      safeJson(sleepRes),
      safeJson(workoutRes),
    ]);

    const recoveries = recoveryResult.data?.records ?? [];
    const cycles     = cycleResult.data?.records    ?? [];
    const sleeps     = sleepResult.data?.records    ?? [];
    const workouts   = workoutResult.data?.records  ?? [];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recovery: recoveries[0] ?? null,
        cycle:    cycles[0]     ?? null,
        sleep:    sleeps[0]     ?? null,
        workouts,
        history: { recoveries, cycles, sleeps },
        _debug: {
          recoveryStatus: recoveryRes.status,
          cycleStatus:    cycleRes.status,
          sleepStatus:    sleepRes.status,
          workoutStatus:  workoutRes.status,
          recoveryCounts: recoveries.length,
          cycleCounts:    cycles.length,
          sleepCounts:    sleeps.length,
          recoveryRaw:    recoveryResult.raw,
          sleepRaw:       sleepResult.raw,
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
};

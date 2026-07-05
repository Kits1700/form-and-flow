const safeJson = async (res) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return null; }
};

exports.handler = async (event) => {
  try {
    const token = (event.headers.authorization || '').replace('Bearer ', '');
    if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'No token' }) };

    const headers = { Authorization: `Bearer ${token}` };

    const [recoveryRes, cycleRes, sleepRes, workoutRes] = await Promise.all([
      fetch('https://api.prod.whoop.com/developer/v1/recovery/?limit=30', { headers }),
      fetch('https://api.prod.whoop.com/developer/v1/cycle/?limit=30', { headers }),
      fetch('https://api.prod.whoop.com/developer/v1/sleep/?limit=30', { headers }),
      fetch('https://api.prod.whoop.com/developer/v1/workout/?limit=30', { headers }),
    ]);

    const [recoveryData, cycleData, sleepData, workoutData] = await Promise.all([
      safeJson(recoveryRes),
      safeJson(cycleRes),
      safeJson(sleepRes),
      safeJson(workoutRes),
    ]);

    const recoveries = recoveryData?.records ?? [];
    const cycles     = cycleData?.records    ?? [];
    const sleeps     = sleepData?.records    ?? [];
    const workouts   = workoutData?.records  ?? [];

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

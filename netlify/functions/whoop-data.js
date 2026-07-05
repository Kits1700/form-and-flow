exports.handler = async (event) => {
  try {
    const token = (event.headers.authorization || '').replace('Bearer ', '');
    if (!token) return { statusCode: 401, body: JSON.stringify({ error: 'No token' }) };

    const headers = { Authorization: `Bearer ${token}` };

    const [recoveryRes, cycleRes, sleepRes, workoutRes] = await Promise.all([
      fetch('https://api.prod.whoop.com/developer/v1/recovery/?limit=1', { headers }),
      fetch('https://api.prod.whoop.com/developer/v1/cycle/?limit=1', { headers }),
      fetch('https://api.prod.whoop.com/developer/v1/sleep/?limit=1', { headers }),
      fetch('https://api.prod.whoop.com/developer/v1/workout/?limit=5', { headers }),
    ]);

    const [recovery, cycle, sleep, workout] = await Promise.all([
      recoveryRes.json(),
      cycleRes.json(),
      sleepRes.json(),
      workoutRes.json(),
    ]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recovery: recovery.records?.[0] ?? null,
        cycle:    cycle.records?.[0]    ?? null,
        sleep:    sleep.records?.[0]    ?? null,
        workouts: workout.records       ?? [],
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

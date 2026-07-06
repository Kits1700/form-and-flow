exports.handler = async () => {
  const state = Math.random().toString(36).substring(2, 18);

  // Build URL manually — URLSearchParams encodes ':' as '%3A' which some
  // OAuth servers don't parse correctly for scope values.
  const scope    = 'read:recovery read:sleep read:cycles read:workout';
  const clientId = encodeURIComponent(process.env.WHOOP_CLIENT_ID);
  const redirect = encodeURIComponent(process.env.WHOOP_REDIRECT_URI);
  const scopeEnc = scope.split(' ').map(s => encodeURIComponent(s)).join('+');

  const url = `https://api.prod.whoop.com/oauth/oauth2/auth` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${redirect}` +
    `&scope=${scopeEnc}` +
    `&state=${state}`;

  return {
    statusCode: 302,
    headers: { Location: url },
  };
};

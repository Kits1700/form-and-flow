exports.handler = async () => {
  const state    = Math.random().toString(36).substring(2, 18);
  const clientId = process.env.WHOOP_CLIENT_ID;
  const redirect = encodeURIComponent(process.env.WHOOP_REDIRECT_URI);

  // Scopes: colons must NOT be percent-encoded — only spaces become %20.
  // URLSearchParams over-encodes ':' as '%3A' which Whoop doesn't parse correctly.
  const scope = 'read:recovery%20read:sleep%20read:cycles%20read:workout';

  const url = `https://api.prod.whoop.com/oauth/oauth2/auth` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${redirect}` +
    `&scope=${scope}` +
    `&state=${state}`;

  return {
    statusCode: 302,
    headers: { Location: url },
  };
};

exports.handler = async () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.WHOOP_CLIENT_ID,
    redirect_uri: process.env.WHOOP_REDIRECT_URI,
    scope: 'read:recovery read:sleep read:cycles read:workout',
  });

  return {
    statusCode: 302,
    headers: { Location: `https://api.prod.whoop.com/oauth/oauth2/auth?${params}` },
  };
};

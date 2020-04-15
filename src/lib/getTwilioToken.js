const { jwt: { AccessToken } } = require('twilio');

const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

const handler = async (event, context) => {
  const { identityUsername } = event;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_SID,
    process.env.TWILIO_API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION }
  );
  token.identity = identityUsername;

  const grant = new VideoGrant();
  token.addGrant(grant);

  const result = {
    username: identityUsername,
    token: token.toJwt(),
  };
  console.log(result, 'Resulting token');

  return result;
};

module.exports = handler;

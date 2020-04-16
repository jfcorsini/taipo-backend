const { jwt: { AccessToken } } = require('twilio');

const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

const handler = async (event, context) => {
  const { identityUsername, arguments: { input } } = event;
  const { roomName } = input;

  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_SID,
    process.env.TWILIO_API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION, identity: identityUsername }
  );

  const grant = new VideoGrant({ room: roomName});
  accessToken.addGrant(grant);

  const result = {
    username: identityUsername,
    token: accessToken.toJwt(),
  };
  console.log(result, 'Resulting token');

  return result;
};

module.exports = handler;

const createPrivateChat = require('./lib/createPrivateChat');
const getPrivateChat = require('./lib/getPrivateChat');
const getTwilioToken = require('./lib/getTwilioToken');

module.exports = (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  switch(event.field) {
      case "createPrivateChat":
          return createPrivateChat(event, context);
      case "getPrivateChat":
          return getPrivateChat(event, context);
      case "getTwilioToken":
        return getTwilioToken(event, context);
      default:
          throw new Error("Unknown field, unable to resolve" + event.field);
  }
};
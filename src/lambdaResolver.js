const createPrivateChat = require('./lib/createPrivateChat');
const getPrivateChat = require('./lib/getPrivateChat');

module.exports = (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  switch(event.field) {
      case "createPrivateChat":
          return createPrivateChat(event, context);
      case "getPrivateChat":
          return getPrivateChat(event, context);
      default:
          throw new Error("Unknown field, unable to resolve" + event.field);
  }
};
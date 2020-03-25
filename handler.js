const createPrivateChat = require('./src/createPrivateChat');
const getPrivateChat = require('./src/getPrivateChat');
const getChat = require('./src/getChat');

exports.app = (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  console.log("Got an Invoke Request.");
  switch(event.field) {
    case "createPrivateChat":
      return createPrivateChat(event, context);
    case "getPrivateChat":
      return getPrivateChat(event, context);
    case "getChat":
      return getChat(event, context);
    default:
      throw new Error("Unknown field, unable to resolve" + event.field);
  }
};
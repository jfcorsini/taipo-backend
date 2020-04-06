const { startsWith, pathOr } = require('ramda');
const createPrivateChat = require('./src/createPrivateChat');
const getPrivateChat = require('./src/getPrivateChat');
const { translate } = require('./src/translator');
const updateTranslation = require('./src/updateTranslation');

const app = (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  console.log("Got an Invoke Request.");
  switch(event.field) {
      case "createPrivateChat":
          return createPrivateChat(event, context);
      case "getPrivateChat":
          return getPrivateChat(event, context);
      default:
          throw new Error("Unknown field, unable to resolve" + event.field);
  }
};

const translator = (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));
  const translateMessages = event.Records
    .filter((record) => {
      const sortKey = pathOr('', ['dynamodb', 'NewImage', 'sortKey', 'S'], record);

      return record.eventName === 'INSERT' && startsWith('message_', sortKey);
    })
    .map(async (record) => {
      const entry = record.dynamodb.NewImage;
      const message = entry.message.S;

      const translation = await translate(message);
      const params = {
        chatId: entry.chatId.S,
        sortKey: entry.sortKey.S,
        translation,
      };

      return updateTranslation(params);
    });

  return Promise.all(translateMessages);
};

module.exports = {
  app,
  translator,
};

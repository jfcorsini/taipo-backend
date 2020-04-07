const { startsWith, pathOr } = require('ramda');
const updateTranslation = require('./lib/updateTranslation');

module.exports = async (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  const messagesToTranslate = event.Records
    .filter((record) => {
      const sortKey = pathOr('', ['dynamodb', 'NewImage', 'sortKey', 'S'], record);

      return record.eventName === 'INSERT' && startsWith('message_', sortKey);
    })
    .map((record) => {
      const entry = record.dynamodb.NewImage;
      return {
        chatId: entry.chatId.S,
        sortKey: entry.sortKey.S,
        message: entry.message.S,
      };
    });
  
  await updateTranslation(messagesToTranslate);
};
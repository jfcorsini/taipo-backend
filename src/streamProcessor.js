const { startsWith, pathOr, uniq, compose, reject, isNil } = require('ramda');
const updateTranslation = require('./lib/updateTranslation');
const updateLastMessageAt = require('./lib/updateLastMessageAt');

module.exports = async (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  const newMessages = event.Records
    .filter((record) => {
      const sortKey = pathOr('', ['dynamodb', 'NewImage', 'sortKey', 'S'], record);

      return record.eventName === 'INSERT' && startsWith('message_', sortKey);
    });

  const messagesToTranslate = newMessages.map((record) => {
    const entry = record.dynamodb.NewImage;
    return {
      chatId: entry.chatId.S,
      sortKey: entry.sortKey.S,
      message: pathOr(null, ['message', 'S'], entry),
    };
  }).filter(item => item.message);
  
  await updateTranslation(messagesToTranslate);

  const chatsWithNewMessage = compose(
    reject(isNil),
    uniq,
  )(newMessages.map(record => pathOr(null, ['dynamodb', 'NewImage', 'chatId', 'S'], record)));
  
  await updateLastMessageAt(chatsWithNewMessage);
};
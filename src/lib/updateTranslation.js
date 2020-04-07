const AWS = require('aws-sdk');
const { translate } = require('./translator');

const documentClient = new AWS.DynamoDB.DocumentClient();

const updateTranslation = async ({ chatId, sortKey, message }) => {
  const translation = await translate(message);

  const params = {
      TableName: process.env.CHATS_TABLE,
      Key: {
        chatId,
        sortKey,
      },
      UpdateExpression: 'set #translation = :translation',
      ExpressionAttributeNames: { '#translation' : 'translation' },
      ExpressionAttributeValues: { ':translation': translation }
  };

  try {
    await documentClient.update(params).promise();
  } catch (error) {
    console.error(error, 'Failed to update item');
    throw error;
  }
};

const updateTranslations = (messages) => {
  const updates = messages.map(message => updateTranslation(message));

  return Promise.all(updates);
}

module.exports = updateTranslations;

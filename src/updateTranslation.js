const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const updateTranslation = async ({ chatId, sortKey, translation }) => {
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

module.exports = updateTranslation;

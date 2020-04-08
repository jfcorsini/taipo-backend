const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const updateSingleChat = async (chatId, now) => {

  const params = {
      TableName: process.env.CHATS_TABLE,
      Key: {
        chatId,
        sortKey: 'config'
      },
      UpdateExpression: 'set #lastMessageAt = :lastMessageAt',
      ExpressionAttributeNames: { '#lastMessageAt' : 'lastMessageAt' },
      ExpressionAttributeValues: { ':lastMessageAt': now }
  };

  try {
    await documentClient.update(params).promise();
  } catch (error) {
    console.error(error, 'Failed to update item');
    throw error;
  }
};

const updateLastMessageAt = (chatIds) => {
  const now = new Date().toISOString();
  const updates = chatIds.map(chatId => updateSingleChat(chatId, now));

  return Promise.all(updates);
}

module.exports = updateLastMessageAt;

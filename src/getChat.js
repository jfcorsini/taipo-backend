const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event, context) => {
  const { arguments: { input: { chatId } } } = event;

  const params = {
      TableName: process.env.CHATS_TABLE,
      KeyConditionExpression: 'chatId = :chatId and begins_with(sortKey, :sortKey)',
      ExpressionAttributeValues: {
        ':chatId': chatId,
        ':sortKey': 'config',
      }
  };

  try {
    const response = await documentClient.query(params).promise();
    
    return response.Items[0];
    
  } catch (error) {
    console.error(error, 'Failed to run query');
    throw error;
  }
};

module.exports = handler;

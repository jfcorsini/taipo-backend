const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event, context) => {
  const { identityUsername, arguments: { input } } = event;
  const { username } = input;

  const sortedUsernames = [username, identityUsername].sort().join('_');

  const params = {
      TableName: process.env.CHATS_TABLE,
      IndexName: 'invertedIndex',
      KeyConditionExpression: 'sortKey = :sortKey',
      ExpressionAttributeValues: {
        ':sortKey': `config_${sortedUsernames}`,
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

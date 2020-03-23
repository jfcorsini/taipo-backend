const AWS = require('aws-sdk');
const uuid = require('uuid');
const { isEmpty } = require('ramda');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.app = async (event, context) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  console.log("Got an Invoke Request.");
  switch(event.field) {
      case "createPrivateChat":
          const username = event.arguments.input.username;
          const identityUsername = event.identityUsername;
          const createdAt = event.createdAt;

          const sortedUsernames = [username, identityUsername].sort().join('_');
          const chatId = uuid.v4();

          const privateChat = {
            chatId,
            sortKey: `config_${sortedUsernames}`,
            createdAt,
            private: true,
          };

          const params = {
            RequestItems: {
              [process.env.CHATS_TABLE]: [
                {
                  PutRequest: {
                    Item: privateChat,
                  }
                },
                {
                  PutRequest: {
                    Item: {
                      chatId,
                      sortKey: `member_${identityUsername}`,
                      createdAt,
                      username: identityUsername,
                    }
                  }
                },
                {
                  PutRequest: {
                    Item: {
                      chatId,
                      sortKey: `member_${username}`,
                      createdAt,
                      username,
                    }
                  }
                }
              ]
            }
          };

          try {
            const response = await documentClient.batchWrite(params).promise();
            
            if (isEmpty(response.UnprocessedItems)) {
              return privateChat;
            }

            console.log('Unprocessed items', response.UnprocessedItems);
            throw new Error('Failed to create chat')
            
          } catch (error) {
            console.error(error, 'Failed to run batchWrite');
            throw error;
          }

      default:
          throw new Error("Unknown field, unable to resolve" + event.field);
  }
};
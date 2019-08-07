# nameless-language-app

This is the repository where I will add code related to a message-based app to help learning a language. This is still in early stage of development.

To this particular moment, this will be the codebase for the backend.

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/releases/)
* [Docker installed](https://www.docker.com/community-edition)

## Access Patterns

The following list describes all the access patterns that this application allows:

1) Create a chat
2) Return a list of chats
3) Add a message to a chat
4) List all messages of a chat.
5) Create / update a user details, e.g. last login time.

## DynamoDB Tables

As the core of this application, there are two DynamoDB tables: users and chats. This could of course be done in a single one, but I prefered
to separate the concerns at this level. Following DynamoDB Advanced Patterns, the design of the tables were done thinking about our access
patterns.

The chats table will have the partition key being the chat identifier and the sort key will be different according to the need,
as shown below:

| PartitionKey | SortKey                         | Description                     |
|--------------|---------------------------------|---------------------------------|
| <chatId>     | config                          | Provides details about the chat |
| <chatId>     | message_<timestamp>_<messageId> | Details about the message       |

Meanwhile, the users table will have the partition key being the username of a user and sort key also being different according
to the need, as shown below:

| PartitionKey | SortKey  | Description                                          |
|--------------|----------|------------------------------------------------------|
| <username>   | config   | Details about the user, like when was the last login |

Both tables will have a Global Secondary Index with the sortKey column being the primary key to allow extra queries. If needed,
these and more indices will be described here.

## Ideas to implement:

* Always improve development flow.
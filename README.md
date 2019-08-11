# Taipo 

Taipo is a chat application that aims to help people to learn a new language. For more details on my motivation to build this, check my [blog post](https://jfcorsini.com/blog/chat-app-pt-1/).

This repository will keep track of the backend development. To see how I am building the whole application, please check the following repositories:
  * 👾 Backend repository: [jfcorsini/taipo-frontend](https://github.com/jfcorsini/taipo-backend)
  * 🎨 Frontend repository: [jfcorsini/taipo-frontend](https://github.com/jfcorsini/taipo-frontend)
  * 📱 Mobile repository: [jfcorsini/taipo-mobile](https://github.com/jfcorsini/taipo-mobile)

## Development

The following sections will cover how to develop / maintain this application. More details should be added soon.

### Access Patterns

The following list describes all the access patterns that this application allows:

1) Create a chat
2) Return a list of chats
3) Add a message to a chat
4) List all messages of a chat.
5) Create / update a user details, e.g. last login time.
6) A user can create a chat with another user

### DynamoDB Tables

As the core of this application, there are two DynamoDB tables: users and chats. This could of course be done in a single one, but I prefered
to separate the concerns at this level. Following DynamoDB Advanced Patterns, the design of the tables were done thinking about our access
patterns.

The chats table will have the partition key being the chat identifier and the sort key will be different according to the need,
as shown below:

| PartitionKey                | SortKey                         | Description                               |
|-----------------------------|---------------------------------|-------------------------------------------|
| <usernameOne>_<usernameTwo> | config_private                  | Provides details about a private chat     |
| <chatId>                    | config_group                    | Provides details about the chat group     |
| <chatId>                    | message_<timestamp>_<messageId> | Details about the message                 |
| <chatId>                    | member_<username>               | Contain data about the members of a group |

Meanwhile, the users table will have the partition key being the username of a user and sort key also being different according
to the need, as shown below:

| PartitionKey | SortKey  | Description                                          |
|--------------|----------|------------------------------------------------------|
| <username>   | config   | Details about the user, like when was the last login |

Both tables will have a Global Secondary Index with the sortKey column being the primary key to allow extra queries. If needed,
these and more indices will be described here.
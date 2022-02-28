# odl-server

odl-server is the backend for an online multiplayer darts game,
it is intended to be used with the odl-flutter-client.

## API Reference

### Get all items

#### Rest

```http
  POST /auth/login
```

| Parameter  | Type     | Description          |
| :--------- | :------- | :------------------- |
| `username` | `string` | Username of the user |
| `password` | `string` | Password of the user |

This endpoint is used to fetch the JWT Token that is needed to
access the GraphQL resolvers.

#### GraphQL

##### Queries

```gql
type Query {
  """
  gets all users
  """
  users: [User!]!

  """
  gets user by its id
  """
  user(id: String!): User!

  """
  gets all matches
  """
  matches: [Match!]!

  """
  gets match by its id
  """
  match(id: String!): Match!
}
```

##### Mutations

```gql
type Mutation {
  """
  creates user with specified data
  """
  createUser(createUserInput: CreateUserInput!): User!

  """
  gets user by id and updates with specified data
  """
  updateUser(updateUserInput: UpdateUserInput!): User!

  """
  deletes the user that corresponds to the specified id
  """
  removeUser(id: String!): User!

  """
  updates match with specified data
  """
  updateMatch(updateMatchInput: UpdateMatchInput!): Match!

  """
  starts search for opponent
  """
  searchOpponent: String!
}
```

##### Subscriptions

```gql
type Subscription {
  """
  returns match data as soon as an opponent was found
  """
  getMatchId(id: String!): Match!

  """
  listens to updates of the match that corresponds to the specified id
  """
  listenToMatch(matchId: String!): Match!
}
```

##### ObjectTypes

```gql
type User {
  id: ID!

  """
  the username of the user
  """
  username: String!

  """
  the email address of the user
  """
  email: String!

  """
  all matches the user ever played
  """
  matches: [Match!]!

  """
  all legs the user ever played
  """
  legs: [Leg!]!
}

type Match {
  id: ID!

  """
  the participants of the match
  """
  players: [User!]!

  """
  the legs of the match
  """
  legs: [Leg!]!

  """
  a boolean that indicates if the match is finished
  """
  isFinished: Boolean!
}

type Leg {
  id: ID!

  """
  id of the match to which the leg belongs
  """
  matchId: String!

  """
  match to which the leg belongs
  """
  match: Match!

  """
  boolean indicating wether the leg is finished
  """
  isFinished: Boolean!

  """
  array where each element represents the points left in the leg for the user at the same index in players array of the match
  """
  points: [Int!]!

  """
  the visits that belong to the leg
  """
  visits: [Visit!]!
}

type Visit {
  id: ID!

  """
  the darts that belong to the visit
  """
  darts: [Dart!]!

  """
  the id of the leg to which the visit belongs
  """
  legId: String!

  """
  the id of the player to whom the visit belongs
  """
  playerId: String!

  """
  boolean indicating wether the visit is finished
  """
  isFinished: Boolean!
}

type Dart {
  id: ID!

  """
  the point value of the dart
  """
  value: Int!

  """
  the field in which the dart landed 25 beeing bullseye
  """
  field: Int!

  """
  indicates whether the dart landed in a single a double or a treble
  """
  segment: Int!
}
```

##### InputTypes

```gql
input CreateUserInput {
  username: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  username: String
  email: String
  password: String
  id: ID!
}

input UpdateMatchInput {
  """
  id of the match that is getting updated
  """
  matchId: String!

  """
  id of the leg that is getting updated
  """
  legId: String!

  """
  the field in wich the dart landed where 25 stands for bulleye
  """
  field: Int!

  """
  indicates wheter the dart hit a treble a double or a single
  """
  segment: Int!

  """
  determinates whether the match is finished
  """
  isFinished: Boolean!
}
```

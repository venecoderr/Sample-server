const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  id: ID!
  username: String!
  email: String!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type Query {
  users: [User]
  user(id: ID!): User
}

# Mutation type for data modification
type Mutation {
  addUser(username: String!, email: String!, password: String!): User
  updateUser(id: ID!, username: String, email: String): User
  deleteUser(id: ID!): User
  login(email: String!, password: String!): AuthData
}
`;

module.exports = typeDefs;

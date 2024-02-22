const { gql } = require("apollo-server-express");

const userSchema = gql`
  type User {
    id: Int
    username: String
    
  }

  type AuthPayload {
    token: String!
    user: User
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    createUser(username: String!,password:String!): User
    updateUser(id: Int!, username: String!,password:String!): User
    deleteUser(id: Int!): User
  }
`;

module.exports = userSchema;

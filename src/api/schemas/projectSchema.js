const { gql } = require('apollo-server-express');

const projectSchema = gql`
type Project {
  id: ID!
  name: String!
  enabled: Boolean!
  time_zone: String!
  
}

type Query {
  getProjects: [Project]! 
  
}

type Mutation {
  createProject(name: String!, enabled: Boolean!, time_zone: String!): Project! 
  updateProject(id: ID!, name: String, enabled: Boolean, time_zone: String): Project! 
  deleteProject(id: ID!): Project 
}
`;

module.exports = projectSchema;

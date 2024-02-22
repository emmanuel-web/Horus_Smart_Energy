const { gql } = require('apollo-server-express');

const deviceSchema = gql`
type Device {
  id: ID!
  name: String!
  type: String!
  visible: Boolean!
  project: Project!
}

extend type Query {
  getDevicesByProject(projectId: ID!): [Device]!
  getDevice(projectId: ID!, deviceId: ID!): Device
}

extend type Mutation {
  createDevice(projectId: ID!,name: String!,type: String!,visible: Boolean!): Device!
  updateDevice(projectId: ID!,deviceId: ID!,name: String,type: String,visible: Boolean ): Device!
  deleteDevice(projectId: ID!,deviceId: ID!): Device!
}

`;

module.exports = deviceSchema;

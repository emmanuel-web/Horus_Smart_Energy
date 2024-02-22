const { gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const projectSchema = require('./projectSchema');
const deviceSchema = require('./deviceSchema');
const userSchema  = require('./userSchema');

const rootSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

`;

const schema = makeExecutableSchema({
  typeDefs: [rootSchema, projectSchema, deviceSchema,userSchema],
});

module.exports = schema;

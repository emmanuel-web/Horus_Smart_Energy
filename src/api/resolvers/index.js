const projectResolvers = require('./projectResolvers');
const deviceResolvers = require('./deviceResolvers');
const userResolvers = require('./userResolvers');


const resolvers = {
  Query: {
    ...projectResolvers.Query,
    ...deviceResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...projectResolvers.Mutation,
    ...deviceResolvers.Mutation,
    ...userResolvers.Mutation,
  },
  
};

module.exports = resolvers;

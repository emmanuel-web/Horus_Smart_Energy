const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./src/api/resolvers/index')
const typeDefs  = require('./src/api/schemas/index')
const jwt = require('jsonwebtoken');
const express = require('express');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (error) {
      console.log(`Token error: ${error.message}`);
    }
  }
  next();
};



const startServer = async () => {


  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({
    user: req.user
  })});

  await server.start();

  const app = express();

  app.use(authMiddleware);
  
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Servidor GraphQL en http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch(error => console.error(error));

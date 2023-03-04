const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const adminTypeDefs = require('./graphql/schemas/adminSchema');
const adminResolver = require('./graphql/resolvers/adminResolver');
const db = require('./config/database');
const { ApolloServer, gql } = require('apollo-server-express');
const { auth } = require("./utils/auth");
const makeContext = require("./context/makeContext");


const app = express();
console.log('Starting server');

// Connect to database
db.connect();

// Set up cors middleware
app.use(morgan("dev"));
app.use(cors());

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cookieParser());

const server = new ApolloServer({
  typeDefs: [adminTypeDefs],
  resolvers: [adminResolver],
  context: ({ req }) => makeContext(req),
  playground: true,
});

server.start().then(() => {
  server.applyMiddleware({
    app,
    cors: true,
  });
});


app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);

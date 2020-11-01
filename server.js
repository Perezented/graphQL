const express = require("express");
let { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// GraphQL Schema
const schema = buildSchema(`
    type Query{
        message: String
    }
`);

const root = {
  message: () => "Hello World! I just sent my first GraphQL message as a string"
};

// Create an express server and GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000, () =>
  console.log("Express GraphQl server now running on localhost:4000/graphql")
);

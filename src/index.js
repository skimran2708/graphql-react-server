import { ApolloServer } from "apollo-server";
import typeDefs from "./schemaGQL.js";
import resolvers from "./resolvers.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, JWT_SECRET);
      return { userId };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    quotes: [Quote]
  }

  type Quote {
    text: String!
    by: ID!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User!
    userProfile: User!
    quotes: [Quote!]!
    userQuote(userId: Int!): [Quote!]!
  }

  type Token {
    token: String
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User!
    singnInUser(email: String!, password: String!): Token!
    createQuote(text: String!): String
  }
`;

export default typeDefs;

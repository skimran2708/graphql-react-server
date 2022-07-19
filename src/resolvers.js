import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mockData = require("../mock_data.json");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const resolvers = {
  Query: {
    users: () => mockData.usersProfile,
    quotes: () => mockData.userQuotes,
    user: (parent, args) => {
      return mockData.usersProfile.find((user) => user.id === args.id);
    },
    userProfile: (parent, args, context) => {
      if (!context.userId) throw new Error("You must be logged in");
      return mockData.usersProfile.find((user) => user.id === context.userId);
    },
    userQuote(parent, args) {
      const tempQuotes = [];
      mockData.userQuotes.map((quote) => {
        if (quote.by === args.userId) {
          tempQuotes.push(quote);
        }
      });
      return tempQuotes;
    },
  },

  User: {
    quotes: (user) =>
      mockData.userQuotes.filter((quote) => quote.by == user.id),
  },

  Mutation: {
    createUser: async (parent, args) => {
      if (mockData.usersProfile.find((user) => user.email === args.email)) {
        throw new Error("User already exist with that email");
      }
      const id = mockData.usersProfile[mockData.usersProfile.length - 1].id + 1;
      const hashedPassword = await bcrypt.hash(args.password, 12);
      mockData.usersProfile.push({ id, ...args, password: hashedPassword });
      return mockData.usersProfile.find((user) => user.id === id);
    },
    singnInUser: async (parent, args) => {
      const user = await mockData.usersProfile.find(
        (user) => user.email === args.email
      );
      if (!user) {
        throw new Error("User doesn't exist with that email");
      }
      const doMatch = await bcrypt.compare(args.password, user.password);
      if (!doMatch) {
        throw new Error("Invalid email or password");
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token };
    },
    createQuote: (parent, args, context) => {
      if (!context.userId) throw new Error("You must be logged in");
      mockData.userQuotes.push({ ...args, by: context.userId });
      return "Quote saved successfully!";
    },
  },
};

export default resolvers;

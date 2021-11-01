"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema = (0, graphql_1.buildSchema)(`
    input UserLoginInput {
        email: String!
        password: String!
    }

    input UserCreateInput {
        username: String!
        email: String!
        password: String!
    }

    input UserUpdateInput {
        id: ID!
        username: String
        email: String
        password: String
        token: String!
    }

    input UserDeleteInput {
        id: ID!
        token: String!
    }

    type ReturnUserType {
        _id: ID!
        token: String!
    }

    type Query {
        login(userLoginInput: UserLoginInput!): ReturnUserType!
    }

    type Mutation {
        signup(userCreateInput: UserCreateInput!): ID!
        updateUser(userUpdateInput: UserUpdateInput!): ReturnUserType!
        deleteUser(userDeleteInput: UserDeleteInput!): ID!
    }
`);
exports.default = schema;

import { buildSchema } from "graphql";

const schema = buildSchema(`
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

export default schema;

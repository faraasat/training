import { GraphQLID } from "graphql/type";

export interface ISignup {
  username: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUpdateUser {
  id: GraphQLID;
  username: string;
  email: string;
  password: string;
  token: string;
}

export interface IDeleteUser {
  id: GraphQLID;
  token: string;
}

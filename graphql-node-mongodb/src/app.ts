import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";

import graphqlSchema from "./graphql/schema";
import graphqlResolvers from "./graphql/resolvers";

dotenv.config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  const error = err.error;
  res.status(status).json({ error: error });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING!)
  .then(() => {
    app.listen(3000);
    console.log(
      "Connected to mongodb. Server running at http://localhost:3000/"
    );
  })
  .catch((err) => {
    let error = new Error("An error occured during connection with mongodb");
    error.statusCode = 500;
    error.error = err;
    throw error;
  });

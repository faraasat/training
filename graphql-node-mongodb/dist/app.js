"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use((err, _req, res, _next) => {
    const status = err.statusCode || 500;
    const error = err.error;
    res.status(status).json({ error: error });
});
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    rootValue: resolvers_1.default,
    graphiql: true,
}));
mongoose_1.default
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
    app.listen(3000);
    console.log("Connected to mongodb. Server running at http://localhost:3000/");
})
    .catch((err) => {
    let error = new Error("An error occured during connection with mongodb");
    error.statusCode = 500;
    error.error = err;
    throw error;
});

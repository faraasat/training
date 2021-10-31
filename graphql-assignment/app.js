const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const app = express();

let myTodos = [
  { id: 1, title: "My First Todo", starred: false, archived: false },
  { id: 2, title: "My Second Todo", starred: false, archived: false },
];

const schema = buildSchema(`
    type Todo {
        id: ID
        title: String
        starred: Boolean
        archived: Boolean
    }

    input TodoInput {
        id: ID!
        title: String!
        starred: Boolean
        archived: Boolean
    }

    input TodoUpdated {
        id: ID!
        title: String
        starred: Boolean
        archived: Boolean
    }

    type Query {
        getTodos: [Todo]
        getTodo(id: ID!): Todo
    }

    type Mutation {
        createTodo(todo: TodoInput!): Todo! 
        updateTodo(todo: TodoUpdated!): Todo!
        deleteTodo(id: ID!): ID!
    }
`);

const root = {
  getTodos: () => {
    return myTodos;
  },
  getTodo: ({ id }) => {
    const todo = myTodos.filter((todo) => +todo.id === +id);
    return todo[0];
  },
  createTodo: ({ todo: { id, title, starred, archived } }) => {
    const todo = {
      id: id,
      title: title,
      starred: starred || false,
      archived: archived || false,
    };
    myTodos.push(todo);
    return todo;
  },
  updateTodo: ({ todo: { id, title, starred, archived } }) => {
    let updatedTodo;
    myTodos.map((todo) => {
      if (+todo.id === +id) {
        todo.title = title;
        todo.starred = starred || false;
        todo.archived = archived || false;
        updatedTodo = { ...todo, id: id };
      }
    });
    return updatedTodo;
  },
  deleteTodo: ({ id }) => {
    myTodos = myTodos.filter((todo) => +todo.id !== +id);
    console.log(myTodos);
    return id;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3000);

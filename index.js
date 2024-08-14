import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { books } from "./data.js";

const typeDefs = `
  type Book {
    id: Int
    title: String
    author: String
    content: String
  }

  type Query {
    books: [Book]
    book(id: ID): Book
    dbook(id: ID): String
  }

  type Mutation {
    addBook(title: String!, author: String!, content: String!): String
  }

  type Mutation {
    editBook(title: String!, author: String!, content: String!): String
    editBook(id: ID!, title: String!, author: String!, content: String!): String
  }
`

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(book => book.id === parseInt(id)),
    dbook: (_, { id }) => {
      const index = books.findIndex(book => book.id === parseInt(id));
      if (index !== -1) {
        books.splice(index, 1);
        return "You've deleted this Book!";
      }
      return "Book not found so it wasn't deleted!";
    }
  },

  Mutation: {
    addBook: (_, { title, author, content }) => {
      const newBook = {
        id: books.length + 1,
        title,
        author,
        content
      };
      books.push(newBook);
      return "You've Created a new Book";
    },
    editBook: (_, { id, title, author, content }) => {
      const index = books.findIndex(book => book.id === parseInt(id));
      if (index !== -1) {
        books[index] = { id: parseInt(id), title, author, content };
        return "Book updated successfully";
      }
      return "Book not found";
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
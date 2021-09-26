const { gql } = require('apollo-server-express');
const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(content: bookData!): User
        deleteBook(bookId: String!): User
    }
    type Auth {
        token: ID!
        user: User!
    }
    input bookData {
        bookId: ID!
        authors: [String!]
        description: String
        title: String
        image: String
        link: String
    }
`;

module.exports = typeDefs;
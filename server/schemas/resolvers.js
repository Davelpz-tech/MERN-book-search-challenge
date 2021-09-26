const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user.id }).select('-__v -password');
                return userData;
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('email not found');
            }
            const correctPass = await user.isCorrectPassword(password);
            if (!password) {
                throw new AuthenticationError('Password is incorrect')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { content }, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $push: { savedBooks: content }},
                    { new: true }
                );
                return user;
            }
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $pull: { savedBooks: {bookId: bookId}}},
                    { new: true }
                );
                return user;
            }
        }
    }
};

module.exports = resolvers;
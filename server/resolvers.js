const Book = require("./models/book");
const Author = require("./models/author");
const {
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const pubsub = new PubSub();
console.clear();
const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: async (root, args) => {
      let allBooksInDatabase = await Book.find({}).populate("author");

      if (args.author !== undefined) {
        allBooksInDatabase = allBooksInDatabase.filter((book) => {
          return book.author.name === args.author;
        });
      }

      if (args.genre !== undefined) {
        allBooksInDatabase = allBooksInDatabase.filter((book) =>
          book.genres.includes(args.genre)
        );
      }

      return allBooksInDatabase;
    },
    allAuthors: () => Author.find({}),
    me: (root, args, { currentUser }) => currentUser,
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const validBook = {
        title: args.title,
        published: args.published,
        genres: args.genres,
      };

      const authorIsInDatabase = (await Author.findOne({ name: args.author }))
        ? true
        : false;

      if (authorIsInDatabase === false) {
        const newAuthor = new Author({ name: args.author });

        try {
          await newAuthor.save();
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: newAuthor });
        }
      }

      const foundAuthor = await Author.findOne({ name: args.author });
      foundAuthor.bookCount++;

      const newBook = new Book({ ...validBook, author: foundAuthor._id });

      try {
        await newBook.save();
        await foundAuthor.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: newBook });
      }

      const newlyAddedBook = newBook.populate("author").execPopulate();

      pubsub.publish("BOOK_ADDED", { bookAdded: newlyAddedBook });
      return newlyAddedBook;
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const authorToEdit = await Author.findOne({ name: args.name });

      if (!authorToEdit) {
        return null;
      }

      authorToEdit.born = args.setBornTo;

      try {
        await authorToEdit.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      return authorToEdit;
    },
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args;
      const newUser = new User({ username, favoriteGenre });

      try {
        await newUser.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: newUser });
      }
      return newUser;
    },
    login: async (root, args) => {
      const { username, password } = args;
      const foundUser = await User.findOne({ username });

      if (!foundUser || password !== "password") {
        throw new AuthenticationError(error.message, { invalidArgs: { args } });
      }

      const userForToken = {
        username,
        id: foundUser._id,
      };

      const jwtToken = jwt.sign(userForToken, process.env.JWT_SECRET);
      return { value: jwtToken };
    },
  },
};

module.exports = resolvers;

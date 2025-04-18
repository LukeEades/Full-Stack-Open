const Book = require("./models/Book")
const Author = require("./models/Author")
const User = require("./models/User")
const { GraphQLError, subscribe } = require("graphql")
const { sign, verify } = require("jsonwebtoken")
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    allBooks: async (root, args) => {
      const filter = {}
      // need to query for the author from the id
      if (args.author) {
        const author = await Author.find({ name: args.author })
        filter.author = author._id
      }
      if (args.genre) {
        filter.genres = new RegExp(args.genre, "i")
      }
      const books = await Book.find(filter).populate("author")
      return books
    },
    allAuthors: async () => {
      const authors = (await Author.find({})).map(author => {
        return {
          name: author.name,
          id: author._id,
          born: author.born || null,
          bookCount: 0,
        }
      })
      const books = await Book.find({})
      books.forEach(book => {
        const author = authors.find(author => {
          return author.id.toString() == book.author.toString()
        })
        if (author) {
          author.bookCount++
        }
      })
      return authors
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("user authentication required", {
          extensions: {
            code: "AUTHENTICATION",
          },
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = new Author({
            name: args.author,
          })
          await author.save()
        } catch (err) {
          throw new GraphQLError("unable to create new user", {
            extensions: {
              code: "VALIDATION",
            },
          })
        }
      }
      try {
        const book = await new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        }).populate("author")
        await book.save()
        pubsub.publish("BOOK_ADDED", { bookAdded: book })
        return book
      } catch (err) {
        throw new GraphQLError("unable to create new book", {
          extensions: {
            code: "VALIDATION",
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("user authentication required", {
          extensions: {
            code: "AUTHENTICATION",
          },
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      await author.save()
      return author
    },
    createUser: async (root, { username, favoriteGenre }) => {
      try {
        const user = new User({
          username,
          favoriteGenre,
        })
        await user.save()
        return user
      } catch (err) {
        throw new GraphQLError("one or more fields are missing or invalid", {
          extensions: {
            code: "VALIDATION",
          },
        })
      }
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })
      if (!user) {
        throw new GraphQLError("user doesn't exist", {
          extensions: {
            code: "VALIDATION",
          },
        })
      }
      if (password !== "password") {
        throw new GraphQLError("password is incorrent", {
          extensions: {
            code: "VALIDATION",
          },
        })
      }
      const tokenInfo = {
        username,
        favoriteGenre: user.favoriteGenre,
        id: user._id,
      }
      const token = sign(tokenInfo, process.env.SECRET)
      return {
        value: token,
      }
    },
  },
}

module.exports = resolvers

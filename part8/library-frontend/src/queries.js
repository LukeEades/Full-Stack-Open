import { gql } from "@apollo/client"

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
    }
    id
    published
    genres
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
const getAllBooks = gql`
  query getAllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`
const getAuthors = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`
const updateAuthor = gql`
  mutation updateAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
    }
  }
`

const login = gql`
  mutation loginQuery($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
const createBook = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const getCurrentUser = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export default {
  getAllBooks,
  getAuthors,
  updateAuthor,
  login,
  createBook,
  getCurrentUser,
  BOOK_ADDED,
}

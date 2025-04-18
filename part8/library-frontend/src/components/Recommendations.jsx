import { useState } from "react"
import queries from "../queries"
import { useQuery } from "@apollo/client"
const Recommendations = () => {
  const [genre, setGenre] = useState("")
  const user = useQuery(queries.getCurrentUser)
  const booksQuery = useQuery(queries.getAllBooks, {
    variables: {
      genre,
    },
    skip: !genre,
  })
  if (user.loading || booksQuery.loading) return <div>loading...</div>
  if (!genre) setGenre(user.data.me.favoriteGenre)
  const books = booksQuery.data?.allBooks || []
  return (
    <div>
      <h2>Favorite genre: {user.data.me.favoriteGenre}</h2>
      <ul>
        {books.map(book => {
          return (
            <li key={book.id}>
              {book.author.name} {book.title}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Recommendations

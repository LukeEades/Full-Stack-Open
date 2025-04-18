import { useQuery, useSubscription } from "@apollo/client"
import queries from "../queries"
import { useState } from "react"
const Books = () => {
  const [filter, setFilter] = useState("")
  const [genres, setGenres] = useState([])
  const [books, setBooks] = useState([])
  const request = useQuery(queries.getAllBooks, {
    variables: {
      genre: filter === "" ? null : filter,
    },
  })
  useSubscription(queries.BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded
      console.log(book)
      setBooks(books.concat(book))
    },
  })
  if (!books.length && request.data?.allBooks) {
    setBooks(request.data.allBooks)
  }
  if (!genres.length) {
    const temp = Array.from(
      books.reduce((acc, curr) => {
        curr.genres.forEach(genre => acc.add(genre))
        return acc
      }, new Set(genres)),
    )
    if (temp.length) setGenres(temp)
  }
  const filtered = books.filter(book => {
    if (filter === "") return true
    return book.genres.find(genre => genre === filter)
  })
  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filtered.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <select
        name="genre"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      >
        <option value="" hidden={true}>
          Choose
        </option>
        {genres.map(genre => {
          return (
            <option key={genre} value={genre}>
              {genre}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default Books

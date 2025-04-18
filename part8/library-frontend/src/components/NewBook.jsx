import { useState } from "react"
import { useMutation } from "@apollo/client"
import queries from "../queries"
import { useApolloClient } from "@apollo/client"

const NewBook = ({ allGenres, setAllGenres }) => {
  const client = useApolloClient()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])
  const [createBook] = useMutation(queries.createBook, {
    refetchQueries: [{ query: queries.getAllBooks }],
  })

  const submit = async event => {
    event.preventDefault()
    try {
      await createBook({
        variables: { title, author, published: Number(published), genres },
      })
      client.resetStore()
      setTitle("")
      setPublished("")
      setAuthor("")
      setGenres([])
      setGenre("")
    } catch (err) {
      console.error(err)
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook

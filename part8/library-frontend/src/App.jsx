import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { BrowserRouter, Route, Routes } from "react-router"
import { useState } from "react"
import Nav from "./components/Nav"
import Recommendations from "./components/Recommendations"
import { useQuery, useSubscription } from "@apollo/client"
import queries from "./queries"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("user-login-token"))
  const [genres, setGenres] = useState([])
  useSubscription(queries.BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded
      window.alert(`book ${book.title} by ${book.author.name} added`)
    },
  })
  return (
    <BrowserRouter>
      <Nav token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route
          path="/books"
          element={<Books genres={genres} setGenres={setGenres} />}
        />
        <Route
          path="/addBook"
          element={<NewBook allGenres={genres} setAllGenres={setGenres} />}
        />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

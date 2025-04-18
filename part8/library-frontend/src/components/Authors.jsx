import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import queries from "../queries"
const Authors = () => {
  const request = useQuery(queries.getAuthors)
  const token = localStorage.getItem("user-login-token")
  if (request.loading) return <div>loading...</div>
  const authors = request.data.allAuthors
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && <ChangeYearForm authors={authors} />}
    </div>
  )
}

const ChangeYearForm = ({ authors }) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const [updateAuthor] = useMutation(queries.updateAuthor, {
    refetchQueries: [{ query: queries.getAuthors }],
  })
  const changeBirthYear = async e => {
    e.preventDefault()
    if (name == "") {
      return
    }
    await updateAuthor({
      variables: { name, born: Number(born) },
    })
    setBorn("")
    setName("")
  }
  return (
    <form onSubmit={changeBirthYear}>
      <select
        name="name"
        onChange={e => setName(e.target.value)}
        value={name}
        defaultChecked={true}
      >
        <option value="" disabled={true} hidden={true}>
          Choose an author
        </option>
        {authors.map(author => (
          <option key={author.id} value={author.name}>
            {author.name}
          </option>
        ))}
      </select>
      <label>
        born{" "}
        <input
          type="text"
          onChange={e => setBorn(e.target.value)}
          value={born}
        />
      </label>
      <button type="submit">update</button>
    </form>
  )
}

export default Authors

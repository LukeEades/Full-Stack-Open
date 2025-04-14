import { setFilter } from "../reducers/filterReducer"
import { useDispatch } from "react-redux"

const Filter = () => {
  let dispatch = useDispatch()
  const handleInput = (event) => {
    let term = event.target.value
    dispatch(setFilter(term))
  }
  return (
    <div>
      filter <input onChange={handleInput} />
    </div>
  )
}

export default Filter
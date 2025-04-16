import { useRef } from "react"
import Toggleable from "./Toggleable"
import Blogform from "./Blogform"
import BlogList from "./BlogList"
import { Container } from "@mui/material"

const Bloginfo = () => {
  const toggleRef = useRef(null)
  return (
    <Container>
      <Toggleable buttonLabel="new note" toggleRef={toggleRef}>
        <Blogform toggle={toggleRef} />
      </Toggleable>
      <BlogList />
    </Container>
  )
}

export default Bloginfo

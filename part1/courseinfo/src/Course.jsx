const Course = ({course}) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  )
}

const Content = ({course}) => {
  let parts = course.parts
  return (
    <div>
      {parts.map((part) => <Part part={part} key={part.id}/>)}
    </div>
  )
}

const Part = ({part}) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Total = ({course}) => {
  let total = course.parts.reduce((acc, part) => {
    return acc + part.exercises
  }, 0)
  return (
    <p>
      Number of exercises {total} 
    </p>
  )
}

export default Course
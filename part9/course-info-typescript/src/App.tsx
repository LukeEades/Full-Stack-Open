import { courseParts, CoursePart } from "./courseParts";

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

interface HeaderProps {
  name: string;
}

const Header = ({name}: HeaderProps) => {
  return (
    <h1>{name}</h1>
  )
}

interface ContentProps {
  courseParts: CoursePart[]
}

const Content = ({courseParts}: ContentProps) => {
  return (
    <>
      {courseParts.map(part => {
        return <Part key={part.name} part={part}/>
      })}
    </>
  )
}

interface PartProps {
  part: CoursePart
}

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic": {
      return (
        <div>
          {part.name} {part.exerciseCount}
          <p>{part.description}</p>
        </div>
      )
    }
    case "background": {
      return (
        <div>
          {part.name} {part.exerciseCount}
          <p>{part.description}</p>
          <p>{part.backgroundMaterial}</p>
        </div>
      )
    }
    case "group": {
      return (
        <div>
          {part.name} {part.exerciseCount}
          <p>{part.groupProjectCount}</p>
        </div>
      )
    }
    case "special": {
      return (
        <div>
          {part.name} {part.exerciseCount}
          <p>{part.requirements.map(requirement => <p>{requirement}</p>)}</p>
        </div>
      )
    }
    default: {
      return <div></div>
    }
  }
}

interface TotalProps {
  totalExercises: number;
}

const Total = ({ totalExercises }: TotalProps) => {
  return (<p>
    Number of exercises {totalExercises}
  </p>)
}

export default App;
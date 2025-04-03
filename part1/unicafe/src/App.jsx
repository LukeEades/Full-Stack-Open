import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, bad, neutral}) => {
  let total = good + bad + neutral 
  if (total == 0) {
    return (
      <>
        <h2>statistics</h2>
        no feedback given
      </>
    )
  }
  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total" value={total} />
          <StatisticLine text="average" value={(good - bad)/total} />
          <StatisticLine text="positive" value={`${good / total * 100}%`} />
        </tbody>
      </table>
    </>
  )
}

const Button = ({increment, text}) => {
  return (
    <button onClick={increment}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  function increment(value, setter) {
    return () => {
      setter(value + 1)
    }
  }

  return (
    <div>
      <h2>give feedback</h2>
      <Button increment={increment(good, setGood)} text="good" />
      <Button increment={increment(neutral, setNeutral)} text="neutral" />
      <Button increment={increment(bad, setBad)} text="bad" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}
export default App
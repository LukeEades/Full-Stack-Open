import { useState, useEffect } from 'react'
const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY
const App = () => {
  let [countryData, setCountryData] = useState([])
  let [countrySearch, setCountrySearch] = useState('')
  let [display, setDisplay] = useState(<div>Too many results to display</div>)
  if (countryData.length == 0) {
    // grab all the data from the api on load
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        return response.json()
      })
      .then((countries) => {
        setCountryData(countries)
      })
  }
  function handleCountryInput(event) {
    // filter it and display based on the current input word
    setCountrySearch(event.target.value)
  }
  useEffect(()=> {
    let filtered = countryData.filter((country) => {
      return country.name.common.toLowerCase().indexOf(countrySearch.toLowerCase()) != -1
    })
    if (filtered.length > 10 || countryData.length == 0) {
      setDisplay(<div>Too many results to display</div>)
    } else if (filtered.length == 1) {
      setDisplay(<Country country={filtered[0]} />)
    } else if(filtered.length == 0) {
      setDisplay(<div>No matches</div>)
    } else {
      setDisplay(<div>{filtered.map((country) => {
        return <div key={country.name.common}>
            <div>{country.name.common}</div>
            <button onClick={()=>{setCountrySearch(country.name.common); document.getElementById('country_input').value = country.name.common}}>Show</button>
          </div>
      })}</div>)
    }
  }, [countrySearch])
  return (
    <div>
      <input type="text" id="country_input" onChange={handleCountryInput}/>
      {display}
    </div>
  )
}

const Country = ({ country }) => {
  let [weatherContent, setWeatherContent] = useState(<div></div>)
  useEffect(()=>{
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country.capital[0]}/today?unitGroup=metric&key=${WEATHER_KEY}&contentType=json`)
      .then((response) => {
        return response.json()
      })
      .then((content) => {
        console.log(content)
        let weather = <div>
          <div>Conditions: {content.currentConditions.conditions}</div>
          <div>Temperature: {content.currentConditions.temp} Celsius</div>
          <div>Wind speed: {content.currentConditions.windspeed} m/s</div>
        </div>
        setWeatherContent(weather)
      })
  },[])
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital: {country.capital[0]}</div>
      <div>area: {country.area}</div>
      <h2>Languages:</h2>
      <ul>
        {
          Object.values(country.languages).map((language) => <li key={language}>{language}</li>)
        }
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} />
      <h2>Weather in {country.capital[0]}</h2>
      {weatherContent}
    </div>
  )
}

export default App
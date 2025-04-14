const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD': {
      let newState = {
        ...state,
        good: state.good + 1
      }
      return newState
    }
    case 'OK': {
      let newState = {
        ...state,
        ok: state.ok + 1
      }
      return newState
    }
    case 'BAD': {
      let newState = {
        ...state,
        bad: state.bad + 1
      }
      return newState
    }
    case 'ZERO':
      return initialState
    default: return state
  }
  
}

export default counterReducer

import React, { useReducer } from 'react'
import Context from 'components/common/Context'
import reducer from './movieReducer'
import userReducer from './userReducer'

export default ({ children }) => {
  const [movies, dispatch] = useReducer(reducer, [])
  const [user, dispatchUserAction] = useReducer(userReducer, {})

  return (
    <Context.Provider
      value={{
        movies,
        dispatch,
        user,
        dispatchUserAction,
      }}
    >
      {children}
    </Context.Provider>
  )
}

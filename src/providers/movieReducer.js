import { navigate } from 'gatsby'

export default (movies, action) => {
  switch (action.type) {
    case 'Add_NEW_MOVIE':
      return [...movies, action.payload]
    case 'FETCH_MOVIES':
      return action.payload
    case 'GET_DATA_BY_ID':
      return action.payload
    case 'TOGGLE_MOVIE':
      navigate('/app/')
      return movies.map(item =>
        item.id === action.id
          ? {
              ...item,
              isDone: !item.isDone,
            }
          : item
      )
    default:
      return movies
  }
}

import { navigate } from 'gatsby'

export default (movies, action) => {
  switch (action.type) {
    case 'Add_NEW_MOVIE':
      return [...movies, action.payload]
    case 'FETCH_MOVIES':
      return action.payload
    case 'GET_DATA_BY_ID':
      return action.payload
    default:
      return movies
  }
}

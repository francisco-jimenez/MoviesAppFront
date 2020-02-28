import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'gatsby'
import Context from 'components/common/Context'
import MoviesLoading from './common/MoviesLoading'

export default () => {
  const [loading, setLoading] = useState(true)
  const { movies, dispatch } = useContext(Context)
  const { user, dispatchUserAction } = useContext(Context)

  const fetchMovies = async () => {
    try {
      const token = window.localStorage.getItem('token')

      const { data } = await axios.get(
        `${process.env.API}/movies`,
         config
       )

      await dispatch({ type: 'FETCH_MOVIES', payload: data.data.movies })
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <>
      <div className="container">
        {user &&
          <h4>Hi, {user.data.name}</h4>
        }
        <h2>Movies list</h2>
        {loading ? (
          <MoviesLoading />
        ) : (
          <>
            {movies && (
              <ul>
                {movies.map(({ name, id }) => (
                  <li key={id}>
                    <Link
                      to={`/app/movie/${id}`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/app/movie/new/">New Movie</Link>
          </>
        )}
      </div>
    </>
  )
}

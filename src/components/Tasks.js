import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'gatsby'
import Context from 'components/common/Context'
import SEO from 'components/common/Seo'
import TasksLoading from './common/TasksLoading'

export default () => {
  const [loading, setLoading] = useState(true)
  const { tasks, dispatch } = useContext(Context)

  const fetchMovies = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const config = {
        headers: {
          'x-access-token': token,
        }
      }
      const { data } = await axios.get(
        `${process.env.API}/movies`,
         config
       )

      await dispatch({ type: 'FETCH_TASKS', payload: data.data.movies })
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
        <h1>Tasks</h1>
        {loading ? (
          <TasksLoading />
        ) : (
          <>
            {console.log(tasks)}
            {tasks && (
              <ul>
                {tasks.map(({ name, id }) => (
                  <li key={id}>
                    <Link
                      to={`/app/task/`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/app/task/new/">Add new Task</Link>
          </>
        )}
      </div>
    </>
  )
}

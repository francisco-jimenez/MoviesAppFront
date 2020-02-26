import React, { useContext, useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import axios from 'axios'
import Context from 'components/common/Context'

export default ({ id }) => {
  const { selectedTask, dispatch } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setSubmitting] = useState(false)
  console.log('paramId',id)

  const fetchTask = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const config = {
        headers: {
          'x-access-token': token,
        }
      }
      const { data } = await axios.get(
        `${process.env.API}/movies/${id}`,
         config
       )
       console.log(data.data.movies[0])
      dispatch({ type: 'GET_DATA_BY_ID', payload: data.data.movies[0] })
      setLoading(false)
    } catch (err) {
      navigate('/404/')
    }
  }

  const deleteTask = async () => {
    try {
      setSubmitting(true)
      await axios.delete(`${process.env.API}/${id}`)
      navigate('/app/tasks/')
      setSubmitting(false)
    } catch (error) {
      // TODO: use react-toastify
      alert('something went wrong')
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchTask()
  }, [])

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div className="container">
          <h1>
            {selectedTask}
          </h1>
          <button type="button" disabled={isSubmitting} onClick={deleteTask}>
            Delete
          </button>
        </div>
      )}
    </>
  )
}

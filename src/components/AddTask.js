import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { navigate } from 'gatsby'
import Context from 'components/common/Context'
const qs = require('querystring')

export default ({ id }) => {
  const { dispatch } = useContext(Context)

  const [isSubmitting, setSubmitting] = useState(false)

  let movieId = id
  console.log(movieId)

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)

  const [score, setScore] = useState(0)
  const [scoreError, setScoreError] = useState(false)

  const [director, setDirector] = useState('')
  const [directorError, setDirectorError] = useState(false)

  const [releaseDate, setReleaseDate] = useState('')
  const [releaseDateError, setReleaseDateError] = useState(false)

  const [plotDescription, setPlotDescription] = useState('')
  const [plotDescriptionError, setPlotDescriptionError] = useState(false)

  const handleChange = e => {
    const value = e.target.value
    switch (e.target.name) {
      case 'name':
        setName(value)
        break;

      case 'release_date':
        setReleaseDate(value)
        break;

      case 'score':
        setScore(value)
        break;

      case 'director':
        setDirector(value)
        break;

      case 'plot':
        setPlotDescription(value)
        break;

      default:
        break;
    }
    setSubmitting(false)
  }

  const fetchTask = async () => {
    if (movieId) {
      try {
        const token = window.localStorage.getItem('token')
        const config = {
          headers: {
            'x-access-token': token,
          }
        }
        const { data } = await axios.get(
          `${process.env.API}/movies/${movieId}`,
          config
        )
        let fetchMovie = data.data.movies
        setName(fetchMovie.name)
        setReleaseDate(fetchMovie.release_date)
        setDirector(fetchMovie.director)
        setScore(fetchMovie.score)
        setPlotDescription(fetchMovie.plot_description)
      } catch (err) {
        // navigate('/404/')
      }
    }
  }

  useEffect(() => {
    fetchTask()
  }, [])

  const checkErrors = () => {
    let cleanOfError = true

    if (!name) {
      setNameError(true)
      cleanOfError = false
    }
    if (!releaseDate) {
      setReleaseDateError(true)
      cleanOfError = false
    }
    if (!score) {
      setScoreError(true)
      cleanOfError = false
    }
    if (!director) {
      setDirectorError(true)
      cleanOfError = false
    }
    if (!plotDescription) {
      setPlotDescriptionError(true)
      cleanOfError = false
    }

    return cleanOfError
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (checkErrors()) {
        const token = window.localStorage.getItem('token')
        const requestBody = {
          name: name,
          released_date: releaseDate,
          director: director,
          score: score,
          plot_description: plotDescription
        }
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': token,
          }
        }
        const { data } = await axios.post(
          `${process.env.API}/movies`,
          qs.stringify(requestBody),
          config
        )

        dispatch({ type: 'Add_NEW_TASK', payload: data })
        navigate('/app/tasks/')
        setSubmitting(false)
      }
    } catch (err) {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="text"
              placeholder="Film Name"
              name="name"
              value ={name}
            />
            {nameError && <span style={{ color: 'red' }}>{'Name is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="date"
              placeholder="Release Date"
              name="release_date"
              value ={releaseDate}
            />
            {releaseDateError && <span style={{ color: 'red' }}>{'Release date is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="director"
              placeholder="Director"
              name="director"
              value ={director}
            />
            {directorError && <span style={{ color: 'red' }}>{'Director is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="number"
              placeholder="Score"
              name="score"
              min="0"
              max="10"
              step="0.5"
              value ={score}
            />
            {scoreError && <span style={{ color: 'red' }}>{'Score is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="text"
              placeholder="Plot description"
              name="plot"
              value ={plotDescription}
            />
            {plotDescriptionError && <span style={{ color: 'red' }}>{'Plot Description is required'}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-rounded gradient-green"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

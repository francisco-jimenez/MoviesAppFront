import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { navigate } from 'gatsby'
import Context from 'components/common/Context'
const moment = require('moment');
const qs = require('querystring')

export default ({ id }) => {
  const { dispatch } = useContext(Context)

  const [isSubmitting, setSubmitting] = useState(false)
  const [isEditing, setEditing] = useState(false)

  let movieId = id
  console.log(movieId)

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)

  const [score, setScore] = useState(0)
  const [scoreError, setScoreError] = useState(false)

  const [director, setDirector] = useState('')
  const [directorError, setDirectorError] = useState(false)

  const [releaseDate, setReleaseDate] = useState(null)
  const [releaseDateError, setReleaseDateError] = useState(false)

  const [plotDescription, setPlotDescription] = useState('')
  const [plotDescriptionError, setPlotDescriptionError] = useState(false)

  useEffect(() => {
    fetchMovie()
  }, [])

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
    setEditing(true)
  }

  const fetchMovie = async () => {
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
        console.log(fetchMovie)
        setName(fetchMovie.name)
        setReleaseDate(fetchMovie.released_date)
        setDirector(fetchMovie.director)
        setScore(fetchMovie.score)
        setPlotDescription(fetchMovie.plot_description)
        setEditing(false)
      } catch (err) {
        navigate('/404/')
      }
    }
  }

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
    if (!score && score !== 0) {
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

  const deleteMovie = async () => {
    try {
      const token = window.localStorage.getItem('token')
      const config = {
        headers: {
          'x-access-token': token,
        }
      }
      setSubmitting(true)
      await axios.delete(`${process.env.API}/movies/${movieId}`,config)
      navigate('/app/movies/')
      setSubmitting(false)
    } catch (error) {
      alert('something went wrong')
      setSubmitting(false)
    }
  }

  const updateMovie = async () => {
    try {
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
      setSubmitting(true)
      await axios.put(
        `${process.env.API}/movies/${movieId}`,
        qs.stringify(requestBody),
        config
      )
      navigate('/app/movies/')
      setSubmitting(false)
    } catch (error) {
      alert('something went wrong')
      setSubmitting(false)
    }
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

        dispatch({ type: 'Add_NEW_MOVIE', payload: data })
        navigate('/app/movies/')
        setSubmitting(false)
      }
    } catch (err) {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="container">
        <button
              className="btn btn-rounded gradient-green"
                onClick={() => navigate('/app/movies/')}
              >
                Back
        </button>
        {/* <form onSubmit={handleSubmit}> */}
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="text"
              placeholder="Film Name"
              name="name"
              value={name}
            />
            {nameError && <span style={{ color: 'red' }}>{'Name is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="date"
              placeholder="Release Date"
              name="release_date"
              value={moment(releaseDate).format('YYYY-MM-DD')}
            />
            {releaseDateError && <span style={{ color: 'red' }}>{'Release date is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="director"
              placeholder="Director"
              name="director"
              value={director}
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
              value={score}
            />
            {scoreError && <span style={{ color: 'red' }}>{'Score is required'}</span>}
          </div>
          <div className="input-field black-input">
            <input
              onChange={handleChange}
              type="text"
              placeholder="Plot description"
              name="plot"
              value={plotDescription}
            />
            {plotDescriptionError && <span style={{ color: 'red' }}>{'Plot Description is required'}</span>}
          </div>
          {!movieId &&
            <button
              onClick={handleSubmit}
              className="btn btn-rounded gradient-green"
              disabled={isSubmitting}
            >
              Submit
          </button>
          }
          {movieId &&
            <>
              <button
                onClick={updateMovie}
                className="btn btn-rounded gradient-green"
                disabled={!isEditing}
              >
                Save changes
              </button>
              <button 
                type="button" 
                disabled={isSubmitting} 
                onClick={deleteMovie}
              >
                Delete
              </button>
            </>
          }
        {/* </form> */}
      </div>
    </>
  )
}

import React, { useContext, useState } from 'react'
import axios from 'axios'
import { navigate } from 'gatsby'
import Context from 'components/common/Context'
import setAuthToken from 'helpers/setAuthToken'
const qs = require('querystring')

export default ({ form }) => {
  const { dispatchUserAction } = useContext(Context)
  const [isSubmitting, setSubmitting] = useState(false)
  const [details, setDetails] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleChange = e => {
    setDetails({ ...details, [e.target.name]: e.target.value })
    setErrors({})
    setSubmitting(false)
  }

  const handleBlur = e => {
    if (!e.target.value) {
      setErrors({ ...errors, [e.target.name]: 'Required field' })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { username, email, password } = details

      if (form === 'login') {
        if (!email || !password) {
          setErrors({
            ...errors,
            email: 'Field is required',
            password: 'Field is required',
          })
        } else {
          const requestBody = {
            email: email,
            password: password,
          }
          const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          const { data } = await axios.post(
                                             `${process.env.API}/users/authenticate`,
                                              qs.stringify(requestBody),
                                              config
                                            )
          
          if(data.data && data.data.token && data.status !== 'error'){
            await setAuthToken(data.data.token)
            dispatchUserAction({ type: 'SAVE_USER', payload: data.data.user })
            window.localStorage.setItem('token', data.data.token)
            navigate('/app/tasks/')
          } else {
            setErrors({
              ...errors,
              email: 'wrong user',
              password: 'wrong password',
            })
          }
        }
      } else {
        if (!username || !email || !password) {
          alert('aye sir')
        } else {
          const requestBody = {
            name: username,
            email: email,
            password: password,
          }
          const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          const { data } = await axios.post(
            `${process.env.API}/users/register`,
             qs.stringify(requestBody),
             config
           )
           navigate('/app/login/')
        }
      }
    } catch (err) {
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {form === 'register' && (
          <div className="input-field black-input">
            <span className="user-icon" />
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              placeholder="Enter your username"
              name="username"
            />
            {errors.username && (
              <span style={{ color: 'red' }}>{errors.username}</span>
            )}
          </div>
        )}
        <div className="input-field black-input">
          <span className="email-icon" />
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            placeholder="Enter your email"
            name="email"
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className="input-field black-input">
          <span className="lock-icon" />
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            placeholder="Enter your password"
            name="password"
          />
          {errors.password && (
            <span style={{ color: 'red' }}>{errors.password}</span>
          )}
        </div>
        <div className="center-text">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-rounded gradient-green"
          >
            {form}
          </button>
        </div>
      </form>
    </div>
  )
}

import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { navigate } from 'gatsby'
import setAuthToken from 'helpers/setAuthToken'
import Layout from 'components/common/Layout'
import Context from './common/Context'

export default ({ children }) => {
  const { user, dispatchUserAction } = useContext(Context)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const token = window.localStorage.getItem('token')
      if (token) {
        const { data } = await axios({
          method: 'GET',
          url: `${process.env.API}/users/authenticate`,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })

        await setAuthToken(data.token)
        dispatchUserAction({ type: 'SAVE_USER', payload: data.data.user })
        window.localStorage.setItem('token', data.token)

        if (
          window.location.pathname === '/app/login' ||
          window.location.pathname === '/app/register' ||
          window.location.pathname === '/app' ||
          window.location.pathname === '/app/login/' ||
          window.location.pathname === '/app/register/' ||
          window.location.pathname === '/app/'
        ) {
          navigate('/app/movies/')
        }
        setLoading(false)
      } else {
        if (
          window.location.pathname === '/app/movies' ||
          window.location.pathname === '/app/movies/' ||
          window.location.pathname === '/app/movie' ||
          window.location.pathname === '/app/movie/' ||
          window.location.pathname === '/app/movie/new/' ||
          window.location.pathname === '/app/movie/new'
        ) {
          navigate('/app/login/')
        }
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
    }
  }

  const logout = async () => {
      // await axios.delete(`${process.env.API}/user/logout`)
      dispatchUserAction({ type: 'LOGOUT' })
      window.localStorage.removeItem('token')
      setAuthToken(false)
      navigate('/')
  }

  useEffect(() => {
    if (!user.isLoggedIn) {
      fetchUser()
    }
  }, [])

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <Layout logout={logout}>
          {children}
        </Layout>
      )}
    </>
  )
}

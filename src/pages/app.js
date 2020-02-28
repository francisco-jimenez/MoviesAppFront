import React from 'react'
import { Router } from '@reach/router'
import Provider from 'providers/Provider'
import AppWrapper from 'components/AppWrapper'
import App from 'components/App'
import Movies from 'components/Movies'
// import Movie from 'components/Movie'
import AddMovie from 'components/AddMovie'
import NotFound from 'components/common/NotFound'
import Register from 'components/Register'
import Login from 'components/Login'

export default () => (
  <Provider>
    <AppWrapper>
      <Router>
        <App path="/app/" component={App} />
        <Movies path="/app/movies/" component={Movies} />
        <Register path="/app/register/" component={Register} />
        <Login path="/app/login/" component={Login} />
        <AddMovie path="/app/movie/:id" component={AddMovie} />
        <AddMovie path="/app/movie/new" component={AddMovie} />
        <NotFound default component={NotFound} />
      </Router>
    </AppWrapper>
  </Provider>
)

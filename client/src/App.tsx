import './styles/index.scss'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import Dashboard, { loader as dashboardLoader } from './components/Dashboard'
import DbError from './components/DbError'
import Error from './components/Error'
import Layout, { loader as layoutLoader } from './components/Layout'
import MovieCreate, { action as movieCreateAction, loader as movieCreateLoader } from './components/MovieCreate'
import MovieDelete, { action as movieDeleteAction, loader as movieDeleteLoader } from './components/MovieDelete'
import MovieEdit, { action as movieEditAction, loader as movieEditLoader } from './components/MovieEdit'
import MoviesLayout, { loader as moviesLayout } from './components/MoviesLayout'
import DbMovieCard, { loader as dbMovieCardLoader } from './pages/dbMovies/DbMovieCard'
import DbMovies, { loader as dbMoviesLoader } from './pages/dbMovies/DbMovies'
import Home, { loader as homeLoader } from './pages/Home'
import Logout from './pages/login/Logout'
import SignIn, { action as sigInAction, loader as sigInLoader } from './pages/login/SignIn'
import SignUp, { action as signUpAction } from './pages/login/SignUp'
import MovieCard, { loader as movieCardLoader } from './pages/movies/MovieCard'
import Movies, { loader as moviesLoader } from './pages/movies/Movies'
import NotFound from './pages/NotFound'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} loader={layoutLoader}>
      <Route index element={<Home />} loader={homeLoader} />
      <Route path='signin' element={<SignIn />} loader={sigInLoader} action={sigInAction} errorElement={<Error />} />
      <Route path='signup' element={<SignUp />} action={signUpAction} errorElement={<Error />} />
      <Route path='logout' element={<Logout />} />
      <Route path='moviesdb' element={<MoviesLayout />} loader={moviesLayout}>
        <Route index element={<Dashboard />} loader={dashboardLoader} errorElement={<Error />} />
        <Route path='list' element={<DbMovies />} loader={dbMoviesLoader} errorElement={<DbError />} />
        <Route path='list/:id' element={<DbMovieCard />} loader={dbMovieCardLoader} errorElement={<DbError />} />
      </Route>
      <Route path='movies' element={<MoviesLayout />} loader={moviesLayout}>
        <Route index element={<Dashboard />} loader={dashboardLoader} errorElement={<Error />} />
        <Route path='list' element={<Movies />} errorElement={<Error />} loader={moviesLoader} />
        <Route
          path='create'
          element={<MovieCreate />}
          loader={movieCreateLoader}
          action={movieCreateAction}
          errorElement={<Error />}
        />
        <Route path='list/:id' element={<MoviesLayout />} loader={moviesLayout}>
          <Route index element={<MovieCard />} loader={movieCardLoader} errorElement={<Error />} />
          <Route
            path='edit'
            element={<MovieEdit />}
            loader={movieEditLoader}
            action={movieEditAction}
            errorElement={<Error />}
          />
          <Route
            path='delete'
            element={<MovieDelete />}
            loader={movieDeleteLoader}
            action={movieDeleteAction}
            errorElement={<Error />}
          />
        </Route>
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>,
  ),
)

function App() {
  return <RouterProvider router={router} />
}

export default App

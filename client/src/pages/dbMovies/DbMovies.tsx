import { Suspense, useState } from 'react'
import { Await, defer, Link, useLoaderData, useSearchParams } from 'react-router-dom'

import { getDbMovies } from '../../api'
import type { DbMovieLoaderData } from '../../interfaces'
import { requireAuth } from '../../utils'

export async function loader({ request }: { request: Request }) {
  await requireAuth(request)
  const searchParams = new URL(request.url).searchParams
  const search = searchParams.get('search') || ''
  const dbMovies = getDbMovies(search)
  return defer({ dbMovies })
}

export default function DbMovies() {
  const [search, setSearch] = useState<string>('')
  const [searchParams, setSearchParams] = useSearchParams()
  const dbMoviesPromise = useLoaderData() as { dbMovies: DbMovieLoaderData[] }
  const tmdbLink = <Link to='https://www.themoviedb.org/'>TMDB</Link>

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const key = 'search'
    const value = e.target.value
    setSearch(value)
    setSearchParams((prevParams) => {
      value === null ? prevParams.delete(key) : prevParams.set(key, value)
      return prevParams
    })
  }

  function renderDbMovies(dbMovies: DbMovieLoaderData[]) {
    const filteredDbMovies = (dbMovies?.slice(0, 8) || []).map(({ id, original_title, release_date, vote_average }) => (
      <Link
        className='container bg-accent bg-opacity-00'
        key={id}
        to={`${id}`}
        state={{ search: `?${searchParams.toString()}` }}
      >
        <h3>{original_title}</h3>
        <i className='fs-300'>
          ({release_date.slice(0, 4)}
          <span>, {vote_average} Rating)</span>
        </i>
      </Link>
    ))

    return (
      <>
        <div className='flow'>
          <div className='flex'>
            <h3>Movies from</h3>
            <h3>{tmdbLink}</h3>
          </div>
          <input onChange={handleChange} value={search} type='search' placeholder='Search...' />
        </div>
        <div className='ff-sans-cond'>{filteredDbMovies}</div>
      </>
    )
  }

  return (
    <div className='flow container'>
      <Suspense fallback={<h2>Loading movies from TMDB...</h2>}>
        <Await resolve={dbMoviesPromise.dbMovies}>{renderDbMovies}</Await>
      </Suspense>
    </div>
  )
}

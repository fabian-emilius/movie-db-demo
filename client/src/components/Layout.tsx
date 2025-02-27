import { Outlet } from 'react-router-dom'

import Footer from './Footer'
import Header from './Header'

export async function loader() {
  return null
}

export default function Layout() {
  return (
    <div className='layout'>
      <Header />
      <main className='box-shadow bg-accent bg-opacity-02'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

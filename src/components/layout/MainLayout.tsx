import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const MainLayout = () => {
  const location = useLocation()
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  )
}

export default MainLayout

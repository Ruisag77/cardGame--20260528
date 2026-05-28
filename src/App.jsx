import { Outlet } from 'react-router-dom'
import MeshBackground from './components/ui/MeshBackground.jsx'

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-navy">
      <MeshBackground />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  )
}

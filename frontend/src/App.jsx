import { AuthProvider } from './features/auth/AuthProvider.jsx'
import { Navbar } from './components/Navbar.jsx'
import { Footer } from './components/Footer.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App

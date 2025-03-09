import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Header } from "./components/Header"
import { UserStatus } from "./components/UserStatus"
import { Home } from "./pages/Home"
import { Dashboard } from "./pages/Dashboard"
import { About } from "./pages/About"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserStatus />
          <div className="mt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  )
}

export default App


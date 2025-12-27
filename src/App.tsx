import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ServiceProvider } from "@/modules/admin/context/ServiceContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

// Service Routes (each renders its own complete UI)
import { MLRoutes } from "@/modules/ml/routes"
import { RAGRoutes } from "@/modules/rag/routes"
import { AgentsRoutes } from "@/modules/agents/routes"

// Platform Pages
import LandingPage from "@/pages/LandingPage"
import Login from "@/pages/Login"
import AdminDashboard from "@/modules/admin/pages/AdminDashboard"

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page - Service Selector */}
            <Route path="/" element={<LandingPage />} />

            {/* Platform Auth */}
            <Route path="/login" element={<Login />} />

            {/* Protected Service Routes */}
            <Route path="/ml/*" element={
              <ProtectedRoute>
                <MLRoutes />
              </ProtectedRoute>
            } />
            <Route path="/rag/*" element={
              <ProtectedRoute>
                <RAGRoutes />
              </ProtectedRoute>
            } />
            <Route path="/agents/*" element={
              <ProtectedRoute>
                <AgentsRoutes />
              </ProtectedRoute>
            } />

            {/* Admin Dashboard - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ServiceProvider>
    </AuthProvider>
  )
}

export default App

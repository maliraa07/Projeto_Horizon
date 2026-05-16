import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AnalisesPage } from './pages/AnalisesPage'
import { CategoriasPage } from './pages/CategoriasPage'
import { ConfiguracoesPage } from './pages/ConfiguracoesPage'
import { DashboardPage } from './pages/DashboardPage'
import { LancamentosPage } from './pages/LancamentosPage'
import { LoginPage } from './pages/LoginPage'
import { PrivacidadePage } from './pages/PrivacidadePage'
import { SobrePage } from './pages/SobrePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/sobre" element={<SobrePage />} />
      <Route path="/privacidade" element={<PrivacidadePage />} />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lancamentos" element={<LancamentosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/analises" element={<AnalisesPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

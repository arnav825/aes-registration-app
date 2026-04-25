import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import Welcome          from './pages/Welcome';
import CategorySelect   from './pages/CategorySelect';
import LevelSelect      from './pages/LevelSelect';
import RegistrationForm from './pages/RegistrationForm';
import Success          from './pages/Success';
import AdminLogin       from './pages/AdminLogin';
import AdminDashboard   from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <RegistrationProvider>
        <Routes>
          <Route path="/"                  element={<Welcome />} />
          <Route path="/category"          element={<CategorySelect />} />
          <Route path="/level"             element={<LevelSelect />} />
          <Route path="/register"          element={<RegistrationForm />} />
          <Route path="/success"           element={<Success />} />
          <Route path="/admin/login"       element={<AdminLogin />} />
          <Route path="/admin/dashboard"   element={<AdminDashboard />} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </RegistrationProvider>
    </BrowserRouter>
  );
}

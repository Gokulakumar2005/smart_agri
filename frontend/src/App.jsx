import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/user/Dashboard';
import CropForm from './pages/user/CropForm';
import PlanView from './pages/user/PlanView';
import PlantHealth from './pages/user/PlantHealth';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCrops from './pages/admin/AdminCrops';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crop-form" element={<CropForm />} />
              <Route path="/plans" element={<PlanView />} />
              <Route path="/plant-health" element={<PlantHealth />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/crops" element={<AdminCrops />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

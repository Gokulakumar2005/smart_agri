import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/user/Dashboard';
import CropForm from './pages/user/CropForm';
import Plans from './pages/user/Plans';
import PlanView from './pages/user/PlanView';
import PlantHealth from './pages/user/PlantHealth';
import Tasks from './pages/user/Tasks';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCrops from './pages/admin/AdminCrops';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3500} newestOnTop closeOnClick pauseOnHover theme="colored" />
            <div className="min-h-screen md:flex">
              <Navbar />
              <main className="min-w-0 flex-1 p-4 md:p-6">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/crop-form" element={<CropForm />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/plans/:id" element={<PlanView />} />
                    <Route path="/plant-health" element={<PlantHealth />} />
                    <Route path="/tasks" element={<Tasks />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/crops" element={<AdminCrops />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

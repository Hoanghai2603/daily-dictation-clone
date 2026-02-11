import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { ExercisesPage } from './pages/Exercises';
import { ExerciseDetailPage } from './pages/ExerciseDetail';
import { LoginPage } from './pages/Login';
import { Topics } from './pages/Topics';
import { UsersPage } from './pages/UsersPage';
import { UserDetailPage } from './pages/UserDetailPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="topics" element={<Topics />} />
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="exercises/:id" element={<ExerciseDetailPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="settings" element={<div className="p-10 font-bold text-gray-400">Settings Page (Coming Soon)</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

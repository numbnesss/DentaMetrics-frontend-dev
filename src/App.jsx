import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout/Layout';
import Login from './components/auth/Login/Login';
import RequireAuth from './components/auth/RequireAuth';
import Dashboard from './components/reviewPage/dashboard/Dashboard/Dashboard';
import Branches from './components/branchesPage/Branches/Branches';
import Doctors from './components/doctorsPage/Doctors/Doctors';
import DoctorProfile from './components/doctorProfile/DoctorProfile/DoctorProfile';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

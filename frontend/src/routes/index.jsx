import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute, { PublicRoute } from './ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Groups from '../pages/Groups';
import GroupDetail from '../pages/GroupDetail';
import GroupCycles from '../pages/GroupCycles';
import CycleDetail from '../pages/CycleDetail';
import Contributions from '../pages/Contributions';
import Cycles from '../pages/Cycles';
import PayoutOrder from '../pages/PayoutOrder';
import Profile from '../pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/groups', element: <Groups /> },
      { path: '/groups/:groupId', element: <GroupDetail /> },
      { path: '/groups/:groupId/cycles', element: <GroupCycles /> },
      { path: '/groups/:groupId/cycles/:cycleId', element: <CycleDetail /> },
      { path: '/contributions', element: <Contributions /> },
      { path: '/cycles', element: <Cycles /> },
      { path: '/payout-order', element: <PayoutOrder /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;

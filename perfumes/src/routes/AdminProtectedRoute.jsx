import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const admin = JSON.parse(localStorage.getItem("admin"));

  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default AdminProtectedRoute;
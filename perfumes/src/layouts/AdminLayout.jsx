import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f5ef]">
      <AdminSidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ef] via-[#fffdf8] to-[#f3eee6] lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
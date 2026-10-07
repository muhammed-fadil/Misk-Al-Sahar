import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f5ef] lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#744b4b] p-6 text-white">
      <h2 className="mb-10 text-2xl font-bold">
        Misk Al-Sahar
      </h2>

      <nav className="space-y-4">
        <Link
          to="/admin/dashboard"
          className="block rounded px-4 py-2 hover:bg-[#5f3c3c]"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="block rounded px-4 py-2 hover:bg-[#5f3c3c]"
        >
          Products
        </Link>

        <Link
          to="/admin/users"
          className="block rounded px-4 py-2 hover:bg-[#5f3c3c]"
        >
          Users
        </Link>

        <Link
          to="/admin/orders"
          className="block rounded px-4 py-2 hover:bg-[#5f3c3c]"
        >
          Orders
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto w-full rounded bg-white px-4 py-2 text-[#744b4b]"
      >
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
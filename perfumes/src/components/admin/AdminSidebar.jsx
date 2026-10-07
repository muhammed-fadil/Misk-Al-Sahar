import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside className="w-full shrink-0 bg-[#744b4b] p-4 text-white sm:p-6 lg:sticky lg:top-0 lg:h-screen lg:w-64">
      <div className="flex flex-col lg:h-full">
        <h2 className="mb-6 text-xl font-bold sm:text-2xl lg:mb-10">
          Misk Al-Sahar
        </h2>

        <nav className="flex flex-col gap-2">
          <Link
            to="/admin/dashboard"
            className="rounded px-4 py-2 hover:bg-[#5f3c3c]"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="rounded px-4 py-2 hover:bg-[#5f3c3c]"
          >
            Products
          </Link>

          <Link
            to="/admin/users"
            className="rounded px-4 py-2 hover:bg-[#5f3c3c]"
          >
            Users
          </Link>

          <Link
            to="/admin/orders"
            className="rounded px-4 py-2 hover:bg-[#5f3c3c]"
          >
            Orders
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 rounded bg-white px-4 py-2 text-[#744b4b] hover:bg-gray-100 lg:mt-auto lg:w-full"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
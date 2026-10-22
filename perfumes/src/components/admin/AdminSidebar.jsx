import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  Store,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  {to:"/admin/Managment",label:"Managment",icon:Package},
];

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside className="relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#2b1710] via-[#392016] to-[#2b1710] text-white lg:sticky lg:top-0 lg:h-screen lg:w-72">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,123,36,0.18),transparent_60%)]" />

      <div className="relative flex flex-col p-5 sm:p-6 lg:h-full">
        <div className="mb-7 lg:mb-10">
          <Link
            to="/admin/dashboard"
            className="font-serif text-2xl text-[#e6d5a8] transition-colors duration-300 hover:text-white"
          >
            مِسْك السَّحَر
          </Link>

          <p className="mt-1 text-[10px] font-medium uppercase tracking-[3px] text-[#9a7b24]">
            Admin Panel
          </p>

          <div className="mt-4 h-px w-full bg-gradient-to-r from-[#9a7b24]/50 to-transparent" />
        </div>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#9a7b24]/20 text-[#e6d5a8] shadow-soft ring-1 ring-[#9a7b24]/30"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-[#9a7b24]" : ""
                  }`}
                />
                {label}

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#9a7b24]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 flex flex-col gap-2 lg:mt-auto">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            <Store size={18} />
            View Store
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-red-500/80"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

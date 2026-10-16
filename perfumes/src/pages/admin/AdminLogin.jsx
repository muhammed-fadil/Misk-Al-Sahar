import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdmins } from "../../services/adminService";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const response = await getAdmins();

      const admin = response.data.find(
        (admin) =>
          admin.email === email &&
          admin.password === password
      );

      if (!admin) {
        toast.error("Invalid admin credentials");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(admin));

      toast.success("Admin login successful");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to the server");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#2b1710] via-[#392016] to-[#2b1710] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,123,36,0.25),transparent_60%)]" />

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-2xl border border-[#e6d5a8]/15 bg-white/95 p-6 shadow-luxury backdrop-blur-sm sm:p-8"
      >
        <div className="mb-8 text-center">
          <p className="font-serif text-3xl text-[#744b4b]">
            مِسْك السَّحَر
          </p>

          <p className="mt-3 text-[10px] font-medium uppercase tracking-[4px] text-[#9a7b24]">
            Admin Access
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Admin Login
          </h1>

          <div className="mx-auto my-4 h-px w-16 bg-gradient-to-r from-transparent via-[#9a7b24] to-transparent" />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-[#744b4b]">
            Email
          </label>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[#e4dccf]/60 bg-[#fffdf9]/80 px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#9a7b24] focus:ring-2 focus:ring-[#9a7b24]/20 hover:border-[#9a7b24]/40"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-[#744b4b]">
            Password
          </label>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[#e4dccf]/60 bg-[#fffdf9]/80 px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#9a7b24] focus:ring-2 focus:ring-[#9a7b24]/20 hover:border-[#9a7b24]/40"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#744b4b] py-3 font-medium text-white shadow-soft transition-all duration-300 hover:bg-[#9a7b24] hover:shadow-luxury"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
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
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4 py-8">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#744b4b] sm:text-3xl">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Misk Al-Sahar
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-[#744b4b] py-3 font-medium text-white transition hover:bg-[#5f3c3c]"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
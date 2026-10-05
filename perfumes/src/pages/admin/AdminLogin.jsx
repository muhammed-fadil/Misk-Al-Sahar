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
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-[#744b4b]">
          Admin Login
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Misk Al-Sahar
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border px-4 py-3 outline-none focus:border-[#9a7b24]"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border px-4 py-3 outline-none focus:border-[#9a7b24]"
        />

        <button
          type="submit"
          className="w-full rounded bg-[#744b4b] py-3 text-white transition hover:bg-[#5f3c3c]"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
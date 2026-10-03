
import { useState } from "react";
import { registerUser, getUsers } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  

    if (!name || !email || !password) {
toast.error("All fields are required");  
    return;
    }

    if (password.length < 6) {
toast.error("Password must be at least 6 characters");   
   return;
    }

    try {
      const response = await getUsers();

      const exists = response.data.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
toast.error("Email already registered");
        return;
      }

      await registerUser({
        name,
        email,
        password,
      });
      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please check JSON Server.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-['Amiri'] text-3xl text-[#744b4b]">
            مِسْك السَّحَر
          </p>

          <p className="mt-4 text-xs tracking-[3px] text-[#9a7b24]">
            JOIN MISK AL-SAHAR
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#744b4b] sm:text-4xl">
            Create Account
          </h1>

          <p className="mt-3 text-sm text-[#777]">
            Create an account and discover your signature scent.
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">


          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#744b4b]">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-[#e4dccf] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#744b4b]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-[#e4dccf] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#744b4b]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-lg border border-[#e4dccf] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
              />

              <p className="mt-2 text-xs text-gray-400">
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#744b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#9a7b24]"
            >
              Create Account
            </button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e4dccf]" />

            <span className="text-xs text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-[#e4dccf]" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-[#777]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#9a7b24] hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Register;


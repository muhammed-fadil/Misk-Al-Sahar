
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../redux/slices/authSlice";
import { loadCart } from "../redux/slices/cartSlice";
import { loadWishlist } from "../redux/slices/wishlistSlice";

import { getUsers } from "../services/userService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await getUsers();

      const user = response.data.find(
        (user) =>
          user.email === email &&
          user.password === password
      );

      if (!user) {
        setError("Invalid email or password");
        return;
      }

      dispatch(login(user));

      const cart =
        JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];

      const wishlist =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

      dispatch(loadCart(cart));
      dispatch(loadWishlist(wishlist));

      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
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
            WELCOME BACK
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#744b4b] sm:text-4xl">
            Sign In
          </h1>

          <p className="mt-3 text-sm text-[#777]">
            Enter your details to continue your fragrance journey.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

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
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#e4dccf] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#744b4b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#9a7b24]"
            >
              Login
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

          {/* Register */}
          <p className="text-center text-sm text-[#777]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#9a7b24] hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default Login;


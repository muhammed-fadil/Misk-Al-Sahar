import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { login } from "../redux/slices/authSlice";
import { loadCart } from "../redux/slices/cartSlice";
import { loadWishlist } from "../redux/slices/wishlistSlice";

import { getUsers } from "../services/userService";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await getUsers();

      const user = response.data.find(
        (user) =>
          user.email?.toLowerCase() === email.trim().toLowerCase() &&
          user.password === password
      );

      if (!user) {
        toast.error("Invalid email or password");
        return;
      }

      // Prevent blocked users from logging in.
      // Users without a status field are treated as active.
      if (user.status?.toLowerCase() === "blocked") {
        toast.error(
          "Your account has been blocked. Please contact the administrator."
        );
        return;
      }

      // Login successful
      dispatch(login(user));

      // Load the user's saved cart
      const cart =
        JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];

      // Load the user's saved wishlist
      const wishlist =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

      dispatch(loadCart(cart));
      dispatch(loadWishlist(wishlist));

      toast.success("Login successful!");

      const from = location.state?.from;

      navigate(from?.pathname || "/", {
        state: from?.state,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8f5ef] via-[#fffdf8] to-[#f3eee6] px-5 py-12">
      <div className="w-full max-w-md">
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

        <div className="rounded-2xl bg-white/95 p-6 shadow-luxury border border-[#e4dccf]/30 backdrop-blur-sm sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#744b4b]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[#e4dccf]/60 bg-[#fffdf9]/80 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#9a7b24] focus:ring-2 focus:ring-[#9a7b24]/20 hover:border-[#9a7b24]/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#744b4b]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[#e4dccf]/60 bg-[#fffdf9]/80 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#9a7b24] focus:ring-2 focus:ring-[#9a7b24]/20 hover:border-[#9a7b24]/40"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#744b4b] px-5 py-3 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:bg-[#9a7b24] hover:shadow-luxury disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e4dccf]" />

            <span className="text-xs text-gray-400">OR</span>

            <div className="h-px flex-1 bg-[#e4dccf]" />
          </div>

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
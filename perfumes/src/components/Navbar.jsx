import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slices/authSlice";
import { clearOrders } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { clearWishlist } from "../redux/slices/wishlistSlice";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const dispatch = useDispatch();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  // Hide shopping navigation on authentication pages
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowMenu(false);
  };

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(clearWishlist());
    dispatch(clearOrders());
    dispatch(logout());

    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e4dccf] bg-[#f8f5ef]">
      <div className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="font-['Amiri'] text-2xl text-[#744b4b] transition hover:text-[#9a7b24] sm:text-3xl"
        >
          مِسْك السَّحَر
        </Link>

        {/* Authentication page */}
        {isAuthPage ? (
          <Link
            to={location.pathname === "/login" ? "/register" : "/login"}
            className="rounded-lg border border-[#744b4b] px-4 py-2 text-sm text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white sm:px-5"
          >
            {location.pathname === "/login"
              ? "Create Account"
              : "Login"}
          </Link>
        ) : (
          <>
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-7 md:flex">

              <Link
                to="/"
                className="text-[#9a7b24] transition hover:text-[#744b4b]"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="text-[#9a7b24] transition hover:text-[#744b4b]"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                className="relative text-[#9a7b24] transition hover:text-[#744b4b]"
              >
                Cart

                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="relative text-[#9a7b24] transition hover:text-[#744b4b]"
              >
                Wishlist

                {wishlistCount > 0 && (
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/about"
                className="text-[#9a7b24] transition hover:text-[#744b4b]"
              >
                About
              </Link>

              {/* Profile */}
              <div className="relative">

                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 text-[#744b4b] transition hover:text-[#9a7b24]"
                >
                  <span>👤</span>
                  <span>{user ? user.name : "Profile"}</span>
                  <span className="text-xs">▼</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 w-60 rounded-lg bg-white p-3 shadow-lg">

                    {user ? (
                      <>
                        <div className="border-b border-gray-200 px-3 pb-3">
                          <p className="font-medium text-[#744b4b]">
                            Hello, {user.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          to="/orders"
                          onClick={() => setShowMenu(false)}
                          className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-[#f8f5ef]"
                        >
                          My Orders
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setShowMenu(false)}
                          className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-[#f8f5ef]"
                        >
                          Wishlist
                        </Link>

                        <Link
                          to="/cart"
                          onClick={() => setShowMenu(false)}
                          className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-[#f8f5ef]"
                        >
                          My Cart
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="mt-2 w-full rounded bg-[#744b4b] px-3 py-2 text-left text-sm text-white hover:bg-[#9a7b24]"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="border-b border-gray-200 px-3 pb-3 text-sm text-gray-500">
                          New customer?
                        </p>

                        <Link
                          to="/login"
                          onClick={() => setShowMenu(false)}
                          className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-[#f8f5ef]"
                        >
                          Login
                        </Link>

                        <Link
                          to="/register"
                          onClick={() => setShowMenu(false)}
                          className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-[#f8f5ef]"
                        >
                          Register
                        </Link>
                      </>
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-2xl text-[#744b4b] md:hidden"
            >
              {showMobileMenu ? "✕" : "☰"}
            </button>
          </>
        )}

      </div>

      {/* Mobile Shopping Menu */}
      {!isAuthPage && showMobileMenu && (
        <div className="border-t border-[#e4dccf] bg-[#f8f5ef] px-5 py-5 md:hidden">

          <div className="flex flex-col gap-1">

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded px-3 py-3 text-[#744b4b] hover:bg-white"
            >
              Home
            </Link>

            <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="rounded px-3 py-3 text-[#744b4b] hover:bg-white"
            >
              Shop
            </Link>

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex justify-between rounded px-3 py-3 text-[#744b4b] hover:bg-white"
            >
              <span>Cart</span>

              {cartCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              className="flex justify-between rounded px-3 py-3 text-[#744b4b] hover:bg-white"
            >
              <span>Wishlist</span>

              {wishlistCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="rounded px-3 py-3 text-[#744b4b] hover:bg-white"
            >
              About
            </Link>

            <div className="mt-2 border-t border-[#e4dccf] pt-3">

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex w-full justify-between rounded px-3 py-3 text-[#744b4b] hover:bg-white"
              >
                <span>👤 {user ? user.name : "Profile"}</span>
                <span>▼</span>
              </button>

              {showMenu && (
                <div className="mt-2 rounded-lg bg-white p-3">

                  {user ? (
                    <>
                      <Link
                        to="/orders"
                        onClick={closeMobileMenu}
                        className="block px-3 py-3 text-sm text-gray-600"
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={closeMobileMenu}
                        className="block px-3 py-3 text-sm text-gray-600"
                      >
                        Wishlist
                      </Link>

                      <Link
                        to="/cart"
                        onClick={closeMobileMenu}
                        className="block px-3 py-3 text-sm text-gray-600"
                      >
                        My Cart
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="mt-2 w-full rounded bg-[#744b4b] px-3 py-3 text-left text-sm text-white"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block px-3 py-3 text-sm text-gray-600"
                      >
                        Login
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="block px-3 py-3 text-sm text-gray-600"
                      >
                        Register
                      </Link>
                    </>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
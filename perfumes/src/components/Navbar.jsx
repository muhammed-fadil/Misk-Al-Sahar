import { useState } from "react";
import { Link } from "react-router-dom";
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

  const [showMenu, setShowMenu] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(clearWishlist());
    dispatch(clearOrders());
    dispatch(logout());

    setShowMenu(false);
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">مِسْك السَّحَر</Link>
      </div>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        <Link to="/cart" className="nav-notification">
          Cart

          {cartCount > 0 && (
            <span className="notification-badge">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/wishlist" className="nav-notification">
          Wishlist

          {wishlistCount > 0 && (
            <span className="notification-badge">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link to="/about">About</Link>

        <div className="user-menu">

          <button
            className="user-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="user-icon"></span>

            {user ? user.name : "Profile"}

            <span>👤</span>
          </button>

          {showMenu && (
            <div className="user-dropdown">

              {user ? (
                <>
                  <div className="user-welcome">
                    <strong>Hello, {user.name}</strong>
                    <small>{user.email}</small>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setShowMenu(false)}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowMenu(false)}
                  >
                    Wishlist
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setShowMenu(false)}
                  >
                    My Cart
                  </Link>

                  <button
                    className="dropdown-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="new-customer">
                    <span>New customer?</span>
                  </div>

                  <Link
                    to="/login"
                    onClick={() => setShowMenu(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowMenu(false)}
                  >
                    Register
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowMenu(false)}
                  >
                    Wishlist
                  </Link>
                </>
              )}

            </div>
          )}

        </div>
      </div>

    </nav>
  );
}

export default Navbar;
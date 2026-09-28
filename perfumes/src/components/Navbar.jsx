import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slices/authSlice";
import { clearOrders } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { clearWishlist } from "../redux/slices/wishlistSlice";

function Navbar() {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);

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
        <Link to="/cart">Cart</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/about">About</Link>

        {user ? (
          <div className="user-menu">

            <button
              className="user-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="user-icon"></span>
              {user.name} 
              <span></span>
            </button>

            {showMenu && (
              <div className="user-dropdown">

                <div className="user-welcome">
                  <strong>Hello, {user.name}</strong>
                  <small>{user.email}</small>
                </div>

                <Link to="/orders" onClick={() => setShowMenu(false)}>
                  My Orders
                </Link>

                <Link to="/wishlist" onClick={() => setShowMenu(false)}>
                  Wishlist
                </Link>

                <Link to="/cart" onClick={() => setShowMenu(false)}>
                  My Cart
                </Link>

                <button
                  className="dropdown-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
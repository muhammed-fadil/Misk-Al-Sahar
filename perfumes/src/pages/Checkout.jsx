import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <main className="checkout">
        <h2>Your cart is empty</h2>
      </main>
    );
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !address || !phone) {
      setError("All delivery details are required");
      return;
    }

    if (phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }

    const order = {
      userId: user.id,
      name,
      address,
      phone,
      items: cartItems,
      total,
    };

    try {
      await createOrder(order);

      dispatch(clearCart());

      navigate("/orders");
    } catch (error) {
      setError("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="checkout">
      <h1>Checkout</h1>

      {error && <p className="error">{error}</p>}

      <div className="checkout-content">
        <div>
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <p key={item.id}>
              {item.name} × {item.quantity} — ₹
              {item.price * item.quantity}
            </p>
          ))}

          <h2>Total: ₹{total}</h2>
        </div>

        <div>
          <h2>Delivery Details</h2>

          <form onSubmit={handleOrder}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button type="submit">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
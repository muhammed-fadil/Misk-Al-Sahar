import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { createOrder } from "../services/orderService";
import { updateProductStock } from "../services/productService";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const buyNowItem = location.state?.buyNowItem;

  const checkoutItems = buyNowItem
    ? [buyNowItem]
    : cartItems;

  const savedDetails =
    JSON.parse(localStorage.getItem(`checkout_${user.id}`)) || {};

  const [name, setName] = useState(
    savedDetails.name || user.name || ""
  );

  const [address, setAddress] = useState(
    savedDetails.address || ""
  );

  const [phone, setPhone] = useState(
    savedDetails.phone || ""
  );

  const total = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (checkoutItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <div className="mb-5 text-5xl">
            🛍️
          </div>

          <h2 className="mb-3 font-serif text-3xl text-[#744b4b]">
            Your Cart is Empty
          </h2>

          <p className="mb-6 text-[#777]">
            Add some beautiful fragrances before checking out.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="bg-[#744b4b] px-7 py-3 text-white transition hover:bg-[#9a7b24]"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!name || !address || !phone) {
      toast.error("All delivery details are required");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    try {
      for (const item of checkoutItems) {
        const newStock = item.stock - item.quantity;

        if (newStock < 0) {
          toast.error(
            `${item.name} does not have enough stock`
          );
          return;
        }

        await updateProductStock(item.id, newStock);
      }

      const order = {
        userId: user.id,
        name,
        address,
        phone,
        items: checkoutItems,
        total,
        status: "Pending",
        date: new Date().toISOString(),
      };

      await createOrder(order);

      localStorage.setItem(
        `checkout_${user.id}`,
        JSON.stringify({
          name,
          address,
          phone,
        })
      );

      // Only clear cart when normal cart checkout is used
      if (!buyNowItem) {
        dispatch(clearCart());
      }

      toast.success("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to place order. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <p className="mb-2 text-sm tracking-[3px] text-[#9a7b24]">
            COMPLETE YOUR PURCHASE
          </p>

          <h1 className="font-serif text-4xl text-[#744b4b] sm:text-5xl">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Order Summary */}
          <div className="bg-[#eae6e1] p-6 sm:p-8">
            <p className="mb-2 text-sm tracking-[2px] text-[#9a7b24]">
              YOUR ORDER
            </p>

            <h2 className="mb-7 font-serif text-3xl text-[#744b4b]">
              Order Summary
            </h2>

            <div className="space-y-5">
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b border-[#d4cec7] pb-4"
                >
                  <div>
                    <p className="font-medium text-[#744b4b]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-[#777]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-[#9a7b24]">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-[#cfc8c0] pt-5">
              <span className="text-lg text-[#555]">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#744b4b]">
                ₹{total}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white p-6 sm:p-8">
            <p className="mb-2 text-sm tracking-[2px] text-[#9a7b24]">
              DELIVERY
            </p>

            <h2 className="mb-7 font-serif text-3xl text-[#744b4b]">
              Delivery Details
            </h2>

            <form
              onSubmit={handleOrder}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-[#555]">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#555]">
                  Delivery Address
                </label>

                <textarea
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#555]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="10 digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength="10"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#744b4b] px-6 py-4 text-white transition hover:bg-[#9a7b24]"
              >
                Place Order
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Checkout;
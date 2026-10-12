import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { createOrder } from "../services/orderService";
import {
  getProductById,
  updateProductStock,
} from "../services/productService";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const buyNowItem = location.state?.buyNowItem;

  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

  const getSavedDetails = () => {
    if (!user?.id) return {};

    try {
      return (
        JSON.parse(
          localStorage.getItem(`checkout_${user.id}`)
        ) || {}
      );
    } catch {
      return {};
    }
  };

  const savedDetails = getSavedDetails();

  const [name, setName] = useState(
    savedDetails.name || user?.name || ""
  );

  const [address, setAddress] = useState(
    savedDetails.address || ""
  );

  const [phone, setPhone] = useState(
    savedDetails.phone || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  if (checkoutItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <div className="mb-5 text-5xl">🛍️</div>

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

    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedAddress || !trimmedPhone) {
      toast.error("All delivery details are required");
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (!checkoutItems.length) {
      toast.error("Your order has no products");
      return;
    }

    const invalidItem = checkoutItems.find(
      (item) =>
        !item.id ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0
    );

    if (invalidItem) {
      toast.error("One or more products have an invalid quantity");
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Step 1: Fetch the latest product data and validate
       * every item before making any stock changes.
       */
      const validatedItems = [];

      for (const item of checkoutItems) {
        const response = await getProductById(item.id);
        const product = response.data;

        const quantity = Number(item.quantity);
        const stock = Number(product.stock);
        const price = Number(product.price);

        if (!Number.isFinite(stock) || stock < 0) {
          throw new Error(
            `Stock information is invalid for ${item.name}`
          );
        }

        if (quantity > stock) {
          throw new Error(
            `${product.name} is out of stock`
          );
        }

        if (!Number.isFinite(price) || price < 0) {
          throw new Error(
            `Invalid price for ${product.name}`
          );
        }

        validatedItems.push({
          ...product,
          quantity,
          price,
          stock,
          subtotal: price * quantity,
        });
      }

      /*
       * Step 2: Prepare the order using current API prices.
       */
      const orderTotal = validatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = {
        userId: user.id,
        name: trimmedName,
        address: trimmedAddress,
        phone: trimmedPhone,
        items: validatedItems.map((item) => {
          const orderItem = { ...item };
          delete orderItem.subtotal;
          delete orderItem.stock;
          return orderItem;
        }),
        total: orderTotal,
        status: "Pending",
        date: new Date().toISOString(),
      };

      /*
       * Step 3: Update stock.
       *
       * If a later update fails, attempt to restore stock
       * already changed by this checkout.
       */
      const stockChanges = [];

      try {
        for (const item of validatedItems) {
          const newStock = item.stock - item.quantity;

          await updateProductStock(item.id, newStock);

          stockChanges.push({
            id: item.id,
            previousStock: item.stock,
          });
        }
      } catch (stockError) {
        // Best-effort rollback of successful stock updates.
        for (const changedItem of [...stockChanges].reverse()) {
          try {
            await updateProductStock(
              changedItem.id,
              changedItem.previousStock
            );
          } catch (rollbackError) {
            console.error(
              "Stock rollback failed:",
              rollbackError
            );
          }
        }

        throw stockError;
      }

      /*
       * Step 4: Create the order.
       *
       * If order creation fails, attempt to restore stock.
       */
      try {
        await createOrder(order);
      } catch (orderError) {
        for (const item of [...validatedItems].reverse()) {
          try {
            await updateProductStock(
              item.id,
              item.stock
            );
          } catch (rollbackError) {
            console.error(
              "Stock rollback failed:",
              rollbackError
            );
          }
        }

        throw orderError;
      }

      /*
       * Step 5: Save details and finish checkout.
       */
      localStorage.setItem(
        `checkout_${user.id}`,
        JSON.stringify({
          name: trimmedName,
          address: trimmedAddress,
          phone: trimmedPhone,
        })
      );

      // Keep the cart unchanged when using Buy Now.
      if (!buyNowItem) {
        dispatch(clearCart());
      }

      toast.success("Order placed successfully!");

      navigate("/orders", { replace: true });
    } catch (error) {
      console.error("Checkout error:", error);

      toast.error(
        error.response?.status === 404
          ? "A product in your order could not be found."
          : error.message ||
              "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
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
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-[#cfc8c0] pt-5">
              <span className="text-lg text-[#555]">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#744b4b]">
                ₹
                {total.toLocaleString("en-IN")}
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
                <label
                  htmlFor="checkout-name"
                  className="mb-2 block text-sm text-[#555]"
                >
                  Full Name
                </label>

                <input
                  id="checkout-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="mb-2 block text-sm text-[#555]"
                >
                  Delivery Address
                </label>

                <textarea
                  id="checkout-address"
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  rows={4}
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="mb-2 block text-sm text-[#555]"
                >
                  Phone Number
                </label>

                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="10 digit phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  autoComplete="tel-national"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#9a7b24]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#744b4b] px-6 py-4 text-white transition hover:bg-[#9a7b24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Processing Order..."
                  : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
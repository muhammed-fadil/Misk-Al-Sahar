import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <div className="mb-5 text-5xl">🛍️</div>

          <h2 className="mb-3 font-serif text-3xl text-[#744b4b]">
            Your Cart is Empty
          </h2>

          <p className="mb-6 text-[#777]">
            Discover something beautiful from our collection.
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

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm tracking-[3px] text-[#9a7b24]">
            YOUR SELECTION
          </p>

          <h1 className="font-serif text-4xl text-[#744b4b]">
            Your Cart
          </h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-5">

          {cartItems.map((item) => (
            <div
              className="flex flex-col gap-5 border-b border-[#ddd] bg-white p-5 sm:flex-row sm:items-center"
              key={item.id}
            >

              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="mx-auto h-32 w-32 object-contain sm:mx-0"
              />

              {/* Product Details */}
              <div className="flex-1 text-center sm:text-left">

                <h2 className="font-serif text-2xl text-[#744b4b]">
                  {item.name}
                </h2>

                <p className="mt-1 text-lg text-[#9a7b24]">
                  ₹{item.price}
                </p>

                {/* Quantity */}
                <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">

                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    disabled={item.quantity === 1}
                    className="h-8 w-8 border border-[#744b4b] text-[#744b4b] hover:bg-[#744b4b] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>

                  <span className="w-8 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    disabled={item.quantity === item.stock}
                    className="h-8 w-8 border border-[#744b4b] text-[#744b4b] hover:bg-[#744b4b] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>

                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    dispatch(removeFromCart(item.id))
                  }
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>

              </div>

              {/* Item Total */}
              <div className="text-center sm:text-right">
                <p className="text-sm text-[#777]">
                  Item Total
                </p>

                <p className="mt-1 text-xl font-semibold text-[#744b4b]">
                  ₹{item.price * item.quantity}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* Cart Summary */}
        <div className="mt-8 ml-auto max-w-md border-t border-[#ddd] pt-6">

          <div className="flex items-center justify-between">
            <span className="text-lg text-[#555]">
              Total
            </span>

            <span className="text-2xl font-semibold text-[#744b4b]">
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-[#744b4b] px-6 py-4 text-white transition hover:bg-[#9a7b24]"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="mt-3 w-full border border-[#744b4b] px-6 py-3 text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </main>
  );
}

export default Cart;
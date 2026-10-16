import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

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

        <div className="mb-10 text-center">
          <p className="mb-2 text-sm tracking-[3px] text-[#9a7b24]">
            YOUR SELECTION
          </p>

          <h1 className="font-serif text-4xl text-[#744b4b]">
            Your Cart
          </h1>
        </div>

        <div className="space-y-5">
          {cartItems.map((item) => (
              <div
                className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-soft border border-[#e4dccf]/30 transition-all duration-300 hover:shadow-luxury sm:flex-row sm:items-center"
                key={item.id}
              >
              <img
                src={item.image}
                alt={item.name}
                className="mx-auto h-32 w-32 object-contain sm:mx-0"
              />

              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-serif text-2xl text-[#744b4b]">
                  {item.name}
                </h2>

                <p className="mt-1 text-lg text-[#9a7b24]">
                  ₹{item.price}
                </p>

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
                    className="h-9 w-9 rounded-lg border border-[#744b4b]/40 text-[#744b4b] transition-all duration-200 hover:border-[#744b4b] hover:bg-[#744b4b] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>

                  <span className="w-10 text-center font-medium text-[#744b4b]">
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
                    className="h-9 w-9 rounded-lg border border-[#744b4b]/40 text-[#744b4b] transition-all duration-200 hover:border-[#744b4b] hover:bg-[#744b4b] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

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

        <div className="mt-8 ml-auto max-w-md rounded-2xl bg-white p-6 shadow-soft border border-[#e4dccf]/30">
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
             className="mt-6 w-full rounded-xl bg-[#744b4b] px-6 py-4 text-white shadow-soft transition-all duration-300 hover:bg-[#9a7b24] hover:shadow-luxury"
           >
            Proceed to Checkout
          </button>

           <button
             onClick={() => navigate("/shop")}
             className="mt-3 w-full rounded-xl border border-[#744b4b]/40 bg-white/90 px-6 py-3 text-[#744b4b] shadow-soft transition-all duration-300 hover:border-[#744b4b] hover:bg-[#744b4b] hover:text-white"
           >
            Continue Shopping
          </button>
        </div>

      </div>
    </main>
  );
}

export default Cart;
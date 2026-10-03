import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector(
    (state) => state.wishlist.items
  );

  const handleRemove = (product) => {
    dispatch(removeFromWishlist(product.id));
    toast.success(`${product.name} removed from wishlist`);
  };

  const handleMoveToCart = (product) => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );

    dispatch(removeFromWishlist(product.id));

    toast.success(`${product.name} moved to cart`);
  };

  // Empty Wishlist
  if (wishlist.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <div className="mb-5 text-5xl">
            ♡
          </div>

          <h2 className="mb-3 font-serif text-3xl text-[#744b4b]">
            Your Wishlist is Empty
          </h2>

          <p className="mb-6 text-[#777]">
            Save your favorite fragrances here.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="bg-[#744b4b] px-7 py-3 text-white transition hover:bg-[#9a7b24]"
          >
            Explore Collection
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm tracking-[3px] text-[#9a7b24]">
            SAVED FOR YOU
          </p>

          <h1 className="font-serif text-4xl text-[#744b4b] sm:text-5xl">
            My Wishlist
          </h1>
        </div>

        {/* Wishlist Products */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <div
              className="overflow-hidden bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg"
              key={product.id}
            >

              {/* Product Image */}
              <div className="bg-[#f8f5ef]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-72 w-full object-contain p-6"
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h2 className="font-serif text-2xl text-[#744b4b]">
                  {product.name}
                </h2>

                <p className="mt-2 text-lg text-[#9a7b24]">
                  ₹{product.price}
                </p>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3">

                  <button
                    onClick={() => handleRemove(product)}
                    className="w-full border border-[#744b4b] px-4 py-3 text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full bg-[#744b4b] px-4 py-3 text-white transition hover:bg-[#9a7b24]"
                  >
                    Move to Cart
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

export default Wishlist;
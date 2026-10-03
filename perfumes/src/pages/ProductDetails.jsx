import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getProductById } from "../services/productService";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";
import { toast } from "react-toastify";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);

  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],

    queryFn: async () => {
      const response = await getProductById(id);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <main className="flex h-[calc(100vh-70px)] items-center justify-center overflow-hidden bg-[#f8f5ef]">
        <div className="text-center">
          <p className="mb-2 text-xs tracking-[3px] text-[#9a7b24]">
            MISK AL-SAHAR
          </p>

          <h2 className="text-lg text-[#744b4b]">
            Loading fragrance...
          </h2>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="flex h-[calc(100vh-70px)] items-center justify-center overflow-hidden bg-[#f8f5ef] px-5">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-3xl text-[#9a7b24]">
            ✦
          </p>

          <h2 className="mt-3 text-xl text-[#744b4b]">
            Product not found
          </h2>

          <button
            onClick={() => navigate("/shop")}
            className="mt-5 rounded-lg bg-[#744b4b] px-5 py-2.5 text-sm text-white transition hover:bg-[#9a7b24]"
          >
            Back to Shop
          </button>

        </div>
      </main>
    );
  }

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  const isInCart = cart.some(
    (item) => item.id === product.id
  );

 
const handleWishlist = () => {
  if (isWishlisted) {
    dispatch(removeFromWishlist(product.id));
    toast.success("Removed from wishlist");
  } else {
    dispatch(addToWishlist(product));
    toast.success("Added to wishlist");
  }
};

const handleAddToCart = () => {
  dispatch(
    addToCart({
      ...product,
      quantity,
    })
  );

  toast.success("Added to cart");
};

const handleBuyNow = () => {
  dispatch(
    addToCart({
      ...product,
      quantity,
    })
  );

  navigate("/checkout");
};

  return (
<main className="min-h-[calc(100dvh-70px)] bg-[#f8f5ef] p-3 sm:p-4 lg:h-[calc(100dvh-70px)] lg:overflow-hidden lg:p-5">
      {/* Main Product Card */}
      <div className="mx-auto grid h-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-sm lg:grid-cols-2">

        {/* ================= IMAGE ================= */}
        <div className="flex h-[40vh] items-center justify-center bg-[#f3eee6] p-4 lg:h-full lg:p-6">

          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[500px] w-full object-contain transition duration-500 hover:scale-105"
          />

        </div>


        
        <div className="flex h-full flex-col justify-center overflow-hidden p-4 sm:p-6 lg:p-7">

          
          <p className="text-[11px] font-medium uppercase tracking-[2px] text-[#9a7b24]">
            {product.category}
          </p>


          
          <h1 className="mt-1 text-3xl font-semibold leading-tight text-[#744b4b]">
            {product.name}
          </h1>


          
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="text-[#9a7b24]">
              ★
            </span>

            <span className="text-[#666]">
              {product.rating} / 5
            </span>
          </div>


          
          <p className="mt-2 text-2xl font-semibold text-[#744b4b]">
            ₹{product.price}
          </p>


          
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#666]">
            {product.description}
          </p>


          <div className="my-3 grid grid-cols-2 gap-2 border-y border-[#e4dccf] py-3">

            <div className="rounded-md bg-[#f8f5ef] px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                Size
              </p>

              <p className="mt-0.5 truncate text-xs text-[#555]">
                {product.size}
              </p>
            </div>


            <div className="rounded-md bg-[#f8f5ef] px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                Gender
              </p>

              <p className="mt-0.5 truncate text-xs text-[#555]">
                {product.gender}
              </p>
            </div>


            <div className="rounded-md bg-[#f8f5ef] px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                Occasion
              </p>

              <p className="mt-0.5 truncate text-xs text-[#555]">
                {product.occasion}
              </p>
            </div>


            <div className="rounded-md bg-[#f8f5ef] px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                Stock
              </p>

              <p className="mt-0.5 truncate text-xs text-[#555]">
                {product.stock}
              </p>
            </div>

          </div>


          <div>

            <h2 className="text-lg font-semibold text-[#744b4b]">
              Fragrance Notes
            </h2>

            <div className="mt-2 grid grid-cols-3 gap-2">

              
              <div className="min-w-0 rounded-md bg-[#f8f5ef] p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                  Top
                </p>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#555]">
                  {product.notes.top.join(", ")}
                </p>
              </div>


              {/* Heart */}
              <div className="min-w-0 rounded-md bg-[#f8f5ef] p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                  Heart
                </p>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#555]">
                  {product.notes.heart.join(", ")}
                </p>
              </div>


              {/* Base */}
              <div className="min-w-0 rounded-md bg-[#f8f5ef] p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#9a7b24]">
                  Base
                </p>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#555]">
                  {product.notes.base.join(", ")}
                </p>
              </div>

            </div>

          </div>


          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`mt-3 w-full rounded-md border px-4 py-2 text-xs transition ${
              isWishlisted
                ? "border-[#744b4b] bg-[#744b4b] text-white hover:bg-[#9a7b24]"
                : "border-[#744b4b] text-[#744b4b] hover:bg-[#744b4b] hover:text-white"
            }`}
          >
            {isWishlisted
              ? "♥ Remove from Wishlist"
              : "♡ Add to Wishlist"}
          </button>


          {product.stock > 0 ? (
            <>

              {/* Quantity */}
              <div className="mt-2 flex items-center gap-3">

                <span className="text-xs font-medium text-[#744b4b]">
                  Quantity
                </span>

                <div className="flex items-center overflow-hidden rounded-md border border-[#d8d0c5] bg-white">

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.max(1, q - 1)
                      )
                    }
                    disabled={quantity === 1}
                    className="h-8 w-8 text-sm text-[#744b4b] hover:bg-[#f3eee6] disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="flex h-8 w-8 items-center justify-center border-x border-[#d8d0c5] text-xs">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(product.stock, q + 1)
                      )
                    }
                    disabled={quantity === product.stock}
                    className="h-8 w-8 text-sm text-[#744b4b] hover:bg-[#f3eee6] disabled:opacity-40"
                  >
                    +
                  </button>

                </div>

              </div>


              {/* Buttons */}
              <div className="mt-2 grid grid-cols-2 gap-2">

                <button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className="rounded-md bg-[#744b4b] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#9a7b24] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isInCart
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="rounded-md bg-[#9a7b24] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#744b4b]"
                >
                  Buy Now
                </button>

              </div>

            </>
          ) : (
            <div className="mt-3 rounded-md bg-red-50 p-2 text-center">
              <p className="text-xs font-medium text-red-600">
                Out of Stock
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
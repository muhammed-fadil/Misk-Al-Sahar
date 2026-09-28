import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../services/productService";
import { addToCart } from "../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const wishlist = useSelector(
    (state) => state.wishlist.items
  );
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
    return <h2>Loading product...</h2>;
  }

  if (isError) {
    return <h2>Product not found</h2>;
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
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
  };

  return (
    <main className="product-details">
      <div className="product-details-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-details-info">
        <p className="product-details-category">
          {product.category}
        </p>

        <h1>{product.name}</h1>

        <p className="product-details-rating">
          ★ {product.rating}
        </p>

        <h2>₹{product.price}</h2>

        <p className="product-details-description">
          {product.description}
        </p>

        <div className="product-meta">
          <p>
            <strong>Size:</strong> {product.size}
          </p>

          <p>
            <strong>Gender:</strong> {product.gender}
          </p>

          <p>
            <strong>Occasion:</strong> {product.occasion}
          </p>

          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
        </div>

        <div className="fragrance-notes">
          <h3>Fragrance Notes</h3>

          <p>
            <strong>Top:</strong>{" "}
            {product.notes.top.join(", ")}
          </p>

          <p>
            <strong>Heart:</strong>{" "}
            {product.notes.heart.join(", ")}
          </p>

          <p>
            <strong>Base:</strong>{" "}
            {product.notes.base.join(", ")}
          </p>
        </div>

        <button
          className="wishlist-btn"
          onClick={handleWishlist}
        >
          {isWishlisted
            ? "♥ Remove from Wishlist"
            : "♡ Add to Wishlist"}
        </button>

        {product.stock > 0 ? (
          <>
            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={quantity === 1}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(product.stock, q + 1)
                  )
                }
                disabled={quantity === product.stock}
              >
                +
              </button>
            </div>

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
            >
              {isInCart?"Added to cart":"Add to cart"}
            </button>
          </>
        ) : (
          <p>Out of Stock</p>
        )}
      </div>
    </main>
  );
}

export default ProductDetails;
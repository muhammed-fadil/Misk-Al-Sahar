import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlist = useSelector(
    (state) => state.wishlist.items
  );

  const handleMoveToCart = (product) => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );

    dispatch(removeFromWishlist(product.id));
  };

  if (wishlist.length === 0) {
    return (
      <main className="wishlist">
        <h2>Your wishlist is empty</h2>
      </main>
    );
  }

  return (
    <main className="wishlist">
      <h1>My Wishlist</h1>

      <div className="product-grid">
        {wishlist.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-card-image"
            />

            <h2>{product.name}</h2>

            <p>₹{product.price}</p>

            <button className="wishlist-btn"
              onClick={() =>
                dispatch(removeFromWishlist(product.id))
              }
            >
              Remove
            </button>

            <button className="wishlist-btn"
              onClick={() => handleMoveToCart(product)}
            >
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Wishlist;
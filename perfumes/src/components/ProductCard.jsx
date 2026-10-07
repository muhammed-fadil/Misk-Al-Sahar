import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-[#fffdf8] transition duration-300 hover:-translate-y-2"
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="h-64 w-full object-cover sm:h-80 lg:h-[400px]"
      />

      {/* Product Information */}
      <div className="p-6">

        <p className="text-xs uppercase tracking-[2px] text-[#9a7b24]">
          {product.category}
        </p>

        <h3 className="my-2 font-serif text-2xl text-[#744b4b]">
          {product.name}
        </h3>

        <p className="mb-5 text-sm leading-6 text-[#777]">
          {product.description}
        </p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-[#9a7b24]">
            ₹{product.price}
          </h3>

          <h3 className="text-sm text-[#9a7b24]">
            ★ {product.rating}
          </h3>
        </div>

      </div>
    </Link>
  );
}

export default ProductCard;
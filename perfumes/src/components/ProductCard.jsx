import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-[#fffdf8] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-luxury"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#744b4b]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f3eee6] to-[#f8f5ef]">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 sm:h-80 lg:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="relative p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="rounded-full bg-[#9a7b24]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[2px] text-[#9a7b24] backdrop-blur-sm">
            {product.category}
          </p>
          <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-soft backdrop-blur-sm">
            <span className="text-[#9a7b24]">★</span>
            <span className="text-xs font-medium text-[#744b4b]">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-serif text-2xl leading-tight text-[#744b4b] transition-colors duration-300 group-hover:text-[#9a7b24]">
          {product.name}
        </h3>

        <p className="mb-5 mt-2 line-clamp-2 text-sm leading-6 text-[#777]">
          {product.description}
        </p>

        <div className="flex items-center justify-between border-t border-[#e4dccf]/50 pt-4">
          <h3 className="text-lg font-semibold text-[#9a7b24]">
            ₹{product.price}
          </h3>
          <div className="flex items-center gap-1 text-xs text-[#744b4b] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            <span>View Details</span>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
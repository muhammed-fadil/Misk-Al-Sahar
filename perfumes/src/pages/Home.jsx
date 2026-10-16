import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";

function Home() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
  });

  const featuredProducts = products
    .filter((product) =>
      ["tsuki", "one", "espanio"].includes(product.slug)
    )
    .slice(0, 3);

  return (
    <main className="bg-[#f8f5ef]">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#392016] via-[#4d2a1c] to-[#392016]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(154,123,36,0.15),transparent_70%)]" />
        <div className="relative">
          <Link
            to="/shop"
            className="group block"
            aria-label="Explore Misk Al-Sahar perfumes"
          >
            <img
              src="/misk-hero.png"
              alt="Misk Al-Sahar luxury perfume collection"
              fetchPriority="high"
              className="block h-auto w-full scale-100 transition-transform duration-[1500ms] ease-out group-hover:scale-[1.02]"
            />
          </Link>
        </div>
      </section>

      <section className="border-t border-[#e4dccf] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-medium tracking-[4px] text-[#9a7b24] sm:text-sm">
              OUR COLLECTION
            </p>

            <h2 className="font-['Amiri'] text-4xl text-[#744b4b] sm:text-5xl">
              Signature Perfumes
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#777]">
              A selection of fragrances inspired by the warmth,
              mystery, and elegance of the Middle East.
            </p>
          </div>

          {isLoading && (
            <div className="py-10 text-center">
              <p className="text-sm text-[#777]">
                Loading products...
              </p>
            </div>
          )}

          {isError && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-600">
                Failed to load products.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-luxury"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#744b4b]/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="overflow-hidden bg-gradient-to-br from-[#f3eee6] to-[#f8f5ef]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 sm:h-80 lg:h-[420px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="relative p-6 text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#9a7b24]">
                      {product.category}
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#744b4b] transition-colors duration-300 group-hover:text-[#9a7b24]">
                      {product.name}
                    </h3>

                    <div className="mx-auto my-3 h-px w-12 bg-gradient-to-r from-transparent via-[#e4dccf] to-transparent" />

                    <p className="text-lg font-semibold text-[#9a7b24]">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded-full border border-[#744b4b]/40 bg-white/90 px-8 py-3 text-sm font-medium text-[#744b4b] shadow-soft backdrop-blur-sm transition-all duration-300 hover:border-[#744b4b] hover:bg-[#744b4b] hover:text-white hover:shadow-luxury"
            >
              <span>View All Perfumes</span>
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e4dccf] px-5 py-16 text-center sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-medium tracking-[4px] text-[#9a7b24] sm:text-sm">
            OUR STORY
          </p>

          <h2 className="font-['Amiri'] text-4xl leading-tight text-[#744b4b] sm:text-5xl">
            The Essence of the Middle East
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-[#666] sm:text-base sm:leading-8">
            Misk Al-Sahar is inspired by the timeless fragrance
            traditions of the Middle East. Each scent is created
            to reflect elegance, warmth, and the beauty of
            unforgettable moments.
          </p>

          <Link
            to="/about"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#9a7b24]/40 bg-white/90 px-8 py-3 text-sm font-medium text-[#9a7b24] shadow-soft backdrop-blur-sm transition-all duration-300 hover:border-[#9a7b24] hover:bg-[#9a7b24] hover:text-white hover:shadow-luxury"
          >
            <span>Discover Our Story</span>
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
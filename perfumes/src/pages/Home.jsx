
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";

function Home() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
  });

  const featuredProducts = products
    .filter((product) =>
      ["White Musk", "One", "Desert Rose"].includes(product.name)
    )
    .slice(0, 3);

  return (
    <main className="bg-[#f8f5ef]">

      {/* Hero Section */}
      <section className="flex min-h-[calc(100vh-70px)] items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="max-w-3xl">

          <p className="mb-5 text-xs font-medium tracking-[5px] text-[#9a7b24] sm:text-sm">
            M U S K &nbsp; O F &nbsp; T H E &nbsp; D A W N
          </p>

          <h1 className="font-['Amiri'] text-5xl leading-tight text-[#744b4b] sm:text-6xl md:text-7xl">
            Misk Al-Sahar
          </h1>

          <div className="mx-auto my-7 h-px w-20 bg-[#9a7b24]" />

          <p className="mx-auto max-w-2xl text-base leading-7 text-[#777] sm:text-lg sm:leading-8">
            Discover the timeless beauty of Middle Eastern perfumes,
            crafted with elegance, tradition, and unforgettable character.
          </p>

          <Link
            to="/shop"
            className="mt-9 inline-block rounded-sm bg-[#744b4b] px-8 py-3.5 text-sm font-medium text-white transition duration-300 hover:bg-[#9a7b24] sm:px-10"
          >
            Explore Collection
          </Link>

        </div>
      </section>

      {/* Collection Section */}
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {featuredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group overflow-hidden rounded-lg border border-[#e4dccf] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                >

                  {/* Image */}
                  <div className="flex h-64 items-center justify-center overflow-hidden bg-[#f3eee6] p-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5 text-center">

                    <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#9a7b24]">
                      {product.category}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-[#744b4b]">
                      {product.name}
                    </h3>

                    <div className="mx-auto my-3 h-px w-8 bg-[#e4dccf]" />

                    <p className="text-lg font-medium text-[#9a7b24]">
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
              className="inline-block border border-[#744b4b] px-7 py-3 text-sm font-medium text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white"
            >
              View All Perfumes
            </Link>
          </div>

        </div>
      </section>

      {/* Story Section */}
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
            className="mt-8 inline-block border border-[#9a7b24] px-7 py-3 text-sm font-medium text-[#9a7b24] transition hover:bg-[#9a7b24] hover:text-white"
          >
            Discover Our Story
          </Link>

        </div>
      </section>

    </main>
  );
}

export default Home;


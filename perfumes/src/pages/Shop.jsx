import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../services/productService";
import { setProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

function Shop() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  const { isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      dispatch(setProducts(response.data));
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="text-center">
          <p className="mb-3 text-sm tracking-[3px] text-[#9a7b24]">
            MISK AL-SAHAR
          </p>

          <h2 className="text-xl text-[#744b4b]">
            Loading our collection...
          </h2>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="mb-3 text-3xl">!</p>

          <h2 className="text-xl font-medium text-red-600">
            Failed to load products
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

      {/* Page Heading */}
      <section className="mx-auto max-w-3xl text-center">

        <p className="mb-3 text-xs font-medium tracking-[3px] text-[#9a7b24] sm:text-sm">
          DISCOVER
        </p>

        <h1 className="text-4xl font-semibold text-[#744b4b] sm:text-5xl">
          Our Collection
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#777] sm:text-base">
          Explore our collection of carefully selected fragrances
          inspired by the beauty and tradition of the Middle East.
        </p>

      </section>

      {/* Filters */}
      <section className="mx-auto mt-10 max-w-6xl rounded-xl bg-white p-4 shadow-sm sm:p-5">

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          {/* Search */}
          <div>

            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9a7b24]">
              Search
            </label>

            <input
              type="text"
              placeholder="Search perfumes..."
              value={search}
              onChange={handleSearch}
              className="w-full rounded-lg border border-[#e1d9cd] bg-[#fdfbf7] px-4 py-3 text-sm text-[#444] outline-none transition placeholder:text-gray-400 focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
            />

          </div>

          {/* Category */}
          <div>

            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9a7b24]">
              Category
            </label>

            <select
              value={category}
              onChange={handleCategory}
              className="w-full rounded-lg border border-[#e1d9cd] bg-[#fdfbf7] px-4 py-3 text-sm text-[#444] outline-none transition focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* Sort */}
          <div>

            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9a7b24]">
              Sort
            </label>

            <select
              value={sort}
              onChange={handleSort}
              className="w-full rounded-lg border border-[#e1d9cd] bg-[#fdfbf7] px-4 py-3 text-sm text-[#444] outline-none transition focus:border-[#9a7b24] focus:ring-1 focus:ring-[#9a7b24]"
            >
              <option value="">Sort by Price</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

          </div>

        </div>

      </section>

      {/* Results Count */}
      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between">

        <p className="text-sm text-[#777]">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "fragrance"
            : "fragrances"}
        </p>

        {search && (
          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="text-sm text-[#9a7b24] hover:underline"
          >
            Clear search
          </button>
        )}

      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <section className="mx-auto mt-8 max-w-6xl rounded-xl bg-white px-5 py-16 text-center shadow-sm">

          <p className="text-4xl">✦</p>

          <h2 className="mt-4 text-2xl font-medium text-[#744b4b]">
            No fragrances found
          </h2>

          <p className="mt-2 text-sm text-[#777]">
            Try changing your search or category.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("");
              setCurrentPage(1);
            }}
            className="mt-6 rounded-lg bg-[#744b4b] px-6 py-3 text-sm text-white transition hover:bg-[#9a7b24]"
          >
            Clear Filters
          </button>

        </section>
      ) : (
        <>
          <section className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                disabled={currentPage === 1}
                className="rounded-lg border border-[#e1d9cd] bg-white px-4 py-2 text-sm text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-lg text-sm transition ${
                    currentPage === page
                      ? "bg-[#744b4b] text-white"
                      : "border border-[#e1d9cd] bg-white text-[#744b4b] hover:bg-[#744b4b] hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#e1d9cd] bg-white px-4 py-2 text-sm text-[#744b4b] transition hover:bg-[#744b4b] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}
        </>
      )}

    </main>
  );
}

export default Shop;
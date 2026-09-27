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

  const { isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getProducts();
      dispatch(setProducts(response.data));
      return response.data;
    },
  });

  if (isLoading) {
    return <h2>Loading products...</h2>;
  }

  if (isError) {
    return <h2>Failed to load products. Please try again.</h2>;
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

  return (
    <main className="shop">
      <h1>Our Collection</h1>
  <div className="input-div">
      <input className="input-box"
        type="text"
        placeholder="Search perfumes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select className="input-box"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select className="input-box"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="">Sort by Price</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>
      </div>

      {filteredProducts.length === 0 ? (
        <h2>No products found</h2>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Shop;
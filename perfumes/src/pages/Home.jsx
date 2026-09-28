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

  return (
    <main>
      {/* Hero Section */}
      <section className="perfume">
        <div className="perfume-content">
          <p className="perfume-subtitle">
            M U S K &nbsp; O F &nbsp; T H E &nbsp; D A W N
          </p>

          <h1>Misk Al-Sahar</h1>

          <p className="perfume-description">
            Discover the timeless beauty of Middle Eastern
            perfumes, crafted with elegance and tradition.
          </p>

          <Link to="/shop" className="perfume-button">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Collection Section */}
      <section className="preview">
        <div className="content">
          <p>OUR COLLECTION</p>

          <h2 className="a">
            Signature Perfumes
          </h2>

          {isLoading && <p>Loading products...</p>}

          {isError && (
            <p>Failed to load products.</p>
          )}

          {!isLoading && !isError && (
         <div className="b">
  {products
    .filter((product) =>
      ["White Musk", "One", "Desert Rose"].includes(product.name)
    )
    .map((product) => (
      <Link
        to={`/product/${product.id}`}
        className="royal"
        key={product.id}
      >
        <img
          src={product.image}
          alt={product.name}
        />

        <h3>{product.name}</h3>

        <p>{product.category}</p>

        <h3>₹{product.price}</h3>
      </Link>
    ))}
</div>
          )}
        </div>
      </section>

      {/* Story Section */}
      <section className="preview">
        <div className="content">
          <p className="label">
            OUR STORY
          </p>

          <h2>
            The Essence of the Middle East
          </h2>

          <p>
            Misk Al-Sahar is inspired by the timeless fragrance
            traditions of the Middle East. Each scent is created
            to reflect elegance, warmth, and the beauty of
            unforgettable moments.
          </p>

          <Link to="/about" className="button">
            Discover Our Story
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
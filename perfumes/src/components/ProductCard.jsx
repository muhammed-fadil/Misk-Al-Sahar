import { Link } from "react-router-dom"


function ProductCard({product}) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link" >
      <img 
      src={product.image} 
      alt={product.name}
      className="product-card-image"/>
    
      </Link>
      <div className="product-card-content">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-button">
            <h3>₹{product.price}</h3>
            <h3>★{product.rating}</h3>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

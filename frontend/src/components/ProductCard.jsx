import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="card">
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p className="price">₱{product.price}</p>
      <div className="actions">
        <Link to={`/products/${product.id}`} className="btn secondary">Details</Link>
        <Link to={`/register/${product.id}`} className="btn">Register</Link>
      </div>
    </div>
  );
}

export default ProductCard;

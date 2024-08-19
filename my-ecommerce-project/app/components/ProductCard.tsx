import React from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
}

interface ProductCardProps extends Product {
  addToCart: () => void; // Adjusted to a function prop
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, description, price, currency, image, rating, addToCart }) => {
  const truncatedDescription = description ? (description.length > 100 ? `${description.slice(0, 100)}...` : description) : '';

  return (
    <div className="border p-4 rounded-lg shadow-sm flex flex-col justify-between h-full">
      <div>
        <img src={image} alt={title} className="w-full h-48 object-cover mb-4 rounded" />
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-700">{truncatedDescription}</p>
        <p className="text-lg font-semibold mt-2">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}
        </p>
        <div className="mt-2">
          <span className="text-yellow-500">{Array.from({ length: Math.floor(rating) }, (_, i) => '⭐').join('')}</span>
          <span className="text-gray-600"> ({rating})</span>
        </div>
      </div>
      <button
        onClick={addToCart}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded self-center"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

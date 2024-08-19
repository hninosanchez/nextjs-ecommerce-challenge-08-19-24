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
  addToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ title, description, price, currency, image, rating, addToCart }) => {
  const truncatedDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;

  return (
    <div className="bg-white border border-gray-100 overflow-hidden flex flex-col mt-10">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{truncatedDescription}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}
          </p>
          <div className="flex items-center">
            <span className="text-yellow-500 text-sm">
              {Array.from({ length: Math.floor(rating) }, (_, i) => '⭐').join('')}
            </span>
            <span className="text-gray-600 ml-2 text-sm">({rating})</span>
          </div>
        </div>
        <div className="mt-auto">
          <button
            onClick={addToCart}
            className="w-full bg-blue-500 text-white py-2 rounded-full transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Add ${title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;

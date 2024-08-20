import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

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
    <div className="bg-white rounded-md border border-gray-100 overflow-hidden flex flex-col hover:cursor-pointer hover:shadow-lg transition-shadow duration-1000">
      <div className="w-full h-54 overflow-hidden p-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      </div>
      <div className="px-6 pt-2 pb-6 flex flex-col flex-grow">
        <h2 className="text-base font-semibold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4 text-sm">{truncatedDescription}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}
          </p>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-900 ml-2 text-sm font-bold">{rating}</span>
          </div>
        </div>
        <div className="mt-auto">
          <button
            onClick={addToCart}
            className="w-full bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

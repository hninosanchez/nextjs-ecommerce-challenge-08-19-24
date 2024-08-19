"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addToCart } from '../slices/cartSlice';
import { ShoppingCartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceSortOption, setPriceSortOption] = useState<string>('');
  const [ratingSortOption, setRatingSortOption] = useState<string>('');

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://my-json-server.typicode.com/hninosanchez/nextjs-ecommerce-challenge-08-19-24/products');
      const data: Product[] = await res.json();
      setProducts(data);
      setVisibleProducts(data.slice(0, productsPerPage));
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (priceSortOption) {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        return priceSortOption === 'price-asc' ? a.price - b.price : b.price - a.price;
      });
    }

    if (ratingSortOption) {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        return ratingSortOption === 'rating-asc' ? a.rating - b.rating : b.rating - a.rating;
      });
    }

    setVisibleProducts(filteredProducts.slice(0, productsPerPage));
  }, [searchQuery, priceSortOption, ratingSortOption, products]);

  const loadMoreProducts = () => {
    const newOffset = visibleProducts.length;
    const moreProducts = products.slice(newOffset, newOffset + productsPerPage);
    setVisibleProducts(prev => [...prev, ...moreProducts]);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && visibleProducts.length < products.length) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts.length, products.length]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((total: number, product: Product) => total + product.price, 0);

  return (
    <div>
      {/* Fixed Header for Cart */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-10 p-4 flex items-center justify-between">
    <div className="container m-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">My E-commerce</h1>
      <div className="flex items-center space-x-6">
        {/* Cart Icon with Items Count */}
        <div className="relative flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full p-2">
          <ShoppingCartIcon className="h-6 w-6 text-blue-500" />
          {totalItems > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </div>
          )}
        </div>
        {/* Total Price */}
        <div className="flex items-center space-x-2 bg-green-50 border border-green-100 rounded-full p-2">
          <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
          <span className="text-lg font-bold text-green-500">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  </header>



      {/* Space below header */}
      <div className="pt-20 container m-auto">
        <div className="flex flex-col sm:flex-row justify-between mb-4 mt-14">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded mb-4 sm:mb-0 sm:mr-4 w-full sm:w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex">
            <select
              className="p-2 border border-gray-300 rounded mr-4"
              value={priceSortOption}
              onChange={(e) => setPriceSortOption(e.target.value)}
            >
              <option value="">Sort by Price</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded"
              value={ratingSortOption}
              onChange={(e) => setRatingSortOption(e.target.value)}
            >
              <option value="">Sort by Rating</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {visibleProducts.map(product => (
            <ProductCard key={product.id} {...product} addToCart={() => handleAddToCart(product)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

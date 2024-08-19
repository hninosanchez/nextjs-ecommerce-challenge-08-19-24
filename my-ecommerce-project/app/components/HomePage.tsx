"use client"; 

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addToCart } from '../slices/cartSlice';

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
  // States to manage product data, search query, sorting options, and pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to handle search query
  const [priceSortOption, setPriceSortOption] = useState<string>(''); // State to handle price sorting option
  const [ratingSortOption, setRatingSortOption] = useState<string>(''); // State to handle rating sorting option

  // Get cart items from Redux store
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const productsPerPage = 10;

  useEffect(() => {
    // Fetch product data from the JSON API endpoint
    const fetchProducts = async () => {
      const res = await fetch('https://my-json-server.typicode.com/hninosanchez/nextjs-ecommerce-challenge-08-19-24/products');
      const data: Product[] = await res.json();
      setProducts(data);
      setVisibleProducts(data.slice(0, productsPerPage)); // Load initial set of products
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter and sort products based on search query and sorting options
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

    setVisibleProducts(filteredProducts.slice(0, productsPerPage)); // Update visible products based on search query and sorting
  }, [searchQuery, priceSortOption, ratingSortOption, products]);

  const loadMoreProducts = () => {
    const newOffset = visibleProducts.length;
    const moreProducts = products.slice(newOffset, newOffset + productsPerPage);
    setVisibleProducts(prev => [...prev, ...moreProducts]);
  };

  useEffect(() => {
    // Load more products when the user scrolls near the bottom of the page
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && visibleProducts.length < products.length) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts.length, products.length]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product)); // Dispatch the action to add the product to the cart
  };

  const totalItems = cartItems.length; // Calculate total items in the cart
  const totalPrice = cartItems.reduce((total: number, product: Product) => total + product.price, 0); // Calculate total price of the cart

  return (
    <div>
      {/* Fixed Header for Cart */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-4">
        <div className="container m-auto">
          <h1 className="text-3xl font-bold">My E-commerce</h1>
          <div className="mt-2">
            <span className="mr-4">Total Items: {totalItems}</span>
            <span>Total Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice)}</span>
          </div>
        </div>
      </header>

      {/* Space below header */}
      <div className="pt-20 container m-auto">
        {/* Search Bar and Sorting Options */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 mt-10">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded mb-4 sm:mb-0 sm:mr-4 w-full sm:w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query as the user types
          />
          <div className="flex">
            <select
              className="p-2 border border-gray-300 rounded mr-4"
              value={priceSortOption}
              onChange={(e) => setPriceSortOption(e.target.value)} // Update price sorting option as the user selects
            >
              <option value="">Sort by Price</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded"
              value={ratingSortOption}
              onChange={(e) => setRatingSortOption(e.target.value)} // Update rating sorting option as the user selects
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

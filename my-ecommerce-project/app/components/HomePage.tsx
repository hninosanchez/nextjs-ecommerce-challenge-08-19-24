"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addToCart } from '../slices/cartSlice';
import {
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        'https://my-json-server.typicode.com/hninosanchez/nextjs-ecommerce-challenge-08-19-24/products'
      );
      const data: Product[] = await res.json();
      setProducts(data);
      setVisibleProducts(data.slice(0, productsPerPage));
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredProducts = products.filter((product) =>
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
    setVisibleProducts((prev) => [...prev, ...moreProducts]);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (total: number, product: Product) => total + product.price,
    0
  );

  const handleSortOption = (filterType: string, sortOption: string) => {
    if (filterType === 'price') {
      setPriceSortOption(sortOption);
    } else if (filterType === 'rating') {
      setRatingSortOption(sortOption);
    }
    setActiveFilter(filterType); // Mantener el acordeón activo
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  return (
    <div>
      {/* Fixed Header for Cart */}
      <header
        className={`fixed top-0 left-0 right-0 bg-white z-10 p-4 flex items-center justify-between w-full transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container m-auto flex justify-between items-center max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800">My E-commerce</h1>
          <div className="flex items-center space-x-6">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              className="p-2 border border-gray-300 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Total Price */}
            <div className="flex items-center space-x-2 p-2">
              <span className="text-base text-gray-500">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalPrice)}
              </span>
            </div>
            {/* Cart Icon with Items Count */}
            <div className="relative flex items-center space-x-2 p-2">
              <ShoppingBagIcon className="h-6 w-6 text-gray-500" />
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Space below header */}
      <div className="pt-24 container m-auto max-w-6xl flex">
        {/* Left side - Fixed sort and filters menu (30%) */}
        <div className="w-3/12 pr-4">
          <div className="fixed top-24 left-0 w-3/12">
            <div className="bg-white p-4 flex flex-col items-start justify-between">
              {/* Sort by Price Accordion */}
              <div className="w-full mb-4">
                <div
                  className={`flex justify-between items-center p-2 cursor-pointer border border-gray-300 rounded ${
                    activeFilter === 'price' ? 'bg-red-100 text-red-500' : 'text-gray-800'
                  }`}
                  onClick={() => toggleFilter('price')}
                >
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                    <span>Sort by Price</span>
                  </div>
                  {activeFilter === 'price' ? (
                    <ChevronDownIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                {activeFilter === 'price' && (
                  <div className="ml-8 mt-2 flex flex-col space-y-2 transition-all duration-300 ease-in-out">
                    <button
                      className={`text-left ${
                        priceSortOption === 'price-asc'
                          ? 'text-red-500 font-bold'
                          : 'text-blue-500'
                      } hover:underline`}
                      onClick={() => handleSortOption('price', 'price-asc')}
                    >
                      Price: Low to High
                    </button>
                    <button
                      className={`text-left ${
                        priceSortOption === 'price-desc'
                          ? 'text-red-500 font-bold'
                          : 'text-blue-500'
                      } hover:underline`}
                      onClick={() => handleSortOption('price', 'price-desc')}
                    >
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>
              {/* Sort by Rating Accordion */}
              <div className="w-full">
                <div
                  className={`flex justify-between items-center p-2 cursor-pointer border border-gray-300 rounded ${
                    activeFilter === 'rating' ? 'bg-red-100 text-red-500' : 'text-gray-800'
                  }`}
                  onClick={() => toggleFilter('rating')}
                >
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-5 w-5 text-gray-500" />
                    <span>Sort by Rating</span>
                  </div>
                  {activeFilter === 'rating' ? (
                    <ChevronDownIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                {activeFilter === 'rating' && (
                  <div className="ml-8 mt-2 flex flex-col space-y-2 transition-all duration-300 ease-in-out">
                    <button
                      className={`text-left ${
                        ratingSortOption === 'rating-asc'
                          ? 'text-red-500 font-bold'
                          : 'text-blue-500'
                      } hover:underline`}
                      onClick={() => handleSortOption('rating', 'rating-asc')}
                    >
                      Rating: Low to High
                    </button>
                    <button
                      className={`text-left ${
                        ratingSortOption === 'rating-desc'
                          ? 'text-red-500 font-bold'
                          : 'text-blue-500'
                      } hover:underline`}
                      onClick={() => handleSortOption('rating', 'rating-desc')}
                    >
                      Rating: High to Low
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right side - Products grid (70%) */}
        <div className="w-9/12 pl-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                addToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

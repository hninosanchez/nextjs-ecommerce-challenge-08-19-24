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
      if (window.scrollY > 50) { // Ajuste: Se detecta scroll después de 50px
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
        className={`fixed top-0 left-0 right-0 bg-white z-10 p-4 flex flex-wrap items-center justify-between w-full transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container m-auto flex flex-wrap justify-between items-center max-w-6xl gap-0 sm:gap-7">
          <h1 className="text-3xl font-bold text-gray-800">Store</h1>
          <div className="flex items-center space-x-6 w-1/2">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              className="p-2 border border-gray-200 rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mt-2 sm:mt-0 flex-col justify-end">
            {/* Cart Icon with Items Count */}
            <div className="relative flex justify-end space-x-2">
              <ShoppingBagIcon className="h-6 w-6 text-gray-500" />
              {totalItems > 0 && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </div>
              )}
            </div>
            {/* Total Price */}
            <div className="flex items-center space-x-2 ">
              <span className="text-base text-blue-700 font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* Space below header */}
      <div className="pt-24 container m-auto max-w-6xl flex flex-col sm:flex-row">
        {/* Left side - Fixed sort and filters menu (100% on mobile, 30% on larger screens) */}
        <div className="w-full sm:w-3/12 pr-4 mb-4 sm:mb-0">
          <div className="sticky top-24">
            <div className="bg-white p-4 flex flex-col items-start justify-between">
              {/* Sort by Price Accordion */}
              <div className="w-full mb-4">
                <div
                  className={`flex justify-between items-center p-2 cursor-pointer ${
                    activeFilter === 'price' ? 'text-blue-700 font-bold' : 'text-gray-800'
                  }`}
                  onClick={() => toggleFilter('price')}
                >
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                    <span>Sort by Price</span>
                  </div>
                  {activeFilter === 'price' ? (
                    <ChevronDownIcon className="h-5 w-5 text-blue-700" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                {activeFilter === 'price' && (
                  <div className="ml-8 mt-2 flex flex-col space-y-2 transition-all duration-300 ease-in-out">
                    <button
                      className={`text-left ${
                        priceSortOption === 'price-asc'
                          ? 'text-blue-700 font-bold'
                          : 'text-blue-500'
                      } hover:underline`}
                      onClick={() => handleSortOption('price', 'price-asc')}
                    >
                      Price: Low to High
                    </button>
                    <button
                      className={`text-left ${
                        priceSortOption === 'price-desc'
                          ? 'text-blue-700 font-bold'
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
                  className={`flex justify-between items-center p-2 cursor-pointer ${
                    activeFilter === 'rating' ? 'text-blue-700 font-bold' : 'text-gray-800'
                  }`}
                  onClick={() => toggleFilter('rating')}
                >
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-5 w-5 text-gray-500" />
                    <span>Sort by Rating</span>
                  </div>
                  {activeFilter === 'rating' ? (
                    <ChevronDownIcon className="h-5 w-5 text-blue-700" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                {activeFilter === 'rating' && (
                  <div className="ml-8 mt-2 flex flex-col space-y-2 transition-all duration-300 ease-in-out">
                    <button
                      className={`text-left ${
                        ratingSortOption === 'rating-asc'
                          ? 'text-blue-700 font-bold'
                          : 'text-blue-500'
                      } hover:underline`}
                      onClick={() => handleSortOption('rating', 'rating-asc')}
                    >
                      Rating: Low to High
                    </button>
                    <button
                      className={`text-left ${
                        ratingSortOption === 'rating-desc'
                          ? 'text-blue-700 font-bold'
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
        {/* Right side - Products grid (100% on mobile, 70% on larger screens) */}
        <div className="w-full sm:w-9/12 pl-4">
          {visibleProducts.length === 0 ? (
            <div className="text-center text-gray-500 text-base">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  addToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

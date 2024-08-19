import React from 'react';
import HomePage from './components/HomePage';  // Importing the component with the main logic

// Define SEO metadata specific to the page
export const metadata = {
  title: 'Product Listing - My E-commerce',
  description: 'Explore our wide range of products including electronics, gadgets, and more. Find the best deals on our e-commerce platform.',
};

export default function Page() {
  return <HomePage />;  // Render the main product listing logic
}

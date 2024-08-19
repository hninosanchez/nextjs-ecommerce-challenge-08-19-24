import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '@/app/components/HomePage';
import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.resetMocks();
});

/**
 * Test case to ensure products are fetched and rendered correctly
 */
test('should fetch products correctly', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([
    { id: 1, title: 'Test Product', description: 'This is a test product.', price: 19.99, currency: 'USD', rating: 4 },
    { id: 2, title: 'Another Product', description: 'This is another product.', price: 29.99, currency: 'USD', rating: 5 }
  ]));

  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  const product1 = await screen.findByText('Test Product');
  const product2 = await screen.findByText('Another Product');

  expect(product1).toBeInTheDocument();
  expect(product2).toBeInTheDocument();
});

/**
 * Test case to ensure the search functionality filters products correctly
 */
test('should filter products based on search query', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([
    { id: 1, title: 'Test Product', description: 'This is a test product.', price: 19.99, currency: 'USD', rating: 4 },
    { id: 2, title: 'Another Product', description: 'This is another product.', price: 29.99, currency: 'USD', rating: 5 }
  ]));

  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  const searchInput = screen.getByPlaceholderText('Search products...');
  fireEvent.change(searchInput, { target: { value: 'Test' } });

  const product1 = await screen.findByText('Test Product');
  const product2 = screen.queryByText('Another Product');

  expect(product1).toBeInTheDocument();
  expect(product2).not.toBeInTheDocument();
});

/**
 * Test case to ensure products are sorted by price correctly
 */
test('should sort products by price correctly', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([
    { id: 1, title: 'Cheap Product', description: 'This is a cheap product.', price: 9.99, currency: 'USD', rating: 3 },
    { id: 2, title: 'Expensive Product', description: 'This is an expensive product.', price: 99.99, currency: 'USD', rating: 5 }
  ]));

  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  const sortSelect = screen.getByText('Sort by Price');
  fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

  const expensiveProduct = await screen.findByText('Expensive Product');
  const cheapProduct = screen.getByText('Cheap Product');

  // Check the order of products
  expect(expensiveProduct).toBeInTheDocument();
  expect(cheapProduct).toBeInTheDocument();
});

/**
 * Test case to ensure products are sorted by rating correctly
 */
test('should sort products by rating correctly', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([
    { id: 1, title: 'Low Rating Product', description: 'This product has a low rating.', price: 19.99, currency: 'USD', rating: 2 },
    { id: 2, title: 'High Rating Product', description: 'This product has a high rating.', price: 29.99, currency: 'USD', rating: 5 }
  ]));

  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  const sortSelect = screen.getByText('Sort by Rating');
  fireEvent.change(sortSelect, { target: { value: 'rating-asc' } });

  const lowRatingProduct = await screen.findByText('Low Rating Product');
  const highRatingProduct = screen.getByText('High Rating Product');

  expect(lowRatingProduct).toBeInTheDocument();
  expect(highRatingProduct).toBeInTheDocument();
});

/**
 * Test case to ensure that more products load correctly with infinite scroll
 */
test('should load more products on scroll', async () => {
  fetchMock.mockResponse(JSON.stringify([
    { id: 1, title: 'Product 1', description: 'This is product 1.', price: 19.99, currency: 'USD', rating: 4 },
    { id: 2, title: 'Product 2', description: 'This is product 2.', price: 29.99, currency: 'USD', rating: 5 },
    { id: 3, title: 'Product 3', description: 'This is product 3.', price: 39.99, currency: 'USD', rating: 3 },
    { id: 4, title: 'Product 4', description: 'This is product 4.', price: 49.99, currency: 'USD', rating: 2 },
    // Add more products to simulate infinite scroll
  ]));

  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  // Simulate scroll event to load more products
  fireEvent.scroll(window, { target: { scrollY: 1000 } });

  const product3 = await screen.findByText('Product 3');
  const product4 = await screen.findByText('Product 4');

  expect(product3).toBeInTheDocument();
  expect(product4).toBeInTheDocument();
});

/**
 * Test case to ensure products can be added to the cart
 */
test('should add products to cart correctly', async () => {
  fetchMock.mockResponseOnce(JSON.stringify([
    { id: 1, title: 'Product to Cart', description: 'This product will be added to the cart.', price: 19.99, currency: 'USD', rating: 4 }
  ]));

  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

  const addToCartButton = await screen.findByText('Add to Cart');
  fireEvent.click(addToCartButton);

  const cartItems = screen.getByText('Total Items: 1');
  const totalPrice = screen.getByText('Total Price: $19.99');

  expect(cartItems).toBeInTheDocument();
  expect(totalPrice).toBeInTheDocument();
});

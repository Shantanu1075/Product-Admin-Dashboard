# Product Admin Dashboard

A small product management dashboard built with **Next.js, React, Tailwind CSS, Axios, and DummyJSON API**.

The application allows users to log in, browse products, search and filter them, view product details, and perform add, edit, and delete operations from the dashboard.


## Live Demo

[View Live Demo](https://product-admin-dashboard-7djwp2lic-shantanu-2d77.vercel.app)

## Tech Stack

* Next.js
* React
* Tailwind CSS
* Axios
* DummyJSON API
* JavaScript

## Features

### Authentication

* Login using the provided DummyJSON credentials
* Shows an error message for invalid login details
* Protects product pages from unauthenticated users
* Logout functionality
* Login token is automatically attached to API requests

### Product Management

* Product listing with:

  * Product image
  * Title
  * Category
  * Price
  * Rating
  * Stock
* Responsive layout

  * Table view on desktop
  * Card view on mobile
* Product details page
* Add new product
* Edit existing product
* Delete product with confirmation popup

### Search, Filter and Sort

* Search products using the DummyJSON search API
* Debounced search to avoid unnecessary API requests
* Category filtering
* Sort products by:

  * Price
  * Rating
  * Title
* Search, filter, sort and pagination values are stored in the URL

### Pagination

* Page-by-page loading using `limit` and `skip`
* Page size options:

  * 10
  * 20
  * 50
* Previous and Next buttons
* Page numbers
* Displays the current range of products

### UI States

* Loading state while fetching data
* Empty state when no products are found
* Error state with Retry button
* Invalid product ID handling
* Invalid URL parameters are handled without breaking the page

## Project Structure

```text
src/
├── app/
│   ├── login/
│   │   └── page.js
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   ├── new/
│   │   │   └── page.js
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── DeleteModal.js
│   ├── ErrorMessage.js
│   ├── Loading.js
│   ├── Navbar.js
│   ├── Pagination.js
│   ├── ProductCard.js
│   ├── ProductFilters.js
│   ├── ProductForm.js
│   ├── ProductTable.js
│   └── SearchBar.js
│
├── lib/
│   └── axios.js
│
├── services/
│   ├── authApi.js
│   └── productApi.js
│
└── utils/
    ├── auth.js
    └── urlParams.js
```

## API

This project uses the free [DummyJSON API](https://dummyjson.com).

Main endpoints used:

```text
POST /auth/login
GET  /auth/me

GET  /products
GET  /products/search?q=
GET  /products/categories
GET  /products/category/{category}
GET  /products/{id}

POST   /products/add
PUT    /products/{id}
DELETE /products/{id}
```

All API requests are handled through Axios.

A shared Axios instance is used so authentication and API error handling can be managed from one place.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Go to the project directory

```bash
cd product-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Login Credentials

Use the credentials provided in the assignment:

```text
Username: emilys
Password: emilyspass
```

## Important Implementation Decisions

### Search and Category Filter

DummyJSON does not support searching and category filtering together in a single API request.

Because of this, the application handles these states separately. When searching, the search endpoint is used. When browsing by category, the category endpoint is used.

This keeps the API requests simple and avoids making assumptions about unsupported API combinations.

### Debounced Search

Search requests are debounced so that the API is not called for every character typed.

For example, if the user types:

```text
iphone
```

the application waits until the user stops typing before making the request.

The search logic also prevents an older request from overwriting the result of a newer search.

### URL State

Pagination, search, filter and sorting values are stored in the URL.

For example:

```text
/products?page=2&limit=20&search=phone&sort=price
```

This means refreshing the page keeps the current state and the URL can also be shared with someone else.

### Invalid URL Parameters

The application validates URL parameters before using them.

For example:

```text
?page=abc
?page=999
?limit=invalid
```

These values are handled safely instead of causing the page to break.

### Add, Edit and Delete

DummyJSON simulates product mutations but does not permanently save the changes to the server.

Because of this, after a successful add, edit or delete request, the application updates the local UI state so that the user can immediately see the change.

The changes are therefore reflected in the current application session but are not intended to persist permanently on the DummyJSON server.

## Technical Challenge

One of the main challenges was handling search requests when the user types quickly.

If multiple search requests are running at the same time, an older request can finish after the newer request and incorrectly replace the latest results.

To solve this, the search implementation keeps track of the latest request and makes sure that only the current request is allowed to update the displayed results.

This was also tested using an artificial API delay such as:

```text
&delay=2000
```

## AI Usage

AI tools were used during development to help with understanding the assignment requirements, debugging issues, checking implementation approaches and improving parts of the code.

I reviewed and tested the generated suggestions before using them and made sure I understood how the implemented code works.

## What I Completed

* [x] Login and logout
* [x] Protected product pages
* [x] Product listing
* [x] Responsive product table/cards
* [x] Pagination
* [x] Page size selection
* [x] Product search
* [x] Debounced search
* [x] Category filter
* [x] Product sorting
* [x] URL-based state
* [x] Product details
* [x] Add product
* [x] Edit product
* [x] Delete product
* [x] Delete confirmation
* [x] Loading states
* [x] Empty states
* [x] Error handling
* [x] Retry functionality
* [x] Invalid URL handling
* [x] Shared Axios configuration


## Notes

This project was created as part of a frontend assignment to demonstrate working with API integration, authentication, responsive UI, URL state management, pagination, search, filtering, sorting and basic product management functionality.
